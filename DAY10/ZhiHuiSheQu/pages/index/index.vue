<template>
	<view class="content">
		<!-- F1: 轮播广告 -->
		<!-- indicator-dots：是否显示“小圆饼”指示器 -->
		<!-- autoplay：是否自动播放轮播广告 -->
		<!-- interval：时间间隔，两个广告间停留时间 -->
		<!-- duration：持续时长，一个广告的过渡动画持续时长 -->
		<swiper class="swiper" :indicator-dots="true" :autoplay="true" :interval="2000" :duration="500">
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
		<uni-grid class="func-menu" :column="4" :showBorder="false" :square="true">
			<uni-grid-item v-for="(item,i) in menuItems" :key="i">
				<view class="menu-item" @click="jump(item.href)">
					<image :src="base+item.pic" mode="widthFix"/>
					<text>{{item.title}}</text>
				</view>
			</uni-grid-item>
		</uni-grid>
		
		<!-- F3: 商业服务 -->
		<!-- isFull：是否显示为“通栏卡片”(左右撑满) -->
		<uni-card class="card" title="| 商业服务" is-full>
			<view class="service">
				<!-- 左侧：房屋租售 -->
				<view class="service-item">
					<view class="txt">
						<text>房屋租售</text>
						<view>
							<navigator>租房</navigator>
							<navigator>短租</navigator>
						</view>
					</view>	
					<!-- 图片缩放模式1：widthFix -->
					<!-- 图片缩放模式2：scaleToFill：不保持原始宽高比，缩放图片填满指定宽高 -->
					<image class="img" mode="scaleToFill" src="../../static/img/chuzu.png"/>
				</view>
				<!-- 右侧：便民服务 -->
				<view class="service-item">
					<view class="txt">
						<text>便民服务</text>
						<view>
							<navigator>便利店</navigator>
							<navigator>超市</navigator>
						</view>
					</view>	
					<image class="img" mode="scaleToFill" src="../../static/img/bianmin.png"/>
				</view>
			</view>
		</uni-card>
		
		<!-- F4: 社区活动 -->
		<uni-card class="card" title="| 社区活动" is-full padding="0">
			<!-- clickable：是否允许列表项被点击，如果允许则自动添加点击反馈 -->
			<!-- link：是否允许列表项显示为链接，如果允许则自动添加点击反馈 + 添加向右的箭头 -->
			<uni-list>
				<uni-list-item class="activity-item" v-for="(a,i) in activities" :key="i">
					<!-- 列表项中央主体插槽内容 -->
					<template v-slot:body>
					  <view class="activity-body">
						<text class="title">{{a.title}}</text>
						<text class="content">{{a.content}}</text>
						<!-- 通过管道(|)把数据传递给过滤器 -->
						<text class="time">{{a.startTime | datetime}}</text>
					  </view>
					</template>
					<!-- 列表项右侧插槽内容 -->
					<template v-slot:footer>
						<image class="pic" :src="base+a.pic" mode="widthFix"/>
					</template>
				</uni-list-item>
			</uni-list>
		</uni-card>
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
			// console.log(data);
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
	.swiper {
		height: 300rpx;
		.swiper-item > image {
			width: 750rpx;
		}
	}
	.func-menu {
		margin-top: $uni-spacing-col-base;
		background-color: $uni-bg-color;
		.menu-item {
			height: 100%;
			//把弹性容器的主轴方向修改为：纵向
			flex-direction: column;
			//弹性容器中的子元素在主轴方向上居中对齐
			justify-content: center;
			//弹性容器中的子元素交叉轴方向上居中对齐
			align-items: center;
			> image { width:35%; margin-bottom: $uni-spacing-col-sm; }
		}
	}
	.service {
		width: 100%;
		.service-item {
			//弹性子元素尺寸增长权重为：1
			flex: 1;
			padding-top: $uni-spacing-col-sm;
			padding-bottom: $uni-spacing-col-sm;
			justify-content: space-between; //弹性容器中的子元素在主轴方向上：空白在中央
			align-items: center; //弹性容器中的子元素在交叉轴方向上：居中对齐
			&:nth-child(1) {padding-right: $uni-spacing-row-sm;}
			&:nth-child(2) {padding-left: $uni-spacing-row-sm;}
			.txt { 
				font-size: $uni-font-size-sm; 
				flex-direction: column; 
				flex: 1; //弹性子元素尺寸增长权重：1
				navigator {margin-right: $uni-spacing-row-sm;}
			}
			.img { width: 150rpx; height: 120rpx;}
		}
	}
	.activity-item {
		align-items: center;//弹性容器中的子元素交叉轴上居中对齐
		.activity-body {
			flex-direction: column;
			width: 420rpx; //父元素指定宽度，子元素就可能显示省略号
			.title {
				font-size: $uni-font-size-base - 1;
				@include ellipsis-1;
			}
			.content {
				font-size: $uni-font-size-sm; 
				color:$uni-text-color-grey;
				@include ellipsis-1;
			}
			.time {
				font-size: $uni-font-size-sm; 
				color:$uni-text-color-grey;
			}
		}
		.pic {
			width:240rpx;
			flex-shrink: 0;//弹性子元素尺寸收缩权重： 0 —— 参与尺寸缩小
		}
	}
</style>
