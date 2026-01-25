import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

# الاتصال بـ Supabase
supabase = create_client(
    os.getenv('SUPABASE_URL'),
    os.getenv('SUPABASE_KEY')
)

def test_database():
    print("🔗 اختبار الاتصال بقاعدة البيانات العراقية...")
    print(f"👨‍💻 المطور: {os.getenv('DEVELOPER_NAME', 'المهندس حسين فاهم الخزعلي')}")
    print(f"📅 السنة: {os.getenv('DEVELOPMENT_YEAR', '2026')}")
    print(f"🇮🇶 البلد: {os.getenv('COUNTRY', 'العراق')}")
    print("-" * 50)
    
    try:
        # اختبار قراءة الأقمار
        response = supabase.table('satellites').select('*').execute()
        print(f"✅ عدد الأقمار: {len(response.data)}")
        
        # اختبار قراءة المحطات
        stations = supabase.table('iraq_stations').select('*').execute()
        print(f"✅ عدد محطات الرصد: {len(stations.data)}")
        
        print("\n" + "=" * 50)
        print("🎉 الاتصال بنجاح! قاعدة البيانات جاهزة.")
        return True
        
    except Exception as e:
        print(f"❌ خطأ: {e}")
        print("\n🔧 تحقق من:")
        print("   1. اتصال الإنترنت")
        print("   2. مفاتيح API في ملف .env")
        print("   3. أن مشروع Supabase يعمل")
        return False

if __name__ == "__main__":
    test_database()