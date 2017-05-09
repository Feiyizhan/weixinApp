//game.js
//获取应用实例
var app = getApp()
var utils = require('../../utils/util.js')
var initData = {
    maxCount: 0,
    maxValue: 128,
    minValue: 0,
    currNumber: "",
    //maxG: 0,
    //minG: 0,
	  //gap: 0,
	  //checkReult: 99,  //检查结果，0匹配，1偏大，-1 偏小，99 初始值
	  index:1, //当前次数
	  gapRate:0.05, //随机调整差的比例
	  endFlag:false,
    gameStartMessage:"游戏开始",
	currentResultMessage:""
	
  }
var KEY="numberGame"
Page({
  data: initData,
  formSubmit: function(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
	let value 
	if(e.detail.value.currNumber){
		value = parseInt(e.detail.value.currNumber)
	}else{
		value = parseInt(e.detail.value)
	}
	playGame(value,this)
	
  },
  formReset: function() {
    console.log('form发生了reset事件')
	resetGame(initData,this)
  },
  
  onLoad () {
    let that = this
    resetGame(initData,that)
	  
	
    
    
  },
  onShareAppMessage:function(){
	return {
      title: '史上最难猜数字游戏',
      path: '/pages/numberGame/numberGame',
      success: function(res) {
        // 分享成功
		console.log(res)
      },
      fail: function(res) {
        // 分享失败
		console.log(res)
      }
    }  
  }
})


function resetGame(data,that){
  let newData = initData
  newData.maxValue= data.maxValue
  newData.minValue = data.minValue
  newData.maxCount = Math.ceil(Math.log(data.maxValue-data.minValue)/(Math.log(2)))-1 
  that.setData(newData)
  //wx.removeStorageSync(KEY)
  wx.setStorageSync(KEY,newData)
}

function playGame(value,that){
	let data = wx.getStorageSync(KEY)
	let index = data.index
	let maxValue = data.maxValue
	let minValue = data.minValue
	let maxCount = data.maxCount
	let gapRate = data.gapRate
	let checkReult = 99 //检查结果，0匹配，1偏大，-1 偏小，99 初始值
	let maxG= maxValue-value  //偏大区域数量
	let minG= value-minValue  //偏小区域数量
	let randomValue = 0
	
	if(index <=maxCount){
		data.gameStartMessage = "游戏中。。。"
		let gap = Math.round((maxValue-minValue)*gapRate)
		if(value <= maxValue && value >=minValue){ //输入的值必须在有效范围内
                //判断输入的值是在偏大还是偏小区域，偏大区域就提示输入值偏小，偏小区域就提示偏大,相等提示偏小

			if(index==maxCount){ //最后一次，随机选择一个范围内数字，判断当前输入的数字是否匹配
				if((parseInt(Math.random()*(maxValue-minValue+1))+minValue) == value){
					checkReult = 0
				}
			}
			if(checkReult!=0){

				if(Math.abs(maxG-minG)<=gap){  //偏大和偏小区域的数量差在范围内，则随机选择偏大还是偏小
					
					if( maxG==0 && maxG==minG){
						checkReult = 0
					}else{
						if(Math.random() > 0.5){ //偏大
							checkReult = 1
							maxValue = value-1
						}else{ //偏小
							checkReult = -1
							minValue = value+1
						}
					}

				}else if(maxG > minG){ //偏大区域大于偏小区域就提示输入值偏小，将正确范围移动到偏大范围
					checkReult = -1
					minValue = value+1
				}else{ //偏大区域小于偏小区域就提示输入值偏大，将正确范围移动到偏小范围
					checkReult = 1
					maxValue = value-1
				}

			}
			
			switch (checkReult) {//显示匹配结果 
				
				case 0:  //猜中
					data.gameStartMessage = "游戏结束"
					data = setCurrentResultMessage("恭喜，猜中了，用了"+index+"次。",data)
					data.endFlag =true
					break
				case -1:
					if(index ==maxCount){ //最后一次，输出最终结果
						data.gameStartMessage = "游戏结束"
						data.endFlag =true
						randomValue= parseInt(Math.random()*(maxG)) //在偏大区间随机取一个数
						randomValue = randomValue + value + 1  //随机数返回是0开始的数字，因此需要+1跳过当前输入的值
						data = setCurrentResultMessage("偏小,失败！正确的数字是："+randomValue,data)
					}else{
						data = setCurrentResultMessage("偏小",data)
					}
					
					break
				case 1:
					if(index ==maxCount){ //最后一次，输出最终结果
						data.gameStartMessage = "游戏结束"
						data.endFlag =true
						randomValue= parseInt(Math.random()*(minG))  //在偏小区间随机取一个数
						randomValue = value -randomValue-1  //随机数返回是0开始的数字，因此需要-1跳过当前输入的值
						data = setCurrentResultMessage("偏大,失败！正确的数字是："+randomValue,data)
					}else{
						data = setCurrentResultMessage("偏大",data)
					}
					break

			}

		}else{
			if(index ==maxCount){ //最后一次，输出最终结果
				data.gameStartMessage = "游戏结束"
				data.endFlag =true
				randomValue= parseInt( (Math.random()*(maxValue-minValue+1)))
				randomValue = randomValue + minValue
				data = setCurrentResultMessage("失败！正确的数字是："+randomValue,data)
			}else{
				data= setCurrentResultMessage("你浪费了一次机会.",data)
			}
		}


		data.maxValue = maxValue
		data.minValue = minValue
		index = index + 1
		data.index = index
		that.setData(data)
		wx.setStorageSync(KEY,data)		

		
		
	}else{
		resetGame(initData,that)
		
	}

	
	
}

function setCurrentResultMessage(value,data){
	data.currentResultMessage = value
	return data
}
