HTMLElement.prototype.getOffset=function(stopSelectorElement){
    var offsetParent=this.offsetParent;
    var top=this.offsetTop,
        left=this.offsetLeft;
    while (offsetParent) {
        top+=offsetParent.offsetTop;
        left+=offsetParent.offsetLeft;
        offsetParent=offsetParent.offsetParent;
        if(stopSelectorElement && offsetParent==stopSelectorElement){
            break;
        }
    }
    return {top:top,left:left,width:this.offsetWidth,height:this.offsetHeight};
}
//日期对象扩展
Date.prototype.format = function(format) {
    var formatData=format;
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(), //day
        "h+": this.getHours(), //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        "S": this.getMilliseconds() //millisecond
    };
    if (/(y+)/.test(formatData)) {
        formatData = formatData.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(formatData)) {
            formatData = formatData.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return formatData;
};
//获取中文长度，中文占用两个字符
String.prototype.charLength=function(){
    var len=0;
    for (var i = 0; i < this.length; i++) {
        if (this.substr(i,1).match(/[^\x00-\xff]/ig)){
            len += 2;
        }else {
            len += 1;
        }
    }
    return len;
}
//截取文本，中文占用两个字符
String.prototype.subchar=function(_length,_suffix){
    var value=this,len = 0; //字符长度，汉字占有2个字节，英文占有1个字节
    var suffix=(_suffix?_suffix:"");
    for (var i = 0; i < value.length; i++) {
        if (value.substr(i,1).match(/[^\x00-\xff]/ig)){
            len += 2;
        }else {
            len += 1;
        }
        if(len>=_length){
            return value.substr(0,i+1-(len>_length?1:0))+suffix;
        }
    }
    return value;
}
export default {};
