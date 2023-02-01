<template>
	<view class="content">
		<!-- F1：手机系统状态栏设定 -->
		<view class="status-bar" :style="{height: statusBarHeight+'px'}"></view>
		
		<!-- F2：LOGO -->
		<!-- mode：图片的缩放模式  widthFix：宽度使用指定的固定值，高度自动等比例缩放 -->
		<image src="../../static/img/logo.png" class="logo" mode="widthFix"/>
		
		<!-- F3：手机号码输入框组 -->
		<!-- 提示：真正的App开发中，input就是没有初始样式的，都需要自己指定 -->
		<view class="input-group">
			<input v-model="phone" class="input" placeholder="请输入手机号"/>
			<uni-icons class="icon left" type="phone-filled" size="25px" color="#090"/>
			<uni-icons class="icon right" type="clear" size="22px" color="#1296DB"/>
		</view>
		<!-- F4：密码输入框组  -->
		<view class="input-group pwd-group">
			<input v-model="pwd" :password="hidePwd" class="input" placeholder="请输入密码"/>
			<uni-icons class="icon left" type="locked-filled" size="25px" color="#090"/>
			<uni-icons class="icon right" :type="hidePwd ? 'eye-slash-filled' : 'eye-filled'"  @click="hidePwd = !hidePwd" size="22px" color="#8a8a8a"/>
		</view>
		<!-- F5：提交按钮 -->
		<button class="btn" @click="doLogin">登 录</button>
		<!-- F6：找回密码 -->
		<!-- 导航跳转/保留跳转 -->
		<navigator class="find" open-type="navigate" url="/pages/feePay/feePay">找回密码</navigator>
		<!-- 重定向跳转/销毁跳转 -->
		<!-- <navigator class="find" open-type="redirect" url="/pages/feePay/feePay">找回密码2</navigator> -->
		<!-- 切换页签页 -->
		<!-- <navigator class="find" open-type="switchTab" url="/pages/my/my">找回密码3</navigator> -->
	</view>
</template>

<script>
	export default {
		data(){
			return {
				statusBarHeight: 0,		//系统状态栏高度
				hidePwd: true,			//是否隐藏密码
				phone: "13501234567",	//用户输入的登录手机号
				pwd:"123456",			//用户输入的登录密码
			}
		},
		//生命周期方法 —— 页面挂载完成
		onLoad(){    //此处此方法类似于mounted()
			//console.log('login组件挂载完成')
			//获取系统信息，读取其中的“状态栏高度”
			let {statusBarHeight} = uni.getSystemInfoSync()
			// console.log('屏幕高度：', screenHeight);
			this.statusBarHeight = statusBarHeight
		},
		methods: {
			async doLogin(){
				//console.log('当前输入：',this.phone, this.pwd)
				//1.验证手机号是否合法，不合法就弹出提示框，退出执行
				if(!/^1[3-9]\d{9}$/.test(this.phone)){
					uni.showToast({
						title: '手机号非法',		//提示标题
						icon: 'none',			//图标
						duration: 3000			//持续时长 
					})
					return
				}
				//2.验证密码是否合法，不合法就弹出提示框，退出执行
				if(this.pwd.length < 6){
					uni.showToast({
						title:'密码格式非法',
						icon: 'none',
						duration: 3000
					})
					return 
				}
				//3.把手机号/密码提交给服务器端数据API，进行登录验证
				/**********使用uni.request()发起POST请求************/
				let url = "https://www.codeboy.com/zhsqapi/user/login"
				let [err, res] = await uni.request({ 
					url,
					method: 'POST',
					//header: { 'Content-Type': 'application/json'},
					header: { }, //请求内容类型默认就是JSON格式
					//data: `{"phone":"${this.phone}", "pwd":"${this.pwd}"}`
					//JSON系列化：把普通的JS对象转换为JSON格式的字符串
					//data: JSON.stringify( {phone:this.phone, pwd:this.pwd})
					//uni.request方法会自动根据请求内容类型，把数据转换为需要的格式
					data: {phone:this.phone, pwd:this.pwd}
				})
				if(err){
					console.log('执行失败：', err);
				}else {
					console.log('异步请求成功：', res);
				}
				//4.登录成功，提示“欢迎回来”，跳转到首页
			},
		}
	}
</script>

<style lang="scss" scoped>
.status-bar {
	background-color: $zh-theme-color;
	width: 750rpx;		//宽度占满一整行
	//height: 30rpx;		//高度：临时
	position: fixed;	//固定定位
}
.logo {
	width: 450rpx;
	// height: 450rpx;
	// block或inline-block使用左右margin:auto实现水平居中
	margin: $uni-spacing-col-lg*6   auto   0;
}
//针对高度小于500px的屏幕，减小顶部留白
@media screen and (max-height: 500px) {
	.logo {
		margin-top: $uni-spacing-col-lg;
	}
}
//针对高度大于700px的屏幕，增大顶部留白
@media screen and (min-height: 700px) {
	.logo {
		margin-top: $uni-spacing-col-lg*12;
		margin-bottom: $uni-spacing-col-lg*4;
	}
}
.input-group {
	position: relative;
	margin: $uni-spacing-col-lg*3  $uni-spacing-row-lg   0;
	//弹性容器中的子元素在交叉轴上居中对齐
	align-items: center;
	&.pwd-group {
		margin-top: $uni-spacing-col-lg*2;
	}
	.input {
		font-size: $uni-font-size-base;
		border: 1px solid $zh-theme-color;
		border-radius: $uni-border-radius-base;
		width: 100%;
		padding: 0  $uni-spacing-row-base*3;
		height: $uni-font-size-lg*2.2;  //注意：此处不能使用line-height
	}
	.icon {
		position: absolute;
		&.left { left:$uni-spacing-row-sm; }
		&.right { right:$uni-spacing-row-sm; }
	}
}
.btn {
	margin: $uni-spacing-col-lg*2.5  $uni-spacing-row-lg 0;
	background: $zh-theme-color;
	color: $uni-text-color-inverse;
	font-size: $uni-font-size-base;
	//SCSS函数：darken(颜色, 百分比)，返回一个更深的颜色值
	//SCSS函数：lighten(颜色, 百分比)，返回一个更浅的颜色值
	&:active {
		background-color: darken($zh-theme-color, 5%);
	}
}
.find {
	text-align: center;
	color: $zh-theme-color;
	margin-top: $uni-spacing-col-lg*2;
}
</style>
