import { useState } from 'react'
import { cities, popularCities } from '../data/cities'

export default function InputForm({ onSubmit, loading }) {
  const [city, setCity] = useState('')
  const [childAge, setChildAge] = useState('')
  const [date, setDate] = useState('')
  const [showCityDropdown, setShowCityDropdown] = useState(false)
  const [citySearch, setCitySearch] = useState('')

  // 过滤城市
  const filteredCities = citySearch
    ? cities.filter(c => c.name.includes(citySearch) || c.province.includes(citySearch))
    : cities

  // 获取明天的日期作为默认最小日期
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (city && childAge && date) {
      onSubmit({ city, childAge: parseInt(childAge), date })
    }
  }

  const selectCity = (cityName) => {
    setCity(cityName)
    setCitySearch('')
    setShowCityDropdown(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-4 space-y-4">
      {/* 城市选择 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          所在城市
        </label>
        <div className="relative">
          <input
            type="text"
            value={city || citySearch}
            onChange={(e) => {
              setCitySearch(e.target.value)
              setCity('')
              setShowCityDropdown(true)
            }}
            onFocus={() => setShowCityDropdown(true)}
            placeholder="搜索或选择城市"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          {showCityDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-auto">
              {/* 热门城市 */}
              {!citySearch && (
                <div className="p-2 border-b">
                  <p className="text-xs text-gray-500 mb-2">热门城市</p>
                  <div className="flex flex-wrap gap-2">
                    {popularCities.map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => selectCity(c)}
                        className="px-2 py-1 text-sm bg-green-50 text-green-700 rounded hover:bg-green-100"
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {/* 城市列表 */}
              <div className="max-h-48 overflow-auto">
                {filteredCities.map(c => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => selectCity(c.name)}
                    className="w-full px-3 py-2 text-left hover:bg-gray-50 flex justify-between"
                  >
                    <span>{c.name}</span>
                    <span className="text-gray-400 text-sm">{c.province}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* 点击外部关闭下拉 */}
        {showCityDropdown && (
          <div 
            className="fixed inset-0 z-0" 
            onClick={() => setShowCityDropdown(false)}
          />
        )}
      </div>

      {/* 孩子年龄 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          孩子年龄
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="3"
            max="18"
            value={childAge}
            onChange={(e) => setChildAge(e.target.value)}
            placeholder="3-18"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <span className="text-gray-500">岁</span>
        </div>
        {childAge && (
          <p className="text-xs text-gray-500 mt-1">
            {childAge <= 5 && '适合简单线路，距离3km以内'}
            {childAge > 5 && childAge <= 8 && '适合简单到中等线路，距离5km以内'}
            {childAge > 8 && childAge <= 12 && '适合中等线路，距离8km以内'}
            {childAge > 12 && '适合中等到困难线路'}
          </p>
        )}
      </div>

      {/* 出行日期 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          计划出行日期
        </label>
        <input
          type="date"
          min={minDate}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      {/* 提交按钮 */}
      <button
        type="submit"
        disabled={!city || !childAge || !date || loading}
        className="w-full py-3 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            生成推荐中...
          </span>
        ) : (
          '获取线路推荐'
        )}
      </button>
    </form>
  )
}
