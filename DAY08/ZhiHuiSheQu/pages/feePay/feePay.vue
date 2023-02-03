<template>
	<view class="content">
		<!-- F1：自定义导航条  -->
		<uni-nav-bar class="nav-bar" left-icon="back" left-text="返回" right-icon="list" title="缴 费" background-color="#090" color="#fff" @clickLeft="back" @clickRight="jump('/pages/feeRecord/feeRecord')"/>
		<!-- F2：缴费类型&金额 -->
		<uni-list class="list-amount">
			<uni-list-item :title="type | feeType" :thumb="type | feeTypeIcon" thumbSize="lg">
				<template v-slot:footer>
					<view class="footer-amount">
						<!-- type="digit": 弹出“带小数点”的数字键盘 -->
						<input v-model="amount" type="digit" placeholder="请输入缴费金额">
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
			<uni-list-item title="用户编号">
				<template v-slot:footer>
					<input class="user-id" placeholder="请输入用户编号" v-model="userId" @input="doUserIdChange">
				</template>
			</uni-list-item>
			<uni-list-item :rightText="household.householdName">
				<template v-slot:header>
					<text class="household-name">户名</text>
				</template>
			</uni-list-item>
			<uni-list-item title="用户住址" :rightText="household.householdAddr"></uni-list-item>
		</uni-list>
		<!-- F4：提交按钮	-->
		<view class="f4">
			<button @click="submitPay">立即缴费</button>
		</view>
		
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
					<radio-group class="radio-group" @change="tmpCollector = $event.detail.value">
						<!-- 
						 f1(e){
							 //把当前用户选中的缴费单位下标赋值给“临时选中的缴费单位下标”
							 this.tmpCollector = e.detail.value
						 }
						 -->
						<label v-for="(c, i) in collectors" :key="i" class="radio-item">
							<text>{{c.cname}}</text>
							<!-- 指定当用户选中当前单选按钮时，对应的数值：不要使用缴费单位名称，也不要使用缴费单位编号，而是当前缴费单位在所有缴费单位数组中的下标 -->
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
	import { feeAdd, feeCollector, householdQuery } from '@/service'
	export default {
		data() {
			return {
				type: 1,			//缴费类型
				collectors: [],		//费用收缴单位列表
				curCollector: 0,	//当前选中的缴费单位下标	
				tmpCollector: 0,	//临时选中尚未点击确定的缴费单位下标
				userId: '',			//用户在输入框中输入的“缴费用户编号”
				requestTimer: null,	//当前页面的全局变量，表示发起服务器端防抖请求的定时器
				household: {},		//根据用户输入的业主编号，查询到的业主信息
				amount: '',			//缴费金额
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
			//处理“立即缴费”操作
			async submitPay(){
				//必需数据1：缴费类型
				let type = this.type
				//必需数据2：收费单位的编号
				let collectorId = this.collectors[this.curCollector].cid 
				//必需数据3：业主的编号
				let householdId = this.household.householdId
				if(!householdId){
					uni.showToast({
						title:'请填写有效的业主编号',
						icon:'error',
						duration: 3000
					})
					return
				}
				//必需数据4：缴费金额
				let amount = this.amount
				if(!amount || amount<=0){
					uni.showToast({
						title:'请正确填写缴费金额',
						icon:'error',
						duration: 3000
					})
					return
				}
				//异步请求服务器端接口
				let data = await feeAdd(type, collectorId, householdId, amount)
				if(data.code===2000){
					uni.showToast({
						title:'缴费成功'
					})
					this.amount = ''
					this.userId = ''
					this.household = {}
				}else {
					uni.showToast({
						title:'缴费失败:'+data.msg,
						icon:'error'
					})
				}
			},
			//处理“用户编号”输入框中的内容改变
			doUserIdChange(e){
				//调用服务器端接口，根据用户编号，查询其对应的户主信息 —— 防抖调用
				if(this.requestTimer){
					//停止定时器任务
					clearTimeout(this.requestTimer)
					//定时器值为空
					this.requestTimer = null
				}
				//重新创建一个全新的定时器任务
				this.requestTimer = setTimeout(async ()=>{
					//异步请求服务器端接口，获取业主信息
					if(e.detail.value.length>3){  //只有输入数据长度满足一定要求才可能发起请求
						//console.log('即将发起服务器查询：', e.detail.value)
						let data = await householdQuery(e.detail.value)
						if(data.code===2000){	//根据业主编号查询到了相关记录
							//console.log('查询成功：', data.msg)
							this.household = data.msg
						}else {  //用户输入的业主编号不存在
							this.household = {}  //清除之前可能已经查询到的数据
							uni.showToast({
								title: '业主编号不存在',
								icon: 'error',
								duration: 3000
							})
						}
					}
				}, 2000)
			},
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
				this.curCollector = this.tmpCollector   //此时的tmpCollector是String
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
	.user-id {
		font-size: $uni-font-size-sm;
		// width: $uni-font-size-sm * 8;
		text-align: right;
	}
	.household-name {
		font-size: $uni-font-size-base;
		width: $uni-font-size-base * 4;
		//text-align: justify; //段落中的文字在一行中“两端调整对齐”（仅对非最后一行有效）
		text-align-last: justify; //段落中的文字在一行中“两端调整对齐”（仅对最后一行有效）
	}
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
.f4 {
	padding: $uni-spacing-col-lg*4  $uni-spacing-row-lg;
	button {
		background-color: $zh-theme-color;
		width: 100%;
		font-size: $uni-font-size-base;
		color: $uni-text-color-inverse;
		&:active { background-color: darken($zh-theme-color, 5%); }
	}
}
</style>
