import SimpleWebSocket from '@/utils/websocket'
import {UserStorage} from "@/utils/UserStorage";
import { Modal,Icon } from 'antd';
import Toast from "@/components/Toast";
import notify from "@/utils/notify";
import notificationMuscis from '@/assets/notificationMuscis.mp3';
import logo from '@/assets/logo.svg';
import {isTestEnv} from "@/utils/utils";
const url = `wss://${isTestEnv() ? 'test.' : ''}wss.cyss19.com:7273`;const openData = (token)=> ({type:'headquarters',token});
const userStorage = new UserStorage();
const handFocus = () => {isShine = false};
const handBlur = () => {isShine = true};

let webSocket;
let isCloseAfterConnect = true;
let isShine = true;
let titleInit;
let timer;

export default {
    namespace: 'noticesWebSocket',
    state: {
        connect : false,
    },
    subscriptions: {
        // 在app.run时候,运行此方法,以后不再运行
        openSocket ({ dispatch, history }) {
            //推送
            if(window.Notifier.HasSupport()) {
                console.log("你的浏览器支持桌面通知功能！");
                window.Notifier.RequestPermission();//获取权限
                Notifier.ModelAll();//设置显示模式
            }
            window.addEventListener('focus', handFocus, {passive: true});
            window.addEventListener('blur', handBlur, {passive: true});

            webSocket = new SimpleWebSocket(
                (event) => {
                    dispatch({ type:'open', payload: event });
                },
                (data) => {
                    dispatch({ type:'message', payload: data });
                },(event) => {
                    dispatch({ type:'close', payload: event });
                },(event) => {
                    dispatch({ type:'error', payload: event });
                });
            // 当history变化的时，触发
            history.listen((location) => {
                titleInit = document.title;
                // 存在token时(登录了),连接webSocket
                const token = userStorage.getToken();
                if (token) {
                    if(webSocket.readyState() !== 1){
                        isCloseAfterConnect = true;
                        webSocket.setConnectInfo(
                            url,
                            openData(token),
                        );
                        // 防止用户频繁刷新,处理抖动问题
                        setTimeout(() => {
                            webSocket.connect();
                        }, 5000);
                    }
                }else {
                    isCloseAfterConnect = false;
                    webSocket.close();
                    webSocket.stopRunReConnect();
                }
            })
        },
    },
    effects: {
        * open({payload}, {put}) {
            Toast.success('已成功开启消息推送功能。');
            yield put({
                type: "saveConnect",
                payload: {
                    connect: true
                }
            });
        },
        * message({payload}, {put, call, select}) {
            console.log('message', payload);
            switch (payload.t) {
                case 'message':
                    yield put({
                        type: 'notices/fPushNotices',
                        payload: [payload.data]
                    });
                    yield put({
                        type: 'notices/changeNotifyCount',
                        payload: {
                            unreadCount: (yield select(state => state.notices.unreadCount )) + 1 ,
                        },
                    });
                    // 推送通知
                    Notifier.CloseAll();
                    Notifier.ModelTimeout(10);
                    Notifier.Notify(logo, "有新的站消息", "有新的站消息,请在消息盒子中查阅...");
                    Toast.success('有新的站消息,请在消息盒子中查阅...',8);

                    // 标题闪烁
                    timer = setInterval(function() {
                        const title = document.title;
                        if (isShine === true) {
                            if (/新/.test(title) === false) {
                                document.title = '【你有新消息】';
                            } else {
                                document.title = '【　　　　　】';
                            }
                        } else {
                            document.title = titleInit;
                            clearInterval(timer);
                        }
                    }, 500);

                    // 音乐播放
                    const myAudio = new Audio();
                    myAudio.preload = true; //
                    // myAudio.controls = true;
                    myAudio.loop = false;
                    myAudio.src = notificationMuscis;
                    myAudio.play();

                    break;
            }
        },
        * close({payload}, {put}) {
            yield put({
                type: "saveConnect",
                payload: {
                    connect: false
                }
            });
            if(isCloseAfterConnect && ! webSocket.isReConnectRun()){
                webSocket.reConnect(30, 10, () => {
                    // 如果因为token不在线被后端下线,这里就不再连接了
                    const token = userStorage.getToken();
                    if(token){
                        webSocket.setConnectInfo(url, openData(token));
                        Toast.error('消息推送功能掉线,正在尝试连接。');
                        return true;
                    }else{
                        webSocket.stopRunReConnect();
                        return false;
                    }
                }, () => {
                    if (webSocket.readyState() !== 1) {
                        Modal.confirm({
                            icon: <Icon style={{color: '#faad14'}} type="exclamation-circle"/>,
                            title: '离线了',
                            okText: '择机再连',
                            cancelText: '不再连接',
                            content: <div>消息推送功能<br/>因为您的网络波动导致离线了,<br/>我们尝试再次连接却未成功。<br/><br/>选择不再连接,将不再连接。<br/>选择择机再连,我们将在合适的时机重新为您连接。
                            </div>,
                            onOk() {
                                isCloseAfterConnect = true; // 因为连不上时,触发了error,被设置了false,这里再设置为true
                                window.g_app._store.dispatch({type: 'noticesWebSocket/close', payload});
                            },
                        });
                    }
                });
            }
        },
        * error({payload}, {put, call}) {
            if(isCloseAfterConnect && ! webSocket.isReConnectRun()){
                webSocket.reConnect(60, 3, () => {
                    // 如果因为token不在线被后端下线,这里就不再连接了
                    const token = userStorage.getToken();
                    if(token){
                        webSocket.setConnectInfo(url, openData(token));
                        return true;
                    }else{
                        webSocket.stopRunReConnect();
                        return false;
                    }
                }, () => {
                    if (webSocket.readyState() !== 1) {
                        Modal.confirm({
                            icon:<Icon style={{color: '#f5222d'}} type="close-circle" />,
                            title: '推送出了问题',
                            okText: '知道了',
                            cancelText: '刷新网页',
                            content: <div>消息推送功能<br/>出了无法自动修复的错误,<br/>请您尝试刷新网页解决,<br/>如果还未解决,<br/>请您联系管理员处理。</div>,
                            onOk() {
                                isCloseAfterConnect = false;
                            },
                        });
                    }
                });
            }
            isCloseAfterConnect = false;//error后还会触发close,所以这里也要false
        },
    },

    reducers: {
        saveConnect(state, {payload}) {
            return {
                ...state,
                connect: payload.connect,
            }
        },
    },
}