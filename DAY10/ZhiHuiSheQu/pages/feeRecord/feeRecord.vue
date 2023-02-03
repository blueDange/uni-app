<template>
	<view class="content">
		<!-- F1：两个下拉菜单/数据拾取器 -->
		<view class="f1">
			<!-- 第一个数据拾取器（普通拾取器）：缴费类型 -->
			<!-- mode：数据拾取器模式，共有五种类型：“普通”、“多列”、“日期”、“时间”、“省市” -->
			<!-- range：可选的范围 -->
			<picker class="picker" mode="selector" :range="feeTypes" @change="doFeeTypeChange">
				<view class="picker-content">
					<text class="txt">{{curFeeType<0 ? '缴费类型' : feeTypes[curFeeType] }}</text>
					<uni-icons type="bottom" />
				</view>
			</picker>
			<!-- 第二个数据拾取器（日期拾取器）：缴费月份 -->
			<!-- fields：可选择到哪个字段/选择器的粒度，可选值：year、month、day -->
			<picker class="picker" mode="date" fields="month" @change="doMonthChange">
				<view class="picker-content">
					<text class="txt">{{curMonth}}</text>
					<uni-icons type="bottom" />
				</view>
			</picker>
		</view>

		<!-- F2：缴费记录/卡片做循环 -->
		<!-- thumbnail：缩略图 -->
		<uni-card v-for="(r, i) in records" :key="i" class="record" padding="0" :title="r.type | feeType" :thumbnail="r.type | feeTypeIcon" :extra="`￥${r.amount.toFixed(2)}`">
			<!-- 卡片的主体：包含三个列表项的列表组件 	-->
			<uni-list class="record-content">
				<uni-list-item title="缴费状态" rightText="交易成功"/>
				<uni-list-item title="缴费用户" :rightText="r.householdId"/>
				<uni-list-item title="缴费时间" :rightText="r.paidTime | datetime"/>
			</uni-list>     
		</uni-card>
		
		<!-- v-show -->
		<text v-show="records.length===0" style="text-align: center;">没有查询到相关记录</text>
	</view>
</template>

<script>
	import { feeRecord } from '@/service'
	export default {
		data() { 						//cur：全称current，当前的
			return {
				curFeeType: -1, 		//当前选中的缴费类型编号，-1表不存在  0表全部类型 1表水费 2表电费...
				feeTypes: [ 			//所有的缴费类型
					'全部类型', '水费', '电费', '燃气费', '物业费', '停车费', '宽带费'
				],
				curMonth: '选择月份', 	//当前选中的缴费月份
				records: [],			//查询到的缴费记录
			}
		},
		//生命周期方法 —— 页面加载时
		onLoad() {
			// console.log('-----------------------')
			// console.log(getApp().globalData.author)
			// console.log(getApp().globalData.version)
			// console.log(getApp().globalData.printInfo())
			// console.log('-----------------------')
			//“请求缴费记录”方法的调用情形1
			this.requestFeeRecord()
		},
		methods: {
			//处理“缴费类型”拾取器选项改变事件
			doFeeTypeChange(e) {
				//console.log('当前选中的类型的下标：', e.detail.value) //此处也可以使用e.target.value
				this.curFeeType = e.detail.value
				//此处读取到的用户选择项形如：0/1/2...
				//调用“请求缴费记录”方法的情形2
				this.requestFeeRecord()
			},
			//处理“缴费月份”拾取器选项改变事件
			doMonthChange(e) {
				//console.log('当前选中的月份', e.detail.value) //此处也可以使用e.target.value
				//此处读取到的用户选择项形如："2022-12"/"2023-01"...
				this.curMonth = e.detail.value
				//调用“请求缴费记录”方法的情形3
				this.requestFeeRecord()
			},
			//请求缴费记录 —— 此方法有三种调用情形	
			async requestFeeRecord(){
				let type = this.curFeeType		//待查询的缴费类型
				let startTime = 0				//待查询的缴费开始时间
				let endTime = 0					//待查询的缴费结束时间
				//把当前选中月份用-拆分，如果其值是“2022-09”则拆分结果是两个字符串组成的数组
				//如果其值是“选择月份”则拆分结果是一个字符串组成的数组
				let arr = this.curMonth.split('-')
				if(arr.length===2){  //用户选中了某个月份   
					//new Date('2022-09')返回9月的第一天
					startTime = new Date(this.curMonth) - 3600000*8
					//new Date('2022', '09')返回10的第一天
					endTime = new Date(arr[0], arr[1]) - 1
				}
				let data = await feeRecord(type, startTime, endTime)
				// console.log(data)
				this.records = data
			}
		},
	}
</script>

<style scoped lang="scss">
	.picker {
		display: inline-block;
		width: $uni-font-size-base * 10;

		.picker-content {
			align-items: center; //弹性容器中的子元素在交叉轴上居中对齐
			margin: $uni-spacing-col-lg  0  $uni-spacing-col-lg  $uni-spacing-row-lg;
			border: $uni-border;
			border-radius: $uni-border-radius-base;
			padding: $uni-spacing-col-sm $uni-spacing-row-base;

			.txt {
				flex: 1;
				text-align: center;
			}
		}
	}

	.record {
		flex-direction: column; //弹性容器主轴方向：纵向
		.record-content {
			width: 100%;
		}
	}
</style>
