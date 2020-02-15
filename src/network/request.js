import axios from 'axios'

export function request(config){
    const instance = axios.create({
        baseURL: 'http://123.207.32.32:8000/api/hy',
        timeout:5000
    })
    2.
    // axios拦截器
        //请求拦截
    instance.interceptors.request.use(config=>{
        return config
    },err=>{
        // console.log(err);
    })
        // 响应拦截
    instance.interceptors.response.use(res=>{
        // console.log(res);
        return res.data
    },err=>{
        console.log(err);
    })
    //发送真正的网络请求
    // axios.create的返回值本神就是promise
    return instance(config)
}