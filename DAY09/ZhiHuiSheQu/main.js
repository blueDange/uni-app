import App from './App'

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
//声明全局过滤器——可供所有的页面/组件使用
Vue.filter('datetime', (num)=>{
	//参数是数字——时间戳，返回日期时间字符串
	let d = new Date(num)  //把时间戳转换为日期对象
	//获取Date中的不同部分
	let yy = d.getFullYear()
	let mm = d.getMonth() + 1   //注意：默认的月份是0~11
	mm = mm<10 ? '0'+mm : mm
	let dd = d.getDate()
	dd = dd<10 ? '0'+dd : dd
	let hh = d.getHours()
	hh = hh<10 ? '0'+hh : hh
	let mi = d.getMinutes()
	mi = mi<10 ? '0'+mi : mi
	return `${yy}-${mm}-${dd} ${hh}:${mi}`
})
Vue.filter('feeType', (num)=>{
	//1-水费 2-电费 3-燃气费 4-物业费 5-停车费 6-宽带费
	//此处可以使用 if...else... 或者  switch...case... 或者：
	let arr = ['全部类型', '水费', '电费', '燃气费', '物业费', '停车费', '宽带费']
	let type = arr[num] ?? '未知类型'  
	//??运算符表示：第一个表达式的值如果存在，就返回它的值；否则就返回第二个表达式的值
	return  type
})
Vue.filter('feeTypeIcon', (num)=>{
	//1-shui 2-dian 3-ranqi 4-wuye 5-tingche 6-kuandai
	//此处可以使用 if...else... 或者  switch...case... 或者：
	let arr = ['logo2', 'shui', 'dian', 'ranqi', 'wuye', 'tingche', 'kuandai']
	let type = arr[num] ?? 'logo2'  
	//??运算符表示：第一个表达式的值如果存在，就返回它的值；否则就返回第二个表达式的值
	return  `../../static/img/${type}.png`
})


App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif