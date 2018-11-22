<template>
    <div>
      <layout>
        <header style="background-color: white;font-size: 20px;font-weight: bold;">最近</header>
        <content style="background-color: white">
          <div
            :key="index"
            style="display: flex;flex-direction: column;align-items: left;width: 80%;margin: 15px auto"
            v-for="(item,index) in nearList">
            <Time :time="item.date" style="font-size: 20px;font-weight: bold;"/>
            <item :item="item"></item>
          </div>
        </content>
      </layout>
    </div>
</template>

<script>
    import item from '../components/item';
    import axios from 'axios';
    axios.defaults.withCredentials=true;

    export default {
        name: "near",
        components:{item},
        mounted(){
          axios.get('http://localhost:3000/index/getFileByTime').then((res)=>{
            this.$store.commit('updateSource',{
              type:'near',
              files:res.data
            });
            this.nearList=this.$store.state.source.near;
            console.log(this.nearList)
          }).catch((err)=>{
            console.log(err)
          })
        },
        data(){
          return{
            nearList:''
          }
        }
    }
</script>

<style scoped>

</style>
