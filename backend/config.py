import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Supabase Configuration
    SUPABASE_URL = os.getenv('SUPABASE_URL')
    SUPABASE_KEY = os.getenv('SUPABASE_KEY')
    
    # App Configuration
    SECRET_KEY = os.getenv('SECRET_KEY', 'satellite-tracker-iraq-2026')
    DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'
    
    # API Configuration
    CELESTRAK_URL = "https://celestrak.org/NORAD/elements/gp.php"
    N2YO_API_KEY = os.getenv('N2YO_API_KEY', '')
    
    # Iraq Default Locations
    IRAQ_LOCATIONS = {
        'baghdad': {'lat': 33.3128, 'lon': 44.3615, 'city': 'بغداد'},
        'basra': {'lat': 30.5, 'lon': 47.8, 'city': 'البصرة'},
        'mosul': {'lat': 36.34, 'lon': 43.13, 'city': 'الموصل'},
        'erbil': {'lat': 36.19, 'lon': 44.01, 'city': 'أربيل'},
        'nasiriyah': {'lat': 31.05, 'lon': 46.25, 'city': 'الناصرية'},
        'karbala': {'lat': 32.6, 'lon': 44.02, 'city': 'كربلاء'}
    }
    
    DEFAULT_LOCATION = IRAQ_LOCATIONS['baghdad']
    
    # Iraqi Satellites Info
    IRAQI_SATELLITES = {
        'IRAQ-SAT1': {
            'name': 'IRAQ-SAT 1',
            'frequency': '11958 MHz',
            'type': 'اتصالات',
            'description': 'القمر الصناعي العراقي الأول للإتصالات',
            'launch_year': '2014',
            'operator': 'وزارة الاتصالات العراقية'
        },
        'NOAA 19': {
            'name': 'NOAA 19',
            'frequency': '137.100 MHz',
            'type': 'طقس',
            'description': 'قمر طقس أمريكي مهم للعراق'
        },
        'ISS': {
            'name': 'محطة الفضاء الدولية',
            'frequency': '145.800 MHz',
            'type': 'محطة فضائية',
            'description': 'محطة الفضاء الدولية (ISS)'
        }
    }
    
    # Developer Info
    DEVELOPER = 'المهندس حسين فاهم الخزعلي'
    DEVELOPMENT_YEAR = '2026'
    UNIVERSITY = 'كلية الهندسة - مشروع تخرج'
    
    # CORS Configuration
    CORS_ORIGINS = [
        "http://localhost:5173",
        "http://localhost:3000",
        "https://*.vercel.app"
    ]