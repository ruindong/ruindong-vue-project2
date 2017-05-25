<template>
  <div class="page-body" id="select-nav">
    <div v-title>{{pageTitle}}</div>
    <ul class="select-nav-body">
      <li v-for="item in selectData" v-on:click="selectFun(item)" v-bind:class="nowSelect==item.type?'active':'' ">
        <span class="">{{item.prop}}</span>
        <img class="arrow-img" v-bind:src="nowSelect==item.type?'http://api.dfhon.cn/page/webapp/assets/specialSubject/arrow-up.png':'http://api.dfhon.cn/page/webapp/assets/specialSubject/arrow-down.png'"/>
      </li>
    </ul>
    <div class="masking" v-if="nowSelect!=''"></div>
    <div class="nav-item-box" v-if="nowSelect!=''">
      <!--地区选择-->
      <ul class="area-box" v-show="nowSelect==1">
        <li v-for="item in area" v-on:click="province(item.Province)"
            v-bind:class="areaSelect==item.Province?'active':'' ">{{item.Province}}</li>
      </ul>
      <!--项目选择-->
      <div class="item-box" v-show="nowSelect==2">
        <ul class="item-box-l">
          <li v-on:click="selectLeft(item)" v-for="item in classSelect"
              v-bind:class="classSelectL==item.ClassName?'active':''">{{item.ClassName}}</li>
        </ul>
        <ul class="item-box-r">
          <li v-on:click="selectRight(item)" v-for="item in classR"
              v-bind:class="classSelectR==item.ClassName?'active':''">{{item.ClassName}}</li>
        </ul>
      </div>
      <!--智能筛选-->
      <ul class="smart-box" v-show="nowSelect==3">
        <li v-on:click="smartFun('RecommendQZ DESC,EndDate ASC','智能推荐')"
            v-bind:class="smartSelect=='智能推荐'?'active':''">智能推荐</li>
        <li v-on:click="smartFun('OrderCount DESC,EndDate ASC','销量最高')"
            v-bind:class="smartSelect=='销量最高'?'active':''">销量最高</li>
        <li v-on:click="smartFun('PreferPrice ASC,EndDate ASC','价格最低')"
            v-bind:class="smartSelect=='价格最低'?'active':''">价格最低</li>
      </ul>
    </div>
    <!--专题图片-->
    <div style="width: 100%;height: 0.45rem;"></div>
    <div class="project-img" v-for="item in imgArray">
      <div v-if="item[0].length!=2&&item[0]!==''">
        <img style="width: 100%;vertical-align: middle;display: grid;" v-bind:src="item[0]" v-on:click="ClickImg(item[1])">
      </div>
      <div v-else>
        <img style="width: 50%;float: left;" v-bind:src="item[0][0]" v-on:click="ClickImg(item[0][1])">
        <img style="width: 50%;float: left;" v-bind:src="item[1][0]" v-on:click="ClickImg(item[1][1])">
      </div>
    </div>
    <!--产品-->
    <div id="list_content">
      <div v-for="item in productList" class="cp_cont" v-on:click="ClickCoupon(item.ID)">
        <img v-bind:src="item.ImgUrl">
        <div class="cp_info">
          <p class="info_tit"><span>{{item.Title|strLimit}}</span><span></span></p>
          <p class="info_txt">{{item.HospitalName|strLimit}}</p>
          <p class="info_yy"></p>
          <p>
            <span class="money">￥{{item.PreferPrice}}<i>￥{{item.MarketPrice}}</i></span>
            <span class="order-r"><span class="order">预约数：</span>{{item.OrderCount}}</span>
          </p>
        </div>
        <div class="clear"></div>
      </div>
    </div>
    <div v-show="loading" class="loading"><img src="http://api.dfhon.cn/page/webapp/images/loading.gif"><span>正在加载...</span></div>
    <div v-show="!loading" class="loading"><span>已加载全部</span></div>
    <!--公用引导下载banner,传递一个参数告诉引导下载的子组件是否显示-->
    <download-footer :hide="hide"></download-footer>
  </div>
</template>
<script>
  import wxShare from '../common/weixinshare'
  import common from '../common/common'
  import axios from 'axios';
  import downloadFooter from './download-footer.vue'
  export default{
    data(){
      return{
        pageTitle:'',
        selectData:[
          {type:1,prop:'全国',isActive:false,result:''},
          {type:2,prop:'全部项目',isActive:false,result:''},
          {type:3,prop:'智能筛选',isActive:false,result:''}
        ],
        hospitalIds:'',
        DoctorIds:'',
//        ClassIds:'',
        nowSelect:"",//当前选择的头部内容类型判断
        area:[],//省份数组
        areaSelect:'',//当前选择的省
        classSelect:[],//类别选择
        classR:[],//类别选择右子项
        classSelectL:'',//类别左当前选择；
        classSelectR:'',//类别右当前选择；
        smartSelect:'',//当前选择的排序
        imgArray:[],//专题图片数组
        fromId:'',
        productList:[],//产品数组
        loading:true,
        flag:false,//可加载
        hide:true,//引导下载banner组件是否显示
      }
    },
    created () {
      var isShareUrl = window.location.href.indexOf('api.dfhlady.com');//判断是否是分享页，还是在app显示的api域名
      if(isShareUrl>0){
          this.hide = false;
      }
      axios.get(common.wx_host_url + '?action=GetShareMsg&type=11', {params: {id: this.$route.query.id}}).then((back) => {
        var data = back.data.Data[0];
        this.pageTitle = data.Share_Title;
        /*title:微信分享的标题，desc:微信分享的描述，link:微信分享的连接地址，imgUrl:微信分享的图片地址，successFun:分享成功执行的方法， cancleFun：取消分享执行的方法*/
        wxShare.InitShare(data.Share_Title, data.Share_Content,data.Share_ImgUrl, function () {}, function () {});
      });
      var _this = this;
      document.onscroll = function () {
        if (document.body.scrollTop + document.documentElement.clientHeight >= document.body.scrollHeight - 40 && !_this.flag) {
          console.log("触摸底部");
          _this.flag = true;//触底不触发
          setTimeout(function () {
//            _this.flag = false;//触底触发
            _this.getProductList('load');//加载商品
          }, 1000);
        }
      };
      axios.get(common.host_url + 'class.json?action=GetSpecialSubjectInfo', {params: {id: this.$route.query.id}}).then((response) => {
        var databack = response.data.Data[0];
        this.hospitalIds = databack.HospitalIds;
        this.DoctorIds = databack.DoctorIds;
        this.selectData[1].result = databack.ClassIds;
        var imgArrayUrl = [];
        var imgArray = databack.TImgUrls.split("|");
        var imgUrl = databack.TLinkUrls.split("|");
        for (var p in imgArray) {
          imgArrayUrl[p] = [];
          if (imgArray[p].indexOf(",") > 0) {
            imgArray[p] = imgArray[p].split(",");
            imgUrl[p] = imgUrl[p].split(",");
            imgArrayUrl[p][0] = [imgArray[p][0], imgUrl[p][0]];
            imgArrayUrl[p][1] = [imgArray[p][1], imgUrl[p][1]];
          } else {
            imgArrayUrl[p].push(imgArray[p]);
            imgArrayUrl[p].push(imgUrl[p]);
          }
        }
        this.imgArray = imgArrayUrl;
        var paramArray = {
          'hospitalIds': databack.HospitalIds,
          'doctorIds': databack.DoctorIds,
          'classIds': databack.ClassIds,
        };
        axios.get(common.host_url + 'class.json?action=GetSubjectAllProvince', {params: paramArray}).then((province) => {
          province.data.Data[0].Province = '全国';
          this.area = province.data.Data;
        }).catch((province) => {
          console.log(province)
        });
        axios.get(common.host_url + 'class.json?action=GetSubjectAllClass', {params: paramArray}).then((classtype) => {
          this.classSelect = classtype.data.Data;
          this.classSelect.unshift({ClassId: "0", ClassName: "全部项目", SubClass: [{ClassId: "0", ClassName: "全部项目"}]});
          for (var name in this.classSelect) {
            if (name != 0) {
              this.classSelect[name].SubClass.unshift({
                ClassId: this.classSelect[name].ClassId,
                ClassName: "全部" + this.classSelect[name].ClassName
              });
            }
          }
        }).catch((classtype) => {
          console.log(classtype)
        })
        this.getProductList();
      }).catch((response) => {
        console.log(response)
      });
    },
    methods:{
      selectFun: function (item) {//头部选择
        if(this.nowSelect == ""){
          this.nowSelect = item.type;
        }else if(this.nowSelect != item.type) {
          this.nowSelect = item.type;
        }else {
          this.nowSelect = "";
        }
      },
      province:function(province){//省份选择
        this.areaSelect = province;
        this.selectData[0].prop = province;
        this.selectData[0].result = decodeURI(province);
        this.nowSelect = "";
        this.getProductList();
      },
      selectLeft:function (item) {//类别选择左
        this.classR = item.SubClass;
        this.classSelectL = item.ClassName;
      },
      selectRight:function (info) {//类别选择右
        this.classSelectR = info.ClassName;
        this.selectData[1].prop = info.ClassName;
        this.selectData[1].result = info.ClassId;
        this.nowSelect = "";
        this.getProductList();
      },
      smartFun:function(asc,type){
        this.smartSelect = type;
        this.selectData[2].prop = type;
        this.selectData[2].result =asc;
        this.nowSelect = "";
        this.getProductList();
      },
      getProductList:function(text){
        var prop = {
          fromId: this.fromId,
          pageSize: 5,
          province: this.selectData[0].result ,
          _ClassIds: this.selectData[1].result,
          _hospitalIds: this.hospitalIds,
          _doctorIds:  this.DoctorIds,
          _orderBy: this.selectData[2].result
        };
        if(text != 'load'){
          document.body.scrollTop=0;
          prop.fromId='';
          this.productList = [];
          this.flag = false;
        }
        var productArray = this.productList;
        axios.get(common.host_url+'class.json?action=GetSubjectProductList',{params: prop}).then((product)=>{
          var length = product.data.Data.length;
          if(length>0){
            var formId = product.data.Data[(length-1)].ID;
            this.fromId = formId;
            for (var list in product.data.Data){
              productArray.push(product.data.Data[list]);
            }
            this.productList = productArray;
            this.flag = false;
            this.loading = true;//加载全部
          }else {
            this.loading = false;//加载全部完成
            this.flag = true;
          }
        }).catch((province)=> {
          console.log(province)
        });
      },
      onInfinite() {
        setTimeout(() => {
          const temp = [];
          for (let i = this.list.length + 1; i <= this.list.length + 20; i++) {
            temp.push(i);
          }
          this.list = this.list.concat(temp);
          this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
        }, 1000);
      },
      ClickImg:function(params){
        params = params.toLowerCase();
        var linkurl;
        var adtype;
        var adid;
        var posttype;
        var postid;
        var exchangecode;
        if(params.indexOf("//")>0){
          linkurl = params;
          adtype = 0;
        }else {
          var paramsObject = [];
          var paramsArray = params.replace("?",'');
          paramsArray = paramsArray.split("&");
          for (var n in paramsArray){
            var prop = paramsArray[n].split("=");
            paramsObject[prop[0]] = prop[1];
          }
          linkurl = paramsObject['linkurl'];
          adtype = parseInt(paramsObject['adtype']);
          adid = paramsObject['adid'];
          posttype = paramsObject['posttype'];
          postid = paramsObject['postid'];
          exchangecode = paramsObject['exchangecode'];
        }
        ClickImg(linkurl, adtype, adid, posttype, postid,exchangecode)
      },
      ClickCoupon:function(id){//产品跳转111111
        ClickCoupon(id);
      }
    },
    components:{
      downloadFooter
    }
  }
  //    安卓和IOS判定及跳转
  var os = function() {
    var ua = navigator.userAgent,
      isWindowsPhone = /(?:Windows Phone)/.test(ua),
      isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
      isAndroid = /(?:Android)/.test(ua),
      isFireFox = /(?:Firefox)/.test(ua),
      isChrome = /(?:Chrome|CriOS)/.test(ua),
      isTablet = /(?:PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua)),
      isPad = /(?:iPad)/.test(ua),
      isPhone = /(?:iPhone)/.test(ua) && !isTablet,
      isPc = !isPhone && !isAndroid && !isSymbian;
    return {
      isTablet: isTablet,
      isPhone: isPhone,
      isAndroid: isAndroid,
      isPc: isPc,
      isPad: isPad,
      webApp: ua.indexOf('Safari') == -1,
      weiXin:ua.toLowerCase().match(/MicroMessenger/i) == 'micromessenger',
      QQ:ua.match(/\sQQ/i) == " QQ"
    };
  } ();
  // IOS相关
  // 固定方法，用于H5与IOS通信
  function setupWebViewJavascriptBridge(callback) {
    if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
    if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
    window.WVJBCallbacks = [callback];
    var WVJBIframe = document.createElement('iframe');
    WVJBIframe.style.display = 'none';
    WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
  }

  function ClickCoupon(_ID) {
    if (os.isAndroid || os.isTablet) {
      control.appCustomDetail(_ID.toString(), 2);
    } else if (os.isPad || os.isPhone) {
      setupWebViewJavascriptBridge(function (bridge) {
        bridge.callHandler('appCustomDetail', {"_id": _ID.toString(), "_type": 2}, function (response) {
        });
      });
    }
  }

  function ClickImg(_linkUrl, _adType, _adId, _postType, _postId,_exchangeCode) {
    var isShareUrl = window.location.href.indexOf('api.dfhlady.com');//判断是否是分享页，还是在app显示的api域名
    if(isShareUrl>0){
      window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=app2.dfhon.com';
    }
    if (_adType == 0) {
      window.location.href = _linkUrl;
    }
    else if (_adType == 1) {
      if (os.isAndroid || os.isTablet) {
        control.appPostDetail(_postType, _adId, _postId);
      }
      else if (os.isPad || os.isPhone) {
        setupWebViewJavascriptBridge(function(bridge) {
          bridge.callHandler('appPostDetail', { "_postType": _postType, "_tableInfoId": _adId, "_postId": _postId }, function(response) {
          });
        });
      }
    }
    else if (_adType == 2 ||_adType == 5 ||_adType == 6 ||_adType == 7 ||_adType == 8 ||_adType == 9) {
      if (os.isAndroid || os.isTablet) {
        control.appCustomDetail(_adId,parseInt( _adType));
      } else if (os.isPad || os.isPhone) {
        setupWebViewJavascriptBridge(function(bridge) {
          bridge.callHandler('appCustomDetail', { "_id": _adId, "_type": _adType }, function(response) {
          });
        })
      }
    }
    else if (_adType == 10) {
      axios.get(common.host_url+'class.json?action=GetVoucherCodeByTypeId',{params:{voucherTypeId:_adId}}).then((exchangeCode)=>{
        _exchangeCode = exchangeCode.data.Data[0].ExchangeCode
        if (null != _exchangeCode && _exchangeCode != "") {
          if (os.isAndroid || os.isTablet) {
            control.appVoucherExchange(_exchangeCode);
          } else if (os.isPad || os.isPhone) {
            setupWebViewJavascriptBridge(function(bridge) {
              bridge.callHandler('appVoucherExchange', { "_code": _exchangeCode }, function(response) {
              });
            })
          }
        }
        else {
          alert("抱歉，该优惠券已经被兑换完了");
        }
      }).catch((response)=> {
        console.log(_exchangeCode)
      });
    }
  }
</script>
<style scoped>
  .page-body {
    width: 100%;
    max-width: 750px;
    margin: 0 auto;
  }

  .select-nav-body {
    width: 100%;
    max-width: 750px;
    height: 0.45rem;
    position: fixed;
    top: 0;
    left: 0px;
    right: 0px;
    margin: auto;
    font-size: 0.15rem;
    color: #4e4e4e;
    border-bottom: 1px solid #ebebeb;
    box-sizing: border-box;
    z-index: 10;
    background-color: #FFFFFF;
  }

  .select-nav-body li {
    float: left;
    width: 33.3%;
    height: 0.45rem;
    line-height: 0.45rem;
    text-align: center;
    box-sizing: border-box;
  }

  .select-nav-body li:last-child {
    border-right: 0px;
  }

  .arrow-img {
    width: 0.1rem;
    vertical-align: middle;
    margin-left: 0.05rem;
  }

  .active {
    color: #ff507f;
  }

  .nav-item-box {
    width: 100%;
    max-width: 750px;
    max-height: 2.4rem;
    position: fixed;
    top: 0.45rem;
    left: 0px;
    right: 0px;
    margin: auto;
    font-size: 0.15rem;
    color: #4e4e4e;
    overflow-y: hidden;
    z-index: 10;
    background-color: #FFFFFF;
  }

  .masking {
    width: 100%;
    max-width: 750px;
    height: 100%;
    position: fixed;
    top: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 9;
  }

  /*地区选择区域*/
  .area-box {
    width: 100%;
    height: 2.4rem;
    overflow-y: auto;
  }

  .nav-item-box li {
    width: 100%;
    height: 0.45rem;
    line-height: 0.45rem;
    text-align: center;
  }

  /*项目选择区域*/
  .item-box {
    width: 100%;
    height: 2.4rem;
    overflow-y: hidden;
  }

  .item-box-l, .item-box-r {
    float: left;
    width: 66.6%;
    height: 2.4rem;
    overflow-y: scroll;
  }

  .item-box-l {
    width: 33.3%;
    background-color: #f4f4f4;
  }

  .item-box-r li {
    padding-left: 0.25rem;
    text-align: left;
    box-sizing: border-box;
  }

  .project-img {
    width: 100%;
    max-width: 750px;
    margin: 0 auto;
  }
  /*产品css*/
  .clear{
    clear: both;
  }
  #list_content{
    width: 100%;
    max-width: 750px;
    margin: 0 auto;
  }
  .cp_cont{
    padding: 0.1rem 0.15rem;
    border-bottom: 1px solid #ebebeb;
    font-size: 0.14rem;
    color: #a4a4a4;
    background-color: #ffffff;
  }
  .cp_cont img{
    float: left;
    width: 1.1rem;
    height: 1.1rem;
  }
  .cp_cont .cp_info{
    float: left;
    width: 2.24rem;
    height: 1.1rem;
    margin-left: 0.1rem;
  }
  .cp_cont .cp_info p{
    width: 100%;
    height: 0.275rem;
    line-height: 0.275rem;
  }
  .info_tit{
    font-size: 0.16rem;
    color: #4e4e4e;
  }
  .cp_cont .cp_info p .money{
    font-size: 0.16rem;
    color: #ff507f;
  }
  .cp_cont .cp_info p i{
    font-size: 0.13rem;
    font-style: normal;
    text-decoration: line-through;
    padding-left: .1rem;
    color: #a4a4a4;
  }
  .cp_cont .cp_info p .order-r{
    float: right;
    font-size: 0.13rem;
    color: #ff507f;
  }
  .cp_cont .cp_info p .order{
    color: #a4a4a4;
  }
  .loading{
    width: 100%;
    height: 0.45rem;
    background-color: #f4f4f4;
    font-size: 0.15rem;
    text-align: center;
  }
  .loading img{
    width: 0.18rem;
    vertical-align: middle;
    line-height: 0.45rem;
  }
  .loading span{
    margin-left: 0.05rem;
    line-height: 0.45rem;
  }
</style>
