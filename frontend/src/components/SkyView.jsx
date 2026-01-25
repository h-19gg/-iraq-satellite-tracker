import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Compass, Target, Zap, Eye } from 'lucide-react'

const SkyView = ({ location }) => {
  const [satelliteData, setSatelliteData] = useState([])
  const [selectedTime, setSelectedTime] = useState('now')
  const [loading, setLoading] = useState(false)

  const fetchPredictions = async () => {
    setLoading(true)
    try {
      const response = await axios.post('/api/predict', {
        latitude: location.latitude,
        longitude: location.longitude,
        satellites: ['NOAA 19', 'ISS (ZARYA)', 'NOAA 18', 'METEOR M2'],
        days: 1
      })
      
      if (response.data.success) {
        setSatelliteData(response.data.predictions)
      }
    } catch (error) {
      console.error('Error fetching predictions:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPredictions()
    const interval = setInterval(fetchPredictions, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [location])

  // Create sky view visualization
  const renderSkyView = () => {
    return (
      <div className="relative w-full h-96 bg-gradient-to-b from-gray-900 to-blue-900/20 rounded-2xl overflow-hidden">
        {/* Horizon line */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-800 to-transparent"></div>
        
        {/* Stars */}
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 70}%`,
              opacity: Math.random() * 0.8 + 0.2
            }}
          />
        ))}
        
        {/* Satellites */}
        {satelliteData.map((sat, index) => {
          const angle = (index * 90) % 360
          const distance = 30 + (index * 10) % 50
          
          return (
            <div
              key={sat.satellite}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${50 + Math.cos(angle * Math.PI / 180) * distance}%`,
                top: `${50 - Math.sin(angle * Math.PI / 180) * distance}%`
              }}
            >
              <div className="relative">
                <div className="h-4 w-4 bg-blue-500 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-8 right-1/2 transform translate-x-1/2 whitespace-nowrap bg-gray-900/80 px-2 py-1 rounded-lg text-xs">
                  {sat.satellite}
                </div>
              </div>
            </div>
          )
        })}
        
        {/* Center crosshair */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="h-6 w-6 border-2 border-blue-400 rounded-full">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-blue-400"></div>
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-blue-400"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">الرؤية السماوية</h2>
            <p className="text-gray-400 mt-1">مشاهدة الأقمار في سماء موقعك</p>
          </div>
          
          <div className="flex items-center space-x-3 space-x-reverse">
            <button className="px-4 py-2 bg-gray-900/50 hover:bg-gray-800/50 rounded-xl flex items-center space-x-2 space-x-reverse">
              <Target className="h-4 w-4" />
              <span>تحديد موقعك</span>
            </button>
          </div>
        </div>

        {/* Sky Visualization */}
        <div className="mb-8">
          {renderSkyView()}
        </div>

        {/* Time Selector */}
        <div className="flex space-x-3 space-x-reverse mb-6">
          {['الآن', '+1 ساعة', '+3 ساعات', 'غداً'].map((time) => (
            <button
              key={time}
              onClick={() => setSelectedTime(time)}
              className={`px-4 py-2 rounded-xl transition-all ${
                selectedTime === time
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-900/50 hover:bg-gray-800/50'
              }`}
            >
              {time}
            </button>
          ))}
        </div>

        {/* Satellite Passes */}
        <div>
          <h3 className="text-xl font-bold mb-4">مرور الأقمار القادم</h3>
          
          {loading ? (
            <div className="text-center py-8 text-gray-500">
              جاري حساب المرور القادم...
            </div>
          ) : (
            <div className="space-y-3">
              {satelliteData.map((satellite) => (
                <div
                  key={satellite.satellite}
                  className="bg-gray-900/30 hover:bg-gray-900/50 rounded-xl p-4 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <Zap className="h-5 w-5 text-yellow-500" />
                      <div>
                        <h4 className="font-bold">{satellite.satellite}</h4>
                        <p className="text-sm text-gray-400">تردد: {satellite.frequency}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center space-x-4 space-x-reverse">
                        <div>
                          <p className="text-sm text-gray-400">المرور التالي</p>
                          <p className="font-bold">
                            {satellite.passes.length > 0 
                              ? satellite.passes[0].time.split(' ')[1]
                              : 'غير متوفر'}
                          </p>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg">
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Compass */}
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6">
        <h3 className="text-xl font-bold mb-4">البوصلة السماوية</h3>
        <div className="flex items-center justify-center">
          <div className="relative">
            <Compass className="h-48 w-48 text-blue-400" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="h-24 w-24 border-4 border-blue-500/30 rounded-full animate-spin-slow"></div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-4 mt-6 text-center">
          <div>
            <p className="text-gray-400">شمال</p>
            <p className="text-2xl font-bold">0°</p>
          </div>
          <div>
            <p className="text-gray-400">شرق</p>
            <p className="text-2xl font-bold">90°</p>
          </div>
          <div>
            <p className="text-gray-400">جنوب</p>
            <p className="text-2xl font-bold">180°</p>
          </div>
          <div>
            <p className="text-gray-400">غرب</p>
            <p className="text-2xl font-bold">270°</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SkyView