<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  import axios from 'axios';
  axios.defaults.withCredentials=true;

export default {
  name: 'App',
  created(){
    let that= this
    axios.get('http://localhost:3000/users/isLog').then((res)=>{
      if(res.data.res=='ok'){
        that.$store.commit("login",{username:res.data.username});
        that.$store.commit('changeSize',res.data.size);
        that.$router.replace('/index');
      }else{
        console.log(res)
      }
    }).catch((err)=>{
      console.log(err)
    })
  }
}
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    height: 100%;
  }
  html,body{
    height: 100%;
  }
</style>
