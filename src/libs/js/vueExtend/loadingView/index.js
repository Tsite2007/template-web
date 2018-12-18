/**
* author：马腾
* update：2017年11月29日
* loading状态效果
* 显示window.loadingView.show("loading名")
* 隐藏window.loadingView.hide("loading名")
* 注意：勿同时执行相同名称的loadingView
*/
require("./style.less");
window._loadingViewArr = [];
var animateTimer=0;
function createdView(){
    var loadingView=document.createElement("div");
    loadingView.className = "loadingView animated fadeOut";
    var frame = window.document.createElement("div");
    frame.className = "loadingViewFrame animated";
    frame.innerHTML='<div class="loadingBox1 loadingBox"></div>\
                      <div class="loadingBox2 loadingBox"></div>\
                      <div class="loadingBox4 loadingBox"></div>\
                      <div class="loadingBox3 loadingBox"></div>'
    loadingView.appendChild(frame);
    window.document.body.appendChild(loadingView);
    return loadingView;
}
function addClass(className){
    var classNameArr=this.className.replace(/[ ]+/g,",").split(",");
    var index = classNameArr.indexOf(className);
    if(index<0){
        classNameArr.push(className);
    }
    this.className=classNameArr.join(" ");
}
function removeClass(className){
    var classNameArr=this.className.replace(/[ ]+/g,",").split(",");
    var index = classNameArr.indexOf(className);
    if(index>=0){
        classNameArr.splice(index,1);
    }
    this.className=classNameArr.join(" ");
}
function css(key,value){
    if(typeof key ==="string"){
        if(value !==undefined){
            this.style[key]=value;
            return;
        }else{
            var style=this.style[key];
            if(!style){
                style=window.getComputedStyle ? window.getComputedStyle(this,null)[key] :this.currentStyle[key];
            }
            return style;
        }
    }else if(typeof key=="object"){
        for(var name in key){
            try {
                this.style[name]=key[name];
            } catch (e) {
                console.log(e);
            }
        }
    }
}
var install={
    install(Vue) {
        var node=createdView();
        var showHide=function (_name, _isShow) {
            if (!_name) return null;
            let loadingId = _name;
            var index = window._loadingViewArr.indexOf(loadingId);
            if (index >= 0) {
                if (_isShow) return true;
                window._loadingViewArr.splice(index, 1);
            } else {
                if (_isShow) {
                    window._loadingViewArr.push(loadingId);
                }
            }
            if(window._loadingViewArr.length){
                window.clearTimeout(animateTimer);
                css.bind(node)("display","block");
                removeClass.bind(node)("fadeOut");
                addClass.bind(node)("fadeIn");
            }else{
                removeClass.bind(node)("fadeIn");
                addClass.bind(node)("fadeOut");
                window.clearTimeout(animateTimer);
                animateTimer=window.setTimeout(()=>{
                    css.bind(node)("display","none");
                },1000);
            }
            return window._loadingViewArr.length > 0;
        }
        var loadingView = window.loadingView={
            show(_name) {
                return showHide(_name, true);
            },
            hide(_name) {
                return showHide(_name, false);
            }
        }
        Vue.mixin({
            beforeCreate() {
                this.$loadingView = loadingView;
            },
            destroyed() {
            }
        })
    }
}
export default install;
