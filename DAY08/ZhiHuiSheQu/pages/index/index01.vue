<template>
	<view class="content">
		<text>index-首页</text>
		<uni-rate></uni-rate>
		<uni-rate />
		<uni-number-box></uni-number-box>
		<uni-number-box />
		<uni-rate></uni-rate>
		<uni-rate />
		<uni-number-box></uni-number-box>
		<uni-number-box />
		<uni-rate></uni-rate>
		<uni-rate />
		<uni-number-box></uni-number-box>
		<uni-number-box />
		<uni-rate></uni-rate>
		<uni-rate />
		<uni-number-box></uni-number-box>
		<uni-number-box />
		<uni-rate></uni-rate>
		<uni-rate />
		<uni-number-box></uni-number-box>
		<uni-number-box />
		<uni-rate></uni-rate>
		<uni-rate />
		<uni-number-box></uni-number-box>
		<uni-number-box />
		<uni-rate></uni-rate>
		<uni-rate />
		<uni-number-box></uni-number-box>
		<uni-number-box />
		<!-- 使用自定义子组件 -->
		<zh-go-top />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello2'
			}
		},
		onLoad() {

		},
		methods: {

		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
