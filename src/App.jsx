import { useState } from 'react'
import Header from './components/Header'
import InputForm from './components/InputForm'
import WeatherBadge from './components/WeatherBadge'
import RouteList from './components/RouteList'
import RouteDetailPage from './components/RouteDetailPage'
import { generateRoutes, getWeather } from './services/ai'

function App() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [selectedRoute, setSelectedRoute] = useState(null)
  const [formData, setFormData] = useState(null)
  const [showDetail, setShowDetail] = useState(false)

  const handleSubmit = async (data) => {
    setLoading(true)
    setResult(null)
    setSelectedRoute(null)
    setShowDetail(false)
    setFormData(data)

    try {
      const [routes, weather] = await Promise.all([
        generateRoutes(data.city, data.childAge, data.date),
        getWeather(data.city, data.date),
      ])

      setResult({ routes, weather })
    } catch (error) {
      console.error('获取数据失败:', error)
      alert('获取数据失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectRoute = (route) => {
    setSelectedRoute(route)
    setShowDetail(true)
  }

  const handleBack = () => {
    setShowDetail(false)
  }

  const handleChangeRoute = (route) => {
    setSelectedRoute(route)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main className="max-w-lg mx-auto px-4 py-4 space-y-4">
        {/* 输入表单 */}
        <InputForm onSubmit={handleSubmit} loading={loading} />

        {result && (
          <>
            {/* 天气小标签 */}
            <WeatherBadge weather={result.weather} date={formData.date} />

            {/* 线路列表 */}
            <div>
              <h2 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                <span>🗺️</span>
                <span>推荐线路</span>
                <span className="text-xs font-normal text-gray-400">共{result.routes.length}条</span>
              </h2>
              <RouteList 
                routes={result.routes}
                selectedRoute={null}
                onSelect={handleSelectRoute}
              />
            </div>
          </>
        )}
      </main>

      {/* 页脚 */}
      <footer className="text-center py-4 text-gray-400 text-xs">
        <p>亲子徒步助手 · Demo版本</p>
      </footer>

      {/* 全屏详情页 */}
      {showDetail && selectedRoute && (
        <RouteDetailPage
          route={selectedRoute}
          routes={result.routes}
          city={formData.city}
          weather={result.weather}
          childAge={formData.childAge}
          onBack={handleBack}
          onChangeRoute={handleChangeRoute}
        />
      )}
    </div>
  )
}

export default App
