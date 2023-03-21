// pages/video/video.js
import requestPro from '../../utils/request'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        currentId:0,
        videoLabelList:[],
        videoList:[],
        videoId:'',
        videoTimeList:[],
        isTriggered:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.getVideoTableData()
    },

    //请求视频标签数据
    async getVideoTableData(){
        const result = await requestPro({url:'/video/group/list',method:'get'})
        this.setData({
            videoLabelList:result.data.slice(0,14), 
            currentId:result.data[0].id * 1
        })
        wx.showLoading({
          title: '正在加载',
        })
        this.getVideoData(result.data[0].id)
    },

    //请求视频数据
    async getVideoData(id){
        let num = parseInt(Math.random() * 100)
        const result = await requestPro({url:`/video/timeline/recommend?offset=${num}`,method:'get'})
        let index = 1
        wx.hideLoading({}) 
        this.setData({
            videoList:result.datas || [] .map(item => {item.id=index++;return item})
        })
        this.setData({
            isTriggered:false
        })
        
    },

    //视频播放/继续播放
    handlePlay(e){
        let {id} = e.currentTarget


        this.setData({
            videoId:id
        })
        

        //创建视频实例
        this.videoContext = wx.createVideoContext(id)
        //跳到指定位置
        let index = this.data.videoTimeList.findIndex(item => item.id === id)
        if(index !== -1){
            this.videoContext.seek(this.data.videoTimeList[index].currentTime)
        }
        //播放视频
        this.videoContext.play()
    },

    //删除播放结束视频 记录时长
    handleEnded(e){
        let {id} = e.currentTarget
        let newVideoTimeList = this.data.videoTimeList
        newVideoTimeList.find((item,index) => {
            if(item.id === id){
                newVideoTimeList.splice(index,1)
            }
        })

       
    },

    //顶部下拉刷新视频
    handleRefresher(){
        this.setData({
            isTriggered:true
        })
        this.getVideoData()
    },

    //更新视频时长
    handleTimeUpdate(e){
        let {detail:{currentTime},currentTarget:{id}} = e
        let videoItem = {currentTime,id}
        let newVideoTimeList = this.data.videoTimeList
        //判断数组里有没有相同项
        if(newVideoTimeList.find(item => item.id === id)){
            //更新时长
            newVideoTimeList.find(item => {
                if(item.id === id){item.currentTime = currentTime}
            })
        }else{
            //新增
            newVideoTimeList.push(videoItem)
        }
       
        //统一更新
        this.setData({
            videoTimeList:this.data.videoTimeList
        })
    },

    //更换高亮
    changeActive(e){
        let {id} = e.target
        console.log(typeof (id*1));
        this.setData({
            currentId:(id * 1)
        })
        this.getVideoData()
    },

    //跳转搜索
    skipRoute(){
        wx.navigateTo({
          url: '/pages/search/search',
         
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
    onShareAppMessage(e) {
        console.log(e);
        return {
            title:'云音乐',
            path:'/pages/index/index',
            imageUrl:'/static/images/nvsheng.jpg'
        }
    }
})