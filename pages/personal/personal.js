// pages/personal/personal.js
import reuqestPro from '../../utils/request'
let moveStartY //移动起点
let moveKmY //移动距离
let moveEndY //移动终点


Page({

    /**
     * 页面的初始数据
     */
    data: {
        coverTransform:"",
        coveTransition:"",
        userInfo:{},
        userPlayList:[]
    },
    //点进跳转登录页面
    toLogin(){
        wx.reLaunch({
          url: '/pages/login/login',
        })
    },

    //手指按下 初始位置
    handleTouchStart(e){
        this.setData({
            coveTransition:""
        })
        moveStartY = e.touches[0].clientY
    },
    //手指移动距离
    handleTouchMove(e){
        moveKmY = e.touches[0].clientY - moveStartY
        if(moveKmY>100){
            moveKmY = 100
        }
        if(moveKmY<0)return
        this.setData({
            coverTransform:`translateY(${moveKmY}rpx)`
        })
    },
    //手指抬起 结束触摸后的终点
    handleTouchEnd(e){
        this.setData({
            coveTransition:"all .5s linear",
            coverTransform:`translateY(0rpx)`
        })
    },

    

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        //如果 存了用户信息  加载 没有就显示游客
        if(!wx.getStorageSync('userInfo').nickname) return
        this.setData({
            userInfo:wx.getStorageSync('userInfo')
        })
        this.getUserPlayList(this.data.userInfo.userId)
    },

    //获取用户播放列表
    async getUserPlayList(uid){
        let result = await reuqestPro({url:`/user/record?uid=${uid}&type=0`})
        console.log(result);
        this.setData({
            userPlayList:result.allData.slice(0,20)
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})