import React, { useState, useEffect } from 'react'
import Dashboard from './components/Dashboard'
import SatelliteList from './components/SatelliteList'
import SkyView from './components/SkyView'
import AntennaGuide from './components/AntennaGuide'
import IraqInfo from './components/IraqInfo'
import { Satellite, Map, Compass, Settings, MapPin, Flag, User } from 'lucide-react'

function App() {
  const [currentView, setCurrentView] = useState('dashboard')
  const [userLocation, setUserLocation] = useState({
    latitude: 33.3128,
    longitude: 44.3615,
    city: 'بغداد',
    country: 'العراق',
    arabicCountry: 'جمهورية العراق'
  })
  const [developerInfo, setDeveloperInfo] = useState({
    name: 'المهندس حسين فاهم الخزعلي',
    year: '2026',
    university: 'كلية الهندسة - مشروع تخرج'
  })

  useEffect(() => {
    // جلب معلومات المطور من API
    fetch('/api/developer')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setDeveloperInfo(data.developer)
        }
      })
      .catch(console.error)
    
    // جلب موقع المستخدم (استخدام بغداد كافتراضي للعراق)
    fetch('/api/location/iraq?city=baghdad')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUserLocation(data.location)
        }
      })
      .catch(console.error)
  }, [])

  const navigationItems = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: <Map /> },
    { id: 'satellites', label: 'أقمار العراق', icon: <Satellite /> },
    { id: 'skyview', label: 'السماء العراقية', icon: <Compass /> },
    { id: 'antenna', label: 'توجيه الهوائي', icon: <Settings /> },
    { id: 'iraqinfo', label: 'معلومات العراق', icon: <Flag /> }
  ]

  const iraqiCities = [
    { id: 'baghdad', name: 'بغداد', lat: 33.3128, lon: 44.3615 },
    { id: 'basra', name: 'البصرة', lat: 30.5, lon: 47.8 },
    { id: 'mosul', name: 'الموصل', lat: 36.34, lon: 43.13 },
    { id: 'erbil', name: 'أربيل', lat: 36.19, lon: 44.01 }
  ]

  const handleCityChange = (city) => {
    const selected = iraqiCities.find(c => c.id === city)
    if (selected) {
      setUserLocation({
        latitude: selected.lat,
        longitude: selected.lon,
        city: selected.name,
        country: 'العراق'
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-iraq-red/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="relative">
                <Satellite className="h-10 w-10 text-cyan-400 animate-pulse" />
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-iraq-red rounded-full animate-ping"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  النظام العراقي لمتعقب الأقمار
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <Flag className="h-4 w-4 text-iraq-red" />
                  <p className="text-gray-300 text-sm">نظام وطني لتتبع الأقمار فوق العراق</p>
                </div>
              </div>
            </div>
            
            {/* Location and Developer Info */}
            <div className="flex flex-col gap-3">
              {/* Location Selector */}
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-cyan-300" />
                <select 
                  className="bg-gray-800 border border-iraq-red/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  value={userLocation.city}
                  onChange={(e) => handleCityChange(e.target.value)}
                >
                  {iraqiCities.map(city => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
                <div className="px-3 py-1 bg-iraq-red/20 text-iraq-red rounded-lg text-sm font-medium">
                  العراق
                </div>
              </div>
              
              {/* Developer Info */}
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-cyan-400" />
                <span className="text-gray-300">{developerInfo.name}</span>
                <span className="text-iraq-green">•</span>
                <span className="text-gray-400">{developerInfo.year}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:w-64">
            <nav className="bg-gradient-to-b from-gray-800/80 to-gray-900/80 backdrop-blur-lg rounded-2xl p-4 border border-cyan-500/20">
              <div className="mb-6 p-3 bg-gradient-to-r from-iraq-red/10 to-iraq-green/10 rounded-xl">
                <h3 className="font-bold text-center text-cyan-300">🇮🇶 العراق الفضائي</h3>
                <p className="text-xs text-center text-gray-400 mt-1">
                  رصد الأقمار فوق الأراضي العراقية
                </p>
              </div>
              
              <ul className="space-y-2">
                {navigationItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => setCurrentView(item.id)}
                      className={`w-full flex items-center space-x-3 space-x-reverse p-3 rounded-xl transition-all duration-300 ${
                        currentView === item.id
                          ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg'
                          : 'hover:bg-gray-700/50 hover:translate-x-2'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${
                        currentView === item.id 
                          ? 'bg-white/20' 
                          : 'bg-gray-700/50'
                      }`}>
                        {item.icon}
                      </div>
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>

              {/* Iraq Satellite Info */}
              <div className="mt-8 p-4 bg-gradient-to-br from-iraq-red/5 to-iraq-green/5 rounded-xl border border-iraq-red/20">
                <h3 className="font-bold mb-2 text-cyan-300">معلومة عراقية</h3>
                <p className="text-sm text-gray-300">
                  العراق يمتلك قمراً صناعياً اتصالاتي (IRAQ-SAT 1) تم إطلاقه عام 2014
                </p>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-iraq-green">📍 بغداد</span>
                  <span className="text-cyan-400">📡 11958 MHz</span>
                </div>
              </div>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {currentView === 'dashboard' && (
              <Dashboard location={userLocation} developer={developerInfo} />
            )}
            {currentView === 'satellites' && (
              <SatelliteList location={userLocation} developer={developerInfo} />
            )}
            {currentView === 'skyview' && (
              <SkyView location={userLocation} developer={developerInfo} />
            )}
            {currentView === 'antenna' && (
              <AntennaGuide location={userLocation} developer={developerInfo} />
            )}
            {currentView === 'iraqinfo' && (
              <IraqInfo location={userLocation} developer={developerInfo} />
            )}
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 py-8 bg-gradient-to-t from-gray-900 to-gray-950 border-t border-iraq-red/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Developer Signature */}
            <div className="text-center md:text-right">
              <div className="inline-block px-6 py-3 bg-gradient-to-r from-iraq-red/10 via-iraq-green/10 to-cyan-500/10 rounded-2xl border border-cyan-500/30">
                <p className="font-bold text-lg text-cyan-300">{developerInfo.name}</p>
                <p className="text-sm text-cyan-400 mt-1">{developerInfo.university}</p>
                <div className="flex items-center justify-center gap-4 mt-2">
                  <span className="px-3 py-1 bg-iraq-red/20 text-iraq-red rounded-full text-xs">
                    العراق
                  </span>
                  <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-xs">
                    {developerInfo.year}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Project Info */}
            <div className="text-center md:text-left">
              <h3 className="font-bold text-white mb-2">النظام العراقي لمتعقب الأقمار</h3>
              <p className="text-gray-400 text-sm">
                مشروع تخرج في هندسة الاتصالات والأقمار الصناعية
              </p>
              <p className="text-gray-500 text-xs mt-2">
                © 2026 جميع الحقوق محفوظة - تطوير عراقي خالص
              </p>
            </div>
            
            {/* Iraq Flag */}
            <div className="flex flex-col items-center">
              <div className="flex flex-col w-24 h-16 rounded overflow-hidden shadow-lg">
                <div className="h-1/3 bg-iraq-red"></div>
                <div className="h-1/3 bg-white flex items-center justify-center">
                  <span className="text-iraq-green font-bold text-sm">الله أكبر</span>
                </div>
                <div className="h-1/3 bg-iraq-black"></div>
              </div>
              <p className="text-xs text-gray-400 mt-2">علم جمهورية العراق</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App