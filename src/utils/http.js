'use strict'

import axios from 'axios'

const install = function (Vue) {

    if(process.env.NODE_ENV==='development'){
        window.host='http://192.168.21.148:8070';
        // window.host='https://ceshi.lechengclub.com';
    }else{
        window.host=''
        // if(location.host.includes('ceshi.lechengclub.com')){
        //     window.host='https://ceshi.lechengclub.com';
        // }else{

        // }
        
    }
    
    // window.host='http://192.168.21.108:8080';
    // axios.interceptors.request.use(config => {
    //     return config
    // }, error => {
    //     return Promise.reject(error)
    // }) 

    // axios.interceptors.response.use(response => {
    //     return response
    // }, error => {
    //     return Promise.resolve(error.response)
    // })

    function checkStatus(response) {
        // 如果http状态码正常，则直接返回数据
        if (response && (response.status === 200 || response.status === 304 || response.status === 400)) {
            var type = response.headers.get('Content-Type').split(";")[0];
            switch (type) {  
                case 'text/html':  
                    return response.text();  
                    break  
                case 'application/json':  
                    return response.json();  
                    break  
                default:  
            }  
            // return response.data
        }
        if(response && response.status===401){
            Vue.$router.push('/login')
        }
        // 异常状态下，把错误信息返回去
        return {
            status: -404,
            msg: '网络异常'
        }

    }
    function checkCode(res) {
        // 如果code异常(这里已经包括网络错误，服务器错误，后端抛出的错误)，可以弹出一个错误提示，告诉用户 
        eventBus.$message.error(res.msg);
        return res
    }
    Vue.$post = Vue.prototype.$post = function (url, params) {
        return  fetch(url,{
            credentials: 'include',
            method: 'POST',
            body:JSON.stringify(params),
            mode:'cors',
            cache: 'default',
            timeout: 20000,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            }
        }).then(
            (response) => {
                return checkStatus(response)
            }).catch(
            (res) => {
                return checkCode()
            })
            
    }
    Vue.$get = Vue.prototype.$get = function (url, params) {
        if(params){
            var body="";
            var index=0;
            var len=Object.keys(params).length;
            for(let i in params){
                if(len-1==index){
                    body+=i+'='+encodeURIComponent(params[i])
                }else{
                    body+=i+'='+encodeURIComponent(params[i])+'&'
                }
                index++
            }
            url=url+'?'+body
        }
        return  fetch(url,{
            credentials: 'include',
            method: 'GET',
            mode: "cors",
            cache: 'default',
            timeout: 20000,
        }).then(
            (response) => {
                return checkStatus(response)
            }).catch(
            (res) => {
                return checkCode()
            })
        
    }
    Vue.$delete = Vue.prototype.$delete = function (url, params) {
        if(params){
            var body="";
            var index=0;
            var len=Object.keys(params).length;
            for(let i in params){
                if(len-1==index){
                    body+=i+'='+params[i]
                }else{
                    body+=i+'='+params[i]+'&'
                }
                index++
            }
            url=url+'?'+body;
        }
        return  fetch(url,{
            credentials: 'include',
            method: 'DELETE',
            mode: "cors",
            cache: 'default',
            timeout: 20000,
        }).then(
            (response) => {
                return checkStatus(response)
            }).catch(
            (res) => {
                return checkCode()
            })
        
    }
    // Vue.$post = Vue.prototype.$post = function (url, data) {
    //     if(process.env.NODE_ENV==='development'&&url.indexOf('getMessageConfigList')!=-1){
    //         url='http://192.168.11.81:8080'+url;
    //     }else{
    //         url=host+url;
    //     }
        
    //     return  new Promise((resolve,reject)=>{
    //         axios({
    //             method: 'post',
    //             url,
    //             data: JSON.stringify(data),
    //             timeout: 20000,
    //             headers: {
    //                 'X-Requested-With': 'XMLHttpRequest',
    //                 'Content-Type': 'application/json;charset=UTF-8'
    //             }
    //         }).then(
    //             (response) => {
    //                 resolve(checkStatus(response))
    //             }).catch(
    //             (res) => {
    //                 reject(checkCode())
    //             })
    //     })       
        
    // }

    // Vue.$get = Vue.prototype.$get = function (url, params) {
    //     url=host+url;
    //     return  new Promise((resolve,reject)=>{
    //         axios({
    //             method: 'get',
    //             url,
    //             params, // get 请求时带的参数
    //             timeout: 20000,
    //             headers: {
    //                 'X-Requested-With': 'XMLHttpRequest'
    //             }
    //         }).then(
    //             (response) => {
    //                 resolve(checkStatus(response))
    //             }).catch(
    //             (res) => {
    //                 reject(checkCode())
    //             })
    //     })
    // }
    
    // Vue.$delete = Vue.prototype.$delete = function (url, params) {
    //     url=host+url;
    //     return  new Promise((resolve,reject)=>{
    //         axios({
    //             method: 'delete',
    //             url,
    //             params, // get 请求时带的参数
    //             timeout: 10000,
    //             headers: {
    //                 'X-Requested-With': 'XMLHttpRequest'
    //             }
    //         }).then(
    //             (response) => {
    //                 resolve(checkStatus(response))
    //             }).catch(
    //             (res) => {
    //                 reject(checkCode())
    //             }) 
    //     })
    // }
}
export default install