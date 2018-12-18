import Vue from "vue";
var eventVue = new Vue();
var install = {
    install(Vue) {
        Vue.mixin({
            beforeCreate() {
                this.$eventBus = eventVue;
            }
        })
    }
}
export default install;
