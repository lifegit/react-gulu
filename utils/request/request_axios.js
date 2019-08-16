import axios from "axios";
import Qs from "qs";
import JSONbig from "json-bigint";

const codeMessage = {
    200: "服务器成功返回请求的数据。",
    201: "新建或修改数据成功。",
    202: "一个请求已经进入后台排队（异步任务）。",
    204: "删除数据成功。",
    400: "发出的请求有错误，服务器没有进行新建或修改数据的操作。",
    401: "用户没有权限（令牌、用户名、密码错误）。",
    403: "用户得到授权，但是访问是被禁止的。",
    404: "发出的请求针对的是不存在的记录，服务器没有进行操作。",
    406: "请求的格式不可得。",
    410: "请求的资源被永久删除，且不会再得到的。",
    422: "当创建一个对象时，发生一个验证错误。",
    500: "服务器发生错误，请检查服务器。",
    502: "网关错误。",
    503: "服务不可用，服务器暂时过载或维护。",
    504: "网关超时。",
    901: "未登录。",
    902: "无授权。",
};

//http://blog.csdn.net/fantian001/article/details/70193938

const baseConfig = {
    baseURL: "/services/",
    timeout: 10000,
    headers: {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"},
};

// 创建axios实例
const service = axios.create({
    ...baseConfig,
    //responseType: 'json', // default
    validateStatus: function (status) {
        return status >= 200 && status < 300;//默认  如果自定义的成功status(也就是说非200)如果 `validateStatus` 返回 `true` (或者设置为 `null` 或 `undefined`)，promise 将被 resolve; 否则，promise 将被 rejecte
    },
    transformResponse: function (data) {
        return JSONbig.parse(data);
    }
});

//// request拦截器
//service.interceptors.request.use(config => {
//	config.baseURL= global.baseURL
//	return config
//}, error => {
//	// Do something with request error
//	console.log(error) // for debug
//	Promise.reject(error)
//});


//访问完成后的拦截器
service.interceptors.response.use((response) => {
    // console.log(response)
    if (!response.data) {
        const error = new Error("数据格式错误!");
        error.response = response;
        throw error;
    }


    if (!response.data.success) {
        const error = new Error((response.data.info ? response.data.info : "未知错误!"));
        error.response = response;
        throw error;
    }

    return {"body": response.data, "headers": response.headers};
}, (e) => {
    // console.log('fail',e.response,e.code);

    const error = new Error();
    error.response = e.response;


    if ((e.code + "").startsWith("ECONNABORTED")) {
        error.message = "连接超时";
        throw error;
    }

    if (e.response.status >= 900) {
        window.g_app._store.dispatch({
            type: "login/logout",
            payload: { curl : false },
        });
    }

    const errortext = codeMessage[e.response.status] || e.message;
    error.message = `${e.response.status} ${errortext}`;
    throw error;
});

/**
 * request
 * @param {String}  interfaceName 接口名
 * @param {Object}  datas 提交的data
 */
export const request_axios = (interfaceName, datas = {}) => {
    return service({url: interfaceName, method: "post", data: Qs.stringify(datas)});
};

/**
 * 将文件request到接口
 * requestFile
 * @param {String}  interfaceName 接口名
 * @param {Object}  datas 提交的data
 */
export const requestFile = (interfaceName, datas = {}) => {
    let data = new FormData();
    let t_data = Object.entries(datas);
    t_data.map(it => {
        data.append(it[0], it[1]);
    });
    return service({url: interfaceName, method: "post", data: data});
};

/**
 * 请求一个接口，返回一个图片
 * @param interfaceName
 * @param datas
 * @returns {Promise<AxiosResponse<any> | never>}
 */
export const requestImg = (interfaceName, datas = {})=>{
    return axios.post(interfaceName, Qs.stringify(datas),{...baseConfig,responseType: "arraybuffer",}).then(function (response) {
        if(response.headers['content-type'].startsWith('text')){
            const encodedString = String.fromCharCode.apply(null, new Uint8Array(response.data));
            const decodedString = decodeURIComponent(escape((encodedString))); // 没有这一步中文会乱码
            response.data = JSONbig.parse(decodedString);
            const error = new Error(response.data.info);
            error.response = response;
            throw error;
        }
        else
        // 将从后台获取的图片流进行转换
            return 'data:image/png;base64,' + btoa(
                new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
            );
    }).then(function (data) {
        // 接收转换后的Base64图片
        return data;
    }).catch(function (err) {
        throw err;
    });
};

export default request_axios;
