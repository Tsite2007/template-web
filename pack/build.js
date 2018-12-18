const path = require('path');
const webpack = require('webpack');
const chalk = require("chalk");
const webpackDevConfig = require('./webpack.config.js')("production");
const filePlusFun = require("./fsWebpackPlugin.js");
let filePlus = new filePlusFun();

require("del")(["./dist/*"]); //删除历史打包数据
process.env.NODE_ENV = 'production';

let log = "";
var routers = require("../src/router.js");
const compiler = webpack(webpackDevConfig);
var timer = 0;

function routerEach(outputPath, file) {
    if (!(this instanceof Array)) return;
    this.forEach(item => {
        if (item.path.substr(-5) == ".html") {
            var s = filePlus.writeFile(path.join(outputPath, item.path), file, true);
        }
        routerEach.bind(item.children)(outputPath, file);
    })
}

function runing() {
    return new Promise((resolve, reject) => {
        timer = setInterval(t => {
            process.stdout.write(".")
        }, 100);
    })
}

function packRun() {
    return new Promise((resolve, reject) => {
        compiler.run((err, stats) => {
            if (err) {
                reject(err);
            } else {
                Object.keys(stats.compilation.assets).forEach(key => {
                    log += chalk.blue(key) + "\n";
                })
                stats.compilation.warnings.forEach(key => {
                    log += chalk.yellow(key) + "\n";
                })
                stats.compilation.errors.forEach(key => {
                    log += chalk.red(`${key}:${stats.compilation.errors[key]}`) + "\n";
                })
                log += chalk.green(`time：${(stats.endTime-stats.startTime)/1000} s\n`) + "\n";

                var outputPath = webpackDevConfig.output.path;
                var indexPath = path.join(outputPath, "index.html");
                var indexFile = "";
                try {
                    indexFile = filePlus.readFile(indexPath, "utf-8", true);
                    routerEach.bind(routers)(outputPath, indexFile);
                } catch (e) {
                    return reject( new Error(log+"\n"+e.message));
                }
                resolve(log);
            }
        })
    })
}

console.log("正在打包：");
Promise.race([packRun(), runing()]).then(data => {
    clearInterval(timer);
    console.log(data);
}).catch(err => {
    console.log(chalk.red(err));
    process.exit(0);
})