var express = require('express');
var mongoose = require('../db.js');
var cookoeParser = require('cookie-parser')
var cookieSession = require('cookie-session');
var createDoc = require('../createDoc')
var async = require('async')

var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login',function (req, res, next) {
    res.setHeader('Content-Type', 'text/plain;charset=UTF-8');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.setHeader('Access-Control-Allow-Credentials','true');
    mongoose.user.find({
        username:req.query.username
    },function (err,doc){
        if(doc.length==0){
            res.send({res:'no'});
        }else{
            if(doc[0].password==req.query.password){
                req.session['user']=req.query.username;
                res.send({res:'ok'});
            }else{
                res.send({res:'no'});
            }
        }
    })
});

router.get('/isLog',function (req,res,next) {
    res.setHeader('Content-Type', 'text/plain;charset=UTF-8');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.setHeader('Access-Control-Allow-Credentials','true');
    console.log(req.session)

    if(req.session['user']){
        let size=0;
        mongoose.user.find({username:req.session['user']},function (err,doc) {
            if(err){
                console.log(err);
                res.end(500);
            }
            ['doc','img','video','radio'].forEach(function (it,index,array) {
                doc[0].source[it].forEach(function (item,index,array){
                   size+=(item.size-0);
                })
            })
            res.send({
                res:'ok',
                username:req.session["user"],
                size:size
            });
        })

    }else{
        res.send({res:'no'});
    }
})

router.get('/outLogin',function (req,res,next) {
    res.setHeader('Content-Type', 'text/plain;charset=UTF-8');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.setHeader('Access-Control-Allow-Credentials','true');
    req.session['user']='';
    res.send({res:'ok'});
})

router.get('/reg',function (req, res, next) {
    res.setHeader('Content-Type', 'text/plain;charset=UTF-8');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.setHeader('Access-Control-Allow-Credentials','true');

    //注册同时创建每个人的静态文件
    async.parallel([function (callback) {
        new mongoose.user({
            username:req.query.username,
            password:req.query.password,
            email:req.query.email
        }).save(function(err,doc){
            if(err){
                console.log(err);
            }else {
                callback(null,'ok')
            }
        });
    },createDoc(req.query.username)],function (err,result) {
        if(err){
            console.log(err)
        }else{
            console.log(result);
            if(result[0]=='ok'&&result[1]=='ok'){
                res.send({res:'ok'})
            }
        }
    })
});

//检查用户名是否被注册
router.get('/checkusername',function (req,res,next) {
    res.setHeader('Content-Type', 'text/plain;charset=UTF-8');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.setHeader('Access-Control-Allow-Credentials','true');
    console.log(req.query.username)
    mongoose.user.find({
        username:req.query.username
    },function (err,doc){
        console.log(doc)
        if(doc.length==0){
            res.send({res:'ok'});
        }else{
            res.send({res:'no'});
        }
    })
})
//检查邮箱是否被注册
router.get('/checkemail',function (req,res,next) {
    res.setHeader('Content-Type', 'text/plain;charset=UTF-8');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.setHeader('Access-Control-Allow-Credentials','true');

    mongoose.user.find({
        email:req.query.email
    },function (err,doc){
        console.log(doc)
        if(doc.length==0){
            res.send({res:'ok'});
        }else{
            res.send({res:'no'});
        }
    })

})


module.exports = router;
