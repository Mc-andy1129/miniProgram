const Util=require('../../utils/util.js');
const HttpUtil=require('../../utils/httpUtil.js');
Page({
    data:{
        AK: '5OCD1eCSoNRSeuGhG1cqvrWZeGstlK8n',
        city: '',
        temp: '',
        weather: '',
        des: '',
        located: true,
        future: [],
        cityData:[]
    },
    // 监听页面加载
    onLoad: function () {
        let that=this;
        wx.getSetting({
            success: (res) => {
                console.log(res);
              if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
                    console.log('--');
                    wx.showModal({
                    title: '请求授权当前位置',
                    content: '需要获取您的地理位置，请确认授权',
                    success: function (res) {
                        if (res.cancel) {
                        wx.showToast({
                            title: '拒绝授权',
                            icon: 'none',
                            duration: 1000
                        })
                        } else if (res.confirm) {
                        wx.openSetting({
                            success: function (dataAu) {
                            if (dataAu.authSetting["scope.userLocation"] == true) {
                                wx.showToast({
                                title: '授权成功',
                                icon: 'success',
                                duration: 1000
                                })
                                that.loadInfo();
                                
                            } else {
                                wx.showToast({
                                title: '授权失败',
                                icon: 'none',
                                duration: 1000
                                })
                            }
                            }
                        })
                        }
                    }
                })
              } else if (res.authSetting['scope.userLocation'] == undefined) {
                that.loadInfo();
              }
              else {
                that.loadInfo();
              }
            }
          })
        
    },
    // 监听页面初次渲染完成
    onReady: function () {

    },
    // 监听页面显示
    onShow: function () {

    },
    // 监听页面隐藏
    onHide: function () {

    },
    // 监听页面卸载
    onUpload: function () {

    },
    // 监听用户下拉动作
    onPullDownRefresh: function () {
        this.loadInfo();
    },
    // 监听页面上拉触底
    onReachBottom: function () {

    },
    onShareAppMessage:function(){
        return {
            title: '突突突', // 转发后 所显示的title
            path: '/pages/main/main', // 相对的路径
            success: (res)=>{    // 成功后要做的事情
               console.log(res);
            },
            fail: function (res) {
                // 分享失败
                console.log(res)
            }
        }
    },
    toCitychoose:function(){
        wx.showToast({
            title: '别点了哦，还在开发中~',
            icon: 'none',
            duration: 1000,
            mask:true
        })
    },
    showBcgImgArea:function(){
        console.log('11');
        this.loadInfo();
    },
    loadInfo: function () {
        let that = this;
        wx.getLocation({
            type: 'gcj02',
            success: (res)=>{
                let latitude = res.latitude;
                let longitude = res.longitude;
                let AK = that.data.AK;
                that.loadCity(latitude, longitude, AK, that.loadWeather);
            },
            fail:(err)=>{
                console.log(err);
                wx.showToast({
                    title: '授权失败,搞基失败',
                    icon: 'none',
                    duration: 1000,
                    mask:true
                })
            }
        })
    },
    loadCity: function (latitude, longitude, AK, callback) {
        let that = this;
        let url = 'https://api.map.baidu.com/geocoder/v2/?location=' + latitude + ',' + longitude + '&output=json&ak=' + AK;
        HttpUtil.request(url).then((res)=>{
            console.log(res);
            let city = res.result.addressComponent.city;
            that.setData({city :city});
            callback && callback(city, AK);
        }).catch((err)=>{
            console.log(err);
        });
    },
    loadWeather: function (city, AK) {
        let that  = this;
        let url = 'https://api.map.baidu.com/telematics/v3/weather?location=' + city + '&output=json&ak=' + AK;
        HttpUtil.request(url).then((res)=>{
            let desNum = Util.random(5);
            let future = res.results[0].weather_data.filter((ele, index)=>{
                return index > 0;
            });
            console.log(res.results[0].index);
            that.setData({
                temp: res.results[0].weather_data[0].temperature,
                weather: res.results[0].weather_data[0].weather + ' ' + res.results[0].weather_data[0].wind,
                des: res.results[0].index[desNum].des,
                future: future,
                cityData:res.results[0].index
            });
        }).catch((err)=>{
            console.log(err);
        });
    }
})