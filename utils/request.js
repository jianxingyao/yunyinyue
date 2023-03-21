import config from './config'

//对请求的统一发送
export default function(data={}){
    return new Promise((reslove,reject) => {
        wx.request({
            ...data,
            url: config.modeAHost + data.url,
            header:{
                cookie:wx.getStorageSync('cookies') ? wx.getStorageSync('cookies').find(item => item.includes('MUSIC_U')) : undefined
            },
            success:(res)=>{
              if((data.data || []).isLogin){
                  wx.setStorage({
                      key:'cookies',
                      data:res.cookies
                  })
              }
              reslove(res.data)
            },
            fail:(err) => {
              reject(err)
            }
          })
    })
}