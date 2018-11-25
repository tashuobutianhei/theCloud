# theCloud
咸鱼网盘

#### 前端进行Vue-cli进行相应搭建，使用vueX进行状态管理，使用vue-router进行路由控制
完成功能有：用户登录注册，文件的上传，下载，加入回收站，清空回收站，删除文件，回复文件等基础功能

#### 后端使用node+express进行服务器搭建，使用mutrel进行文件处理，fs模块进行文件操作，router进行路由设置，为基础功能提供服务

#### 数据库采用mongodb+mongoose进行操作，相应建立文档如下

(```)
let userSchema = new Schema({
    username : { type: String },
    password: {type: String},
    email: {type: String},
    source:{
            img:[{
                name:{type:String},
                file:{type:String},
                size:{type:String},
                date:{type:Date}
            }],
            doc:[{
                name:{type:String},
                file:{type:String},
                size:{type:String},
                date:{type:Date}
            }],
            video:[{
                name:{type:String},
                file:{type:String},
                size:{type:String},
                date:{type:Date}
            }],
            radio:[{
                name:{type:String},
                file:{type:String},
                size:{type:String},
                date:{type:Date}
            }],
            trash:[{
                name:{type:String},
                file:{type:String},
                size:{type:String},
                date:{type:Date},
                beforeType:{type:String},
            }]
        }
},{
    timestamps: {
            createdAt: 'created',
            updatedAt: 'updated'
    }
});

(```)
