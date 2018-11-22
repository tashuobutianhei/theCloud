let fs = require('fs');
let async =require('async');
let path =require('path')

var username = ''
var createImg =function (callback) {
    console.log(username)
    fs.mkdir(path.join(__dirname, 'public/'+username+'/img'), function(err) {
        if (err) {
            throw err;
        }
        //console.log('img')
        callback(null,'img')
    });
}

var createDoc=function (callback) {
    fs.mkdir(path.join(__dirname, 'public/'+username+'/doc'), function(err) {
        if (err) {
            throw err;
        }
        //console.log('doc')
        callback(null,'doc')
    });
}
var createRadio =function (callback) {
    fs.mkdir(path.join(__dirname, 'public/'+username+'/radio'), function(err) {
        if (err) {
            throw err;
        }
        //console.log('radio')
        callback(null,'radio')
    });
}
var createVideo =function (callback) {
    fs.mkdir(path.join(__dirname, 'public/'+username+'/video'), function(err) {
        if (err) {
            throw err;
        }
        //console.log('video')
        callback(null,'video')
    });
}


module.exports=function(user){
    username=user;
    return function(callback){
        fs.mkdir(path.join(__dirname, 'public/'+username), function(err) {
            if (err) {
                throw err;
            }else{
                async.series(
                    [createImg, createDoc, createVideo, createRadio],
                    function(err,result){
                        if (err) {
                            console.log(err);
                        }
                        //console.log(result);
                        callback(null,'ok')
                    })
            }
        });
    }

}