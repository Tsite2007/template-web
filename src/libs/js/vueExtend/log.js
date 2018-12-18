export default {
    install(Vue) {
        Vue.mixin({
            beforeCreate() {
                this.$log = function() {
                    if (process.env.NODE_ENV == "development") {
                        var args = Array.prototype.slice.call(arguments, 0);
                        console.log.apply(null, args);
                    }
                };
            }
        })
    }
}
