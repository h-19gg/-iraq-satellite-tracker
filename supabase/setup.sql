-- إنشاء جداول قاعدة البيانات للنظام العراقي

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- جدول الأقمار الصناعية
CREATE TABLE satellites (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    norad_id VARCHAR(50) UNIQUE NOT NULL,
    tle_line1 TEXT,
    tle_line2 TEXT,
    frequency VARCHAR(50),
    type VARCHAR(50) CHECK (type IN ('طقس', 'اتصالات', 'بحث', 'محطة فضائية', 'عسكري', 'أخرى')),
    description TEXT,
    launch_date DATE,
    country VARCHAR(100),
    operator VARCHAR(255),
    iraq_importance VARCHAR(20) DEFAULT 'منخفضة' CHECK (iraq_importance IN ('عالية جداً', 'عالية', 'متوسطة', 'منخفضة')),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    developer VARCHAR(255) DEFAULT 'المهندس حسين فاهم الخزعلي',
    project_year VARCHAR(10) DEFAULT '2026'
);

-- جدول محطات الرصد العراقية
CREATE TABLE iraq_stations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    equipment TEXT,
    operator VARCHAR(255),
    established_year INTEGER,
    status VARCHAR(50) DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    developer VARCHAR(255) DEFAULT 'المهندس حسين فاهم الخزعلي'
);

-- جدول الرصد العراقي
CREATE TABLE iraq_observations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    station_id UUID REFERENCES iraq_stations(id),
    satellite_id UUID REFERENCES satellites(id),
    observation_time TIMESTAMP WITH TIME ZONE NOT NULL,
    signal_strength DECIMAL(5, 2),
    quality VARCHAR(50),
    frequency_used VARCHAR(50),
    antenna_type VARCHAR(100),
    weather_conditions VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    developer VARCHAR(255) DEFAULT 'المهندس حسين فاهم الخزعلي',
    country VARCHAR(50) DEFAULT 'العراق'
);

-- جدول تنبؤات المرور فوق العراق
CREATE TABLE iraq_passes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    satellite_id UUID REFERENCES satellites(id),
    station_id UUID REFERENCES iraq_stations(id),
    pass_start TIMESTAMP WITH TIME ZONE NOT NULL,
    pass_end TIMESTAMP WITH TIME ZONE NOT NULL,
    max_elevation DECIMAL(5, 2),
    duration_minutes INTEGER,
    frequency VARCHAR(50),
    predicted_signal VARCHAR(50),
    actual_signal VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    developer VARCHAR(255) DEFAULT 'المهندس حسين فاهم الخزعلي',
    city VARCHAR(100) DEFAULT 'بغداد'
);

-- جدول المستخدمين العراقيين
CREATE TABLE iraq_users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    city VARCHAR(100),
    organization VARCHAR(255),
    interest VARCHAR(100),
    experience_level VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    developer VARCHAR(255) DEFAULT 'المهندس حسين فاهم الخزعلي'
);

-- إدراج بيانات أولية لأقمار مهمة للعراق
INSERT INTO satellites (name, norad_id, frequency, type, country, iraq_importance, description, launch_date) VALUES
('NOAA 19', '33591', '137.100 MHz', 'طقس', 'الولايات المتحدة', 'عالية', 'قمر طقس أمريكي مهم للعراق', '2009-02-06'),
('ISS (ZARYA)', '25544', '145.800 MHz', 'محطة فضائية', 'دولية', 'متوسطة', 'محطة الفضاء الدولية', '1998-11-20'),
('NOAA 18', '28654', '137.9125 MHz', 'طقس', 'الولايات المتحدة', 'عالية', 'قمر طقس أمريكي', '2005-05-20'),
('METEOR M2', '40069', '137.100 MHz', 'طقس', 'روسيا', 'عالية', 'قمر طقس روسي', '2014-07-08'),
('SAUDISAT 1C', '27844', '145.850 MHz', 'اتصالات', 'السعودية', 'متوسطة', 'قمر اتصالات سعودي', '2002-12-20'),
('IRAQ-SAT 1', '12345', '11958 MHz', 'اتصالات', 'العراق', 'عالية جداً', 'القمر الصناعي العراقي الأول', '2014-01-01'),
('TÜRKSAT 3A', '12346', '11767 MHz', 'اتصالات', 'تركيا', 'متوسطة', 'قمر اتصالات تركي', '2008-06-10');

-- إدراج محطات الرصد العراقية
INSERT INTO iraq_stations (name, location, latitude, longitude, equipment, operator, established_year) VALUES
('محطة بغداد للرصد الفضائي', 'بغداد', 33.3128, 44.3615, 'هوائي SDR، نظام تتبع تلقائي، مستقبلات متعددة', 'وزارة الاتصالات العراقية', 2015),
('مرصد البصرة الفلكي', 'البصرة', 30.5, 47.8, 'تلسكوب راديوي، هوائيات VHF/UHF، معمل معالجة إشارات', 'جامعة البصرة', 2018),
('محطة أربيل للاتصالات الفضائية', 'أربيل', 36.19, 44.01, 'هوائي حلزوني، مستقبلات متعددة، نظام تسجيل رقمي', 'جامعة صلاح الدين', 2020),
('مركز الموصل للعلوم الفضائية', 'الموصل', 36.34, 43.13, 'هوائي Yagi، معدات رصد بصري، مختبر تحليل', 'جامعة الموصل', 2022);

-- إنشاء فهارس للأداء
CREATE INDEX idx_satellites_iraq_importance ON satellites(iraq_importance);
CREATE INDEX idx_satellites_type ON satellites(type);
CREATE INDEX idx_observations_time ON iraq_observations(observation_time);
CREATE INDEX idx_passes_time ON iraq_passes(pass_start, pass_end);
CREATE INDEX idx_stations_location ON iraq_stations(location);

-- Enable Row Level Security
ALTER TABLE satellites ENABLE ROW LEVEL SECURITY;
ALTER TABLE iraq_stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE iraq_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE iraq_passes ENABLE ROW LEVEL SECURITY;
ALTER TABLE iraq_users ENABLE ROW LEVEL SECURITY;

-- سياسات الوصول العام (قراءة فقط)
CREATE POLICY "الوصول العام للأقمار" ON satellites FOR SELECT USING (true);
CREATE POLICY "الوصول العام للمحطات" ON iraq_stations FOR SELECT USING (true);
CREATE POLICY "الوصول العام للرصد" ON iraq_observations FOR SELECT USING (true);
CREATE POLICY "الوصول العام للتنبؤات" ON iraq_passes FOR SELECT USING (true);

-- دالة تحديث الوقت
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- مشغلات التحديث التلقائي
CREATE TRIGGER update_satellites_updated_at 
    BEFORE UPDATE ON satellites 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_passes_updated_at 
    BEFORE UPDATE ON iraq_passes 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- دالة إحصائية للعراق
CREATE OR REPLACE FUNCTION get_iraq_satellite_stats()
RETURNS TABLE (
    total_satellites BIGINT,
    weather_sats BIGINT,
    comm_sats BIGINT,
    high_importance BIGINT,
    iraqi_sats BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_satellites,
        COUNT(*) FILTER (WHERE type = 'طقس') as weather_sats,
        COUNT(*) FILTER (WHERE type = 'اتصالات') as comm_sats,
        COUNT(*) FILTER (WHERE iraq_importance IN ('عالية', 'عالية جداً')) as high_importance,
        COUNT(*) FILTER (WHERE country = 'العراق') as iraqi_sats
    FROM satellites;
END;
$$ LANGUAGE plpgsql;

-- تعليق على الجداول
COMMENT ON TABLE satellites IS 'جدول الأقمار الصناعية - النظام العراقي لتتبع الأقمار';
COMMENT ON TABLE iraq_stations IS 'محطات الرصد العراقية - تطوير المهندس حسين فاهم الخزعلي 2026';
COMMENT ON TABLE iraq_observations IS 'سجلات الرصد العراقية للأقمار الصناعية';
COMMENT ON TABLE iraq_passes IS 'تنبؤات مرور الأقمار فوق العراق';

-- رسالة ترحيبية
DO $$
BEGIN
    RAISE NOTICE '✅ تم إنشاء قاعدة بيانات النظام العراقي لمتعقب الأقمار';
    RAISE NOTICE '👨‍💻 المطور: المهندس حسين فاهم الخزعلي';
    RAISE NOTICE '📅 سنة التطوير: 2026';
    RAISE NOTICE '🇮🇶 الدولة: العراق';
END $$;