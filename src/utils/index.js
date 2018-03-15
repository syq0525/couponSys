'use strict'


const install = function (Vue) {
    //时间格式化
    
    
    //重置标题
    Vue.resetTitle = function (title){
        document.title = title;
        if (/ip(hone|od|ad)/i.test(navigator.userAgent)) {
            var i = document.createElement('iframe');
            i.src = '';
            i.style.display = 'none';
            i.onload = function () {
                setTimeout(function () {
                    i.remove();
                }, 9)
            }
            document.body.appendChild(i);
        }
    }
    
}
export default install