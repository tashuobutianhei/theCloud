import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode:'history',
  routes: [
    {
      path:'/',
      component:(resolve) => require(['../components/login'],resolve),
    },
    {
      path: '/index',
      meta:{
        title:'首页'
      },
      component:(resolve) => require(['../components/index'],resolve),
      children:[
        {
          path: '/near',
          meta:{
            title:'首页'
          },
          component:(resolve) => require(['../components/near'],resolve)
        },
        {
          path: '/all',
          meta:{
            title:'首页'
          },
          component:(resolve) => require(['../components/list'],resolve)
        },{
          path: '/doc',
          meta:{
            title:'首页'
          },
          component:(resolve) => require(['../components/list'],resolve)
        },{
          path: '/img',
          meta:{
            title:'首页'
          },
          component:(resolve) => require(['../components/list'],resolve)
        },{
          path: '/video',
          meta:{
            title:'首页'
          },
          component:(resolve) => require(['../components/list'],resolve)
        },{
          path: '/radio',
          meta:{
            title:'首页'
          },
          component:(resolve) => require(['../components/list'],resolve)
        },{
          path: '/photo',
          meta:{
            title:'首页'
          },
          component:(resolve) => require(['../components/list'],resolve)
        },{
          path: '/note',
          meta:{
            title:'首页'
          },
          component:(resolve) => require(['../components/list'],resolve)
        },{
          path: '/trash',
          meta:{
            title:'首页'
          },
          component:(resolve) => require(['../components/list'],resolve)
        }
      ]
    },
    {
      path:'*',
      redirect:'/'
    },
  ]
})
