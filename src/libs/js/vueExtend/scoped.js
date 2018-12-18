/**
* author：王焕丽
* update：2017年11月29日
* 使vue内元素支持scoped，使scoped样式生效
* 例子<div class="classneme" v-scoped></div>
*/
var install={
    install(Vue) {
        var directiveFun={
            eachChild(el,scoped){
                if(!(el instanceof HTMLElement))return;
                scoped.forEach((name)=>{
                    el.setAttribute(name,"");
                });
                if(el.childNodes.length){
                    for(var i=0;i<el.childNodes.length;i++){
                        directiveFun.eachChild(el.childNodes[i],scoped);
                    }
                }
            },
            getParentScoped(dom,layer){
                function getScoped(dom) {
                    var scoped = [];
                    for (var i = 0; i < dom.attributes.length; i++) {
                        var nodedate = dom.attributes[i];
                        if (nodedate && String(nodedate.nodeName).substr(0, 7) == "data-v-") {
                            scoped.push(nodedate.nodeName);
                        }
                    }
                    return scoped;
                }
                if(!dom)return;
                var domLayer=isNaN(layer)?0:parseInt(layer);
                var scoped=[];
                var parent=dom;
                do{
                    var scopedList=getScoped(parent);
                    scoped=scoped.concat(scopedList);
                    parent=parent.parentNode;
                    domLayer--;
                }while(parent && domLayer>0);
                return scoped;
            }
        };
        Vue.directive('scoped',{
            inserted:function(el){
                var scoped=directiveFun.getParentScoped(el,2);
                if(scoped.length){
                    directiveFun.eachChild(el,scoped);//批量追加
                }
            }
        });
    }
}
export default install;
