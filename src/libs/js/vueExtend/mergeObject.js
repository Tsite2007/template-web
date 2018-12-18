//合并多级对象
function mergeObject() {
    //可传任意多个参数
    var arg = Array.prototype.slice.call(arguments);
    if (!arg.length) return null;
    if (arg.length == 1) return arg[0];
    var type = null; //首层对象类型
    var object = arg[0]; //基础对象

    for (var i = 1; i < arg.length; i++) {
        let item = arg[i];
        if (isEmpty(object)) {
            object = item;
        } else if (isEmpty(item)) {
            continue;
        } else if (object.constructor != item.constructor) {
            object = item;
        } else if (object.constructor == Object || object.constructor == Array) {
            mergeObj(object, item);
        } else {
            object = item;
        }
    }
    return object;
}
function isEmpty(obj){
    return obj===null || obj===undefined;
}
function mergeObj(souce, dist) {
    var isObject = souce.constructor == Object;
    var data = isObject ? Object.keys(dist) : dist;

    data.forEach((key, index) => {
        var item = isObject ? key : index;
        var souceItem = souce[item];
        var distItem = dist[item];
        if (isEmpty(distItem)) return;
        if (isEmpty(souceItem)) {
            souce[item] = distItem;
        } else if (souceItem.constructor != distItem.constructor) {
            souce[item] = dist[item];
        } else if (souceItem.constructor == Object || souceItem.constructor == Array) {
            mergeObj(souceItem, distItem);
        } else {
            souce[item] = dist[item];
        }
    })
}
module.exports = mergeObject;
