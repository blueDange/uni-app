<template>
	<view class="content">
		<!-- F1：自定义的顶部标题栏(uni-navbar)	-->
		<!-- F2：停车区分布图 -->
		<!-- longitude：地图中心点经度， -180~180 -->
		<!-- latitude：地图中心点纬度， -90~90 -->
		<!-- scale：地图的缩放级别，1~20，数字越大显示区域越小越细致 -->
		<map id="parkingMap" class="parking-map" :style="{height: mapHeight+'px'}" longitude="116.420888" latitude="40.06370" scale="15" :markers="mapMarkers" @markertap="doMarkerTap"></map>
		
		<!-- F3：每个停车区剩余车位统计图 -->
		<!-- type：指定图表类型，例如：柱状图(column)、折线图、饼图、雷达图、... -->
		<!-- chartData：图表中要显示出来的数据 -->
		<!-- opts：图表的配置选项，例如：柱状图颜色 -->
		<qiun-data-charts :style="{marginTop:'30px', height:chartHeight-30+'px'}" type="column" :chartData="parkingChartData" :opts="chartOptions"></qiun-data-charts>
	</view>
</template>

<script>
import { parkingZoneList } from '../../service'
	export default {
		data() {
			return {
				parkingZones: [],			//停车区列表
				mapMarkers:[],				//地图上的标记物数组（每个标记物指代一个停车区）
				chartHeight: 300,			//统计图的高度
				mapHeight: 0,				//地图的高度 = 屏幕的高度 - 统计图的高度
				parkingChartData: {},		//停车区空闲车位的统计图数据
				chartOptions: {color:['#090']},	 //图表的选项对象，例如：柱状图颜色
			}
		},
		//生命周期方法——页面组件挂载完成时
		async onLoad(){
			//获得屏幕的高度，从而计算出地图区域的高度
			uni.getSystemInfo({			//获取系统信息(异步)
				success: (result) => {
					//地图高度 = 窗口高度 - 统计图高度
					this.mapHeight = result.windowHeight - this.chartHeight
				}
			})
			//异步请求服务器端停车区数据
			let data = await parkingZoneList()
			this.parkingZones = data
			//把停车区数组“映射为”地图标记物数组
			this.mapMarkers = this.parkingZones.map( (pz, i)=>{return {
				id: i,						//每个标记物的识别符
				longitude: pz.longitude,	//标记物在地图上的经度
				latitude: pz.latitude,		//标记物在地图上的纬度
				//title: pz.zname,			//(可选)标记物上的标题
				iconPath: '/static/img/loc.png',	//标记物显示的图标
				callout: {					//标记物上方的弹出式气泡窗口
					content: pz.zname+"空闲:"+pz.unoccupied
				}
			}} )
			//把停车区数组的空闲车位数据“映射为”图表数据
			this.parkingChartData = {
				//图表的X轴需要展示哪些数据类目
				//categories: ['一区', '二区', '三区'], 
				categories: this.parkingZones.map( pz=>pz.zname.substr(-2) ),  //String.substr()返回字符串中的子串
				//图表的Y轴需要绘制的数据
				series: [
					{
						name: '空闲车位',
						//data: [220, 300, 100]
						data: this.parkingZones.map( pz=>pz.unoccupied )
					}
				]
			}
		},
		methods: {
			//处理地图上的标记物被单击事件
			doMarkerTap(e){
				//console.log(e.detail.markerId) //通过事件对象获得标记物的id —— 即对应的停车区在数组中的下标
				//把地图的中心点坐标变为当前点击停车区坐标
				let longitude = this.parkingZones[e.detail.markerId].longitude
				let latitude = this.parkingZones[e.detail.markerId].latitude
				let ctx = uni.createMapContext('parkingMap', this)//找到页面中的地图对象/创建地图对应的上下文对象
				ctx.moveToLocation( {longitude, latitude} )//移动地图的中心点到指定坐标
			}
		}
	}
</script>

<style scoped lang="scss">
.parking-map {
	width: 750rpx;			//官方推荐此处不要使用 %
	height: 750rpx;
}
</style>
