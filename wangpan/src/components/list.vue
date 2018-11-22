<template>
  <div class="all">
    <Row style="font-size: 13px" v-if="$store.state.checkList==0">
      <Col span="5">名称</Col>
      <Col span="10">上次修改时间</Col>
      <Col span="1">大小</Col>
    </Row>

    <Row v-else>
      <Col span="5">已选中{{$store.state.checkList}}</Col>
    </Row>

    <p v-show="false">{{$store.state.source}}</p>

    <item
      :item="item"
      :key="index"
      @message="check"
      v-for="(item,index) in ListData"></item>
    <div v-if="ListData.length==0">
      <img src="../../static/img/no.png" style="width:10%;margin-top: 200px">
      <p>没得资源哦</p>
    </div>
    <div v-else>
      <p>共{{ListData.length}}项</p>
    </div>
  </div>


</template>

<script>
    import item from './item'
    export default {
        name: "list",
        components:{item},
        updated(){
          this.init(this.routeit,false)
        },
        data(){
          return{
            ListData:[]
          }
        },
        computed:{
          routeit(){
            return this.$route.path
          }
        },
        watch:{
          routeit(newQuestion,oldQuestion){
            this.init(this.routeit,true)
          }
        },
        methods:{
          check(bool,data){
            //进行选择，选择或者取消
            if(bool){
              this.$store.commit('check',{
                type:'add',
                nun:1
              })
              this.$store.commit('changeListData',{
                type:'push',
                data:data
              })
            }else{
              //将选择的数量进行更新
              this.$store.commit('check',{
                type:'sub',
                nun:-1
              })
              this.$store.commit('changeListData',{
                type:'pop',
                data:data
              })
            }
          },
          init(type,bool){
              this.ListData=this.$store.state.source[type.slice(1,type.length)]
              //重置选择个数
              if(bool){
                this.$store.commit('check',{
                  type:'reset',
                  nun:0
                })
              }

          }
        }
    }
</script>

<style scoped>
.all{
  text-align: center;
}
</style>
