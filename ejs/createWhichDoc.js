module.exports=function (extname) {
    console.log('扩展名')
    console.log(extname)
    if(extname=='.jpg'||extname=='.JPG'
        ||extname=='.png'||extname=='.PNG'
        ||extname=='.jpeg'||extname=='.JPEG'
        ||extname=='.gif'||extname=='.GIF'
        ||extname=='.bmp'||extname=='.BMP'
        ||extname=='.psd'||extname=='.PSD'){
        return 'img'
    }else if(extname=='.mp3'||extname=='.MP3'
        ||extname=='.wma'||extname=='.WMA'
        ||extname=='.ogg'||extname=='.OGG'
        ||extname=='.wav'||extname=='.WAV'
        ||extname=='.midi'||extname=='.MIDI'
        ||extname=='.mac'||extname=='.MAV'){
        return 'radio'
    }else if(extname=='.wmv'||extname=='.WMV'
        ||extname=='.avi'||extname=='.AVI'
        ||extname=='.mpg'||extname=='.MPG'
        ||extname=='.rm'||extname=='.RM'
        ||extname=='.rmvb'||extname=='.RMVB'
        ||extname=='.mov'||extname=='.MOV'
        ||extname=='.dat'||extname=='.DAT'
        ||extname=='.3gp'||extname=='.3GP'
        ||extname=='.flv'||extname=='.FLV'){
        return 'video'
    }else{
        return 'doc'
    }
}