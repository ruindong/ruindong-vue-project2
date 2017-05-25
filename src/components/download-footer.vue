<template>
  <div v-show="show" class="download-footer" @click="download">
    <img src="http://api.dfhon.cn/page/webapp/assets/dfhon_logo.png"/>
    <div class="title">
      <p style="font-size: 0.18rem">东方虹整形</p>
      <p class="f-13">百万用户真实整形日记</p>
    </div>
    <div class="button f-14">下载APP</div>
    <img @click.stop="closeDownload" class="close" src="http://api.dfhon.cn/page/webapp/assets/close_download.png"/>
  </div>
</template>
<script>
  export default{
      props:['hide'],
      data(){
          return{
            show:true
          }
      },
      created(){
          if(this.hide){
              this.show = false;
          }
      },
      methods:{
          download:function () {
              window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=app2.dfhon.com';
//              var u = navigator.userAgent;
//              var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
//              var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
//              var ifr = document.createElement('iframe');
//              if(isAndroid){
//                  ifr.src = '<scheme> :// <host>'; //schemaUrl eg ABC://abc.com
//              }else if(isiOS){
//                  ifr.src = 'DfhonAliPay1://'; //schemaUrl eg ABC://abc.com
//              }
//              ifr.style.display = 'none';
//              document.body.appendChild(ifr);
//              var loadDateTime = new Date();
//              //通过定时判断手机内是否安装有app，如果手机内安装有app则启动app再返回浏览器页面的时间>1s
//              window.setTimeout(function () {
//                document.body.removeChild(ifr);
//                  var timeOutDateTime = new Date();
//                  var diffTime = timeOutDateTime - loadDateTime;
//                  if (diffTime < 1100) {
//                    window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=app2.dfhon.com';
//                  }
//              },1000);
          },
          closeDownload:function () {
            this.show = false;
            return;
          }
        }
  }
</script>
<style scoped>
  .download-footer{width: 100%;max-width: 750px;margin: 0 auto;height:0.7rem;color:#ffffff;position: fixed;bottom: 0px;background-color: rgba(0,0,0,0.7)}
  .download-footer img{float:left;width: 0.55rem;margin: 0.075rem 0.1rem 0.075rem 0.15rem;}
  .download-footer .title{float: left;margin-top: 0.15rem;}
  .download-footer .button{float:right;width: 0.9rem;height: 0.3rem;border: 0.02rem solid #ffffff;border-radius: 0.23rem;
                              margin-top: 0.2rem;margin-right:0.23rem;line-height: 0.3rem;text-align: center;}
  .download-footer .close{width: 0.2rem;position: absolute;right: 0;top:-0.18rem;border-radius: 0.2rem;z-index: 99}
</style>
