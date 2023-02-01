<template>
	<view class="content">
		<!-- F1：自定义导航条 -->
		<uni-nav-bar class="nav-bar" left-icon="back" left-text="返回" right-icon="list" title="缴 费" background-color="#090" color="#fff" @clickLeft="back" @clickRight="jump('/pages/feeRecord/feeRecord')"/>
		<!-- F2：缴费类型&金额 -->
		<uni-list class="list-amount">
			<uni-list-item :title="type | feeType" :thumb="type | feeTypeIcon" thumbSize="lg">
				<template v-slot:footer>
					<view class="footer-amount">
						<!-- type="digit": 弹出“带小数点”的数字键盘 -->
						<input type="digit" placeholder="请输入缴费金额">
						<text>元</text>						
					</view>
				</template>
			</uni-list-item>
		</uni-list>
		<!-- F3：缴费详情-->
		<!-- showArrow：是否显示向右箭头图标；即使显示，列表项仍不能被点击 -->
		<!-- clickable：设置为真，作用有二：①点击后有反馈 ②列表项能够点击 -->
		<!-- link：设置为真，作用有三：①点击后有反馈  ②列表项能点击  ③右侧添加一个向右的箭头  一般和to属性组合使用，实现跳转到指定页面效果-->
		<!-- Vue.js中事件处理时省略方法的定义有两个前提：①处理过程只有一句话  ②处理过程以this开头 -->
		<uni-list class="list-details">
			<uni-list-item title="缴费单位" showArrow clickable :rightText="collectors.length===0 ? '加载中' : collectors[curCollector].cname" @click="$refs.popupCollectors.open()"></uni-list-item>
			<uni-list-item title="用户编号"></uni-list-item>
			<uni-list-item title="户名"></uni-list-item>
			<uni-list-item title="用户住址"></uni-list-item>
		</uni-list>
		<!-- F4：提交按钮 -->
		<!-- F5：(隐藏默认不显示)收费单位列表 -->
		<!-- type: 弹出方式，top/right/bottom/left/center -->
		<!-- mask-click：允许用户点击半透明遮罩层关闭弹出框吗？ -->
		<uni-popup ref="popupCollectors" type="center" :mask-click="false">
			<view class="popup-content">
				<!-- 弹出层头部 -->
				<view class="popup-header">
					<text>缴费单位 {{tmpCollector}}</text>
				</view>
				<!-- 弹出层主体 -->
				<view class="popup-body">
					<radio-group class="radio-group" @change="tmpCollector=$event.detail.value">
						<label v-for="(c, i) in collectors" :key="i" class="radio-item">
							<text>{{c.cname}}</text>
							<radio :value="String(i)" :checked="curCollector==i"/>
						</label>
					</radio-group>
				</view>
				<!-- 弹出层尾部 -->				
				<view class="popup-footer">
					<button @click="$refs.popupCollectors.close()">取消</button>
					<button @click="chooseCollector">确定</button>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
import { feeCollector } from '../../service'
	export default {
		data() {
			return {
				type: 1,			//缴费类型
				collectors: [],		//费用收缴单位列表
				curCollector: 0,	//当前选中的缴费单位下标	
				tmpCollector: 0,	//临时选中尚未点击确定的缴费单位下标
			}
		},
		//生命周期方法 —— 组件挂载时
		async onLoad( {type} ){
			//console.log('上一页面传递来查询字符串：', x)
			//console.log('解构上一页面传递来路由参数：', type)
			//如果是在开发阶段，没有通过“物业缴费”跳转过来，请求参数中没有携带type，则强行跳转(销毁跳转)到“物业缴费”页面
			if(!type){
				uni.redirectTo({
					url: "/pages/property-fee/property-fee"
				})
			}else {
				this.type = type	
				//异步请求当前缴费类型对应的收费单位列表	
				let data = await feeCollector(this.type)
				this.collectors = data
			}
		},
		methods: {
			back(){
				//返回访问历史栈中的上一个页面
				uni.navigateBack()
			},
			jump(url){
				//导航跳转到指定的页面
				uni.navigateTo({ url })
			},
			chooseCollector(){
				//保存选中的“缴费单位”编号
				this.curCollector = this.tmpCollector
				//关闭弹出层
				this.$refs.popupCollectors.close()
			}
		},
	}
</script>

<style scoped lang="scss">
.nav-bar {
	display: block;
	::v-deep  .uni-navbar__content {
		display: block;
	}
}
.list-amount {
	margin-top: $uni-spacing-col-base;
	.footer-amount {
		font-size: $uni-font-size-base;
		align-items: center; //弹性容器中的子元素在交叉轴上居中对齐
		input {font-size: $uni-font-size-base; width: 8em;}
	}
}
.list-details {
	margin-top: $uni-spacing-col-base;
}
.popup-content {
	flex-direction: column;//弹性容器主轴方向：纵向
	width: 600rpx;
	background-color: $uni-bg-color;
	.popup-header {
		justify-content: center; //弹性容器中的子元素在主轴方向居中对齐
		padding: $uni-spacing-col-base  0;
		font-size: $uni-font-size-lg;
		background-color: $zh-theme-color;
		color: $uni-text-color-inverse;
	}
	.popup-body {
		padding: $uni-spacing-col-base $uni-spacing-row-base;
		.radio-group {
			display: flex; //显示模式：弹性容器
			flex-direction: column;//弹性容器的主轴方向：纵向
			width: 100%;
			.radio-item {
				display: flex; //显示模式：弹性容器
				flex-direction: row;//弹性容器的主轴方向：纵向
				width: 100%;
				padding: $uni-spacing-col-base;
				text {flex: 1;}
			}
		}
	}
	.popup-footer{
		box-shadow: 0 0 16rpx $uni-border-color;
		padding: $uni-spacing-col-base $uni-spacing-row-base;
		button { font-size: $uni-font-size-base;}
	}
}
</style>
