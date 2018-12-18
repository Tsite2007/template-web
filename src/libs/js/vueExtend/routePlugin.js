/*
by:tengma 2018年03月13日
name: route拓展
notes: 修改url上的参数
 */
const addQuery=function(queryDate){
    var query={};
    Object.assign(query,this.$route.query,queryDate);
    this.$router.push({
        path:this.$route.path,
        query:query
    });
};
const delQuery=function(){
    var query={};
    var arg=Array.prototype.slice.call(arguments);
    Object.assign(query,this.$route.query);
    arg.forEach(item=>{
        delete query[item];//删除参数
    })
    this.$router.push({
        path:this.$route.path,
        query:query
    });
};
var install = {
    install(Vue) {
        Vue.mixin({
            beforeCreate() {
                var self=this;
                this.$routePlugin={
                    addQuery:addQuery.bind(self),
                    delQuery:delQuery.bind(self)
                }
            }
        })
    }
}
export default install;
