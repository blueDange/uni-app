<template>
	<view class="content">
		<!-- F1: 轮播广告 -->
		<!-- indicator-dots：是否显示“小圆饼”指示器 -->
		<!-- autoplay：是否自动播放轮播广告 -->
		<!-- interval：时间间隔，两个广告间停留时间 -->
		<!-- duration：持续时长，一个广告的过渡动画持续时长 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="2000" :duration="500">
			<swiper-item v-for="(c, i) in carousels" :key="i">
				<view class="swiper-item">
					<image @click="jump(c.href)" :src="base + c.pic" mode="widthFix"/>
				</view>
			</swiper-item>
		</swiper>
		<!-- F2: 功能菜单 -->
		<!-- column：一行中默认显示几列 -->
		<!-- showBorder：是否显示边框 -->
		<!-- square：每个宫格项是否显示为方形 -->
		<uni-grid :column="4" :showBorder="false" :square="true">
			<uni-grid-item v-for="(item,i) in menuItems" :key="i">
				<view class="menu-item" @click="jump(item.href)">
					<image :src="base+item.pic" mode="widthFix"/>
					<text>{{item.title}}</text>
				</view>
			</uni-grid-item>
		</uni-grid>
		
		<text>{{menuItems}}</text>
		<!-- F3: 商业服务 -->
		<!-- F4: 社区活动 -->
	</view>
</template>

<script>
import { indexData, base } from '@/service'
	export default {
		data() {
			return {
				base,				//把服务器基础地址变量设置为数据属性
				carousels:[],		//轮播广告条目列表
				menuItems:[],		//当前用户选中的功能菜单列表
				activities:[],		//最新的社区活动列表
			}
		},
		//生命周期方法：组件加载完成
		async onLoad() {	
			//弹出“欢迎回来”提示框
			uni.showToast({
				title:'欢迎回来',
				icon: 'none',
				duration: 3000
			})
			//向服务器请求首页数据
			let data = await indexData()
			this.carousels = data.carousels		//轮播广告
			this.menuItems = data.menuItems		//功能菜单
			this.activities = data.activities	//社区活动
		},
		methods: {
			jump(url){
				console.log(url)
				//导航跳转到指定页
				uni.navigateTo({ url })
			}
		}
	}
</script>

<style scoped lang="scss">
	//提示：页面中可以使用标签选择器，但是组件中不能使用
	.swiper-item > image {
		width: 750rpx;
	}
	.menu-item {
		//把弹性容器的主轴方向修改为：纵向
		flex-direction: column;
		//弹性容器中的子元素交叉轴方向上居中对齐
		align-items: center;
		> image { width:35%; margin-bottom: $uni-spacing-col-base; }
	}
</style>
