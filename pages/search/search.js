// pages/search/search.js
import requestPro from '../../utils/request'

let flang = true //搜索请求开关
Page({

    /** 
     * 页面的初始数据
     */
    data: {
        hotDefaultKeyWord:'', //热搜榜默认关键字
        hotDefaultList:[],   //热搜榜默认列表
        keyWord:'', //用户当前搜索关键字
        searchList:[], //搜索后的结果
        historyList:[], //历史记录
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.getKeyWord()
        this.getHotList()
        this.getStroageSearchHistory()
    },  

    //获取默认关键字
    async getKeyWord(){

        const result = await requestPro({url:'/search/default'})
        this.setData({
            hotDefaultKeyWord:result.data.showKeyword
        })
    },

    //获取默认热搜列表
    async getHotList(){
        const result = await requestPro({url:'/search/hot/detail'})
        this.setData({
            hotDefaultList:result.data
        })
    },

    //搜索框触发的回调
    handlerInput(e){
        let {value} = e.detail
        //空字符串不发送请求
        
        //如果 输入字符是空的  把结果列表置空
        if(!value.trim()){
            this.setData({
                searchList:[]
            })
            return
        }


        //实时更新关键字
        this.setData({
            keyWord:value
        })

        //false 不能发送直接return
        if(!flang){
            return
        }

        //在本地存储  历史记录  
        this.setStorageSearchHistory(value)
        //更新到当前页面
        this.getStroageSearchHistory()

        //发送请求前  修改状态  在规定时间内不能发送
        flang = false
        //发送请求
        this.getSearchData(value)
        
        let oldKeyWord = this.data.keyWord

        //1s 后修改状态 能够继续发送请求
        setTimeout(() => {
                //请求处理完成 修改状态能够 继续发送请求
                flang = true

                //判断当前本次请求结束后 keyword是否变化 变化就发送请求
                if(oldKeyWord != this.data.keyWord && this.data.keyWord){
                    this.getSearchData(this.data.keyWord).then(() => {
                        //在本地存储  历史记录  
                        this.setStorageSearchHistory(this.data.keyWord)
                        //更新到当前页面
                        this.getStroageSearchHistory()
                    })
                }
        }, 1000);

    },


    //本地存储历史记录
    setStorageSearchHistory(history){
        //获取历史记录 数组
        const historyArr = wx.getStorageSync('historySearch')

        if(!historyArr){
            console.log("执行了");
            //更新到 本地存储
            wx.setStorageSync('historySearch',[history])
            return
        }

        //查找 是否有 本次将要保存记录  的相同项
        const flang = historyArr.findIndex(item => item == history)
        console.log(flang);
        if(flang !== -1){
            //删除  相同项
            historyArr.splice(flang,1)
        }
        console.log(historyArr);
        //往最前方加入历史记录
        historyArr.unshift(history)

         //更新到 本地存储
         wx.setStorageSync('historySearch',historyArr)

        
        
       

    },

    //删除当前搜索框文本  并添加历史记录
    handlerOff(){
        this.setStorageSearchHistory(this.data.keyWord)
        this.getStroageSearchHistory()
        this.setData({  
            keyWord:''
        })
    },

    //删除全部历史记录
    allDeleHistory(){
        wx.showModal({
          content:'确定删除所有历史记录吗',
          success:({cancel,confirm}) => {
            if(confirm){
                this.setData({
                    historyList:[]
                })
                wx.setStorageSync('historySearch','')
            }
          }
        })
    },

    //获取本次存储 更新到当前页面
    getStroageSearchHistory(){
        //获取本次存储历史记录
        let historyList = wx.getStorageSync('historySearch')
        //更新到当前页面
        this.setData({
            historyList
        })
    },

    //获取搜索后的数据
    async getSearchData(keyWord){
        const result = await requestPro({url:`/search?keywords=${keyWord}&limit=10`})
        console.log(result.result.songs);
        //更新结果
        this.setData({
            searchList:result.result.songs
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