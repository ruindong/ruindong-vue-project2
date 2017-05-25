<!--分享帖的日记组件-->
<template>
  <div>
    <div v-title>{{pageData.Title}}</div>
    <!--医院，医生，金额，相关商品-->
    <div class="info-bar lin-b" v-if="pageData.HospitalName!=''">
      <img src="http://api.dfhon.cn/page/webapp/assets/sharePost/hospital_icon.png"/>
      <span class="f-14 c-4e">{{pageData.HospitalName}}</span>
    </div>
    <div class="info-bar lin-b" v-if="pageData.DoctorName!=''">
      <img src="http://api.dfhon.cn/page/webapp/assets/sharePost/doctor_icon.png"/>
      <span class="f-14 c-4e">{{pageData.DoctorName}}</span>
    </div>
    <div class="info-bar lin-b" v-if="pageData.Price!=''&&pageData.Price!='0'">
      <img src="http://api.dfhon.cn/page/webapp/assets/sharePost/price_icon.png"/>
      <span class="f-14 c-4e">￥{{pageData.Price}}</span>
    </div>
    <div class="info-bar" style="height: 0.4rem;line-height: 0.4rem;" v-if="pageData.ProductId!=''">
      <img src="http://api.dfhon.cn/page/webapp/assets/sharePost/coupon_icon.png"/>
      <span class="f-14 c-4e">相关商品</span>
    </div>
    <!--相关商品-->
    <!--v-if="pageData.ProductId!=''"-->
    <div class="share-post-product" v-if="pageData.ProductId!=''">
      <img :src="product.ImgUrl2"/>
      <ul>
        <li class="f-16 c-4e">{{product.Title}}</li>
        <li class="f-14 c-a4">{{product.HonSay}}</li>
        <li class="f-14 c-a4">{{product.HospitalName}}</li>
        <li>
          <span class="f-16 c-red">￥{{product.PreferPrice}} </span>
          <span class="f-13 c-a4 xtest">￥{{product.MarketPrice}}</span>
          <span class="order-count f-13 c-a4">预约数：<span class="f-13 c-red">{{product.OrderCount}}</span></span></li>
      </ul>
    </div>
    <div class="lin-bar"></div>
    <!--术前照-->
    <div class="caption">
      <p class="f-13 c-red">术前照</p>
      <img src="http://api.dfhon.cn/page/webapp/assets/sharePost/bg_icon.png"/>
    </div>
    <!--上传照片-->
    <div style="position: relative">
      <ul class="had-updata-pic">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
      <ul class="had-updata-pic" style="position: absolute;left: 0.15rem;top: 0;" >
        <li v-for="(item,index) in pageData.ImgUrl3"><div @click="showDetailImages(pageData.ImgUrl3,index)" class="updata-pic" :style="{ 'background-image': 'url('+item+')' }"></div></li>
      </ul>
    </div>
    <div class="lin-bar"></div>
    <!--我的变美历程-->
    <div class="beautiful-journey lin-b">
      <span class="f-14 c-4e" style="line-height: 0.4rem">我的变美历程</span>
      <img src="http://api.dfhon.cn/page/webapp/assets/sharePost/shanshan_icon.png"/>
      <div class="reversal-show f-13" @click="reversal" v-text="showType==true?'倒序查看':'正序查看'"></div>
    </div>
    <!--日记，第一篇-->
    <div v-for="(item,index) in pageData.SubLogs">
      <div class="caption">
        <p class="f-13 c-red">第{{item.num}}篇</p>
        <img src="http://api.dfhon.cn/page/webapp/assets/sharePost/bg_icon.png"/>
        <span class="journal-time f-13 c-a4">{{item.CreateOn}}</span>
      </div>
      <div class="journal-content lin-b">
        <p class="f-15">
          <span v-text="index==showIndex?item.Content:item.Content.substring(0,84)"></span>
          <!--<span v-if="item.Content.length>84&&showIndex==">...</span>-->
          <span class="c-red" v-if="item.Content.length>84" v-text="index==showIndex?'<<收起':'展开>>'" @click="showMore(index)"></span>
        </p>
        <div v-if="item.ImgUrls!=''">
          <div class="journal-pic" v-for="(img,index) in item.ImgUrls" :style="{ 'background-image': 'url('+img+')' }" @click="showDetailImages(item.ImgUrls,index)"></div>
          <div style="clear: both;"></div>
        </div>
      </div>
    </div>
    <!--图片查看器-->
    <imgSwiper :imgData="detailImages" :imgShow="detailImagesShow" :imgIndex="imgIndex" v-on:childTellMe="tellSomething"></imgSwiper>
  </div>
</template>
<script>
  import common from '../common/common'//引入公用js
  import axios from 'axios';
  import imgSwiper from './img-swiper.vue'
  export default{
    name:'journey',
    props:['pageData'],
    data(){
        return{
          product:{},//商品数据
          showType:true,//是否倒叙查看
          showIndex:'-1',//用于判断具体某项的日记文章的展开或者非
          showOrClose:false,//是否展开
          detailImages:[],//查看大图片
          detailImagesShow:false,//是否查看大图
          imgIndex:0,//出示显示图片大图的索引
        }
    },
    created () {
      if(parseInt(this.pageData.ProductId)>0){
        axios.get(common.host_url+'Activity.json?action=GetCouponDetail&id='+this.pageData.ProductId,{})//加载商品
          .then((response)=>{
            console.log("111111111111")
            response.data.Data[0].ImgUrl2 = response.data.Data[0].ImgUrl2.split(',')[0];
            this.product = response.data.Data[0];
          })
          .catch(function(response) {
            console.log(response)
          })
      }else {
      }
    },
    methods:{
      showMore:function (index) {
          if(this.showIndex == index){
            this.showIndex = '-1';
          }else {
            this.showIndex = index;
          }
      },
      reversal:function () {//倒叙查看
        this.showType = !this.showType;
        this.pageData.SubLogs = this.pageData.SubLogs.reverse();
      },
      showDetailImages:function (data,indx) {//点击查看大图，data-图片数据
        this.detailImages = data;
        this.detailImagesShow = true;
        this.imgIndex = indx;
      },
      tellSomething:function (msg) {
        this.detailImagesShow = msg;
      }
    },
    components:{
      imgSwiper
    }
  }
</script>
<style scoped>
  .info-bar{width: 92%;margin: 0rem 0.15rem;height: 0.5rem;line-height: 0.5rem;}
  .info-bar img{width: 0.2rem;vertical-align: sub;margin-right: 0.1rem}
  .share-post-product{width: 92%;height: 1rem;margin:0 auto 0.15rem auto;}
  .share-post-product img{width: 1rem;float: left;margin-right: 0.15rem}
  .share-post-product ul{float: left}
  .share-post-product ul li{width: 2.3rem;height: 0.25rem;line-height: 0.25rem}
  .share-post-product ul li .order-count{float: right}
  .caption{width: 100%;padding: 0.125rem 0;height: 0.25rem}
  .caption p{float: left; width:0.5rem;height:0.25rem;text-align:right;line-height:0.25rem;display: inline-block;background-color: #FCF2F3}
  .caption img{float: left; height: 0.25rem;}
  .had-updata-pic{width: 92%;height: 0.8rem;margin: 0 auto 0.15rem auto;}
  .had-updata-pic li .updata-pic{width: 0.8rem;height:0.8rem;background-size: cover;background-position: center;}
  .had-updata-pic li{float:left;width: 0.8rem;height:0.8rem;margin-right: 0.08rem;background-size: cover;
    background-image: url("http://api.dfhon.cn/page/webapp/assets/sharePost/no-updata.png")}
  .had-updata-pic li:last-child{margin-right: 0;}
  .had-updata-pic li img{width: 0.8rem;}
  .beautiful-journey{width: 100%;height:0.4rem;padding: 0 0.15rem;box-sizing: border-box;}
  .beautiful-journey img{width: 0.16rem;}
  .reversal-show{float: right;width: 0.7rem;height: 0.24rem;border-radius: 0.24rem;background-color: #f9d088;
    color: #ffffff;margin-top: 0.08rem;text-align: center;line-height: 0.24rem;}
  .journal-time{float: right;margin-right: 0.15rem}
  .journal-content{width: 92%;margin: auto;padding-bottom: 0.15rem;}
  .journal-content p{line-height: 0.23rem}
  .journal-content .journal-pic{width: 1.1rem;height:1.1rem;background-size:cover;background-position:center;margin: 0.075rem 0.075rem 0 0;float: left;}
  .journal-content .journal-pic:nth-child(3n+3){margin-right: 0;}
</style>
