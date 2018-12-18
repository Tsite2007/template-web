import 'babel-polyfill';
import Vue from 'vue';
import 'vuex';
import iView from 'iview';
import VueRouter from 'vue-router';
import store from './store/index.js';
import 'iview/dist/styles/iview.css';
import "./libs/css/public.less";
import "./libs/js/public.js";
const routers = require("./router.js");

import ajax from "./libs/js/vueExtend/ajax.js";
import download from "./libs/js/vueExtend/download.js";
import routePlugin from "./libs/js/vueExtend/routePlugin.js";
import loadingView from "./libs/js/vueExtend/loadingView";
import log from "./libs/js/vueExtend/log.js";
import eventBus from "./libs/js/vueExtend/eventBus.js";
import scoped from "./libs/js/vueExtend/scoped.js";
import index from "./views/index.vue";

//取消 Vue 所有的日志与警告
Vue.config.silent = true;
Vue.use(VueRouter);
Vue.use(iView);
Vue.use(ajax);
Vue.use(scoped);
Vue.use(download);
Vue.use(routePlugin);
Vue.use(loadingView);
Vue.use(eventBus);
Vue.use(log);//输出console；生产环境会自动屏蔽

//设置加载条的高度
iView.LoadingBar.config({
    height: 3
});

let router = new VueRouter({
    routes: routers,
    mode: "history"//history
});
var firstRouter=null;//第一次访问的路由

window.router=router;

router.beforeEach((to, from, next) => {
    if (!firstRouter) {
        firstRouter = to;
        next(false);
    }else{
        next();
    }
});

window.WebSiteApp = new Vue({
    el: '#app',
    router: router,
    store: store,
    render: (h) => {
        return h(index,{
            props: {
                firstRouter: firstRouter
            }
        });
    }
});
