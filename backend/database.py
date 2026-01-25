from supabase import create_client, Client
from config import Config
import json
from datetime import datetime

class SatelliteDatabase:
    def __init__(self):
        self.supabase: Client = create_client(
            Config.SUPABASE_URL,
            Config.SUPABASE_KEY
        )
        self.developer = Config.DEVELOPER
        self.year = Config.DEVELOPMENT_YEAR
    
    async def get_iraq_satellites(self):
        """الحصول على الأقمار المهمة للعراق"""
        query = self.supabase.table('satellites')\
            .select('*')\
            .or_('type.eq.weather,type.eq.communications')\
            .order('name')
        
        response = query.execute()
        
        # إضافة معلومات العراق
        satellites = []
        for sat in response.data:
            sat['iraq_relevant'] = True
            sat['developer'] = self.developer
            sat['development_year'] = self.year
            sat['country'] = 'العراق'
            satellites.append(sat)
        
        return satellites
    
    async def add_iraq_observation(self, observation_data: dict):
        """إضافة رصد عراقي"""
        observation_data.update({
            'country': 'العراق',
            'developer': self.developer,
            'year': self.year,
            'created_at': datetime.now().isoformat()
        })
        
        response = self.supabase.table('iraq_observations').insert(observation_data).execute()
        return response.data
    
    async def get_iraq_stations(self):
        """الحصول على محطات الرصد العراقية"""
        iraq_stations = [
            {
                'name': 'محطة بغداد للرصد الفضائي',
                'location': 'بغداد',
                'latitude': 33.3128,
                'longitude': 44.3615,
                'equipment': 'هوائي SDR، نظام تتبع تلقائي',
                'operator': 'وزارة الاتصالات العراقية'
            },
            {
                'name': 'مرصد البصرة الفلكي',
                'location': 'البصرة',
                'latitude': 30.5,
                'longitude': 47.8,
                'equipment': 'تلسكوب راديوي، هوائيات VHF',
                'operator': 'جامعة البصرة'
            },
            {
                'name': 'محطة أربيل للاتصالات الفضائية',
                'location': 'أربيل',
                'latitude': 36.19,
                'longitude': 44.01,
                'equipment': 'هوائي حلزوني، مستقبلات متعددة',
                'operator': 'جامعة صلاح الدين'
            }
        ]
        
        # إضافة معلومات المطور
        for station in iraq_stations:
            station['developer'] = self.developer
            station['project_year'] = self.year
        
        return iraq_stations
    
    async def log_iraq_pass(self, user_data: dict, satellite_data: dict, pass_data: dict):
        """تسجيل مرور قمر فوق العراق"""
        log_entry = {
            'user_location': user_data,
            'satellite_info': satellite_data,
            'pass_details': pass_data,
            'country': 'العراق',
            'developer': self.developer,
            'timestamp': datetime.now().isoformat(),
            'project_year': self.year
        }
        
        response = self.supabase.table('iraq_satellite_passes').insert(log_entry).execute()
        return response.data
    
    async def get_iraq_statistics(self):
        """إحصائيات الرصد العراقي"""
        stats = {
            'total_observations': 0,
            'active_satellites': 0,
            'iraq_stations': 3,
            'weather_satellites': 3,
            'communication_satellites': 4,
            'developer': self.developer,
            'year': self.year,
            'country': 'العراق',
            'last_updated': datetime.now().isoformat()
        }
        
        try:
            # محاولة الحصول على إحصائيات حقيقية من قاعدة البيانات
            obs_response = self.supabase.table('iraq_observations')\
                .select('id', count='exact')\
                .execute()
            
            if hasattr(obs_response, 'count'):
                stats['total_observations'] = obs_response.count
        except:
            pass
        
        return stats

# إنشاء نسخة عامة
db = SatelliteDatabase()