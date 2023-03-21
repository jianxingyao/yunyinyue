// pages/login/login.js
import requestPro from '../../utils/request'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        phone:'',
        password:''
    },

    //表单输入事件  
    handleInput(e){
        let {id} = e.currentTarget
        this.setData({
            [id]:e.detail.value
        })
    },

    //登录事件回调
    async login(){
        //解构变量
        let {phone,password} = this.data
        //手机号正则
        let phoneRes = /^1[3-9]\d{9}$/

        if(!phone){
            wx.showToast({
              title: '手机号不能为空',
              icon:'error'
            })
            return
        }
        if(!phoneRes.test(phone)){
            wx.showToast({
                title: '请填写正确手机号格式',
                icon:'error'
            })
            return
        }
        if(!password){
            wx.showToast({
                title: '请填写密码',
                icon:'error'
            })
            return
        }
       
        let result = await requestPro({url:`/login/cellphone?phone=${phone}&password=${password}`,data:{isLogin:true},method:'get',})
        switch (result.code) {
            case 200:
                wx.showToast({
                  title: '登录成功',
                  icon:"success"
                })
                //将个人信息存储到本地
                console.log(result);
                wx.setStorageSync('userInfo',result.profile)
                //跳转到个人中心
                wx.switchTab({
                  url: '/pages/personal/personal',
                })
                break;
            case 400:
                wx.showToast({
                  title: '手机号错误',
                  icon:'error'
                })
                break;
            case 502:
                wx.showToast({
                  title: '密码错误',
                  icon:'error'
                })
                break;

            default:
                wx.showToast({
                  title: '登录失败',
                  icon:'error'
                })
                break;
        }

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

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