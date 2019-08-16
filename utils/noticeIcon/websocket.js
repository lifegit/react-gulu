import UserStorage from "@/utils/UserStorage";

const lifeCount = 30;
export default class SimpleWebSocket{

    url;
    openData;
    messageAction;
    openAction;
    closeAction;
    errorAction;


    ws;
    intervalPant;
    intervalMax;
    count;

    reConnectRun = false;

    constructor(openAction, messageAction, closeAction, errorAction){
        this.openAction = openAction;
        this.messageAction = messageAction;
        this.closeAction = closeAction;
        this.errorAction = errorAction;
    }
    setConnectInfo(url, openData){
        this.url = url;
        this.openData = openData;
    }

    connect(){
        if(! this.ws){
            this.ws = new WebSocket(this.url);

            this.ws.onopen = (event) => {
                // console.log('onopen',event);
                this.stopRunReConnect();
                this.send(Object.assign(this.openData,{t:'check'}));
                this.count = lifeCount;
                // 心跳
                this.intervalPant = setInterval(() => {
                    this.count -= 1;
                    // console.log('count',this.count);
                    if (this.count === 0) {
                        this.send({t:'p'});
                    }
                }, 1000);
                this.openAction(event);
            };
            this.ws.onmessage = ({ data }) => {
                // console.log('onmessage',data);
                this.messageAction(JSON.parse(data));
            };
            this.ws.onclose = (event)=> {
                // console.log('onclose',event);
                clearInterval(this.intervalPant);
                this.ws = undefined;
                this.closeAction(event);
            };
            this.ws.onerror = (event)=> {
                // console.log('onerror',event);
                this.errorAction(event);
            };
        }
    }

    isReConnectRun(){
        return this.reConnectRun;
    }

    readyState(){
        return this.ws ? this.ws.readyState : 0;
    }
    /**
     * 重新连接
     * @param time 每次等多少秒
     * @param max 最多等多少次
     * @param everyFun 在每次连接之前的回调方法,该方法的返回值(bool)可决定方法内部是否进行连接,可在此方法里设置一些重新连接数据。
     * @param endFun 所有次结束的回调方法
     */
    reConnect(time, max, everyFun, endFun){
        this.reConnectRun = true;
        this.intervalMax = setInterval(() => {
            if(everyFun())
                this.connect();
            max -= 1;
            if(max <= 0){
                endFun();
                this.stopRunReConnect();
            }
        }, time * 1000);
    }

    /**
     * 停止当前正在重新连接的任务
     */
    stopRunReConnect(){
        clearInterval(this.intervalMax);
        this.reConnectRun = false;
    }

    /**
     * 发送数据
     * @param data 数据数组
     */
    send(data){
        if(this.ws instanceof WebSocket){
            this.ws.send(JSON.stringify(data));
            this.count = lifeCount;
        }
    }
    /**
     * 关闭连接
     */
    close(){
        if(this.ws instanceof WebSocket){
            this.ws.close();
        }
    }

}
