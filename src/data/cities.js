// 中国主要城市列表（按省份分组）
export const cities = [
  // 直辖市
  { name: '北京', province: '北京' },
  { name: '上海', province: '上海' },
  { name: '天津', province: '天津' },
  { name: '重庆', province: '重庆' },
  // 广东
  { name: '广州', province: '广东' },
  { name: '深圳', province: '广东' },
  { name: '东莞', province: '广东' },
  { name: '佛山', province: '广东' },
  { name: '珠海', province: '广东' },
  { name: '惠州', province: '广东' },
  // 浙江
  { name: '杭州', province: '浙江' },
  { name: '宁波', province: '浙江' },
  { name: '温州', province: '浙江' },
  { name: '绍兴', province: '浙江' },
  { name: '嘉兴', province: '浙江' },
  // 江苏
  { name: '南京', province: '江苏' },
  { name: '苏州', province: '江苏' },
  { name: '无锡', province: '江苏' },
  { name: '常州', province: '江苏' },
  { name: '南通', province: '江苏' },
  // 山东
  { name: '济南', province: '山东' },
  { name: '青岛', province: '山东' },
  { name: '烟台', province: '山东' },
  { name: '威海', province: '山东' },
  // 四川
  { name: '成都', province: '四川' },
  { name: '绵阳', province: '四川' },
  { name: '乐山', province: '四川' },
  // 湖北
  { name: '武汉', province: '湖北' },
  { name: '宜昌', province: '湖北' },
  // 湖南
  { name: '长沙', province: '湖南' },
  { name: '张家界', province: '湖南' },
  // 河南
  { name: '郑州', province: '河南' },
  { name: '洛阳', province: '河南' },
  // 福建
  { name: '福州', province: '福建' },
  { name: '厦门', province: '福建' },
  { name: '泉州', province: '福建' },
  // 陕西
  { name: '西安', province: '陕西' },
  // 云南
  { name: '昆明', province: '云南' },
  { name: '大理', province: '云南' },
  { name: '丽江', province: '云南' },
  // 贵州
  { name: '贵阳', province: '贵州' },
  // 辽宁
  { name: '沈阳', province: '辽宁' },
  { name: '大连', province: '辽宁' },
  // 吉林
  { name: '长春', province: '吉林' },
  // 黑龙江
  { name: '哈尔滨', province: '黑龙江' },
  // 安徽
  { name: '合肥', province: '安徽' },
  { name: '黄山', province: '安徽' },
  // 江西
  { name: '南昌', province: '江西' },
  { name: '九江', province: '江西' },
  // 河北
  { name: '石家庄', province: '河北' },
  { name: '秦皇岛', province: '河北' },
  // 山西
  { name: '太原', province: '山西' },
  // 内蒙古
  { name: '呼和浩特', province: '内蒙古' },
  // 广西
  { name: '南宁', province: '广西' },
  { name: '桂林', province: '广西' },
  // 海南
  { name: '海口', province: '海南' },
  { name: '三亚', province: '海南' },
  // 甘肃
  { name: '兰州', province: '甘肃' },
  // 宁夏
  { name: '银川', province: '宁夏' },
  // 青海
  { name: '西宁', province: '青海' },
  // 新疆
  { name: '乌鲁木齐', province: '新疆' },
  // 西藏
  { name: '拉萨', province: '西藏' },
]

// 按省份分组的城市
export const citiesByProvince = cities.reduce((acc, city) => {
  if (!acc[city.province]) {
    acc[city.province] = []
  }
  acc[city.province].push(city.name)
  return acc
}, {})

// 热门城市
export const popularCities = [
  '北京', '上海', '广州', '深圳', '杭州', 
  '成都', '南京', '武汉', '西安', '重庆'
]
