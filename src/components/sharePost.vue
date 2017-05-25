<template>
  <div class="post">
    <!--用户头部-->
    <div class="post-header lin-b">
      <div class="user-face" :style="{ 'background-image': 'url('+pageData.UserFace+')' }"></div>
      <div class="user-info">
        <!--UserType:用户类型（0：用户 1：医院 2：医生,5达人，7圈主，9官方）-->
        <div style="line-height: 0.65rem;">
          <span style="line-height: 0.15rem;" class="f-15 c-4e">{{pageData.UserNickName}}</span>
          <img v-if="pageData.UserType!='0'&&typeof (pageData.UserType)!='undefined'" :src="'http://api.dfhon.cn/page/webapp/assets/sharePost/UserType_0'+pageData.UserType+'.png'"/>
        </div>
        <!--<div style="line-height: 0.18rem" class="f-13 c-a4">{{pageData.AddTime}}</div>-->
      </div>
    </div>
    <!--帖子标签-->
    <div>
      <div class="post-mark">
        <span class="f-13 c-66" v-for="item in pageData.Lables" v-text="item.LableName"></span>
      </div>
    </div>
    <div class="lin-bar"></div>
    <!--动态选择组件，包括分享帖，分享帖求方案，官方帖-->
    <component v-bind:is="currentView" :pageData="pageData">
      <!-- 组件在 vm.currentview 变化时改变！ -->
    </component>
    <!--已读和点赞-->
    <div class="label-count">
      <img src="http://api.dfhon.cn/page/webapp/assets/sharePost/reded_icon.png"/>
      <span class="f-13 c-a4">{{pageData.ClickCountVirtual}}</span>
      <img src="http://api.dfhon.cn/page/webapp/assets/sharePost/zan_icon.png"/>
      <span class="f-13 c-a4">{{pageData.GoodCount}}</span>
    </div>
    <!--所有评论-->
    <div class="all-comment">
      <img src="http://api.dfhon.cn/page/webapp/assets/sharePost/chat_icon.png"/>
      <span class="f-14 c-a4">所有评论({{pageData.ReplyCount}})</span>
    </div>
    <!--评论内容-->
    <div class="comment-item lin-b" v-for="(item,index) in commentData">
      <div class="journal-header f-15 c-4e">
        <div class="header-pic" :style="{ 'background-image': 'url('+item.UserFace+')' }"></div>
        <div style="height: 0.35rem; display: flex;flex-direction: column;justify-content: center;">
          <p style="line-height: 0.15rem;">
            <span class="f-15 c-4e">{{item.UserNickName}}</span>
            <img class="type-mark" v-if="item.UserType!='0'&&typeof (item.UserType)!='undefined'" :src="'http://api.dfhon.cn/page/webapp/assets/sharePost/UserType_0'+item.UserType+'.png'"></p>
          <!--UserType:用户类型（0：用户 1：医院 2：医生,5达人，7圈主，9官方）-->
          <p style="line-height: 0.15rem" v-if="item.UserType=='2'"><span class="f-13 c-a4">{{item.JobTitle+' '+item.HospitalName}}</span></p>
        </div>
      </div>
      <div class="comment-content">
        <p class="f-15 c-4e" style="line-height: 0.23rem;">{{item.CommentContent}}</p>
        <span class="f-13 c-a4" style="line-height: 0.35rem;">{{item.AddTime}}</span>
        <div class="child-replay" v-if="item.SubReplies.length>0">
          <p v-for="comment in item.SubReplies2">
            <span class="f-13 c-red">{{comment.UserNickName}}</span>
            <span class="f-13 c-4e">回复</span>
            <span class="f-13 c-red">{{comment.AtUserNickName}}：</span>
            <span class="f-13 c-a4">{{comment.ReplyContent}}</span>
          </p>
          <div class="show-more" v-if="item.ReplyCount>'3'" @click="allComment(index)">
            <img v-if="!commentAll" src="http://api.dfhon.cn/page/webapp/assets/sharePost/arrow_down_icon.png"/>
            <img v-if="commentAll" src="http://api.dfhon.cn/page/webapp/assets/sharePost/arrow_up_icon.png"/>
          </div>
        </div>
      </div>
    </div>
    <div class=""></div>
    <!--公用引导下载banner-->
    <download-footer :hide="false"></download-footer>
  </div>
</template>

<script>
  import common from '../common/common'
  import { Indicator } from 'mint-ui';
  import axios from 'axios';
  import downloadFooter from './download-footer.vue'
  import journey from './journey.vue'
  import solution from './seek-solutions.vue'
  import office from './officePost.vue'
  export default {
    name:'sharePost',
    data(){
      return{
        currentView:'',//选择什么样的组
        pageData:{},//页面数据包括日记
        commentData:{},//评论数据
        commentAll:false,//是否点击展开显示所有子评论
      }
    },
    created () {
      Indicator.open({
        text: '加载中...',
        spinnerType: 'triple-bounce'
      });
      console.log(this.$route);
      const paramStr = this.$route.fullPath.split('?')[1];
      axios.get(common.host_url+'Post.json?action=GetPostInfoById&app_version=4.1.1&'+paramStr,{})
        .then((response) => {
          //术前照字符串转数组
          var data = response.data.Data[0];
          //UserType:用户类型（0：用户 1：医院 2：医生,5达人，7圈主，9官方）
          //posttype为1：咨询帖（IsQFA区分求方案）；为2：分享帖（IsOfficial区分官方帖；IsPopScience区分科普贴）
          if(this.$route.query.PostType==2&&parseInt(data.IsOfficial)!=1){//分享帖分享
            this.currentView = journey;
            var count = 1;
            data.ImgUrl3 = data.ImgUrl3.split(',');
            for ( var  sub in data.SubLogs){//日记数据转换
              data.SubLogs[sub].num = count++;
              data.SubLogs[sub].CreateOn = data.SubLogs[sub].CreateOn.split(' ')[0];
              if(data.SubLogs[sub].ImgUrls!=''){
                data.SubLogs[sub].ImgUrls = data.SubLogs[sub].ImgUrls.split(',');
              }
            }
          }else if(this.$route.query.PostType==1){//求方案
            this.currentView = solution;
          }else if(parseInt(data.IsOfficial)==1){//官方帖子
            this.currentView = office;
          }
          this.pageData = data;
          console.log(response);
          Indicator.close();//关闭遮罩；
        })
        .catch(function(response) {
          console.log(response)
        })
      axios.get(common.host_url+'post.json?action=GetPostComment&pageSize=10&fromId=&Direction=1&'+paramStr,{})
        .then((response)=>{
          for(var com in response.data.Data){
            response.data.Data[com].SubReplies2 = response.data.Data[com].SubReplies.slice(0,3);
          }
          console.log("回复数据");
          console.log(response);
          this.commentData = response.data.Data;
        })
        .catch(function(response) {
          console.log(response)
        })
    },
    methods:{
      allComment:function (num) {
        this.commentAll = !this.commentAll;
        if(this.commentAll){
          this.commentData[num].SubReplies2 = this.commentData[num].SubReplies;
        }else {
          this.commentData[num].SubReplies2 = this.commentData[num].SubReplies.slice(0,3);
        }
      }
    },
    components:{
      downloadFooter,journey,solution,office
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .post{width: 100%; max-width: 750px;margin: 0 auto;}
  .child-replay .show-more img{width: 0.11rem;}
  .child-replay .show-more{width: 100%;text-align: center;font-size: 0;}
  .child-replay p:last-child{margin-bottom: 0;}
  .child-replay p{margin-bottom: 0.15rem;line-height: 0.13rem}
  .child-replay{width: 100%;background-color: #f4f4f4;padding: 0.1rem;box-sizing: border-box;}
  .comment-content{margin-left: 0.39rem;margin-top: 0.1rem;}
  .journal-header .type-mark{width: 0.35rem;margin-left: 0.05rem;vertical-align: middle;}
  .journal-header .header-pic{width: 0.35rem;height:0.35rem;background-size:cover;background-position:center;
    margin-right: 0.05rem;border-radius: 0.35rem;}
  .journal-header{width: 100%;margin-top: 0.15rem;height:0.35rem;line-height: 0.35rem;display: flex;justify-content: flex-start;align-items: center;}
  .comment-item{width: 92%;margin: auto;padding-bottom: 0.1rem}
  .all-comment{width: 92%;height: 0.4rem;line-height: 0.4rem;background-color: #f4f4f4;padding: 0 0.15rem}
  .all-comment img{width: 0.2rem;vertical-align: middle}
  .post-header{width: 92%;height: 0.65rem;margin: 0 auto;}
  .user-face{float:left;width: 0.35rem;height:0.35rem;background-size:cover;background-position: center;margin: 0.15rem 0.15rem 0.15rem 0;border-radius: 0.35rem;}
  .user-info{float: left;}
  .user-info img{width: 0.35rem;margin-left: 0.15rem;vertical-align: sub;}
  .post-mark{padding-left: 4%;height: 0.54rem;overflow-x: auto;white-space : nowrap;}
  .post-mark span{height: 0.24rem;line-height: 0.54rem ;margin-right: 0.08rem;background-color: #f4f4f4;
                  border-radius: 0.24rem;padding: 0.05rem 0.1rem;}
  .label-count{ width: 92%;height: 0.4rem;margin: auto;}
  .label-count img{width: 0.24rem;vertical-align: middle;}
  .label-count span{margin-right: 0.1rem;line-height: 0.4rem;}
</style>
