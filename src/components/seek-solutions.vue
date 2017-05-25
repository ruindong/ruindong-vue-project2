<!--分享帖求科普-->
<template>
  <div>
    <div v-title>{{pageData.Title}}</div>
    <div class="journal-content">
      <p class="f-15">
        {{pageData.DetailContent}}
      </p>
      <img class="solution-img" v-for="item in pageData.ImgUrl" :src="item"/>
    </div>
  </div>
</template>
<script>
  export default{
    props:['pageData'],
    data(){
      return{

      }
    },
    created () {
        console.log(this.pageData);
      this.pageData.ImgUrl = this.pageData.ImgUrl.split(',');
    },
    methods:{

    },
    components:{
    }
  }
</script>
<style scoped>
  .solution-img{width: 100%; margin-top: 0.1rem;}
  .journal-content p{line-height: 0.23rem}
  .journal-content{width: 92%;margin: auto;padding-top: 0.1rem;}
</style>
