import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Flag, MapPin, Satellite, Users, Cloud, Radio, Award, Calendar } from 'lucide-react'

const IraqInfo = ({ location, developer }) => {
  const [iraqInfo, setIraqInfo] = useState(null)
  const [stations, setStations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchIraqInfo()
    fetchIraqStations()
  }, [])

  const fetchIraqInfo = async () => {
    try {
      const response = await axios.get('/api/iraq/info')
      if (response.data.success) {
        setIraqInfo(response.data)
      }
    } catch (error) {
      console.error('Error fetching Iraq info:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchIraqStations = async () => {
    try {
      const response = await axios.get('/api/database/stations')
      if (response.data.success) {
        setStations(response.data.data || [])
      }
    } catch (error) {
      // إذا لم تكن هناك بيانات، استخدم بيانات افتراضية
      setStations([
        {
          name: 'محطة بغداد للرصد الفضائي',
          location: 'بغداد',
          latitude: 33.3128,
          longitude: 44.3615,
          equipment: 'هوائي SDR، نظام تتبع تلقائي',
          operator: 'وزارة الاتصالات العراقية'
        },
        {
          name: 'مرصد البصرة الفلكي',
          location: 'البصرة',
          latitude: 30.5,
          longitude: 47.8,
          equipment: 'تلسكوب راديوي، هوائيات VHF',
          operator: 'جامعة البصرة'
        },
        {
          name: 'محطة أربيل للاتصالات الفضائية',
          location: 'أربيل',
          latitude: 36.19,
          longitude: 44.01,
          equipment: 'هوائي حلزوني، مستقبلات متعددة',
          operator: 'جامعة صلاح الدين'
        }
      ])
    }
  }

  const iraqSatellites = [
    {
      name: 'IRAQ-SAT 1',
      type: 'اتصالات',
      launch: '2014',
      frequency: '11958 MHz',
      description: 'القمر الصناعي العراقي الأول للإتصالات',
      status: 'نشط'
    },
    {
      name: 'NOAA 19',
      type: 'طقس',
      launch: '2009',
      frequency: '137.100 MHz',
      description: 'رصد الطقس والمناخ في العراق',
      status: 'نشط'
    },
    {
      name: 'METEOR M2',
      type: 'طقس',
      launch: '2014',
      frequency: '137.100 MHz',
      description: 'صور الطقس عالية الدقة',
      status: 'نشط'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-iraq-red/10 via-iraq-white/10 to-iraq-green/10 rounded-2xl p-6 iraq-border">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-right">
            <h1 className="text-3xl font-bold iraq-text-gradient">
              🇮🇶 النظام العراقي للفضاء والأقمار الصناعية
            </h1>
            <p className="text-gray-300 mt-2">
              تطوير وطني لرصد وتتبع الأقمار فوق الأراضي العراقية
            </p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-32 h-20 iraq-flag-bg rounded-lg shadow-xl"></div>
            <p className="text-sm text-gray-400 mt-2">علم جمهورية العراق</p>
          </div>
        </div>
      </div>

      {/* Developer Info Card */}
      <div className="satellite-card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="p-3 bg-gradient-to-r from-iraq-red/20 to-cyan-500/20 rounded-xl">
              <Award className="h-8 w-8 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">المطور والمشرف</h2>
              <p className="text-gray-400">قائد المشروع والتصميم</p>
            </div>
          </div>
          
          <div className="px-4 py-2 bg-gradient-to-r from-iraq-green to-cyan-500 rounded-xl">
            <span className="font-bold text-white">مشروع تخرج 2026</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-cyan-500/30">
            <div className="flex items-center space-x-3 space-x-reverse mb-4">
              <Users className="h-6 w-6 text-cyan-400" />
              <h3 className="text-lg font-bold text-white">المعلومات الشخصية</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-400">الاسم الكامل</p>
                <p className="text-lg font-bold text-cyan-300">{developer.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">الاسم بالإنجليزية</p>
                <p className="text-gray-300">Eng. Hussein Fahim Al-Khazaali</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">التخصص</p>
                <p className="text-gray-300">هندسة الاتصالات والأقمار الصناعية</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-iraq-red/30">
            <div className="flex items-center space-x-3 space-x-reverse mb-4">
              <Calendar className="h-6 w-6 text-iraq-red" />
              <h3 className="text-lg font-bold text-white">معلومات المشروع</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-400">سنة التطوير</p>
                <p className="text-lg font-bold text-iraq-red">{developer.year}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">المؤسسة التعليمية</p>
                <p className="text-gray-300">كلية الهندسة - قسم الاتصالات</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">نوع المشروع</p>
                <p className="text-gray-300">مشروع تخرج بكالوريوس</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-iraq-green/30">
            <div className="flex items-center space-x-3 space-x-reverse mb-4">
              <Flag className="h-6 w-6 text-iraq-green" />
              <h3 className="text-lg font-bold text-white">الانتماء الوطني</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-400">الجنسية</p>
                <p className="text-lg font-bold text-iraq-green">عراقي</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">الهدف الوطني</p>
                <p className="text-gray-300">تعزيز القدرات الفضائية العراقية</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">الرؤية</p>
                <p className="text-gray-300">العراق مركز إقليمي في علوم الفضاء</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Iraqi Space Capabilities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Iraqi Satellites */}
        <div className="satellite-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-cyan-300">🛰️ الأقمار العراقية والمهمة</h2>
            <span className="px-3 py-1 bg-iraq-red/20 text-iraq-red rounded-full text-sm">
              {iraqSatellites.length} أقمار
            </span>
          </div>
          
          <div className="space-y-4">
            {iraqSatellites.map((sat, index) => (
              <div key={index} className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 p-4 rounded-xl border border-gray-700 hover:border-cyan-500/50 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className={`p-2 rounded-lg ${sat.name.includes('IRAQ') 
                      ? 'bg-iraq-red/20 text-iraq-red' 
                      : 'bg-cyan-500/20 text-cyan-400'}`}>
                      <Satellite className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold">{sat.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-1 text-xs rounded ${sat.type === 'اتصالات' 
                          ? 'bg-iraq-green/20 text-iraq-green' 
                          : 'bg-cyan-500/20 text-cyan-300'}`}>
                          {sat.type}
                        </span>
                        <span className="text-xs text-gray-500">إطلاق: {sat.launch}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${sat.status === 'نشط' 
                    ? 'bg-iraq-green/20 text-iraq-green' 
                    : 'bg-gray-500/20 text-gray-400'}`}>
                    {sat.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <p className="text-sm text-gray-400">التردد</p>
                    <p className="font-mono text-gray-300">{sat.frequency}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">الوصف</p>
                    <p className="text-sm text-gray-300">{sat.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Observation Stations */}
        <div className="satellite-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-cyan-300">📡 محطات الرصد العراقية</h2>
            <span className="px-3 py-1 bg-iraq-green/20 text-iraq-green rounded-full text-sm">
              {stations.length} محطات
            </span>
          </div>
          
          <div className="space-y-4">
            {stations.map((station, index) => (
              <div key={index} className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 p-4 rounded-xl border border-gray-700 hover:border-iraq-green/50 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="p-2 rounded-lg bg-iraq-green/20 text-iraq-green">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold">{station.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded text-xs">
                          📍 {station.location}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <p className="text-sm text-gray-400">الإحداثيات</p>
                    <p className="text-sm text-gray-300">
                      {station.latitude.toFixed(4)}°, {station.longitude.toFixed(4)}°
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">المشغل</p>
                    <p className="text-sm text-gray-300">{station.operator}</p>
                  </div>
                </div>
                
                <div className="mt-3">
                  <p className="text-sm text-gray-400">المعدات</p>
                  <p className="text-sm text-gray-300">{station.equipment}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Project Features */}
      <div className="satellite-card">
        <h2 className="text-xl font-bold text-cyan-300 mb-6">✨ مميزات النظام العراقي</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 p-6 rounded-xl border border-cyan-500/30">
            <div className="flex items-center justify-between mb-4">
              <Satellite className="h-8 w-8 text-cyan-400" />
              <span className="text-2xl font-bold text-cyan-300">01</span>
            </div>
            <h3 className="font-bold text-white mb-2">تتبع حي</h3>
            <p className="text-gray-400 text-sm">
              تتبع الأقمار فوق العراق في الوقت الحقيقي مع تحديث فوري
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-iraq-red/10 to-iraq-red/5 p-6 rounded-xl border border-iraq-red/30">
            <div className="flex items-center justify-between mb-4">
              <Cloud className="h-8 w-8 text-iraq-red" />
              <span className="text-2xl font-bold text-iraq-red">02</span>
            </div>
            <h3 className="font-bold text-white mb-2">أقمار الطقس</h3>
            <p className="text-gray-400 text-sm">
              رصد أقمار الطقس الخاصة بالعراق للتنبؤ الدقيق بالحالة الجوية
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-iraq-green/10 to-iraq-green/5 p-6 rounded-xl border border-iraq-green/30">
            <div className="flex items-center justify-between mb-4">
              <Radio className="h-8 w-8 text-iraq-green" />
              <span className="text-2xl font-bold text-iraq-green">03</span>
            </div>
            <h3 className="font-bold text-white mb-2">الاتصالات</h3>
            <p className="text-gray-400 text-sm">
              تتبع أقمار الاتصالات التي تخدم العراق والمنطقة
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 p-6 rounded-xl border border-purple-500/30">
            <div className="flex items-center justify-between mb-4">
              <Flag className="h-8 w-8 text-purple-400" />
              <span className="text-2xl font-bold text-purple-300">04</span>
            </div>
            <h3 className="font-bold text-white mb-2">واجهة عراقية</h3>
            <p className="text-gray-400 text-sm">
              واجهة مستخدم عربية كاملة مع تصميم يعكس الهوية العراقية
            </p>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="text-center p-6 bg-gradient-to-r from-iraq-red/5 via-iraq-white/5 to-iraq-green/5 rounded-2xl border border-dashed border-gray-700">
        <p className="text-gray-400">
          "هذا المشروع يمثل خطوة نحو تعزيز القدرات العراقية في مجال الفضاء والأقمار الصناعية"
        </p>
        <p className="text-cyan-300 font-bold mt-2">{developer.name}</p>
        <p className="text-sm text-gray-500 mt-1">مطور النظام العراقي لمتعقب الأقمار - 2026</p>
      </div>
    </div>
  )
}

export default IraqInfo