<script>
	export default {
		//自定义的可供所有页面/组件使用的数据，获取方法 getApp().globalData....
		globalData: {
			author: 'tedu.cn',
			version: 'V2.1',
			printInfo(){
				console.log('应用程序作者：',this.author)
				console.log('应用程序版本：',this.version)
			}
		},
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<!-- 注意：此处必须声明使用SCSS！！否则无法使用SCSS变量！！ -->
<style lang="scss">
	/*每个页面共用的公共样式 */
	//选择所有的元素
	:not(not) {
		//提示：uni-app提供的内置组件默认都不带内外边距
		//简化盒子模型的计算方案，由默认的内容盒子改为边框盒子
		// box-sizing: content-box;//默认值，总宽度=margin+bordder+padding+width
		box-sizing: border-box;  //总宽度=margin+width
	}
	//选择每个页面的根元素（用page代替body)
	page {
		background-color: $uni-bg-color-grey;
		color: $uni-text-color;				//#363636
		font-size: $uni-font-size-base;		//14px
	}
	//选择所有的容器元素，都采用弹性布局
	view {
		//显示模式：弹性容器
		display: flex;
		//弹性容器中的子元素主轴方向：横向
		flex-direction: row;
	}
	//选择每个页面最外层的容器元素，弹性主轴改为纵向
	view.content {
		//弹性容器中子元素的排列主轴方向：纵向
		flex-direction: column;
	}
	//清除自定义样式对系统默认组件的影响
	view.card {
		flex-direction: column;
		//使用!important提升当前样式的优先级，可以覆盖系统默认样式
		margin-top: $uni-spacing-col-base !important;
	}
</style>
