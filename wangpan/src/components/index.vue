<template>
  <Layout style="background-color: white;height: 100%" class="all">

    <Sider style="background-color: white;">
      <layout style="height: 100%">
            <header>
              <div class="logo">
                <Icon type="md-cloud-download" />
                <span style="color: black">咸鱼网盘</span>
              </div>

              <Input v-model="input"
                     icon="ios-search"
                     placeholder="搜索全部"
                     style="width: 80%;margin-bottom: 10px"
              />
            </header>

            <Conent>
              <Menu  active-name="1"
                     @on-select="changeOne"
                     style="width: 100%;background-color: rgb(245,247,249)">
                  <MenuItem name="near" to="/near" @click>
                    <Icon type="ios-clock" />
                    最近
                  </MenuItem>
                <hr style="margin: 10px auto;width: 80%">
                  <MenuItem name="all" to="/all">
                    <Icon type="md-document" />
                    全部
                  </MenuItem>
                  <MenuItem name="doc" to="/doc">
                    <Icon type="logo-buffer" />
                    文档
                  </MenuItem>
                  <MenuItem name="img" to="/img">
                    <Icon type="md-image" />
                    图片
                  </MenuItem>
                  <MenuItem name="video" to="/video">
                    <Icon type="logo-youtube" />
                    视频
                  </MenuItem>
                  <MenuItem name="radio" to="/radio">
                    <Icon type="md-musical-notes" />
                    音乐
                  </MenuItem>
                <hr style="margin: 10px auto;width: 80%">
                  <MenuItem name="photo" to="/photo">
                    <Icon type="ios-bowtie" />
                    照片
                  </MenuItem>
                  <MenuItem name="note" to="/note">
                    <Icon type="md-create" />
                    笔记
                  </MenuItem>
                  <MenuItem name="trash" to="/trash">
                    <Icon type="ios-trash" />
                      回收站
                  </MenuItem>
              </Menu>
              <Progress :percent="percent" status="active" style="padding-top: 50px" :stroke-width="5">
                <span>已用容量{{size}}/10G</span>
                <Icon type="checkmark-circled"></Icon>
              </Progress>
            </Conent>
      </layout>
    </Sider>
    <Layout>
      <Header style="background-color: white">
          <Row type="flex" justify="space-between">
            <Col span="6" >
              <div style="color: #2d8cf0">
              <Dropdown style="margin-left: 20px">
                <Button type="primary" icon="ios-cloud-upload">
                  上传
                  <Icon type="ios-arrow-down"></Icon>
                </Button>
                <DropdownMenu slot="list">
                  <DropdownItem>
                    <Upload action="http://localhost:3000/index/upfile"
                            :on-success="handleSuccess"
                            :on-error="handleError"
                            :on-progress="handleProgress"
                            :show-upload-list=false
                            :with-credentials=true>
                      <Icon type="md-document"></Icon>文件
                    </Upload>
                  </DropdownItem>
                  <DropdownItem>
                    <Upload
                      action="//jsonplaceholder.typicode.com/posts/">
                      <Icon type="ios-folder" />文件夹
                    </Upload>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <Dropdown style="margin-left: 20px">
                <Button  icon="md-add" >
                  新建
                  <Icon type="ios-arrow-down"></Icon>
                </Button>
                <DropdownMenu slot="list">
                  <DropdownItem>
                    <Upload action="//jsonplaceholder.typicode.com/posts/">
                      <Icon type="ios-folder" />文件夹
                    </Upload>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
            </Col>
            <Col span="6" v-if="$store.state.checkList!=0">
              <Button type="error" @click="delet">删除</Button>
              <Button type="primary" v-if="$route.path!='/trash'">下载</Button>
              <Button type="primary"
                      @click="huifu"
                      v-else="$route.path!='/trash'">复原</Button>
            </Col>
            <Col span="6" >
              <div>
                <span class="name" @click="play">
                  {{$store.state.user.username}}
                  <Icon v-if=" myValue" type="md-arrow-dropup" />
                  <Icon v-else type="md-arrow-dropdown"/>
                </span>
                <Card v-show="myValue">

                  <Layout>
                    <Header style="background-color: rgb(247,248,249)">
                      <Row>
                        <Col span="12"><Avatar shape="square" icon="ios-person"  size="large" /></Col>
                        <Col span="12">
                            <span> {{$store.state.user.username}}</span>
                        </Col>
                      </Row>
                    </Header>
                    <Content>
                      <CellGroup >
                        <p style="font-size: 10px">未开通会员 <span style="color: indianred"> 开通</span></p>
                        <Cell title="下载客户端"  />
                        <Cell title="帮助与反馈"  />
                        <Cell title="安全与隐私"  />
                        <p style="cursor: pointer" @click="outlogin">退出登录</p>
                      </CellGroup>
                    </Content>
                  </Layout>
                </Card>
              </div>
            </Col>
          </Row>
      </Header>
      <Content style="background-color: white">
        <hr style="margin: 10px auto;width: 100%">
        <router-view></router-view>
      </Content>
    </Layout>
  </Layout>
</template>

<script>
    import axios from 'axios';
    axios.defaults.withCredentials=true;

    export default {
        name: "index",
        created(){
          let that= this
          axios.get('http://localhost:3000/users/isLog').then((res)=>{
            if(res.data.res=='ok'){
              that.$store.commit("login",{username:res.data.username})
            }else{
              this.$router.replace('/')
            }
          }).catch((err)=>{
            console.log(err)
          })
        },
        computed:{
          checkList(){
            return this.$store.state.checkList;
          },
          size(){
            let size = this.$store.state.size;
            if(size/1024<1){
              return '小于1KB'
            }else if(size/1024<1024){
              return Math.floor(size/1024)+'KB'
            }else if(size/1024>1024&&size/1024/1024<1024){
              return Math.floor(size/1024/1024)+'M'
            }else {
              return Math.floor(size/1024/1024/1024)+'G'
            }
          },
          percent(){
            let all = 10*1024*1024*1024;
            if(Math.floor(this.$store.state.size/all)*100<1){
              return 1;
            }else{
              return Math.floor(this.$store.state.size/all)*100
            }
          }
        },
        watch:{
          checkList(newQuestion,oldQuestion){

          }
        },
        data(){
          return{
            input:'',
            myValue:false,
            checkData:[]
          }
        },
        methods:{
          huifu(){
            this.$store.state.ListData.forEach(function (item) {
              axios.get('http://localhost:3000/index/huifu',{
                params:{
                  filename:item.filename,
                  type:item.type
                }
              }).then((res)=>{
                console.log(res)
                if(res.data.res=='ok'){
                  that.$Message.success('恢复成功！');
                }else{
                  that.$Message.error('恢复失败，请刷新后重试！');
                }
              })
            })
          },
          delet(){
            if(this.$route.path=='/trash'){
              this.$store.state.ListData.forEach(function (item) {
                axios.get('http://localhost:3000/index/deleteFile',{
                  params:{
                    filename:item.filename,
                    type:item.type
                  }
                }).then((res)=>{
                  console.log(res);
                  if(res.data.res=='ok'){
                    that.$Message.success('删除成功！');
                  }else{
                    that.$Message.error('删除失败，请刷新后重试！');
                  }
                })
              })
            }else{
              this.$store.state.ListData.forEach(function (item) {
                axios.get('http://localhost:3000/index/gotoTrash',{
                  params:{
                    filename:item.filename,
                    type:item.type
                  }
                }).then((res)=>{
                  console.log(res)
                  if(res.data.res=='ok'){
                    that.$Message.success('加入回收站！');
                  }else{
                    that.$Message.error('加入回收站失败失败，请刷新后重试！');
                  }
                })
              })
            }
          },
          //展示信息
          play(){
            this.myValue=!this.myValue
          },
          outlogin(){
            //退出登录
            axios.get('http://localhost:3000/users/outLogin').then((res)=>{
              if(res.data.res=='ok'){
                this.$store.commit('out');
                this.$router.replace('/')
              }
            }).catch((err)=>{
              console.log(err)
            })
          },
          handleSuccess(response, file, fileList){
            this.$Notice.success({
              title: '上传成功',
              desc: ''
            });
          },
          handleProgress(event, file, fileList){
            console.log(event, file, fileList)
          },
          handleError( error, file, fileList){
            console.log(error, file, fileList)
          },
          changeOne(name) {
            //路由切换加载信息
            if (name == 'all'||name=='doc'||name=='img'||name=='radio'||name=='video'||name=='trash') {
              let that = this;
              axios.get('http://localhost:3000/index/getFile', {
                params: {
                  type: name
                }
              }).then((res) => {
                if (res.data.length == 0) {

                } else {
                  that.$nextTick(function () {
                    that.$store.commit('updateSource', {
                      type: name,
                      files: res.data
                    })
                  })
                }
              })
            }
          }
        }
    }
</script>

<style scoped>
  .logo{
    font-size: 30px;
    margin: 15px;
    color: #2d8cf0;
  }
  .name{
    cursor: pointer;
  }
  .all{
    text-align: center;
  }
</style>
