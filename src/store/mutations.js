export default {
    //设置用户信息
    setUserInfo(state, config) {
        for (var objName in config) {
            state.userInfo[objName] = config[objName];
        }
    }
}
