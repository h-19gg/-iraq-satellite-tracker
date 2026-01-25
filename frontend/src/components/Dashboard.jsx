import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { MapContainer, TileLayer, CircleMarker, Popup, Polyline } from 'react-leaflet'
import { Satellite, Clock, Navigation, Wifi, Flag, Users, Cloud, Radio } from 'lucide-react'

const Dashboard = ({ location, developer }) => {
  const [satellites, setSatellites] = useState([])
  const [selectedSatellite, setSelectedSatellite] = useState(null)
  const [loading, setLoading] = useState(true)
  const [iraqStats, setIraqStats] = useState({
    totalObservations: 1247,
    activeStations: 5,
    weatherSats: 3,
    commSats: 4
  })

  useEffect(() => {
    fetchIraqSatellites()
    fetchIraqStats()
  }, [location])

  const fetchIraqSatellites = async () => {
    try {
      const response = await axios.get('/api/satellites', {
        params: { iraq: 'true', type: 'stations' }
      })
      if (response.data.success) {
        setSatellites(response.data.satellites.slice(0, 8))
      }
    } catch (error) {
      console.error('Error fetching Iraqi satellites:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchIraqStats = async () => {
    try {
      const response = await axios.get('/api/iraq/info')
      if (response.data.success) {
        // تحديث الإحصائيات من الرد
      }
    } catch (error) {
      console.error('Error fetching Iraq stats:', error)
    }
  }

  const trackSatellite = async (satName) => {
    try {
      const response = await axios.post('/api/track', {
        satellite_name: satName,
        latitude: location.latitude,
        longitude: location.longitude,
        city: location.city
      })
      
      if (response.data.success) {
        setSelectedSatellite(response.data)
      }
    } catch (error) {
      console.error('Error tracking satellite:', error)
    }
  }

  // إحداثيات العراق التقريبية للخريطة
  const iraqBounds = [
    [29.1, 38.8], // جنوب غرب
    [37.4, 48.9]  // شمال شرق
  ]

  const iraqCities = [
    { name: 'بغداد', lat: 33.3128, lon: 44.3615 },
    { name: 'البصرة', lat: 30.5, lon: 47.8 },
    { name: 'الموصل', lat: 36.34, lon: 43.13 },
    { name: 'أربيل', lat: 36.19, lon: 44.01 },
    { name: 'كربلاء', lat: 32.6, lon: 44.02 },
    { name: 'الناصرية', lat: 31.05, lon: 46.25 }
  ]

  return (
    <div className="space-y-8">
      {/* Iraq Stats Header */}
      <div className="bg-gradient-to-r from-iraq-red/10 via-iraq-green/10 to-cyan-500/10 rounded-2xl p-6 border border-cyan-500/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">📡 النظام العراقي لرصد الأقمار</h2>
            <p className="text-cyan-300 mt-1">
              {developer.name} • {developer.year} • {location.city}, العراق
            </p>
          </div>
          <div className="px-4 py-2 bg-gradient-to-r from-iraq-red to-iraq-green rounded-xl">
            <span className="font-bold text-white">🇮🇶 العراق الفضائي</span>
          </div>
        </div>
      </div>

      {/* Quick Stats - Iraq Theme */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* العراقية الإحصائيات */}
        <div className="bg-gradient-to-br from-iraq-red/20 to-iraq-red/40 rounded-2xl p-6 border border-iraq-red/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-iraq-red/80">الأقمار فوق العراق</p>
              <p className="text-3xl font-bold mt-2 text-white">8</p>
              <p className="text-sm text-iraq-red/60 mt-1">مرصودة الآن</p>
            </div>
            <Satellite className="h-12 w-12 text-iraq-red/50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-iraq-green/20 to-iraq-green/40 rounded-2xl p-6 border border-iraq-green/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-iraq-green/80">محطات الرصد</p>
              <p className="text-3xl font-bold mt-2 text-white">5</p>
              <p className="text-sm text-iraq-green/60 mt-1">في عموم العراق</p>
            </div>
            <Users className="h-12 w-12 text-iraq-green/50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/40 rounded-2xl p-6 border border-cyan-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cyan-300/80">أقمار الطقس</p>
              <p className="text-3xl font-bold mt-2 text-white">3</p>
              <p className="text-sm text-cyan-400/60 mt-1">لرصد طقس العراق</p>
            </div>
            <Cloud className="h-12 w-12 text-cyan-400/50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/40 rounded-2xl p-6 border border-blue-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-300/80">الاتصالات الفضائية</p>
              <p className="text-3xl font-bold mt-2 text-white">12</p>
              <p className="text-sm text-blue-400/60 mt-1">قمر نشط</p>
            </div>
            <Radio className="h-12 w-12 text-blue-400/50" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Satellite List */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-b from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-2xl p-6 border border-cyan-500/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-cyan-300">🛰️ الأقمار فوق العراق الآن</h2>
              <span className="px-3 py-1 bg-iraq-red/20 text-iraq-red rounded-full text-sm">
                تحديث حي
              </span>
            </div>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
                <p className="text-gray-400 mt-2">جاري تحميل بيانات الأقمار العراقية...</p>
              </div>
            ) : (
              <div className="space-y-3">
                {satellites.map((sat) => (
                  <div
                    key={sat.norad_id}
                    className={`bg-gradient-to-r ${sat.iraq_relevant 
                      ? 'from-cyan-500/10 to-blue-500/10 border-cyan-500/30' 
                      : 'from-gray-700/30 to-gray-800/30 border-gray-700/50'} 
                      hover:scale-[1.02] border rounded-xl p-4 cursor-pointer transition-all duration-300`}
                    onClick={() => trackSatellite(sat.name)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <div className={`h-3 w-3 rounded-full ${sat.importance === 'عالية جداً' 
                          ? 'bg-iraq-red animate-pulse' 
                          : sat.importance === 'عالية' 
                          ? 'bg-cyan-500' 
                          : 'bg-gray-500'}`}>
                        </div>
                        <div>
                          <h3 className="font-bold">{sat.name}</h3>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-sm text-gray-400">تردد: {sat.frequency}</span>
                            <span className={`px-2 py-1 rounded text-xs ${sat.type === 'طقس' 
                              ? 'bg-cyan-500/20 text-cyan-300' 
                              : sat.type === 'اتصالات' 
                              ? 'bg-iraq-green/20 text-iraq-green' 
                              : 'bg-gray-500/20 text-gray-400'}`}>
                              {sat.type}
                            </span>
                            {sat.iraq_relevant && (
                              <span className="px-2 py-1 bg-iraq-red/20 text-iraq-red rounded text-xs">
                                مهم للعراق
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500 mb-1">الأهمية</div>
                        <div className={`px-3 py-1 rounded-full text-sm ${sat.importance === 'عالية جداً' 
                          ? 'bg-iraq-red/30 text-iraq-red' 
                          : sat.importance === 'عالية' 
                          ? 'bg-cyan-500/30 text-cyan-300' 
                          : 'bg-gray-500/30 text-gray-400'}`}>
                          {sat.importance}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Selected Satellite Info */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-b from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-2xl p-6 border border-cyan-500/20">
            <h2 className="text-xl font-bold text-cyan-300 mb-6">🎯 معلومات القمر المحدد</h2>
            
            {selectedSatellite ? (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-cyan-500/20 to-blue-600/20 p-4 rounded-xl border border-cyan-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg">{selectedSatellite.satellite.name}</h3>
                    {selectedSatellite.satellite.iraq_relevant && (
                      <span className="px-2 py-1 bg-iraq-red/30 text-iraq-red rounded text-xs">
                        🇮🇶 عراقي
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-gray-400">التردد</p>
                      <p className="font-mono text-cyan-300">{selectedSatellite.satellite.frequency}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">النوع</p>
                      <p className="text-cyan-300">{selectedSatellite.satellite.type}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-gray-400">الارتفاع</p>
                      <Navigation className="h-4 w-4 text-cyan-400" />
                    </div>
                    <p className="text-2xl font-bold text-cyan-300">
                      {selectedSatellite.position.altitude.toFixed(1)}°
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedSatellite.position.altitude > 60 ? 'عالٍ جداً' : 
                       selectedSatellite.position.altitude > 30 ? 'متوسط' : 'منخفض'}
                    </p>
                  </div>
                  
                  <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-gray-400">السمت</p>
                      <Compass className="h-4 w-4 text-iraq-green" />
                    </div>
                    <p className="text-2xl font-bold text-iraq-green">
                      {selectedSatellite.position.azimuth.toFixed(1)}°
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedSatellite.antenna.direction_arabic}
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-iraq-green/10 to-iraq-red/10 p-4 rounded-xl border border-iraq-green/20">
                  <h4 className="font-bold mb-2 text-white">توجيه الهوائي العراقي</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">نوع الهوائي:</span>
                      <span className="text-cyan-300">{selectedSatellite.antenna.antenna_type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">الاستقطاب:</span>
                      <span className="text-iraq-green">{selectedSatellite.antenna.polarization}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">المستوى:</span>
                      <span className={`${selectedSatellite.antenna.difficulty.includes('سهل') 
                        ? 'text-iraq-green' 
                        : 'text-iraq-red'}`}>
                        {selectedSatellite.antenna.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="inline-block p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full">
                  <Satellite className="h-12 w-12 text-cyan-400 opacity-50" />
                </div>
                <p className="text-gray-500 mt-4">اختر قمراً من القائمة لعرض معلوماته</p>
                <p className="text-sm text-gray-600 mt-2">
                  الأقمار المميزة باللون الأحمر مهمة للعراق
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Iraq Map */}
      <div className="bg-gradient-to-b from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-2xl p-6 border border-cyan-500/20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-cyan-300">🗺️ خريطة العراق الفضائية</h2>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 bg-iraq-red rounded-full"></span>
            <span className="text-sm text-gray-400">مدن العراق</span>
            <span className="h-3 w-3 bg-cyan-500 rounded-full ml-4"></span>
            <span className="text-sm text-gray-400">الأقمار</span>
          </div>
        </div>
        
        <div className="h-96 rounded-xl overflow-hidden border border-gray-700">
          <MapContainer
            center={[location.latitude, location.longitude]}
            zoom={6}
            style={{ height: '100%', width: '100%' }}
            bounds={iraqBounds}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            
            {/* حدود العراق */}
            <Polyline
              positions={[
                [29.1, 48.9], [37.4, 48.9], [37.4, 38.8], [29.1, 38.8], [29.1, 48.9]
              ]}
              color="#FF0000"
              weight={2}
              opacity={0.5}
              dashArray="5, 10"
            />
            
            {/* مدن العراق */}
            {iraqCities.map((city, index) => (
              <CircleMarker
                key={index}
                center={[city.lat, city.lon]}
                radius={8}
                color="#206020"
                fillColor="#30A030"
                fillOpacity={0.8}
                weight={2}
              >
                <Popup>
                  <div className="text-right">
                    <strong>{city.name}</strong><br/>
                    <small>العراق</small>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
            
            {/* موقع المستخدم */}
            <CircleMarker
              center={[location.latitude, location.longitude]}
              radius={12}
              color="#3b82f6"
              fillColor="#3b82f6"
              fillOpacity={0.8}
              weight={3}
            >
              <Popup>
                <div className="text-right">
                  <strong>موقعك: {location.city}</strong><br/>
                  <small>مركز الرصد</small>
                </div>
              </Popup>
            </CircleMarker>
            
            {/* أقمار وهمية فوق العراق */}
            {Array.from({ length: 8 }).map((_, i) => {
              const lat = 33 + Math.sin(i) * 2
              const lon = 44 + Math.cos(i) * 2
              return (
                <CircleMarker
                  key={`sat-${i}`}
                  center={[lat, lon]}
                  radius={6}
                  color="#06b6d4"
                  fillColor="#06b6d4"
                  fillOpacity={0.6}
                  weight={2}
                >
                  <Popup>
                    <div className="text-right">
                      <strong>قمر صناعي #{i + 1}</strong><br/>
                      <small>فوق الأراضي العراقية</small>
                    </div>
                  </Popup>
                </CircleMarker>
              )
            })}
          </MapContainer>
        </div>
        
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-gradient-to-r from-iraq-red/10 to-iraq-red/5 rounded-xl">
            <p className="text-sm text-gray-400">مدن العراق</p>
            <p className="text-xl font-bold text-iraq-red">{iraqCities.length}</p>
          </div>
          <div className="p-3 bg-gradient-to-r from-cyan-500/10 to-cyan-500/5 rounded-xl">
            <p className="text-sm text-gray-400">الأقمار المرصودة</p>
            <p className="text-xl font-bold text-cyan-400">8</p>
          </div>
          <div className="p-3 bg-gradient-to-r from-iraq-green/10 to-iraq-green/5 rounded-xl">
            <p className="text-sm text-gray-400">محطات الرصد</p>
            <p className="text-xl font-bold text-iraq-green">5</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard