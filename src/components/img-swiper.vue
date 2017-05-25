<template>
  <div class="swipe" v-if="imgShow">
    <mt-swipe class="my-swipe" :speed="300" :continuous="true" :auto="0" :showIndicators="true" :defaultIndex="imgIndex">
      <mt-swipe-item v-for="(item,index) in imgData" :key="index" class="slide">
        <div class="img-parent" @click="closeImages"><img :src="item"/></div>
      </mt-swipe-item>
    </mt-swipe>
  </div>
</template>
<script>
  import { Swipe, SwipeItem } from 'mint-ui';
  export default{
    props:['imgData','imgShow','imgIndex'],
    data(){
      return{

      }
    },
    methods:{
      closeImages:function () {
        this.$emit('childTellMe',false);
      }
    },
    components:{
      'mt-swipe':Swipe, 'mt-swipe-item':SwipeItem
    }
  }
</script>
<style scoped>
  .swipe{position: fixed;top: 0;width: 100%;height: 100%;max-width: 750px;margin: 0 auto; background-color: #000000;}
  .my-swipe {
    height: 100%;
    color: #fff;
    font-size: 30px;
    text-align: center;
  }
  .img-parent{
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
  }
  .img-parent img{
    width: 100%;
  }
</style>
