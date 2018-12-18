//更新日期：2018年11月07日          添加$checkAjax 的回调函数
var axios = require('axios');
var qs = require('qs');

var ajax = (function() {
    var content=this;
    var ajaxAxios = axios.create({
        baseurl: "",
        timeout: 60000,
        withCredentials: true,//跨域携带cookies
        //responsetype: 'json',
        headers: {
            'Cache-Control': 'no-cache'
        },
        validateStatus: function() {
            return true; //错误码交给ajaxCheck去验证
        },
        paramsSerializer: function(params) {
            return qs.stringify(params, {
                arrayFormat: 'brackets'
            })
        },
        transformResponse: [function(data) {
            return data;
        }]
    });
    ajaxAxios.interceptors.request.use((config) => {
        config.source = axios.CancelToken.source(); //设置取消函数
        config.cancelToken = config.source.token;
        //console.log(content);
        content.$options.destroyed.push(un=>{
            //if(config.source)config.source.cancel();
        })
        // if (!config.params) config.params = {};
        // if (config.method === 'post') {
        //   if (!config.data) config.data = {};
        //   if (config.qs === undefined || config.qs) {
        //     config.data = qs.stringify(config.data);
        //   }
        // }
        return config;
    }, (error) => {
        return Promise.reject(error);
    })
    ajaxAxios.interceptors.response.use((response) => {
        response.config.source=null;
        let contentType= (response.headers && response.headers["content-type"])?String(response.headers["content-type"]):"";
        if(contentType.indexOf("application/json")>=0){
            try {
                response.data=JSON.parse(response.data);
            } catch (e) {
                response.data={
                    status:"error",
                    message:"服务端返回数据格式错误！"
                }
            }
        }
        var errStatus = {
            300: "资源已被转移至其他位置",
            301: "请求的资源已被永久移动到新URI",
            302: "请求的资源已被临时移动到新URI",
            305: "请求的资源必须通过代理访问",
            400: "错误资源访问请求",
            401: "资源访问未授权",
            403: "资源禁止访问",
            404: "未找到要访问的资源",
            405: "请更换请求方法",
            406: "无法访问",
            408: "请求超时",
            413: "请求实体过大",
            414: "请求URI过长",
            500: "内部服务器错误",
            501: "未实现",
            503: "服务无法获得",
            504: "接口访问超时"
        }
        var errorMessage="未知的错误类型";
        if(response.status >=300 && errStatus[String(response.status)]){
            errorMessage=errStatus[String(response.status)];
        }else if (response.status ==200) {
            return response;
        }
        response.data={
            status:"error",
            message:errorMessage?errorMessage:"未知的错误类型"
        }
        return response;
    }, function(error) {
        return Promise.reject(error);
    });
    return ajaxAxios;
});

const ajaxCheck = function(response,callback) {
    let contentType= (response.headers && response.headers["content-type"])?String(response.headers["content-type"]):"";
    if(contentType.indexOf("application/json")>=0){
        switch (response.data.status) {
        case "login":
            if(callback instanceof Function && callback("login")===false)return;
            this.$router.replace({
                name:"/login.html"
            })
            break;
        case "location":
            if(callback instanceof Function && callback("location",response.data.message)===false)return;
            document.location=response.data.message;
            document.close();
            break;
        case "error":
            throw(new Error(response.data.message));
            break;
        case "success":
            return response.data.data;
        default:
            throw(new Error("未知的协议格式"));
        }
        return null;
    }
    return response.data;
}
const ajaxError = function(error, errorMessage) {
    this.$message({
        showClose: true,
        message: errorMessage?errorMessage:error.message,
        type: 'error'
    });
    //默认错误处理函数
    this.$log(error);
}

var install = {
    install(Vue) {
        Vue.mixin({
            beforeCreate() {
                this.$ajax = ajax.bind(this)();
                this.$ajaxCheck = ajaxCheck.bind(this);
                this.$ajaxError = ajaxError.bind(this);
            }
        })
    }
}
export {
    ajax,
    ajaxCheck,
    ajaxError
};
export default install;
