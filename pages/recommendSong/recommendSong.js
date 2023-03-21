// pages/recommendSong/recommendSong.js
import requestPro from '../../utils/request'
import PubSub from 'pubsub-js'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        day: '',
        month: '',
        recommendList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        let info = wx.getStorageSync('userInfo')
        if (!info) {
            wx.showToast({
                title: '请先登录',
                success: () => {
                    wx.reLaunch({
                        url: '/pages/index/index',
                    })
                }
            })
        }
        this.setData({
            day: new Date().getDate(),
            month: new Date().getMonth() + 1
        })


        //获取每日推荐
        this.getRecommendSong()
    },


    //获取每日推荐数据
    async getRecommendSong() {
        let result = await requestPro({
            url: '/recommend/songs',
            method: 'get'
        })
        console.log(result);
        this.setData({
            recommendList: result.data.dailySongs
        })
    },

    //查找当前用户播放歌曲ID 的上一首和下一首歌曲Id
    findCurrentId(id){
        this.id = id
        let {
            recommendList
        } = this.data

        let nextIndex = recommendList.findIndex(item => item.id == this.id) + 1
        let prevIndex = recommendList.findIndex(item => item.id == this.id) - 1

        if(prevIndex < 0)prevIndex = recommendList.length - 1
        if(nextIndex > (recommendList.length - 1))nextIndex = 0

        let nextId = recommendList[nextIndex].id
        let prevId = recommendList[prevIndex].id


        return{
            nextId,
            prevId
        }
    },

    skipRoute(e) {
        let {
            song: {
                id
            }
        } = e.currentTarget.dataset

        
        let {nextId,prevId} = this.findCurrentId(id)
        

        console.log(nextId);
        console.log(prevId);

        //订阅消息
        PubSub.subscribe('findMusicId',(data, topic) =>{
            //拿到当前歌曲Id
            let {currentId} = topic

            //查找回 上一首 和 下一首 歌曲ID 对象
            let idAll = this.findCurrentId(currentId)


            //发布消息 回传Id
            PubSub.publish('getMusicId',{
                idAll
            })
            
            //获取数据后  取消订阅
            PubSub.unsubscribe('abc')
        })

        wx.navigateTo({
            url: '/pages/songDetail/songDetail?ids=' + id,
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