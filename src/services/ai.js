// AI 服务 - 生成徒步线路推荐
// Demo 阶段使用模拟数据，后续可接入 DeepSeek API

// 根据年龄计算适合的难度范围
function getDifficultyRange(age) {
  if (age <= 5) {
    return { maxDistance: 3, maxElevation: 100, level: '简单' }
  } else if (age <= 8) {
    return { maxDistance: 5, maxElevation: 200, level: '简单-中等' }
  } else if (age <= 12) {
    return { maxDistance: 8, maxElevation: 400, level: '中等' }
  } else {
    return { maxDistance: 12, maxElevation: 600, level: '中等-困难' }
  }
}

// 计算难度等级
function calculateDifficulty(distance, elevation) {
  const score = distance * 0.5 + elevation * 0.01
  if (score < 2) return '简单'
  if (score < 4) return '中等'
  return '困难'
}

// 模拟的线路数据（按城市）
const mockRoutes = {
  '北京': [
    { name: '香山公园环线', distance: 4, elevation: 200, duration: 2.5, description: '经典赏秋线路，沿途有多处休息点，适合亲子徒步', startPoint: '香山公园东门', endPoint: '香山公园东门' },
    { name: '百望山森林公园', distance: 3, elevation: 150, duration: 2, description: '山不高但景色优美，有完善的步道系统', startPoint: '百望山公园正门', endPoint: '百望山公园正门' },
    { name: '奥森公园北园', distance: 5, elevation: 50, duration: 2, description: '平坦易走，湿地景观丰富，适合低龄儿童', startPoint: '奥森北园南门', endPoint: '奥森北园南门' },
    { name: '凤凰岭自然风景区', distance: 6, elevation: 350, duration: 3.5, description: '自然风光好，有溪流和瀑布，夏季凉爽', startPoint: '凤凰岭景区入口', endPoint: '凤凰岭景区入口' },
    { name: '八大处公园', distance: 4, elevation: 250, duration: 2.5, description: '历史文化与自然风光结合，可乘索道下山', startPoint: '八大处公园正门', endPoint: '八大处公园正门' },
  ],
  '上海': [
    { name: '佘山国家森林公园', distance: 4, elevation: 100, duration: 2, description: '上海最高峰所在地，森林覆盖率高', startPoint: '佘山公园入口', endPoint: '佘山公园入口' },
    { name: '东平国家森林公园', distance: 5, elevation: 30, duration: 2, description: '崇明岛上的天然氧吧，地势平坦', startPoint: '东平森林公园入口', endPoint: '东平森林公园入口' },
    { name: '滨江森林公园', distance: 6, elevation: 20, duration: 2.5, description: '沿江步道风景优美，适合骑行和徒步', startPoint: '滨江公园南门', endPoint: '滨江公园北门' },
    { name: '共青森林公园', distance: 4, elevation: 15, duration: 1.5, description: '市区内的大型森林公园，设施完善', startPoint: '共青公园1号门', endPoint: '共青公园1号门' },
  ],
  '广州': [
    { name: '白云山摩星岭', distance: 5, elevation: 300, duration: 3, description: '广州第一峰，可俯瞰全城，步道成熟', startPoint: '白云山南门', endPoint: '白云山西门' },
    { name: '火炉山森林公园', distance: 4, elevation: 200, duration: 2, description: '原生态森林，空气清新，难度适中', startPoint: '火炉山公园入口', endPoint: '火炉山公园入口' },
    { name: '大夫山森林公园', distance: 6, elevation: 100, duration: 2.5, description: '番禺最大的森林公园，湖光山色', startPoint: '大夫山北门', endPoint: '大夫山北门' },
    { name: '帽峰山', distance: 7, elevation: 400, duration: 4, description: '广州最高峰之一，挑战性适中', startPoint: '帽峰山景区入口', endPoint: '帽峰山景区入口' },
  ],
  '深圳': [
    { name: '梧桐山小梧桐', distance: 4, elevation: 300, duration: 2.5, description: '深圳最高峰山系，选择小梧桐适合亲子', startPoint: '梧桐山村入口', endPoint: '梧桐山村入口' },
    { name: '塘朗山郊野公园', distance: 5, elevation: 250, duration: 2.5, description: '南山区热门徒步点，步道完善', startPoint: '塘朗山公园入口', endPoint: '塘朗山公园入口' },
    { name: '莲花山公园', distance: 3, elevation: 100, duration: 1.5, description: '市中心公园，交通便利，适合入门', startPoint: '莲花山公园南门', endPoint: '莲花山公园南门' },
    { name: '银湖山郊野公园', distance: 6, elevation: 300, duration: 3, description: '罗湖区最大郊野公园，山水相依', startPoint: '银湖山公园入口', endPoint: '银湖山公园入口' },
    { name: '马峦山郊野公园', distance: 8, elevation: 400, duration: 4, description: '有瀑布群，生态原始，适合大孩子', startPoint: '马峦山入口', endPoint: '马峦山入口' },
  ],
  '杭州': [
    { name: '九溪十八涧', distance: 4, elevation: 150, duration: 2, description: '溪水潺潺，茶园环绕，夏季避暑胜地', startPoint: '九溪公交站', endPoint: '龙井村' },
    { name: '十里琅珰', distance: 6, elevation: 300, duration: 3, description: '杭州经典徒步线路，可远眺西湖', startPoint: '龙井村', endPoint: '梅家坞' },
    { name: '西溪湿地', distance: 5, elevation: 20, duration: 2, description: '城市湿地公园，地势平坦，生态丰富', startPoint: '西溪湿地东门', endPoint: '西溪湿地东门' },
    { name: '北高峰', distance: 3, elevation: 250, duration: 2, description: '登顶可俯瞰西湖，有索道可选', startPoint: '灵隐寺', endPoint: '灵隐寺' },
  ],
  '成都': [
    { name: '青城山前山', distance: 5, elevation: 400, duration: 3, description: '道教名山，幽静清凉，步道完善', startPoint: '青城山景区入口', endPoint: '青城山景区入口' },
    { name: '龙泉山城市森林公园', distance: 6, elevation: 200, duration: 2.5, description: '成都最大城市森林公园，视野开阔', startPoint: '龙泉山公园入口', endPoint: '龙泉山公园入口' },
    { name: '浣花溪公园', distance: 4, elevation: 30, duration: 1.5, description: '市区公园，杜甫草堂旁，适合入门', startPoint: '浣花溪公园东门', endPoint: '浣花溪公园东门' },
    { name: '西岭雪山', distance: 8, elevation: 500, duration: 4, description: '四季皆宜，夏季避暑冬季赏雪', startPoint: '西岭雪山景区', endPoint: '西岭雪山景区' },
  ],
}

// 默认线路（当城市没有特定数据时）
const defaultRoutes = [
  { name: '城市森林公园环线', distance: 4, elevation: 100, duration: 2, description: '城市周边森林公园，步道完善，适合亲子徒步', startPoint: '公园入口', endPoint: '公园入口' },
  { name: '郊野公园徒步道', distance: 5, elevation: 200, duration: 2.5, description: '近郊自然风光，空气清新，难度适中', startPoint: '公园入口', endPoint: '公园入口' },
  { name: '滨水步道', distance: 6, elevation: 50, duration: 2, description: '沿河或沿湖步道，地势平坦，景色宜人', startPoint: '步道起点', endPoint: '步道终点' },
  { name: '山地公园', distance: 4, elevation: 250, duration: 2.5, description: '小型山地公园，有一定爬升，锻炼体能', startPoint: '公园入口', endPoint: '公园入口' },
]

// 生成线路推荐
export async function generateRoutes(city, childAge, date) {
  // 模拟 API 延迟
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  const difficultyRange = getDifficultyRange(childAge)
  const cityRoutes = mockRoutes[city] || defaultRoutes.map(r => ({
    ...r,
    name: `${city}${r.name}`,
  }))
  
  // 根据孩子年龄筛选合适的线路
  const suitableRoutes = cityRoutes
    .filter(route => 
      route.distance <= difficultyRange.maxDistance + 2 &&
      route.elevation <= difficultyRange.maxElevation + 100
    )
    .map(route => ({
      ...route,
      difficulty: calculateDifficulty(route.distance, route.elevation),
      suitable: route.distance <= difficultyRange.maxDistance && 
                route.elevation <= difficultyRange.maxElevation,
    }))
    .sort((a, b) => {
      // 优先显示适合的线路
      if (a.suitable && !b.suitable) return -1
      if (!a.suitable && b.suitable) return 1
      return 0
    })
  
  return suitableRoutes.slice(0, 5)
}

// 生成装备建议
export function generateGearTips(childAge, weather) {
  const tips = {
    clothing: [],
    gear: [],
    food: [],
  }
  
  // 根据天气
  if (weather.includes('晴') || weather.includes('多云')) {
    tips.clothing.push('防晒帽', '太阳镜', '防晒霜')
  }
  if (weather.includes('雨')) {
    tips.clothing.push('雨衣/雨伞', '防水鞋套', '备用衣物')
  }
  if (weather.includes('冷') || weather.includes('低温')) {
    tips.clothing.push('保暖外套', '手套', '帽子')
  }
  
  // 通用装备
  tips.gear.push('舒适的徒步鞋', '双肩背包', '登山杖（可选）', '急救包')
  
  // 根据年龄
  if (childAge <= 6) {
    tips.gear.push('儿童背带/背架（备用）')
    tips.food.push('小零食（每小时补充）', '果汁/牛奶')
  }
  
  // 通用食物
  tips.food.push('充足的饮用水（人均1L以上）', '能量棒/巧克力', '水果', '三明治/饭团')
  
  return tips
}

// 模拟天气数据
export async function getWeather(city, date) {
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // 模拟天气数据
  const weathers = ['晴', '多云', '阴', '小雨']
  const weather = weathers[Math.floor(Math.random() * weathers.length)]
  const temp = Math.floor(Math.random() * 15) + 15 // 15-30度
  
  return {
    weather,
    temperature: `${temp}°C`,
    humidity: `${Math.floor(Math.random() * 30) + 50}%`,
    wind: `${Math.floor(Math.random() * 3) + 1}级`,
    suggestion: weather.includes('雨') 
      ? '有降雨可能，建议携带雨具或改期' 
      : '天气适宜户外活动',
  }
}

// 模拟公交信息
export async function getTransportInfo(city, startPoint) {
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // 模拟公交数据
  return {
    routes: [
      {
        type: '地铁+公交',
        detail: `地铁X号线到XX站，换乘XXX路公交到${startPoint}`,
        duration: '约1小时',
      },
      {
        type: '公交直达',
        detail: `XXX路公交直达${startPoint}`,
        duration: '约1.5小时',
      },
    ],
    tips: '建议使用高德地图或百度地图查询实时公交信息',
  }
}
