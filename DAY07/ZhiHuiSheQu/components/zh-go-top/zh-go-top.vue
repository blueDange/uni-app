<template>
	<view class="go-top" @click="go">
		<text>返回顶部</text>
	</view>
</template>

<script>
	export default {
		methods: {
			go(){
				//滚动到页面顶部——uni-app官方提供的API   Babel
				uni.pageScrollTo({
					scrollTop: 0,	//滚动到距离顶部的位置
					duration: 100,  //滚动动画耗时多少毫秒
				})
			}
		}
	}
</script>

<!-- scoped：局部作用域的样式 -->
<!-- lang： language，指定预编译样式语言 -->
<style scoped  lang="scss">
.go-top {
	//固定定位到页面右下角
	position: fixed;
	right: 20rpx;		//rpx：响应式像素数
	bottom: 180rpx;
	width: 110rpx;
	height: 110rpx;
	background-color: #fff;
	border: 1px solid #aaa;
	border-radius: 50%;
	text-align: center;
	opacity: .5;
	font-size: 38rpx;
	&:active {			//SCSS中的&表示“当前元素”
		opacity: 1;
	}
}	
</style>