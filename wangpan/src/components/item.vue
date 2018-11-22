<template>
<div :style="background" class="it" >

    <Modal title="View Image" v-model="visible">
      <img :src="img" v-if="visible" style="width: 100%">
    </Modal>

    <Row style="height: 60px;line-height: 60px;font-size: 13px">
      <Col span="8">
        <Checkbox v-model="check" @on-change="change"></Checkbox>
        <img
          @click="display"
          :src="img"
          width="50px"
          style="vertical-align: middle;margin: 0 15px">
        {{item.file}}
      </Col>
      <Col span="6" ><Time :time="item.date"/></Col>
      <Col span="6">{{size}}</Col>
    </Row>
</div>
</template>

<script>
    export default {
        name: "item",
        props:["item"],
        data(){
          return{
            visible:false,
            check:'',
            background:{
              'background-color':'white',
              "color":"black",
            }
          }
        },
        computed:{
          img(){
            if(this.$route.path.slice(1,this.$route.path.length)=='trash'){
              return 'http://localhost:3000/'+this.$store.state.user.username+'/trash/'+this.item.file
            }else{
              return 'http://localhost:3000/'+this.$store.state.user.username+'/'+this.item.type+'/'+this.item.file
            }

          },
          size(){
            if(this.item.size/1024<1){
              return '小于1KB'
            }else if(this.item.size/1024<1024){
              return Math.floor(this.item.size/1024)+'KB'
            }else if(this.item.size/1024>1024&&this.item.size/1024/1024<1024){
              return Math.floor(this.item.size/1024/1024)+'M'
            }else {
              return Math.floor(this.item.size/1024/1024/1024)+'G'
            }
          }
        },
        methods:{
          change(){
            if(this.check){
              this.background["background-color"]="#2d8cf0"
              this.background["color"]="white"
              this.$emit('message',true,{
                filename:this.item.file,
                type:this.item.type
              })
            }else{
              this.background["background-color"]="white"
              this.background["color"]="black"
              this.$emit('message',false,{
                filename:this.item.file,
                type:this.item.type
              })
            }
          },
          display(){
            if(this.item.type=='img'){
              this.visible=true
            }
          }
        }
    }
</script>

<style scoped>

  .it{
    cursor: pointer;
    border-bottom:1px silver solid;
    margin:15px;
    width:90%
  }
</style>
