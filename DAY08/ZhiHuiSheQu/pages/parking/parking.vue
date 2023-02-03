<template>
	<view class="content">
		<!-- F1：自定义的顶部标题栏(uni-navbar)	-->
		<!-- F2：停车区分布图 -->
		<!-- longitude：地图中心点经度， -180~180 -->
		<!-- latitude：地图中心点纬度， -90~90 -->
		<!-- scale：地图的缩放级别，1~20，数字越大显示区域越小越细致 -->
		<map class="parking-map" longitude="116.420888" latitude="40.06378" scale="15"></map>
		
		<!-- F3：每个停车区剩余车位统计图 -->
		
		<text>{{parkingZones}}</text>
	</view>
</template>

<script>
import { parkingZoneList } from '../../service'
	export default {
		data() {
			return {
				parkingZones: [],			//停车区列表
			}
		},
		//生命周期方法——页面组件挂载完成时
		async onLoad(){
			//异步请求服务器端停车区数据
			let data = await parkingZoneList()
			this.parkingZones = data
		},
		methods: {
			
		}
	}
</script>

<style scoped lang="scss">
.parking-map {
	width: 750rpx;			//官方推荐此处不要使用 %
	height: 750rpx;
}
</style>
