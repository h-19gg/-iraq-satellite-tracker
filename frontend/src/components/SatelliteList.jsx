import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Search, Filter, Download, Info } from 'lucide-react'

const SatelliteList = ({ location }) => {
  const [satellites, setSatellites] = useState([])
  const [filteredSatellites, setFilteredSatellites] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')

  useEffect(() => {
    fetchAllSatellites()
  }, [])

  useEffect(() => {
    filterSatellites()
  }, [searchTerm, filterType, satellites])

  const fetchAllSatellites = async () => {
    try {
      const response = await axios.get('/api/satellites')
      if (response.data.success) {
        setSatellites(response.data.satellites)
      }
    } catch (error) {
      console.error('Error fetching satellites:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterSatellites = () => {
    let filtered = satellites

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(sat => sat.type === filterType)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(sat =>
        sat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sat.frequency.includes(searchTerm)
      )
    }

    setFilteredSatellites(filtered)
  }

  const satelliteTypes = [
    { id: 'all', label: 'جميع الأقمار' },
    { id: 'weather', label: 'أقمار الطقس' },
    { id: 'communications', label: 'أقمار الاتصالات' },
    { id: 'research', label: 'أقمار البحث العلمي' }
  ]

  const getSatelliteTypeLabel = (type) => {
    switch (type) {
      case 'weather': return 'طقس'
      case 'communications': return 'اتصالات'
      default: return 'بحث'
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold">قائمة الأقمار الصناعية</h2>
            <p className="text-gray-400 mt-1">تصفح وتصفية الأقمار النشطة</p>
          </div>
          
          <div className="flex items-center space-x-3 space-x-reverse">
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center space-x-2 space-x-reverse">
              <Download className="h-4 w-4" />
              <span>تصدير البيانات</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="ابحث عن قمر بالاسم أو التردد..."
              className="w-full bg-gray-900/50 border border-gray-700 rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

                    <div className="flex flex-wrap gap-2">
                        {satelliteTypes.map((type) => (
                            <button
                                key={type.id}
                                onClick={() => setFilterType(type.id)}
                                className={`px-4 py-2 rounded-xl transition-all ${filterType === type.id
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-900/50 hover:bg-gray-800/50'
                                    }`}
                            >
                                {type.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Satellites Table */}
                <div className="overflow-x-auto rounded-xl border border-gray-700">
                    <table className="w-full">
                        <thead className="bg-gray-900/50">
                            <tr>
                                <th className="py-3 px-4 text-right">اسم القمر</th>
                                <th className="py-3 px-4 text-right">النوع</th>
                                <th className="py-3 px-4 text-right">التردد</th>
                                <th className="py-3 px-4 text-right">رقم NORAD</th>
                                <th className="py-3 px-4 text-right">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="py-8 text-center text-gray-500">
                                        جاري تحميل البيانات...
                                    </td>
                                </tr>
                            ) : filteredSatellites.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-8 text-center text-gray-500">
                                        لا توجد أقمار تطابق البحث
                                    </td>
                                </tr>
                            ) : (
                                filteredSatellites.slice(0, 20).map((satellite) => (
                                    <tr
                                        key={satellite.norad_id}
                                        className="border-t border-gray-800 hover:bg-gray-900/30 transition-colors"
                                    >
                                        <td className="py-3 px-4">
                                            <div className="flex items-center space-x-3 space-x-reverse">
                                                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                                <span className="font-medium">{satellite.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                                                {getSatelliteTypeLabel(satellite.type)}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <code className="bg-gray-900 px-2 py-1 rounded text-sm">
                                                {satellite.frequency}
                                            </code>
                                        </td>
                                        <td className="py-3 px-4 text-gray-400">{satellite.norad_id}</td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center space-x-2 space-x-reverse">
                                                <button className="p-2 hover:bg-gray-800 rounded-lg">
                                                    <Info className="h-4 w-4" />
                                                </button>
                                                <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm">
                                                    تتبع
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 text-center text-gray-500 text-sm">
                    عرض {Math.min(filteredSatellites.length, 20)} من أصل {filteredSatellites.length} قمر
                </div>
            </div>
        </div>
    )
}

export default SatelliteList