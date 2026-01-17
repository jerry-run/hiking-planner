import { useState, useEffect } from 'react'
import { getTransportInfo, generateGearTips } from '../services/ai'

// 全屏线路详情页
export default function RouteDetailPage({ 
  route, 
  routes,
  city, 
  weather, 
  childAge,
  onBack,
  onChangeRoute 
}) {
  const [activeTab, setActiveTab] = useState('detail')
  const [transport, setTransport] = useState(null)
  const [loadingTransport, setLoadingTransport] = useState(false)

  const gearTips = generateGearTips(childAge, weather.weather)
  
  // 当前线路索引
  const currentIndex = routes.findIndex(r => r.name === route.name)
  const hasPrev = currentIndex > 0
  const hasNext = currentIndex < routes.length - 1

  // 加载公交信息
  useEffect(() => {
    const fetchTransport = async () => {
      setLoadingTransport(true)
      const data = await getTransportInfo(city, route.startPoint)
      setTransport(data)
      setLoadingTransport(false)
    }
    fetchTransport()
  }, [city, route.startPoint])

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case '简单': return 'bg-green-100 text-green-700'
      case '中等': return 'bg-yellow-100 text-yellow-700'
      case '困难': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const tabs = [
    { id: 'detail', label: '详情', icon: '📍' },
    { id: 'transport', label: '交通', icon: '🚌' },
    { id: 'gear', label: '装备', icon: '🎒' },
  ]

  return (
    <div className="fixed inset-0 bg-gray-100 z-50 flex flex-col animate-slideIn">
      {/* 顶部导航栏 */}
      <header className="bg-white shadow-sm">
        <div className="flex items-center px-4 py-3">
          <button 
            onClick={onBack}
            className="p-2 -ml-2 text-gray-600 hover:text-gray-900"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1 ml-2">
            <h1 className="font-bold text-gray-800 truncate">{route.name}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(route.difficulty)}`}>
                {route.difficulty}
              </span>
              <span className="text-xs text-gray-500">
                {route.distance}km · ↑{route.elevation}m · {route.duration}h
              </span>
            </div>
          </div>
        </div>

        {/* Tab 栏 */}
        <div className="flex border-t">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-green-600 border-b-2 border-green-500 bg-green-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="mr-1">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Tab 内容区 */}
      <main className="flex-1 overflow-auto p-4">
        {activeTab === 'detail' && (
          <DetailTab route={route} weather={weather} />
        )}
        {activeTab === 'transport' && (
          <TransportTab 
            transport={transport} 
            loading={loadingTransport} 
            startPoint={route.startPoint} 
          />
        )}
        {activeTab === 'gear' && (
          <GearTab tips={gearTips} weather={weather} />
        )}
      </main>

      {/* 底部切换栏 */}
      <footer className="bg-white border-t px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => hasPrev && onChangeRoute(routes[currentIndex - 1])}
            disabled={!hasPrev}
            className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm ${
              hasPrev 
                ? 'text-green-600 hover:bg-green-50' 
                : 'text-gray-300 cursor-not-allowed'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            上一条
          </button>
          
          <span className="text-sm text-gray-400">
            {currentIndex + 1} / {routes.length}
          </span>
          
          <button
            onClick={() => hasNext && onChangeRoute(routes[currentIndex + 1])}
            disabled={!hasNext}
            className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm ${
              hasNext 
                ? 'text-green-600 hover:bg-green-50' 
                : 'text-gray-300 cursor-not-allowed'
            }`}
          >
            下一条
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </footer>
    </div>
  )
}

// 详情 Tab
function DetailTab({ route, weather }) {
  return (
    <div className="space-y-4">
      {/* 天气提示 */}
      <div className={`flex items-center justify-between p-3 rounded-lg ${
        weather.weather.includes('雨') 
          ? 'bg-orange-50 border border-orange-200' 
          : 'bg-blue-50 border border-blue-200'
      }`}>
        <div className="flex items-center gap-2">
          <span className="text-xl">{getWeatherIcon(weather.weather)}</span>
          <span className="font-medium">{weather.weather}</span>
          <span className="text-gray-600">{weather.temperature}</span>
        </div>
        <span className="text-sm text-gray-500">风力{weather.wind}</span>
      </div>

      {/* 线路描述 */}
      <div className="bg-white rounded-xl p-4">
        <h3 className="font-medium text-gray-800 mb-2">线路介绍</h3>
        <p className="text-gray-600">{route.description}</p>
      </div>
      
      {/* 数据卡片 */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl p-4 text-center">
          <p className="text-xs text-gray-500 mb-1">距离</p>
          <p className="font-bold text-2xl text-gray-800">{route.distance}</p>
          <p className="text-xs text-gray-400">公里</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center">
          <p className="text-xs text-gray-500 mb-1">爬升</p>
          <p className="font-bold text-2xl text-gray-800">{route.elevation}</p>
          <p className="text-xs text-gray-400">米</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center">
          <p className="text-xs text-gray-500 mb-1">预计时长</p>
          <p className="font-bold text-2xl text-gray-800">{route.duration}</p>
          <p className="text-xs text-gray-400">小时</p>
        </div>
      </div>

      {/* 起终点 */}
      <div className="bg-white rounded-xl p-4 space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
            <span>起</span>
          </div>
          <div>
            <p className="text-xs text-gray-500">起点</p>
            <p className="font-medium text-gray-800">{route.startPoint}</p>
          </div>
        </div>
        <div className="ml-4 border-l-2 border-dashed border-gray-200 h-4"></div>
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
            <span>终</span>
          </div>
          <div>
            <p className="text-xs text-gray-500">终点</p>
            <p className="font-medium text-gray-800">{route.endPoint}</p>
          </div>
        </div>
      </div>

      {/* 难度提示 */}
      {!route.suitable && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <div className="flex items-start gap-2">
            <span className="text-orange-500">⚠️</span>
            <div>
              <p className="font-medium text-orange-700">难度提示</p>
              <p className="text-sm text-orange-600 mt-1">
                此线路对孩子可能有一定挑战，请根据实际体能情况选择，建议预留充足时间和休息点。
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// 交通 Tab
function TransportTab({ transport, loading, startPoint }) {
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-xl p-4">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-20 bg-gray-100 rounded"></div>
            <div className="h-20 bg-gray-100 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!transport) return null

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl p-4">
        <h3 className="font-medium text-gray-800 mb-1">目的地</h3>
        <p className="text-green-600 font-medium">{startPoint}</p>
      </div>

      <div className="bg-white rounded-xl p-4 space-y-3">
        <h3 className="font-medium text-gray-800 mb-2">推荐路线</h3>
        {transport.routes.map((route, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-800 flex items-center gap-2">
                {route.type === '地铁+公交' ? '🚇' : '🚌'}
                {route.type}
              </span>
              <span className="text-sm text-green-600 font-medium">{route.duration}</span>
            </div>
            <p className="text-sm text-gray-600">{route.detail}</p>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-2">
          <span>💡</span>
          <p className="text-sm text-blue-700">{transport.tips}</p>
        </div>
      </div>
    </div>
  )
}

// 装备 Tab
function GearTab({ tips, weather }) {
  return (
    <div className="space-y-4">
      {/* 天气建议 */}
      <div className={`rounded-xl p-4 ${
        weather.weather.includes('雨') 
          ? 'bg-orange-50 border border-orange-200' 
          : 'bg-green-50 border border-green-200'
      }`}>
        <div className="flex items-start gap-2">
          <span>🌤️</span>
          <div>
            <p className="font-medium text-gray-800">天气建议</p>
            <p className="text-sm text-gray-600 mt-1">{weather.suggestion}</p>
          </div>
        </div>
      </div>

      {/* 服装 */}
      {tips.clothing.length > 0 && (
        <div className="bg-white rounded-xl p-4">
          <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
            <span>👕</span> 服装建议
          </h3>
          <div className="flex flex-wrap gap-2">
            {tips.clothing.map((item, index) => (
              <span key={index} className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-sm">
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 装备 */}
      <div className="bg-white rounded-xl p-4">
        <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
          <span>🥾</span> 必备装备
        </h3>
        <div className="flex flex-wrap gap-2">
          {tips.gear.map((item, index) => (
            <span key={index} className="px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm">
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* 饮食 */}
      <div className="bg-white rounded-xl p-4">
        <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
          <span>🍎</span> 食物饮水
        </h3>
        <div className="flex flex-wrap gap-2">
          {tips.food.map((item, index) => (
            <span key={index} className="px-3 py-1.5 bg-orange-50 text-orange-700 rounded-full text-sm">
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// 辅助函数
function getWeatherIcon(w) {
  if (w.includes('晴')) return '☀️'
  if (w.includes('多云')) return '⛅'
  if (w.includes('阴')) return '☁️'
  if (w.includes('雨')) return '🌧️'
  return '🌤️'
}
