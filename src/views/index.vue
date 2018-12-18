<!--  by: hlwang 2018年11月08日
    name: 入口路由
    notes: 登录后根据路由进行分发
-->
<template>
    <div>
        <router-view></router-view>
    </div>
</template>
<script>
    //import url from "@/libs/interface/public.js";
    export default {
        props: {
            firstRouter: {
                type: Object
            }
        },
        mounted() {
            this.$router.replace({name: "/login.html"});
        }
    }
</script>
<style>

</style>
