/****对服务器端数据API进行访问二次封装****/

/**
 * 服务器端基础地址 		
 */
export let base = 'https://www.codeboy.com/zhsqapi/'
// export let base = 'http://127.0.0.1:9005/'

/**
 * API-1.2、用户登录
 * 接口地址：user/login
 * 请求方式：POST
 * 请求主体格式：application/json   					
 * 	名称		必填		类型		说明
 *	phone	是		string	手机号
 *	pwd		是		string	密码
 */
export let userLogin = async (phone, pwd)=>{
	//1.准备请求URL
	let url = base + 'user/login'
	//console.log(url)
	//2.显示“加载中”提示框
	uni.showLoading({
		title: '用户登录中'
	})
	//3.发起异步请求消息
	let [err, res] = await uni.request({
		url,
		method: 'POST',
		data: {phone, pwd}
	})
	//4.隐藏“加载中”提示框
	uni.hideLoading()
	//5.返回响应消息主体
	return res.data
}


/**
 * API-2.1、首页数据
 * 接口地址：index/data
 * 请求方式：GET
 * 请求头部：token - 用户登录后保存在客户端的身份凭证
 */
export let indexData = async ( )=>{
	//1.准备请求URL
	let url = base + 'index/data'
	//2.显示“加载中”提示框	
	uni.showLoading({
		title: '首页数据读取中'
	})
	//3.发起异步请求消息
	let [err, res] = await uni.request({
		url,		//请求地址
		header: {	//请求头部-token(客户端身份令牌)
			token: uni.getStorageSync('userToken')
		}
	})
	//4.隐藏“加载中”提示框
	uni.hideLoading()
	//5.返回响应消息主体
	return res.data
}

/**
 * API-3.1、当前登录用户各项待缴费金额汇总
 * 接口地址：fee/list
 * 请求方式：GET
 * 请求头部：token - 用户登录后保存在客户端的身份凭证
 */
export let feeList = async ( )=>{
	//1.准备请求URL
	let url = base + 'fee/list'
	//2.显示“加载中”提示框	
	uni.showLoading({
		title: '缴费数据读取中'
	})
	//3.发起异步请求消息
	let [err, res] = await uni.request({
		url,		//请求地址
		header: {	//请求头部-token(客户端身份令牌)
			token: uni.getStorageSync('userToken')
		}
	})
	//4.隐藏“加载中”提示框
	uni.hideLoading()
	//5.返回响应消息主体
	return res.data
}

/**
 * API-3.4、当前登录用户缴费记录
 *  接口地址：fee/record
 *  请求方式：GET
 *	请求参数：
 *		type - 		费用的类型；  
 *		startTime - 缴费开始时间（时间戳数字）；
 *		endTime - 	缴费结束时间（时间戳数字）；
 *	请求头部：token - 用户登录后保存在客户端的身份凭证
 */
export let feeRecord = async (type, startTime, endTime)=>{
	//1.准备请求URL   
	//根据HTTP协议规定，URL后出现的“?k=v&k=v” 称为“查询字符串(QueryString)”或“搜索参数(SearchParams)”
	let url = base + `fee/record?type=${type}&startTime=${startTime}&endTime=${endTime}`
	//2.显示“加载中”提示框	
	uni.showLoading({
		title: '缴费记录读取中'
	})
	//3.发起异步请求消息
	let [err, res] = await uni.request({
		url,		//请求地址
		header: {	//请求头部-token(客户端身份令牌)
			token: uni.getStorageSync('userToken')
		}
	})
	//4.隐藏“加载中”提示框
	uni.hideLoading()
	//5.返回响应消息主体
	return res.data
}


/**
 * API-3.2、获取指定类型的收费单位列表
 * 接口地址：fee/collector
 * 请求方式：GET
 * 请求示例：fee/collector?type=2
 * 请求数据说明：
 * 	名称		必填		类型	说明
 * 	type	是		number	收费类型， 1-水费、2-电费、3-燃气费、4-物业费、5-停车费、6-宽带费
 */
export let feeCollector = async (type)=>{
	//1.准备请求URL   
	let url = base + `fee/collector?type=${type}`
	//2.显示“加载中”提示框	
	uni.showLoading({
		title: '缴费数据读取中'
	})
	//3.发起异步请求消息
	let [err, res] = await uni.request({ url })
	//4.隐藏“加载中”提示框
	uni.hideLoading()
	//5.返回响应消息主体
	return res.data
}

/**
 * 3.3、提交缴费记录
 * 接口地址：fee/add
 * 请求方式：POST
 * 请求主体格式：application/json
 * 请求数据说明：
 *	名称	必填	类型	说明
 *	token	是	string	请求头部中必须携带登录成功后得到的身份令牌，且必须在有效期内
 *	type	是	number	1-水费、2-电费、3-燃气费、4-物业费、5-停车费、6-宽带费
 *	collectorId	是	number	收费单位编号
 * 	householdId	是	string	业主用户编号
 *	amount	是	float(10,2)	缴费金额
 */
export let feeAdd = async (type,collectorId,householdId,amount)=>{
	let url = base + 'fee/add'
	//2.显示“加载中”提示框	
	uni.showLoading({
		title: '缴费中'
	})
	//3.发起异步请求消息
	let [err, res] = await uni.request({
		url,			//请求地址
		method: 'POST',
		header: {	//请求头部-token(客户端身份令牌)
			token: uni.getStorageSync('userToken')
		},
		data: {type, collectorId, householdId, amount}
	})
	//4.隐藏“加载中”提示框
	uni.hideLoading()
	//5.返回响应消息主体
	return res.data
}

/**
 * 4.1、根据业主缴费编号查询该业主的基本信息
 * 接口地址：household/query
 * 请求方式：GET
 * 请求示例：household/query?hhid=S60011
 * 注意：前端对此接口的请求需要防抖，时间间隔在2s以上
 */
export let householdQuery = async (hhid)=>{
	//1.准备请求URL   
	let url = base + `household/query?hhid=${hhid}`
	//2.显示“加载中”提示框	
	uni.showLoading({
		title: '业主信息读取中'
	})
	//3.发起异步请求消息
	let [err, res] = await uni.request({ url })
	//4.隐藏“加载中”提示框
	uni.hideLoading()
	//5.返回响应消息主体
	return res.data
}

/**
 * 5.1、返回所有停车区坐标及当前空闲数据
 * 接口地址：parking/zone/list
 * 请求方式：GET
 * 请求主体：无
 */
export let parkingZoneList = async ()=>{
	//1.准备请求URL   
	let url = base + `parking/zone/list`
	//2.显示“加载中”提示框	
	uni.showLoading({
		title: '数据读取中'
	})
	//3.发起异步请求消息
	let [err, res] = await uni.request({ url })
	//4.隐藏“加载中”提示框
	uni.hideLoading()
	//5.返回响应消息主体
	return res.data
}
