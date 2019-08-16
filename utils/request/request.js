/**
 * request 网络请求工具
 * 更详细的api文档: https://bigfish.alipay.com/doc/api#request
 */
import { extend } from 'umi-request';
import router from 'umi/router';
import UserStorage from '@/utils/UserStorage';
import Toast from "@/components/Toast";

const userStorage = new UserStorage();
const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  412: '服务器未满足请求者在请求中设置的其中一个前提条件。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序
 */
const errorHandler = (async (error) => {
  // init
  const { response = {} } = error;
  const err = new Error();
  try{
    response.data = await response.json();
    // text = await error.response.text();
  }catch (e) {
    response.data = {}
  }
  err.response = response;


  if(error.name === 'SyntaxError'){
    err.message = "数据格式错误!";
    Toast.error(err.message);
    return err
  }

  const { status } = response;
  if(status === 412){
    err.message = `请求错误: ${response.data.msg || '数据格式错误'}`;
    Toast.error(err.message);
    return err
  }
  if (status === 401) {
    // @HACK
    /* eslint-disable no-underscore-dangle */
    window.g_app._store.dispatch({
      type: 'login/logout',
    });
    err.message = '未登录或登录已过期，请重新登录!';
    Toast.error(err.message);
    return err;
  }

  err.message = codeMessage[response.status] || response.statusText || `请求错误: ${error.message}`
  Toast.error(err.message);
  // environment should not be used
  if (status === 403) {
    router.push('/exception/403');
    return  err;
  }
  if (status <= 504 && status >= 500) {
    router.push('/exception/500');
    return err;
  }
  if (status >= 404 && status < 422) {
    router.push('/exception/404');
    return err;
  }

  return err;
});


/**
 * 配置request请求时的默认参数
 */
const request = extend({
  prefix: '/api/v1/',
  errorHandler, // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
});

/**
 * 配置request拦截器
 */
request.interceptors.request.use((url, options) => {
  const obj = userStorage.getTokenObj();
  if(obj.key && obj.value)
    options.headers[obj.key] = obj.value;
  return  (
    {
      url,
      options,
    }
  );

});

/**
 * 配置response,拦截器(所有httpCode都会运行该方法)
 */
request.interceptors.response.use(async (response) => {
  if(response.status === 200 && !(response.headers.get('content-type') || '').startsWith('image'))
    await response.clone().json();
  return response;
});


export default request;


/**
 * 上传文件
 * @param url
 * @param extend
 * @returns {Promise<any>}
 */
export const requestFile = (url, extend = {})=>{
  const { data = {} , ...other } = extend;
  const formData = new FormData();
  Object.entries(data).map(it => formData.append(it[0], it[1]) );

  return request(url, {
    ...other,
    requestType: 'form',
    body: formData,
  });
};


/**
 * 请求一个接口，返回一个图片
 * @param url
 * @param data
 * @returns {Promise<string | never>}
 */
export const requestImg = (url, data = {})=>{
  return request(url, {
    ...data,
    responseType: "arrayBuffer"
  }).then((res) =>
     !(res instanceof ArrayBuffer) ? res :  'data:image/png;base64,' + btoa(
      new Uint8Array(res).reduce((data, byte) => data + String.fromCharCode(byte), '')
    )
  )
};

