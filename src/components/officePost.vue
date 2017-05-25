<template>
  <div>
    <div v-title>{{pageData.Title}}</div>
    <p class="office-title c-4e f-16">{{pageData.Title}}</p>
    <div class="journal-content" v-html="pageData.DetailContent"></div>
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
      this.pageData.DetailContent = this.pageData.DetailContent.replace(/<img/g,'<img style="width:100%;"')
    },
    methods:{

    }
  }
</script>
<style scoped>
  .office-title{width: 92%;margin: auto;padding-top: 0.1rem;font-weight: bold;}
  .journal-content div img{width: 100%!important;}
  .journal-content div img{height: 100% !important;}
  .journal-content{width: 92%;margin: auto;padding-top: 0.1rem;font-size: 0.15rem;overflow-x: hidden;}
</style>
