from flask import Flask, request, jsonify
from flask_cors import CORS
from config import Config
from satellite_utils import tracker
from database import db
import json
from datetime import datetime
import pytz

app = Flask(__name__)
app.config.from_object(Config)
CORS(app, origins=Config.CORS_ORIGINS)

# العراقية الأقمار المهمة للعراق
IRAQ_IMPORTANT_SATELLITES = {
    'NOAA 19': {'freq': '137.100 MHz', 'type': 'طقس', 'importance': 'عالية'},
    'NOAA 18': {'freq': '137.9125 MHz', 'type': 'طقس', 'importance': 'عالية'},
    'ISS (ZARYA)': {'freq': '145.800 MHz', 'type': 'محطة فضائية', 'importance': 'متوسطة'},
    'METEOR M2': {'freq': '137.100 MHz', 'type': 'طقس', 'importance': 'عالية'},
    'SAUDISAT 1C': {'freq': '145.850 MHz', 'type': 'اتصالات', 'importance': 'متوسطة'},
    'TÜRKSAT 3A': {'freq': '11767 MHz', 'type': 'اتصالات', 'importance': 'متوسطة'},
    'IRAQ-SAT 1': {'freq': '11958 MHz', 'type': 'اتصالات', 'importance': 'عالية جداً'}
}

@app.route('/api/satellites', methods=['GET'])
def get_satellites():
    """الحصول على قائمة بالأقمار مع تصفية للأقمار المهمة للعراق"""
    sat_type = request.args.get('type', 'stations')
    iraq_only = request.args.get('iraq', 'false').lower() == 'true'
    
    try:
        satellites = tracker.load_tle_from_celestrak(sat_type)
        
        # تنسيق الاستجابة
        result = []
        for name, data in list(satellites.items())[:100]:  # زيادة العدد ليشمل المزيد
            norad_id = data['tle1'][2:7].strip()
            
            # تحديد أهمية القمر للعراق
            importance = 'منخفضة'
            if name in IRAQ_IMPORTANT_SATELLITES:
                sat_info = IRAQ_IMPORTANT_SATELLITES[name]
                freq = sat_info['freq']
                sat_type = sat_info['type']
                importance = sat_info['importance']
            else:
                freq = 'غير معروف'
                sat_type = 'أخرى'
            
            # إذا طلبنا أقمار العراق فقط
            if iraq_only and importance == 'منخفضة':
                continue
            
            result.append({
                'name': name,
                'norad_id': norad_id,
                'frequency': freq,
                'type': sat_type,
                'importance': importance,
                'iraq_relevant': importance != 'منخفضة'
            })
        
        return jsonify({
            'success': True,
            'count': len(result),
            'developer': Config.DEVELOPER,
            'year': Config.DEVELOPMENT_YEAR,
            'country': 'العراق',
            'satellites': result
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'developer': Config.DEVELOPER
        }), 500

@app.route('/api/track', methods=['POST'])
def track_satellite():
    """تتبع قمر معين من موقع في العراق"""
    data = request.json
    
    # إذا لم يتم تحديد موقع، استخدم بغداد كافتراضي
    if 'latitude' not in data or 'longitude' not in data:
        data['latitude'] = Config.DEFAULT_LOCATION['lat']
        data['longitude'] = Config.DEFAULT_LOCATION['lon']
        data['city'] = Config.DEFAULT_LOCATION['city']
    
    required_fields = ['satellite_name']
    for field in required_fields:
        if field not in data:
            return jsonify({
                'success': False,
                'error': f'Missing field: {field}',
                'developer': Config.DEVELOPER
            }), 400
    
    try:
        # تحميل الأقمار
        satellites = tracker.load_tle_from_celestrak()
        
        if data['satellite_name'] not in satellites:
            return jsonify({
                'success': False,
                'error': 'القمر غير موجود',
                'developer': Config.DEVELOPER
            }), 404
        
        # حساب الموقع
        sat_data = satellites[data['satellite_name']]
        position = tracker.calculate_position(
            sat_data['satellite'],
            float(data['latitude']),
            float(data['longitude']),
            float(data.get('altitude', 0))
        )
        
        # الحصول على معلومات توجيه الهوائي
        antenna_info = tracker.get_antenna_orientation(
            position['azimuth'],
            position['altitude']
        )
        
        # إضافة معلومات العراق
        sat_name = data['satellite_name']
        iraq_info = IRAQ_IMPORTANT_SATELLITES.get(sat_name, {
            'freq': 'غير معروف',
            'type': 'أخرى',
            'importance': 'منخفضة'
        })
        
        return jsonify({
            'success': True,
            'developer': Config.DEVELOPER,
            'development_year': Config.DEVELOPMENT_YEAR,
            'country': 'العراق',
            'tracking_location': {
                'city': data.get('city', 'بغداد'),
                'latitude': data['latitude'],
                'longitude': data['longitude'],
                'country': 'العراق'
            },
            'position': position,
            'antenna': antenna_info,
            'satellite': {
                'name': sat_name,
                'frequency': iraq_info['freq'],
                'type': iraq_info['type'],
                'importance': iraq_info['importance'],
                'iraq_relevant': iraq_info['importance'] != 'منخفضة'
            }
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'developer': Config.DEVELOPER
        }), 500

@app.route('/api/predict', methods=['POST'])
def predict_passes():
    """تنبؤ بمرور الأقمار فوق العراق"""
    data = request.json
    
    try:
        satellites = tracker.load_tle_from_celestrak()
        
        # استخدام موقع في العراق إذا لم يتم التحديد
        user_lat = float(data.get('latitude', Config.DEFAULT_LOCATION['lat']))
        user_lon = float(data.get('longitude', Config.DEFAULT_LOCATION['lon']))
        days = int(data.get('days', 2))
        
        # الأقمار المهمة للعراق
        important_sats = data.get('satellites', list(IRAQ_IMPORTANT_SATELLITES.keys()))
        
        predictions = []
        
        for sat_name in important_sats:
            if sat_name in satellites:
                passes = tracker.predict_passes(
                    satellites[sat_name]['satellite'],
                    user_lat,
                    user_lon,
                    days=days
                )
                
                if passes:
                    iraq_info = IRAQ_IMPORTANT_SATELLITES.get(sat_name, {
                        'freq': 'غير معروف',
                        'type': 'أخرى',
                        'importance': 'منخفضة'
                    })
                    
                    predictions.append({
                        'satellite': sat_name,
                        'arabic_name': f'قمر {iraq_info["type"]}' if sat_name != 'ISS (ZARYA)' else 'محطة الفضاء الدولية',
                        'passes': passes,
                        'frequency': iraq_info['freq'],
                        'type': iraq_info['type'],
                        'importance': iraq_info['importance'],
                        'iraq_relevant': iraq_info['importance'] != 'منخفضة'
                    })
        
        return jsonify({
            'success': True,
            'developer': Config.DEVELOPER,
            'university': Config.UNIVERSITY,
            'year': Config.DEVELOPMENT_YEAR,
            'predictions': predictions,
            'location': {
                'latitude': user_lat,
                'longitude': user_lon,
                'city': data.get('city', 'بغداد'),
                'country': 'العراق'
            },
            'note': 'تنبؤات مرور الأقمار فوق الأراضي العراقية'
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'developer': Config.DEVELOPER
        }), 500

@app.route('/api/iraq/info', methods=['GET'])
def get_iraq_info():
    """الحصول على معلومات عن نظام التتبع العراقي"""
    return jsonify({
        'success': True,
        'system_name': 'نظام متعقب الأقمار الصناعية العراقي',
        'developer': Config.DEVELOPER,
        'development_year': Config.DEVELOPMENT_YEAR,
        'university': Config.UNIVERSITY,
        'country': 'العراق',
        'purpose': 'تتبع الأقمار الصناعية فوق الأراضي العراقية لدعم أغراض البحث والاتصالات',
        'features': [
            'تتبع الأقمار فوق العراق',
            'تنبؤ بمرور الأقمار',
            'توجيه الهوائيات',
            'رصد أقمار الطقس',
            'مراقبة الأقمار الاتصالية'
        ],
        'iraq_locations': Config.IRAQ_LOCATIONS,
        'important_satellites': IRAQ_IMPORTANT_SATELLITES
    })

@app.route('/api/location/iraq', methods=['GET'])
def get_iraq_locations():
    """الحصول على مواقع المدن العراقية"""
    city = request.args.get('city', 'baghdad')
    
    if city in Config.IRAQ_LOCATIONS:
        location = Config.IRAQ_LOCATIONS[city]
        return jsonify({
            'success': True,
            'location': location,
            'developer': Config.DEVELOPER,
            'message': f'موقع {location["city"]} في العراق'
        })
    else:
        # عرض جميع المدن
        return jsonify({
            'success': True,
            'available_cities': Config.IRAQ_LOCATIONS,
            'default': Config.DEFAULT_LOCATION,
            'developer': Config.DEVELOPER
        })

@app.route('/api/location', methods=['GET'])
def get_location():
    """الحصول على موقع المستخدم - نسخة العراق"""
    city = request.args.get('city', 'baghdad')
    
    if city in Config.IRAQ_LOCATIONS:
        location = Config.IRAQ_LOCATIONS[city]
    else:
        location = Config.DEFAULT_LOCATION
    
    return jsonify({
        'success': True,
        'location': {
            'latitude': location['lat'],
            'longitude': location['lon'],
            'city': location['city'],
            'country': 'العراق',
            'arabic_country': 'جمهورية العراق'
        },
        'developer': Config.DEVELOPER,
        'development_year': Config.DEVELOPMENT_YEAR,
        'system': 'نظام التتبع الفضائي العراقي',
        'message': 'مرحباً بكم في النظام العراقي لتتبع الأقمار الصناعية'
    })

@app.route('/health', methods=['GET'])
def health_check():
    """فحص حالة الخادم - نسخة العراق"""
    return jsonify({
        'status': 'تعمل بكفاءة',
        'timestamp': datetime.now(pytz.UTC).isoformat(),
        'service': 'نظام متعقب الأقمار العراقي',
        'developer': Config.DEVELOPER,
        'year': Config.DEVELOPMENT_YEAR,
        'country': 'العراق',
        'version': '1.0.0'
    })

@app.route('/api/developer', methods=['GET'])
def get_developer_info():
    """معلومات المطور"""
    return jsonify({
        'success': True,
        'developer': {
            'name': Config.DEVELOPER,
            'name_english': 'Engineer Hussein Fahim Al-Khazaali',
            'project': 'نظام متعقب الأقمار الصناعية',
            'year': Config.DEVELOPMENT_YEAR,
            'university': Config.UNIVERSITY,
            'country': 'العراق',
            'specialization': 'هندسة الاتصالات والأقمار الصناعية'
        },
        'project': {
            'name': 'Iraqi Satellite Tracking System',
            'purpose': 'تطوير نظام وطني لتتبع الأقمار فوق العراق',
            'features': [
                'رصد الأقمار في الوقت الحقيقي',
                'دعم الهواة والباحثين',
                'تعزيز القدرات التقنية العراقية'
            ]
        }
    })

if __name__ == '__main__':
    print(f"🚀 بدء تشغيل نظام متعقب الأقمار العراقي")
    print(f"👨‍💻 المطور: {Config.DEVELOPER}")
    print(f"📅 سنة التطوير: {Config.DEVELOPMENT_YEAR}")
    print(f"🇮🇶 الدولة: العراق")
    app.run(host='0.0.0.0', port=5000, debug=Config.DEBUG)