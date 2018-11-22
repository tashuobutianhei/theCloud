// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import vuex from 'vuex';

Vue.use(vuex);
Vue.use(iView);
Vue.config.productionTip = false

const store = new vuex.Store({
  state:{
    size:'',  //已用的空间
    isLog:false,
    user:'',
    source:{
      near:[],
      all:[],
      img:[],
      doc:[],
      video:[],
      radio:[]
    },
    checkList:0,//选中的个数
    ListData:[] //选中的信息
  },
  mutations:{
    changeSize(state,it){
      state.size=it
    },
    changeListData(state,it){
      console.log(it)
      if(it.type=='push'){
        state.ListData.push(it.data);
      }else if(it.type=='pop'){
        let theindex = '';
        state.ListData.forEach(function (item,index) {
          if(item.filename==it.data.filename){
            theindex = index
          }
        })
        state.ListData.splice(theindex,1);
      }else if(it.type=='reset'){
        state.checkList=[]
      }
    },
    check(state,it){
      if(it.type=='reset'){
        state.checkList=0;
      }else if(it.type=='add'){
        state.checkList++;
      }else if(it.type=='sub'){
        state.checkList--;
      }
    },
    login(state,it){
      state.isLog=true;
      state.user=it
    },
    out(state){
      state.isLog=false;
      state.user=''
    },
    updateSource(state,it){
      console.log(it)
      if(it.type=='img'){
        state.source.img=it.files
      }else if(it.type=='doc'){
        state.source.doc=it.files
      }else if(it.type=='video'){
        state.source.video=it.files
      }else if(it.type=='radio'){
        state.source.radio=it.files
      }else if(it.type=='all'){
        state.source.all=it.files;
        ['img','doc','video','radio'].forEach(function (item,index,array) {
          state.source[item]=[];
        })
        it.files.forEach(function (item,index,array) {
          Array.prototype.push.call(state.source[item.type],item);
        })
      }else if(it.type=='near'){
        state.source.near=it.files;
      }else if(it.type=='trash'){
        state.source.trash=it.files;
      }
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
