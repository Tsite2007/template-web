var context =require("../src/libs/interface/context.js");

module.exports = [
    {
        path: context.name + '/login.html',
        name: '/login.html',
        meta: {
            title: '登录',
            author:"XXX"
        },
        component: resolve => resolve(require('./views/login.vue'))
    },
];
