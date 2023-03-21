// pages/index/index.js
import requestPro from '../../utils/request'
Page({

    /**
     * 页面的初始数据
     */
    data: { 
        bannerList:[],
        recommentList:[],
        topList:[]
    },
    skipRoute(){

    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        //轮播图数据请求
        const result1 = await requestPro({url:'/banner',data:{type:2},method:'get'})
        this.setData({
            bannerList:result1.banners
        })
        //推荐列表数据请求
        const result2 = await requestPro({url:'/personalized',data:{limit:10},method:'get'})
        this.setData({
            recommentList:result2.result
        })
        //排行榜数据请求
        let index = 24381616
        //循环发送请求  
        while(index<=24381621) {
            const result3 = await requestPro({url:'/playlist/detail',data:{id:index++},method:'get'})
            let topList = {title:result3.playlist.name,tracks:result3.playlist.tracks.slice(0,3)}
            this.setData({
                topList:[...this.data.topList,topList]
            })
        }
        
    },

    skipRoute(e){
        let {path} = e.currentTarget.dataset
        wx.navigateTo({
          url: `/pages/${path}/${path}`,
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