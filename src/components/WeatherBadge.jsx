// 天气小标签组件 - 精简显示
export default function WeatherBadge({ weather, date }) {
  const getWeatherIcon = (w) => {
    if (w.includes('晴')) return '☀️'
    if (w.includes('多云')) return '⛅'
    if (w.includes('阴')) return '☁️'
    if (w.includes('雨')) return '🌧️'
    return '🌤️'
  }

  const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    return `${d.getMonth() + 1}/${d.getDate()} ${weekdays[d.getDay()]}`
  }

  const isRainy = weather.weather.includes('雨')

  return (
    <div className={`flex items-center justify-between px-4 py-2 rounded-lg ${
      isRainy ? 'bg-orange-50 border border-orange-200' : 'bg-blue-50 border border-blue-200'
    }`}>
      <div className="flex items-center gap-2">
        <span className="text-xl">{getWeatherIcon(weather.weather)}</span>
        <span className="font-medium">{weather.weather}</span>
        <span className="text-gray-600">{weather.temperature}</span>
      </div>
      <div className="text-sm text-gray-500">
        {formatDate(date)}
      </div>
    </div>
  )
}
