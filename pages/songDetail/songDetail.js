// pages/songDetail/songDetail.js
import requestPro from '../../utils/request';
import PubSub from 'pubsub-js'
const appMusicInstance = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isPlay: false,
        songAuthInfo: {},
        musicData: '',
        currentId:'',
        currentTime:'00:00',
        finalTime:'',
        currentWidth:0//当前进度条长度
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad({ids}) {
        
        this.getData(ids)
        this.getMusicData(ids)


    },

    //上一首
    handlerPrev(){
        this.pubAndSub('prev')
    },
    //下一首
    handlerNext(){
       this.pubAndSub('next')
    },

    //发布与订阅
    pubAndSub(type){
        //订阅消息
        PubSub.subscribe('getMusicId',(fun,id) => {
            let {idAll:{nextId,prevId}} = id

            //确定 是上一首还是下一首
            let currentId =  type === 'prev' ? prevId : nextId

            //更新Id
            // this.setData({
            //     currentId
            // })

            //发送请求更新页面
            this.getData(currentId)
            this.getMusicData(currentId).then(
                res => {
                    this.changePlay(true)
                    this.startOrEndMusic()
                }
            )

           

            //取消订阅
            PubSub.unsubscribe('getMusicId')
        })

        //发布消息 查找当前Id上一首和下一首
        PubSub.publish('findMusicId',{
            currentId:this.data.currentId
        })


        
    },

    //获取歌曲详情信息
    async getData(id) {
        const result = await requestPro({
            url: '/song/detail',
            data: {
                ids: id
            },
            method: 'get'
        })
        
        //更新当前Id之前
        this.setData({
            currentId:id,
            songAuthInfo: result.songs[0].al,
            finalTime:this.backTimeSec(result.songs[0].dt)
            
        })
       
        
       

        wx.setNavigationBarTitle({
            title: this.data.songAuthInfo.name
        })
       
    },
    //获取歌曲音频信息
    async getMusicData(id) {
        const result = await requestPro({
            url: `/song/url?id=${id}`,
            method: 'get'
        })
        this.setData({
            musicData: result.data[0].url
        })




        //创建音乐实例
        this.musicNew = wx.getBackgroundAudioManager()
        let {
            musicNew
        } = this
        ;
       
       
        if (appMusicInstance.overallData.isMusicPlay && appMusicInstance.overallData.musicId == id) {
            this.setData({
                isPlay: true
            })
        }

        //音乐事件监听


        //开始
        musicNew.onPlay(() => {
            this.changePlay(true)
            appMusicInstance.overallData.musicId = id
        })
        //暂停
        musicNew.onPause(() => {
            this.changePlay(false)
        })
        //停止
        musicNew.onStop(() => {
            this.changePlay(false)
        })
        //实时播放
        musicNew.onTimeUpdate(() =>{
            let {isMusicPlay,musicId} = appMusicInstance.overallData

            let {currentId} = this.data

            let currentWidth = 400 * musicNew.currentTime /musicNew.duration
            

            //播放状态 且 不是播放歌曲ID  进度条改为0
            if(currentId != musicId && isMusicPlay){
                this.setData({
                    currentTime:'00:00',
                    currentWidth:0
                })
                return
            }

           //修改当前进度条时间
            this.setData({
                currentTime:this.backTimeSec(musicNew.currentTime * 1000),
                currentWidth
            })

            //自动切换下一首
            if(musicNew.duration == musicNew. currentTime){
                this.handlerNext()
            }
            
        })

    },

    //修改播放暂停  状态功能函数
    changePlay(play) {
        this.setData({
            isPlay: play
        })
        appMusicInstance.overallData.isMusicPlay = play
    },

    //点击播放暂停
    handlerPlay() {
        this.setData({
            isPlay: !this.data.isPlay
        })

        this.startOrEndMusic()
    },

    //播放歌曲
    startOrEndMusic() {
        let {
            isPlay
        } = this.data
        let {
            musicNew
        } = this

        if (isPlay) {
            //获取音乐数据
            musicNew.src = this.data.musicData
            musicNew.title = this.data.songAuthInfo.name
            musicNew.play()
        } else {
            musicNew.pause()
        }
    },


    //时间转化为分钟功能函数
    backTimeSec(msec,type){
        //转换成数字
        msec *= 1
        //得到整分
        let min = parseInt((msec / 1000) / 60)
        //得到余秒
        let sec = parseInt((msec / 1000) % 60)

        sec = sec>10 ? sec : '0'+sec
        
        return `0${min}:${sec}`
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