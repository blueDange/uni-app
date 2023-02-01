<template>
	<view class="content">
		<!-- F1：自定义标题栏 -->
		<uni-nav-bar class="nav-bar" left-icon="back" left-text="返回" right-icon="list" title="缴 费" background-color="#090" color="#fff" @clickLeft="back" @clickRight="jump('/pages/feeRecord/feeRecord')"></uni-nav-bar>
		<!-- F2：累积费用统计 -->
		<view class="fee-statistics">
			<text class="hint">当前待缴费用(元)</text>
			<text class="amount">￥{{amount}}</text>
		</view>
		<!-- F3：分列各项费用的列表 -->
		<!-- thumb：有时也称为thumbnail，拇指图/缩略图 -->
		<!-- thumbSize：缩略图大小，只能选择 sm/base/lg 之一 -->
		<!-- link：列表选项显示为链接效果：点击后有反馈+可以点击+右侧箭头 -->
		<!-- rightText：显示在右侧的文字 -->
		<!-- Math.abs()：返回数字的绝对值 -->
		<uni-list>
			<uni-list-item title="水费" thumb="../../static/img/shui.png" thumbSize="lg" link :rightText="fees.shui>=0 ? '' : `待缴金额：￥${Math.abs(fees.shui)}`" to="/pages/feePay/feePay?type=1"/>
			<uni-list-item title="电费" thumb="../../static/img/dian.png" thumbSize="lg" link :rightText="fees.dian>=0 ? '' : `待缴金额：￥${Math.abs(fees.dian)}`" to="/pages/feePay/feePay?type=2"/>
			<uni-list-item title="燃气费" thumb="../../static/img/ranqi.png" thumbSize="lg" link :rightText="fees.ranqi>=0 ? '' : `待缴金额：￥${Math.abs(fees.ranqi)}`" to="/pages/feePay/feePay?type=3"/>
			<uni-list-item title="物业费" thumb="../../static/img/wuye.png" thumbSize="lg" link :rightText="fees.wuye>=0 ? '' : `待缴金额：￥${Math.abs(fees.wuye)}`" to="/pages/feePay/feePay?type=4"/>
			<uni-list-item title="停车费" thumb="../../static/img/tingche.png" thumbSize="lg" link :rightText="fees.tingche>=0 ? '' : `待缴金额：￥${Math.abs(fees.tingche)}`" to="/pages/feePay/feePay?type=5"/>
			<uni-list-item title="宽带费" thumb="../../static/img/kuandai.png" thumbSize="lg" link :rightText="fees.kuandai>=0 ? '' : `待缴金额：￥${Math.abs(fees.kuandai)}`" to="/pages/feePay/feePay?type=6"/>
		</uni-list>
	</view>
</template>

<script>
	import { feeList } from '@/service'
	export default {
		data() {
			return {
				fees: {},	//待缴费用
			}
		},
		//生命周期方法 —— 页面挂载完成时
		async onLoad(){
			//异步请求当前登录用户的待缴费用
			let data = await feeList()
			this.fees = data
		},
		//计算属性
		computed: {
			amount(){
				let sum = 0;
				sum = this.fees.shui<0 ? sum+this.fees.shui : sum
				sum = this.fees.dian<0 ? sum+this.fees.dian : sum
				sum = this.fees.ranqi<0 ? sum+this.fees.ranqi : sum
				sum = this.fees.tingche<0 ? sum+this.fees.tingche : sum
				sum = this.fees.wuye<0 ? sum+this.fees.wuye : sum
				sum = this.fees.kuandai<0 ? sum+this.fees.kuandai : sum
				//先求数字的绝对值，再保留指定长度的小数位
				return Math.abs(sum).toFixed(2)
			}
		},
		methods: {
			//处理“导航条左侧按钮”被单击事件
			back(){
				uni.navigateBack()
			},
			//处理“导航条右侧按钮”被单击事件
			jump(url){
				uni.navigateTo({ url })
			},
		}
	}
</script>

<style scoped lang="scss">
.nav-bar {
	display: block;
	//让父组件中的样式可以穿透到子组件
	::v-deep  .uni-navbar__content {	
		display: block;
	}
}
.fee-statistics {
	background-color: $zh-theme-color;
	border-top: $uni-border;
	padding: $uni-spacing-col-lg*3  0;
	flex-direction: column; //弹性容器的主轴方向：纵向
	align-items: center; //弹性容器中的子元素在交叉轴上居中对齐
	color: $uni-text-color-inverse;
	.hint {
		font-size: $uni-font-size-lg; 
		margin-bottom: $uni-spacing-col-base;
	}
	.amount { 
		font-size: $uni-font-size-base * 2.5;
		font-weight: bold;
	}
}
</style>
