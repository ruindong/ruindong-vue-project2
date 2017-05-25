// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'mint-ui/lib/style.css'
Vue.config.productionTip = false;
Vue.directive('title', {
	inserted: function (el, binding) {
		document.title = el.innerText;
		el.remove()
	}
});
Vue.filter('strLimit', function (value) {
  if(value.length>12){
    value = value.substring(0,12)+'...'
  }
  return value;
});
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
