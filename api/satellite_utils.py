from skyfield.api import load, Topos, EarthSatellite
from skyfield import almanac
from datetime import datetime, timedelta
import pytz
import requests
import json

class SatelliteTracker:
    def __init__(self):
        self.ts = load.timescale()
        self.eph = load('de421.bsp')
        
    def load_tle_from_celestrak(self, category='stations'):
        """تحميل بيانات TLE من Celestrak"""
        url = f"https://celestrak.org/NORAD/elements/gp.php?GROUP={category}&FORMAT=tle"
        response = requests.get(url)
        
        satellites = {}
        lines = response.text.strip().split('\n')
        
        for i in range(0, len(lines), 3):
            if i + 2 < len(lines):
                name = lines[i].strip()
                line1 = lines[i + 1].strip()
                line2 = lines[i + 2].strip()
                
                sat = EarthSatellite(line1, line2, name, self.ts)
                satellites[name] = {
                    'satellite': sat,
                    'tle1': line1,
                    'tle2': line2
                }
        
        return satellites
    
    def calculate_position(self, satellite: EarthSatellite, lat: float, lon: float, alt: float = 0):
        """حساب موقع القمر بالنسبة لموقع في العراق"""
        observer = Topos(latitude_degrees=lat, longitude_degrees=lon, elevation_m=alt)
        t = self.ts.now()
        
        difference = satellite - observer
        topocentric = difference.at(t)
        
        # حساب الارتفاع والسمت
        alt, az, distance = topocentric.altaz()
        
        # هل القمر فوق الأفق؟
        is_visible = alt.degrees > 0
        
        # تحديد إذا كان النهار أو الليل (للعرض فقط)
        is_daytime = self.is_daytime(lat, lon)
        
        return {
            'latitude': observer.latitude.degrees,
            'longitude': observer.longitude.degrees,
            'satellite_height': distance.km,
            'altitude': alt.degrees,
            'azimuth': az.degrees,
            'is_visible': is_visible,
            'daytime': is_daytime,
            'timestamp': t.utc_datetime().isoformat(),
            'local_time': datetime.now(pytz.timezone('Asia/Baghdad')).strftime('%Y-%m-%d %H:%M:%S')
        }
    
    def is_daytime(self, lat: float, lon: float):
        """تحقق إذا كان الوقت الحالي نهاراً في الموقع"""
        t = self.ts.now()
        observer = Topos(latitude_degrees=lat, longitude_degrees=lon)
        
        # حساب شروق وغروب الشمس
        t0 = t.utc_datetime() - timedelta(hours=12)
        t1 = t.utc_datetime() + timedelta(hours=12)
        
        times, events = almanac.find_discrete(
            self.ts.from_datetime(t0), 
            self.ts.from_datetime(t1), 
            almanac.sunrise_sunset(self.eph, observer)
        )
        
        # البحث عن حالة الشمس الحالية
        for time, event in zip(times, events):
            if time.utc_datetime() > t.utc_datetime():
                # event == 1 يعني شروق الشمس، event == 0 يعني غروب الشمس
                return event == 1
        
        return True  # إفتراضي
    
    def predict_passes(self, satellite: EarthSatellite, lat: float, lon: float, 
                      days: int = 1, min_elevation: float = 10):
        """تنبؤ بمرور القمر فوق العراق"""
        observer = Topos(latitude_degrees=lat, longitude_degrees=lon)
        
        # إنشاء قائمة بالأوقات للأيام القادمة
        t0 = self.ts.now()
        t1 = self.ts.utc(t0.utc_datetime() + timedelta(days=days))
        
        # حساب أوقات الظهور والاختفاء
        t, events = satellite.find_events(observer, t0, t1, altitude_degrees=min_elevation)
        
        passes = []
        for ti, event in zip(t, events):
            utc_time = ti.utc_datetime()
            # تحويل لوقت بغداد
            baghdad_time = utc_time.replace(tzinfo=pytz.utc).astimezone(pytz.timezone('Asia/Baghdad'))
            time_str = baghdad_time.strftime('%Y-%m-%d %H:%M:%S')
            
            event_name = 'ظهور' if event == 0 else 'ذروة' if event == 1 else 'اختفاء'
            
            passes.append({
                'type': event_name,
                'time': time_str,
                'utc_time': utc_time.isoformat(),
                'event_code': event
            })
        
        return passes
    
    def get_antenna_orientation(self, az: float, el: float):
        """تحديد اتجاه الهوائي مع مصطلحات عراقية"""
        # تحويل السمت إلى اتجاه نصي عراقي
        directions_arabic = ['شمال', 'شمال شرقي', 'شرق', 'جنوب شرقي', 
                           'جنوب', 'جنوب غربي', 'غرب', 'شمال غربي']
        
        directions_english = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
        
        index = round(az / 45) % 8
        
        # نصيحة للهوائي بناءً على الارتفاع
        if el < 10:
            antenna_type = "هوائي أفقى مع رفع طفيف"
            difficulty = "صعب (قريب من الأفق)"
        elif el < 25:
            antenna_type = "هوائي قطبي منخفض"
            difficulty = "متوسط"
        elif el < 45:
            antenna_type = "هوائي Yagi أو هوائي شبكة"
            difficulty = "سهل"
        elif el < 70:
            antenna_type = "هوائي عمودي أو هوائي حلزوني"
            difficulty = "سهل جداً"
        else:
            antenna_type = "أي هوائي عمودي"
            difficulty = "سهل جداً (فوق الرأس)"
        
        # اقتراح استقطاب
        polarization = 'عمودي' if (0 <= az < 90 or 270 <= az < 360) else 'أفقي'
        
        return {
            'direction_degrees': az,
            'direction_arabic': directions_arabic[index],
            'direction_english': directions_english[index],
            'elevation_degrees': el,
            'antenna_type': antenna_type,
            'polarization': polarization,
            'difficulty': difficulty,
            'recommendation': self.get_antenna_recommendation(el, az)
        }
    
    def get_antenna_recommendation(self, elevation: float, azimuth: float):
        """توصيات للهوائي بناءً على الموقع في العراق"""
        recommendations = []
        
        if elevation < 15:
            recommendations.append("يفضل وضع الهوائي في مكان مرتفع")
            recommendations.append("تجنب العوائق بالقرب من الأفق")
        
        if 90 <= azimuth <= 270:  # اتجاه جنوبي
            recommendations.append("الاتجاه جنوبي - جيد للاستقبال من الأقمار القطبية")
        
        if elevation > 60:
            recommendations.append("القمر مرتفع جداً - هوائي عمودي مناسب")
        
        recommendations.append("في العراق، يفضل استخدام هوائيات مقاومة للعواصف الترابية")
        
        return recommendations

# إنشاء نسخة عامة
tracker = SatelliteTracker()