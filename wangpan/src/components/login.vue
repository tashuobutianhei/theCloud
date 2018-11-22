<template>
  <div class="bg">
  <p style="font-size: 18px;text-align: center">咸鱼网盘（很随意的主页）</p>
  <div class="all">

    <Form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRuleValidate"
      label-position="top"
      class="loginForm"
      v-if="islogin"
    >
      <FormItem label="用户名" prop="username">
        <Input v-model="loginForm.username" placeholder="请输入用户名"></Input>
      </FormItem>

      <FormItem label="密码" prop="password">
        <Input v-model="loginForm.password" placeholder="请输入密码" type="password"></Input>
      </FormItem>

      <FormItem>
        <Button type="primary" @click="handleSubmit('loginForm')">登录</Button>
        <Button @click="handleReset('loginForm')" style="margin-left: 8px">重置</Button>
      </FormItem>
      <p>没有账号？快去<span style="cursor: pointer;color: #3a8ee6" @click="islogin=false">注册</span></p>
    </Form>


    <Form
      ref="regForm"
      :model="regForm"
      :rules="regRuleValidate"
      label-position="top"
      class="regForm"
      v-else
    >
      <FormItem label="用户名" prop="username">
        <Input v-model="regForm.username" placeholder="请输入用户名"></Input>
      </FormItem>

      <FormItem label="密码" prop="password">
        <Input v-model="regForm.password" placeholder="请输入密码" type="password"></Input>
      </FormItem>
      <FormItem label="再一次密码" prop="passwordAgain">
        <Input v-model="regForm.passwordAgain" placeholder="再输一次密码" type="password"></Input>
      </FormItem>

      <FormItem label="密码" prop="email">
        <Input v-model="regForm.email" placeholder="邮箱哦"></Input>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSubmit('regForm')">注册</Button>
        <Button @click="handleReset('regForm')" style="margin-left: 8px">重置</Button>
      </FormItem>
      <p>注册成功？快去<span @click="islogin=true" style="cursor: pointer;color: #3a8ee6">登录</span></p>
    </Form>

  </div>
  </div>
</template>
<style scoped>
  .bg{
    background-image: url("../../static/img/timg2.gif");
    background-repeat: no-repeat;
    background-size: cover;
    position: absolute;
    top:0;
    bottom: 0;
    left: 0;
    right: 0;
    color: white;
  }
  .all{
    padding: 10px;
    width:500px;
    position: absolute;
    left: 50%;
    top:150px;
    margin-left: -250px;
    box-shadow: 0px 0px 1px 1px grey inset;
  }

</style>
<script>
  import axios from 'axios';
  axios.defaults.withCredentials=true;

  export default {
    created(){
      if(this.$store.isLog){
        this.$router.replace('/index');
      }
    },
    data () {
     const checkUsername = (rule, value, callback) => {
        if (/^\w{3,15}$/.test(value)) {
          //验证该用户名是否已经被注册
          axios.get('http://localhost:3000/users/checkusername', {
              params:{
                username:value
              }
          }).then((res)=>{
            if(res.data.res=='ok'){
              callback();
            }else{
              callback(new Error('阿偶，该用户名被注册了哦'))
            }
          })
        }else{
            callback(new Error('用户名为3到5为的数字字母组合'))
        }
      };

      const checkPassword = (rule, value, callback) => {
       if(value.length<6){
            callback(new Error("密码长度大于6位"))
       }else{
            if(/^[a-zA-Z]{6,15}$/.test(value)||/^\d{6,15}$/.test(value)){
              callback(new Error("密码太简单了"))
            }else{
              if(/^[a-zA-Z0-9_-]{6,15}$/.test(value)){
                callback();
              }else{
                callback(new Error("密码允许字母，数字，下划线和—的组合"))
              }
            }
       }
      };

      const checkPasswordCommon= (rule, value, callback) => {
         if(value==this.regForm.password){
           callback();
         }else{
           callback(new Error('两次密码不一样啊！'));
         }
      };

      const checkEmail = (rule, value, callback) => {
        if (/^[a-z\d]+(\.[a-z\d]+)*@([\da-z](-[\da-z])?)+(\.{1,2}[a-z]+)+$/.test(value)) {
              axios.get('http://localhost:3000/users/checkemail', {
                params:{
                  email:value
                }
              }).then((res)=>{
                if(res.data.res=='ok'){
                  callback();
                }else{
                  callback(new Error('阿偶，邮箱被注册了哦，换个吧'))
                }
              })

        }else{
          callback(new Error('emmm,这个邮箱不合适呀'));
        }
      };

      return {
        islogin:true,
        loginForm: {
          username: '',
          password: ''
        },
        regForm:{
          username:'',
          password:'',
          passwordAgain:'',
          email:''
        },
        loginRuleValidate: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '输入密码哦', trigger: 'blur' },
          ]
        },
        regRuleValidate:{
          username: [
            { required: true,validator: checkUsername, trigger: 'blur' }
          ],
          password: [
            { required: true,validator: checkPassword, trigger: 'blur' },
          ],
          passwordAgain: [
            { required: true,validator: checkPasswordCommon, trigger: 'blur' }
          ],
          email: [
            { required: true,validator: checkEmail, trigger: 'blur' },

          ]
        }
      }
    },
    methods: {
      log(){
        let that = this
        axios.get('http://localhost:3000/users/login', {
          params: {
            username:this.loginForm.username,
            password:this.loginForm.password
          }
        })
          .then(function (response){
            console.log(response.data.res)
            if(response.data.res=='ok'){
              that.$store.commit("login",{username:that.loginForm.username})
              that.$Message.success('登录成功!');
              that.$router.push('/index');
            }else {
              that.$Message.success('登录失败，检查用户名密码');
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      reg(){
        let that = this
        axios.get('http://localhost:3000/users/reg', {
          params: {
            username:this.regForm.username,
            password:this.regForm.password,
            email:this.regForm.email
          }
        })
          .then(function (response){
            console.log(response.data.res)
            if(response.data.res=='ok'){
              that.$Message.success('注册成功，快去登录!');
              that.islogin=true;
            }else {
              that.$Message.success('注册失败');
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      handleSubmit (name) {
        if(name=='loginForm'){
          this.$refs[name].validate((valid) => {
            if (valid) {
              this.log();
            } else {
              this.$Message.error('存在错误信息');
            }
          })
        }else{
          this.$refs[name].validate((valid) => {
            if (valid) {
              this.reg();
            } else {
              this.$Message.error('存在错误信息!');
            }
          })
        }
      },
      handleReset (name) {
        this.$refs[name].resetFields();
      }
    }
  }


</script>
