import axios from 'axios';

// let axiosObj = axios.create({
//     baseURL:'http://localhost:5000/api',
//     timeout:10000
// })
let axiosObj = axios.create({
    baseURL:'https://www.loveyyt.cn',
    timeout:10000
})

axiosObj.defaults.withCredentials=true

axiosObj.interceptors.request.use(function (request) {
    // console.log(request)
    return request;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
axiosObj.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    return response.data;
}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});



function httpAjax(url,method,params,data){
    data?data:{}
    return axiosObj.request({
        url:url,
        method:method,
        params:params,
        data:data
    })
}







export {
    httpAjax
}