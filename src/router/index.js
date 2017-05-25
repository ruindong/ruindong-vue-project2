import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'
import sharePost from '@/components/sharePost'
import SpecialSubject from '@/components/SpecialSubject'
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index//第一个页面
    },
    {
      path: '/sharePost',
      name: 'sharePost',
      component: sharePost//第一个页面
    },
    {
      path: '/SpecialSubject',
      name: 'SpecialSubject',
      component: SpecialSubject//第一个页面
    }
  ]
})
