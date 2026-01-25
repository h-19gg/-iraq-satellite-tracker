import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Navigation, Radio, Settings, Wifi, RotateCw, Zap } from 'lucide-react'

const AntennaGuide = ({ location }) => {
  const [currentSatellite, setCurrentSatellite] = useState('NOAA 19')
  const [antennaData, setAntennaData] = useState(null)
  const [azimuth, setAzimuth] = useState(0)
  const [elevation, setElevation] = useState(45)
  const [loading, setLoading] = useState(false)

  const satellites = [
    { name: 'NOAA 19', frequency: '137.100 MHz', type: 'طقس' },
    { name: 'ISS (ZARYA)', frequency: '145.800 MHz', type: 'محطة فضائية' },
    { name: 'NOAA 18', frequency: '137.9125 MHz', type: 'طقس' },
    { name: 'METEOR M2', frequency: '137.100 MHz', type: 'طقس' },
    { name: 'SAUDISAT 1C', frequency: '145.850 MHz', type: 'اتصالات' }
  ]

  const calculateAntennaSettings = async () => {
    setLoading(true)
    try {
      const response = await axios.post('/api/track', {
        satellite_name: currentSatellite,
        latitude: location.latitude,
        longitude: location.longitude
      })
      
      if (response.data.success) {
        setAntennaData(response.data.antenna)
        setAzimuth(response.data.position.azimuth)
        setElevation(response.data.position.altitude)
      }
    } catch (error) {
      console.error('Error calculating antenna settings:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    calculateAntennaSettings()
    const interval = setInterval(calculateAntennaSettings, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [currentSatellite, location])

  const getDirectionArrow = (azimuth) => {
    const directions = ['↑', '↗', '→', '↘', '↓', '↙', '←', '↖']
    const index = Math.round(azimuth / 45) % 8
    return directions[index]
  }

  const renderAntennaVisualization = () => {
    return (
      <div className="relative h-64 bg-gradient-to-b from-gray-900 to-gray-800 rounded-2xl overflow-hidden">
        {/* Antenna base */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-2 bg-gray-700"></div>
        
        {/* Antenna pole */}
        <div 
          className="absolute bottom-2 left-1/2 transform -translate-x-1/2 origin-bottom w-1 bg-gradient-to-t from-gray-600 to-gray-400"
          style={{ 
            height: '150px',
            transform: `translateX(-50%) rotate(${-azimuth}deg)`
          }}
        >
          {/* Elevation indicator */}
          <div 
            className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-blue-500 origin-top"
            style={{ transform: `translateX(-50%) rotate(${elevation}deg)` }}
          >
            <div className="absolute -top-2 -right-2 h-4 w-4 bg-blue-400 rounded-full"></div>
          </div>
        </div>
        
        {/* Direction indicators */}
        <div className="absolute bottom-4 left-4 text-xs text-gray-400">W</div>
        <div className="absolute bottom-4 right-4 text-xs text-gray-400">E</div>
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-xs text-gray-400">N</div>
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-xs text-gray-400">S</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">توجيه الهوائي</h2>
            <p className="text-gray-400 mt-1">إرشادات دقيقة لتوجيه هوائيات الاستقبال</p>
          </div>
          
          <button
            onClick={calculateAntennaSettings}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center space-x-2 space-x-reverse disabled:opacity-50"
          >
            <RotateCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'جاري التحديث...' : 'تحديث البيانات'}</span>
          </button>
        </div>

        {/* Satellite Selection */}
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-3">اختر القمر المستهدف</h3>
          <div className="flex flex-wrap gap-3">
            {satellites.map((sat) => (
              <button
                key={sat.name}
                onClick={() => setCurrentSatellite(sat.name)}
                className={`px-4 py-3 rounded-xl transition-all flex items-center space-x-3 space-x-reverse ${
                  currentSatellite === sat.name
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-900/50 hover:bg-gray-800/50'
                }`}
              >
                <Radio className="h-4 w-4" />
                <div className="text-right">
                  <div className="font-medium">{sat.name}</div>
                  <div className="text-sm opacity-75">{sat.frequency}</div>
                </div>
                <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-300 rounded">
                  {sat.type}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Antenna Visualization */}
          <div>
            <h3 className="text-lg font-bold mb-3">المحاكاة البصرية</h3>
            {renderAntennaVisualization()}
            
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="bg-gray-900/30 p-4 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">الاتجاه</span>
                  <Navigation className="h-4 w-4 text-blue-400" />
                </div>
                <div className="text-3xl font-bold">{azimuth.toFixed(1)}°</div>
                <div className="text-xl mt-2">{getDirectionArrow(azimuth)}</div>
              </div>
              
              <div className="bg-gray-900/30 p-4 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">الارتفاع</span>
                  <Zap className="h-4 w-4 text-green-400" />
                </div>
                <div className="text-3xl font-bold">{elevation.toFixed(1)}°</div>
                <div className="text-sm mt-2">
                  {elevation > 60 ? 'عالٍ جداً' : 
                   elevation > 30 ? 'متوسط' : 
                   elevation > 10 ? 'منخفض' : 'على الأفق'}
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div>
            <h3 className="text-lg font-bold mb-3">إرشادات التوجيه</h3>
            
            {antennaData ? (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 p-4 rounded-xl border border-blue-500/20">
                  <div className="flex items-center space-x-3 space-x-reverse mb-2">
                    <Settings className="h-5 w-5 text-blue-400" />
                    <h4 className="font-bold">الإعدادات الحالية</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">الاتجاه</p>
                      <p className="font-bold text-lg">{antennaData.direction_text}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">زاوية الارتفاع</p>
                      <p className="font-bold text-lg">{antennaData.elevation_degrees.toFixed(1)}°</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900/30 p-4 rounded-xl">
                  <div className="flex items-center space-x-3 space-x-reverse mb-3">
                    <Wifi className="h-5 w-5 text-green-400" />
                    <h4 className="font-bold">نصائح للهوائي</h4>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-3 space-x-reverse">
                      <div className="h-2 w-2 bg-green-500 rounded-full mt-2"></div>
                      <span>نوع الهوائي الموصى به: <strong>{antennaData.antenna_type}</strong></span>
                    </li>
                    <li className="flex items-start space-x-3 space-x-reverse">
                      <div className="h-2 w-2 bg-green-500 rounded-full mt-2"></div>
                      <span>زاوية الاستقطاب: <strong>{antennaData.polarization}</strong></span>
                    </li>
                    <li className="flex items-start space-x-3 space-x-reverse">
                      <div className="h-2 w-2 bg-green-500 rounded-full mt-2"></div>
                      <span>استخدم بوصلة الهاتف للتوجيه الدقيق</span>
                    </li>
                    <li className="flex items-start space-x-3 space-x-reverse">
                      <div className="h-2 w-2 bg-green-500 rounded-full mt-2"></div>
                      <span>حافظ على خط رؤية واضح للسماء</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 p-4 rounded-xl">
                  <h4 className="font-bold mb-2">خطوات التوجيه</h4>
                  <ol className="list-decimal pr-5 space-y-2">
                    <li>استخدم بوصلة لتحديد اتجاه {antennaData.direction_text}</li>
                    <li>اضبط زاوية الهوائي إلى {antennaData.elevation_degrees.toFixed(0)} درجة</li>
                    <li>اضبط الاستقطاب إلى {antennaData.polarization}</li>
                    <li>شغل جهاز الاستقبال على التردد {satellites.find(s => s.name === currentSatellite)?.frequency}</li>
                    <li>قم بإجراء تعديلات دقيقة أثناء مرور القمر</li>
                  </ol>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Wifi className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>جاري حساب إعدادات الهوائي...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Frequency Guide */}
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6">
        <h3 className="text-xl font-bold mb-4">دليل الترددات</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900/50">
              <tr>
                <th className="py-3 px-4 text-right">نوع القمر</th>
                <th className="py-3 px-4 text-right">نطاق التردد</th>
                <th className="py-3 px-4 text-right">نوع الهوائي</th>
                <th className="py-3 px-4 text-right">مستوى الصعوبة</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-gray-800">
                <td className="py-3 px-4">أقمار الطقس</td>
                <td className="py-3 px-4">137-138 MHz</td>
                <td className="py-3 px-4">QFH أو V-Dipole</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-sm">سهل</span>
                </td>
              </tr>
              <tr className="border-t border-gray-800">
                <td className="py-3 px-4">محطة الفضاء الدولية</td>
                <td className="py-3 px-4">145.800 MHz</td>
                <td className="py-3 px-4">Yagi أو Dipole</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded text-sm">متوسط</span>
                </td>
              </tr>
              <tr className="border-t border-gray-800">
                <td className="py-3 px-4">أقمار الاتصالات</td>
                <td className="py-3 px-4">435-438 MHz</td>
                <td className="py-3 px-4">Yagi مركّز</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 bg-red-500/20 text-red-300 rounded text-sm">متقدم</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AntennaGuide