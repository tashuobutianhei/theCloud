var express = require('express');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');
var path = require('path');
var whichDoc = require('../createWhichDoc');
var mongoose = require('../db.js');
/* GET home page. */
//暂存在images中
var objMUlter= multer({dest:path.join(__dirname,'../public/images')});
router.use(objMUlter.any()) //表示可以接受任何名字的上传文件
router.use(objMUlter.single())

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//删除文件
router.get('/deleteFile',function (req,res,next) {
    res.setHeader('Content-Type', 'text/plain;charset=UTF-8');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.setHeader('Access-Control-Allow-Credentials','true');
    /**req,query格式
     * {
     *      filename:filename
     *      type:type
     * }
     */
    //彻底删除文件
    let filename = req.query.filename;
    let type = req.query.type;
    if(!req.session['user']){
        res.send(400);
    }
    let user = req.session['user'];
    try{
        fs.unlink(path.join(__dirname,'../public/'+user+'/trash/'+filename),function (err,) {
            if(err){
                console.log(err);
                res.end(500);
            }
            mongoose.user.find({username:user},function (err,doc) {
                if(err){
                    console.log(err);
                    req.end(500)
                }
                doc[0].source['trash'].forEach(function (item,index){
                    if(item.file==filename){
                        doc[0].source['trash'].splice(index,1);
                    }
                })
                doc[0].save();
                res.send({res:'ok'})
            })
        })
    }catch (e) {
        console.log(e);
        res.end(500);
    }
})


router.get('/gotoTrash',function (req,res) {
    //放入回收站，不彻底删除
    res.setHeader('Content-Type', 'text/plain;charset=UTF-8');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.setHeader('Access-Control-Allow-Credentials','true');
    /**req,query格式
     * {
     *      filename:filename
     *      type:type
     * }
     */
    let filename = req.query.filename;
    let type = req.query.type;
    if(!req.session['user']){
        //用户未登录，直接返回
        res.end(400);
    }
    let user = req.session['user'];
    var oldPath = path.join(__dirname,'../public/'+user+'/'+type+'/'+filename);
    var newPath = path.join(__dirname,'../public/'+user+'/trash/'+filename);
    console.log(oldPath);
    console.log(newPath);
    fs.rename(oldPath,newPath,function (err) {
        if(err){
            console.log(err);
            res.end(500);
        }else{
            //修改数据库
            mongoose.user.find({username:user},function (err,doc) {
                if(err){
                    console.log(err);
                    res.end(500);
                }else{
                    doc[0].source[type].forEach((item,index,array)=>{
                        if(item.file==filename){
                            doc[0].source['trash'].push(item);
                            array.splice(index,1);
                        }
                    })
                    doc[0].save();
                    res.send({res:'ok'});
                }
            })
        }
    })
})


router.get('/huifu',function (req,res) {
    res.setHeader('Content-Type', 'text/plain;charset=UTF-8');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.setHeader('Access-Control-Allow-Credentials','true');
    /**req,query格式
     * {
     *      filename:filename
     *      type:type
     * }
     */
    try{
        if(!req.session['user']){
            //用户未登录，直接返回
            res.end(400);
        }
        let filename = req.query.filename;
        let type = req.query.type;
        let user =  req.session['user'];
        var oldPath = path.join(__dirname,'../public/'+user+'/trash/'+filename);
        var newPath = path.join(__dirname,'../public/'+user+'/'+type+'/'+filename);

        fs.rename(oldPath,newPath,function (err) {
            if(err){
                console.log(err);
                res.end(500);
            }else{
                //修改数据库
                mongoose.user.find({username:user},function (err,doc) {
                    if(err){
                        console.log(err);
                        res.end(500);
                    }else{
                        doc[0].source['trash'].forEach((item,index,array)=>{
                            if(item.file==filename){
                                doc[0].source[type].push(item);
                                array.splice(index,1);
                            }
                        })
                        doc[0].save();
                        res.send({res:'ok'});
                    }
                })
            }
        })

    }catch (e) {
        console.log(e);
        res.end(500);
    }
})


router.get('/getFile',function (req,res,next) {
    /*
    * type:
    * */
    res.setHeader('Content-Type', 'text/plain;charset=UTF-8');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.setHeader('Access-Control-Allow-Credentials','true');
    try{
        let file=[];
        if(!req.session['user']){
            //用户未登录，直接返回
            res.end(400);
        }
        let user = req.session['user'];
        let whichdoc = req.query.type;
        mongoose.user.find({username:user},function (err,doc) {
            if(err){
                console.log(err);
                req.end(500)
            }
            if(whichdoc=='all'){
                //将所有的文件都进行遍历
                ['doc','img','video','radio'].forEach(function (it,index,array) {
                    doc[0].source[it].forEach(function (item,index,array){
                        file.push({
                            type:it,
                            name:item.name,
                            size:item.size,
                            file:item.file,
                            date:new Date(item.date).getTime()
                        })
                    })
                })
                res.send(file);
            }else if(whichdoc=='trash'){
                //回收站的进行查询
                doc[0].source[whichdoc].forEach(function (item,index,array){
                    file.push({
                        type:whichDoc(path.extname(item.file)),
                        name:item.name,
                        size:item.size,
                        file:item.file,
                        date:new Date(item.date).getTime()
                    })
                })
                res.send(file);
            }else{
                //进行相应文件的遍历
                doc[0].source[whichdoc].forEach(function (item,index,array){
                    file.push({
                        type:whichdoc,
                        name:item.name,
                        size:item.size,
                        file:item.file,
                        date:new Date(item.date).getTime()
                    })
                })
                res.send(file);
            }

        })

    }catch (e) {
        console.log(e)
    }

})

router.get('/getFileByTime',function (req,res,next) {
    res.setHeader('Content-Type', 'text/plain;charset=UTF-8');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.setHeader('Access-Control-Allow-Credentials','true');

    let file=[]
    let user = req.session['user'];

    mongoose.user.find({username:user},function (err,doc) {
            if(err){
                console.log(err);
                req.end(500)
            }
            //将所有的文件都进行遍历
            ['doc','img','video','radio'].forEach(function (it,index,array) {
                doc[0].source[it].forEach(function (item,index,array){
                    if(file.length<5){
                        file.push({
                            type:it,
                            name:item.name,
                            size:item.size,
                            file:item.file,
                            date:new Date(item.date).getTime()
                        })
                        //从小到大排序,数组第一个为最久的
                        file.sort((a,b)=>{
                            console.log(new Date(a.date).getTime())
                            if(new Date(a.date).getTime()<new Date(b.date).getTime()){
                                return -1
                            }else{
                                return 1
                            }
                        })
                    }else{
                        if(new Date(item.date).getTime()<new Date(file[0].date).getTime()){
                            //排除
                        }else{
                            //更换
                            file.shift();
                            file.unshift({
                                type:it,
                                name:item.name,
                                size:item.size,
                                file:item.file,
                                date:new Date(item.date).getTime()
                            })
                            //从小到大排序,数组第一个为最久的
                            file.sort((a,b)=>{
                                if(new Date(a.date).getTime()<new Date(b.date).getTime()){
                                    return -1
                                }else{
                                    return 1
                                }
                            })
                        }
                    }
                })
            })
            res.send(file);
    })


})

router.post('/upfile', function (req, res, next) {
    res.setHeader('Content-Type', 'multipart/form-data;charset=UTF-8');
    //服务器支持的请求方法
    res.setHeader('Access-Control-Allow-Methods','POST, GET, OPTIONS,DELETE,PUT');
    //服务器所支持的域名
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    //是否允许携带cookie，如果为true那么origin部分就不能为*
    res.setHeader('Access-Control-Allow-Credentials','true');
    //res.setHeader('Access-Control-Allow-Headers','')
    try{
        //进行移动和重命名
        // console.log(req.session['user'])
        // console.log(req.files)
        if(!req.session['user']){
            res.send({res:'no'});
        }
        var whichdoc = whichDoc(path.extname(req.files[0].originalname));
        var newPath = path.join(__dirname,'../public/'+req.session['user']+'/'+whichdoc+'/')+req.files[0].filename+path.extname(req.files[0].originalname);
        fs.rename(req.files[0].path,newPath,function (err) {
            if(err){
                res.send({res:'no'})
            }else {
                mongoose.user.find({username:req.session['user']},function (err,doc) {
                    console.log(doc)
                    doc[0].source[whichdoc].push({
                        name:req.files[0].filename,
                        file:req.files[0].filename+path.extname(req.files[0].originalname),
                        size:req.files[0].size,
                        date:new Date().getTime()
                    })
                    doc[0].save()
                    res.send({res:'ok'})
                })
            }
        })
    }catch (e) {
        console.log(e)
        res.end({res:'no'})
    }

})

// catch 404 and forward to error handler
router.use(function(req, res, next) {
    //进行options的时候，进行检测功能加入cors部分
    //本次接受媒体类型
    res.setHeader('Content-Type', 'multipart/form-data;charset=UTF-8');
    //服务器支持的请求方法
    res.setHeader('Access-Control-Allow-Methods','POST, GET, OPTIONS,DELETE,PUT');
    //服务器所支持的域名
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    //是否允许携带cookie，如果为true那么origin部分就不能为*
    res.setHeader('Access-Control-Allow-Credentials','true');
    //res.setHeader('Access-Control-Allow-Headers','')
    if(req.method=='OPTIONS'){
        try {
            next()
        }catch (e) {
            console.log(e)
        }
    }else {
        next(createError(404));
    }
});


module.exports = router;
