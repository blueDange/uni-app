<template>
	<view class="content">
		<!-- F1：顶部的图片和用户头像 -->
		<!-- F2：互动消息列表 -->
		<uni-list>
			<uni-list-item v-for="(msg, i) in msgList" :key="i">
				<!-- 定制列表项的左侧头部——用户头像 -->
				<template v-slot:header>
					<view class="msg-header">
						<image :src="base+msg.avatar" mode="widthFix"/>
					</view>
				</template>
				<!-- 定制列表项的中部主体——消息详情 -->
				<template v-slot:body>
					<view class="msg-body">
						<view class="uname">{{msg.uname}}</view>
						<view class="content">{{msg.content}}</view>
						<view class="pic-list">
							<!-- mode:aspectFit：图片尺寸需要手工指定，内容长边完全显示，短边可以留白 -->
							<!-- mode:aspectFill：图片尺寸需要手工指定，内容短边完全显示，长边可能截断 -->
							<image v-for="(pic,i) in msg.picList" :key="i" :src="base+pic.url" mode="aspectFill"/>
						</view>
					</view>
				</template>
			</uni-list-item>
		</uni-list>
		<!-- F3：页面底部“上拉加载更多/加载中/没有更多数据了”提示 -->
		<!-- status="more"表示还有更多数据可供加载 -->
		<!-- status="loading"表示正在加载数据 -->
		<!-- status="noMore"表示没有更多数据可供加载了 -->
		<!-- <uni-load-more status="more"></uni-load-more> -->
		<!-- <uni-load-more status="loading"></uni-load-more> -->
		<!-- <uni-load-more status="noMore"></uni-load-more> -->
		<uni-load-more :status="isLoading ? 'loading' : (pageNum<pageCount ? 'more' :'noMore')"></uni-load-more>
	</view>
</template>

<script>
	import { chatQuery, base } from '@/service'
	export default {
		data() {
			return {
				base,				//把局部变量上升为数据属性
				//“列表页”必需的五个变量
				kw: '',				//待查询的记录必需包含的关键字
				msgList: [],		//已查询的邻里互动消息列表
				pageCount: 99999,	//满足条件的记录总页数，注意此处的初始值没有使用0
				pageNum: 0,			//当前加载到哪一页数据了，注意此处的初始使用了0
				isLoading: false,	//当前是否正在加载数据
			}
		},
		//生命周期方法——页面加载时
		onLoad() {
			//“加载下一页数据”调用情形1：页面加载时
			this.loadNextPageData()
		},
		//生命周期方法——页面滚动到底部
		onReachBottom(){
			//console.log('----页面滚动到底了----')
			//“加载下一页数据”方法调用情形2：页面滚动到底了					
			this.loadNextPageData()
		},
		//生命周期方法——页面在顶部下拉刷新了
		onPullDownRefresh(){
			//console.log('====页面下拉刷新了====')
			//清除目前已经加载的所有数据 —— 即数据变量恢复为初始值
			this.msgList = []			//删除已经加载的所有记录
			this.pageCount = 99999		//重置总页数
			this.pageNum = 0			//当前加载到的页号必需重置为0
			//“加载下一页数据”方法调用情形3：顶部下拉刷新
			this.loadNextPageData()
			//uni.stopPullDownRefresh()	//停止下拉刷新，实际作用是隐藏“下拉刷新动画图标”
		},
		methods: {
			//“列表页”必需的一个方法：加载下一页数据
			async loadNextPageData(){
				//1、如果当前正在加载中 或者 已经没有更多数据可加载 则退出
				if( this.isLoading || this.pageNum>=this.pageCount ){
					return
				}
				//2、设置“当前正在加载中”为真
				this.isLoading = true
				//3、异步请求服务器端数据，把新得到的数据追加到已有数据的尾部
				let {pageCount,pageNum,data} = await chatQuery( this.pageNum + 1 )
				this.pageCount = pageCount		//获得真实的“总页数”
				this.pageNum = pageNum			//获得修改后的“当前页号”
				//this.msgList = data			//获得查询到的数据 —— 新数据覆盖了已有数据
				this.msgList = [...this.msgList, ...data]//获得查询到的数据 —— 新数据拼接在已有数据尾部
				uni.stopPullDownRefresh()		//停止下拉刷新，实际作用是隐藏“下拉刷新动画图标”
				//4、设置“当前正在加载中”为假
				this.isLoading = false
			},
		}
	}
</script>

<style scoped lang="scss">
.msg-header {
	image {
		width: 90rpx;
	}
}
.msg-body {
	flex-direction: column;
	.pic-list {
		image { 
			width:180rpx; 
			height: 150rpx; 
			border: 1px solid $uni-border-color;
			margin-right: $uni-spacing-row-sm;
		}
	}
}
</style>
