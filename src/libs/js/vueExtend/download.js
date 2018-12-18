let downloadIFrame=null;
function createDownloadIFrame(){
    downloadIFrame=document.createElement("iframe");
    downloadIFrame.style.position="fixed";
    downloadIFrame.style.opacity="0";
    downloadIFrame.style.width="10px";
    downloadIFrame.style.height="10px";
    downloadIFrame.style.left="-20px";
    downloadIFrame.style.top="-20px";
    downloadIFrame.width="10";
    downloadIFrame.height="10";
    document.body.appendChild(downloadIFrame);
}
//下载文件
function downloadFile(url){
    if(!downloadIFrame){
        createDownloadIFrame();
    }
    downloadIFrame.src=url?url:"";
}
var install = {
    install(Vue) {
        Vue.mixin({
            beforeCreate() {
                this.$download = {
                    downloadFile:downloadFile
                };
            }
        })
    }
}
export default install;
