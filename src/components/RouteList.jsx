// 线路列表组件 - 精简版卡片
export default function RouteList({ routes, selectedRoute, onSelect }) {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case '简单': return 'bg-green-100 text-green-700'
      case '中等': return 'bg-yellow-100 text-yellow-700'
      case '困难': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="space-y-2">
      {routes.map((route, index) => {
        const isSelected = selectedRoute?.name === route.name
        return (
          <div
            key={index}
            onClick={() => onSelect(route)}
            className={`bg-white rounded-lg p-3 cursor-pointer transition-all ${
              isSelected 
                ? 'ring-2 ring-green-500 shadow-md' 
                : 'shadow hover:shadow-md'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-800 truncate">{route.name}</h3>
                  {!route.suitable && (
                    <span className="text-orange-500 text-xs">⚠️</span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                  <span>{route.distance}km</span>
                  <span>↑{route.elevation}m</span>
                  <span>{route.duration}h</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(route.difficulty)}`}>
                  {route.difficulty}
                </span>
                <svg 
                  className={`w-5 h-5 text-gray-400 transition-transform ${isSelected ? 'rotate-90' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
