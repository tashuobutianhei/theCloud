let mongoose = require('mongoose');
//连接数库库
mongoose.connect("mongodb://localhost:27017/my", function(err) {
    if(err){
        console.log('连接失败');
    }else{
        console.log('连接成功');
    }
});

let Schema = mongoose.Schema;
//建立用户模式
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
//创建模式；
let user = mongoose.model('user',userSchema)

//  new user({
//     username:'lizilong',
//     password:'123456long',
//     email:'1132256103@qq.com'
// }).save(function (err, res) {
//     if (err) {
//         console.log("Error:" + err);
//     }
//     else {
//         console.log("Res:" + res);
//     }
// });

module.exports  = {mongoose,user};