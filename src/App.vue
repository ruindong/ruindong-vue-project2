<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <router-view></router-view>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'app',
  created(){
    window.scale = Math.min(200,document.documentElement.clientWidth/3.75);
    document.getElementsByTagName("html")[0].style.fontSize=window.scale + "px";
  }
}
</script>

<style>
*{
  margin: 0;
  padding: 0;
}
body{
  font-size: 0.16rem;
}
ol, ul, li {
    list-style: none;
}
scrollbar {
  width: 0;
  height: 0;
  color: transparent;
}
::-webkit-scrollbar {
  width: 0;
  height: 0;
  color: transparent;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
/*字体*/
  .f-13{font-size: 0.13rem;}
  .f-14{font-size: 0.14rem;}
  .f-15{font-size: 0.15rem;}
  .f-16{font-size: 0.16rem;}
/*颜色*/
  .c-a4{color: #a4a4a4;}
  .c-4e{color: #4e4e4e;}
  .c-66{color: #666666;}
  .c-red{color: #ff507f;}
/*分割线*/
  .lin-b{border-bottom: 0.01rem solid #ebebeb}
  .lin-bar{ width:100%;height:0.1rem;background-color:#f4f4f4;}
/*文字划线*/
  .xtest{text-decoration: line-through}
</style>
