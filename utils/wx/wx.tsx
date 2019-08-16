import { parse,stringify } from 'qs';
import wx from 'weixin-js-sdk';
import UserStorage from "@/utils/UserStorage";

let ready;
const readyFn = (() => new Promise(resolve => (ready = resolve)))();
const userStorage = new UserStorage();

//需在用户可能点击分享按钮前就先调用
export async function share(title, desc, imgUrl?, link = window.location.href, success?) {
  await readyFn;
  // 自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容
  wx.updateTimelineShareData({
    title, //  分享标题
    link, //  分享链接
    imgUrl, //  分享图标
    success,
  });
  // 自定义“分享给朋友”及“分享到QQ”按钮的分享内容
  wx.updateAppMessageShareData({
    title, //  分享标题
    desc, //  分享描述
    link, //  分享链接
    imgUrl, //  分享图标
    success,
  });
  // 腾讯微博
  wx.onMenuShareWeibo({
    title, //  分享标题
    desc, //  分享描述
    link, //  分享链接
    imgUrl, //  分享图标
    success,
  });

  // // 分享到朋友圈（即将废弃）
  // wx.onMenuShareTimeline({
  //   title, // 分享标题
  //   link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
  //   imgUrl, // 分享图标
  //   success,
  // });
  // // 分享给朋友（即将废弃）
  // wx.onMenuShareAppMessage({
  //   title, // 分享标题
  //   desc, // 分享描述
  //   link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
  //   imgUrl, // 分享图标
  //   // type, // 分享类型,music、video或link，不填默认为link
  //   // dataUrl, // 如果type是music或video，则要提供数据链接，默认为空
  //   success,
  // });
  // // QQ (即将废弃)
  // wx.onMenuShareQQ({
  //   title, //  分享标题
  //   desc, //  分享描述
  //   link, //  分享链接
  //   imgUrl, //  分享图标
  //   success,
  // });
  // // QQ空间 (即将废弃)
  // wx.onMenuShareQZone({
  //   title, //  分享标题
  //   desc, //  分享描述
  //   link, //  分享链接
  //   imgUrl, //  分享图标
  //   success,
  // });
}

export async function getLocation(callback) {
  await readyFn;
  wx.getLocation({
    type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
    success: async res => {
      if (callback) {
        await callback(res);
      }
    }
  });
}

export default async ({
  title = document.title,
  desc = title,
  link = window.location.href,
  imgUrl = '',
  appId = '',
  openid = parse(window.location.search).openid || userStorage.getOpenId(publicNumberId),
  publicNumberId = 0,
  redirectUri = "",
  isNeedLogin = false,
} = {}) => {
  let { href } = window.location;
  const preHref = href.replace(`openid=${openid}`, '');
  if (href !== preHref) {
    window.location.href = preHref;
  }

  if (openid === undefined && isNeedLogin && process.env.NODE_ENV === 'production') {
    // 用户授权,为了获取用户信息
    const doLogin = async () => {
      const redirect_uri = encodeURIComponent(redirectUri);
      const state = window.btoa( JSON.stringify({publicNumberId, "url": window.location.href}));
      window.location.replace(`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&state=${state}#wechat_redirect`)

    };
    await doLogin();
  } else {
    userStorage.setOpenId(publicNumberId, openid);
    href = href.replace(`openid=${openid}`, '');
    if (window.location.href !== href) {
      window.location.href = href;
      return Promise.resolve();
    }
  }
  // config 为了后面分享等操作
  // https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421141115
  await fetch(
    `http://192.168.199.130:5555/api/v1/wx/js_ticket?${stringify({
      publicNumberId,
      url: location.href.split('#')[0],
    })}`
  ).then(async res => {
    try {
      const result = await res.json();
      wx.config({
        debug: false,
        appId,
        jsApiList: Object.keys(wx),
        ...result,
      });
    }catch (e) { }
  });


  wx.error(e => {
    console.log('wx sdk errors:', e);
  });
  wx.ready(() => {
    console.log("wx ready");
    ready();
    // share(title, desc, imgUrl, link);
    getLocation(res => {
      console.log('getLocation ==== > res', res);
      console.log('getLocation ==== > res.latitude', res.latitude); // 纬度，浮点数，范围为90 ~ -90
      console.log('getLocation ==== > res.longitude', res.longitude); // 经度，浮点数，范围为180 ~ -180。
      console.log('getLocation ==== > res.speed', res.speed); // 速度，以米/每秒计
      console.log('getLocation ==== > res.accuracy', res.accuracy); // 位置精度
      // LS.set(Constants.latitude, res.latitude);
      // LS.set(Constants.longitude, res.longitude);
    });
  });
  return true;
};







// demo
// import initWx,{ share } from '@/utils/wx';
// import debug from '@/utils/debug';

// /**
//  * 判断 pathname 是否在 path 中
//  * @param pathname
//  * @param path
//  * @returns {boolean}
//  */
// function isPath(pathname, path) {
//   const splitPathname = pathname.split('/');
//   const splitPath = path.split('/');
//   if(splitPathname.length !== splitPath.length)
//     return false;

//   return splitPath.every((item,index) => !item.includes(':') ? item === splitPathname[index] : true);
// }

// let timer = null;
// export default {
//   state: { },

//   effects: {
//       * share(_, {select}) {
//         const pathnameUn = window.g_history.location.pathname;
//         const pathname = pathnameUn.substr(pathnameUn.length-1,1) === '/' ? pathnameUn.substr(pathnameUn.length-1,1) : pathnameUn;

//         // project
//         const project = yield select(state => state.project.info ) || {};
//         const { title = ''} = (project.info || {});

//         // user
//         const user = yield select(state => state.user.info ) || {};
//         const { name = '', uid = '', imgs = []} = (user.info || {});

//         // data
//         const projectInfo = {title, img: (project.imgs || [])[0] || ''};
//         const userInfo    = {name, uid, img: imgs[0] || ''};
//         let [shareTitle, shareDesc, shareImgUrl] = [document.title, document.title, ''];

//         // run
//         if(isPath(pathname,'/:project/info/:uid')){
//           [shareTitle, shareDesc, shareImgUrl] = [`我是${userInfo.name},编号${userInfo.uid},正在参加${projectInfo.title}`, `期待您投我一票! ${projectInfo.title}`, userInfo.img];
//         }else if(isPath(pathname,'/:project/user/home')){
//           [shareTitle, shareDesc, shareImgUrl] = [`投票啦! ${projectInfo.title}`, `快来投一票! ${projectInfo.title}`, projectInfo.img];
//         }else if(isPath(pathname,'/:project/user/prize')){
//           [shareTitle, shareDesc, shareImgUrl] = [projectInfo.title, projectInfo.title, projectInfo.img];
//         }else if(isPath(pathname,'/:project/user/enroll')){
//           [shareTitle, shareDesc, shareImgUrl] = [`报名啦! ${projectInfo.title}`, `快来参加! ${projectInfo.title}`, projectInfo.img];
//         }else if(isPath(pathname,'/:project/user/ranking')){
//           [shareTitle, shareDesc, shareImgUrl] = [`激烈竞争! ${projectInfo.title}`, `竞争激烈! ${projectInfo.title}`, projectInfo.img];
//         }else if(isPath(pathname,'/:project/gift/:uid')){
//           [shareTitle, shareDesc, shareImgUrl] = [`送出您的小礼物吧! ${projectInfo.title}`, `送出您的小礼物吧! ${projectInfo.title}`, projectInfo.img];
//         }

//         // share
//         share(shareTitle, shareDesc, shareImgUrl)
//       },
//   },

//   subscriptions: {
//     // 在app.run时候,运行此方法,以后不再运行
//     setup ({ dispatch, history }) {
//       const pathname = history.location.pathname + '/';
//       const project = pathname.substring(1,pathname.indexOf('/',1));
//       if(project){
//         dispatch({
//           type:'project/info',
//           payload: { project },
//           callback: (bool,res)=>{
//             if(! bool){
//               history.replace('/exception/500');
//               Toast.offline(<div>发生了重大错误！<div>请您尝试重新打开该页面！</div></div>, 5);
//             }else {
//               // 初始化微信
//               debug().then(() => {
//                 initWx({
//                   title: '分享标题',
//                   imgUrl: '', // 分享图标
//                   isNeedLogin: true,
//                   desc: '分享描述',
//                   openid: process.env.NODE_ENV === 'development' ? 'o-wQW1uhNt0wcF6dKCZRnvSKrxNM' : undefined,
//                   appId: res.publicNumber.appid,
//                   publicNumberId: res.publicNumber.id,
//                   redirectUri: "http://127.0.0.1:5555/api/v1/wx/user_auth_url",
//                 });
//               });
//             }
//           }
//         });
//       }
//     },
//     // 监听路由变化，设置微信分享
//     history ({history,dispatch}){
//         history.listen((location) => {
//           // 处理抖动
//           clearTimeout(timer);
//           timer = setTimeout(() =>{
//             dispatch({ type:'share' });
//           },100)
//         })
//     }
//   },
// };
