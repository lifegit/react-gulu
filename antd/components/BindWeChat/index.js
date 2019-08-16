import React, { PureComponent,Fragment } from 'react';
import { Icon,notification,Button } from 'antd';
import Result from '@/components/Result';
import PropTypes from 'prop-types';
const key = 'notification_bindWeChat';

class BindWeChat extends PureComponent {
    static propTypes = {
        onChange: PropTypes.func,
        onClose: PropTypes.func,
        onBind: PropTypes.func,
        onGetBindInfo: PropTypes.func,
        bindData: PropTypes.object,
    };

    static defaultProps = {
        onChange: () => { },
        onClose: () => { },
        onBind: () => { },
        onGetBindInfo: () => { },
        bindData: [],
    };

    componentDidUpdate (){
        const {bindData : {step = 0, publicNumberName = '' , publicNumberQrCode = '' , loadingGetBindInfo = false, loadingBind = false, bindErrorMsg = ''}, onChange, onClose, onGetBindInfo, onBind} = this.props;
        const showStop1 =()=>{
            notification.open({
                key,
                placement:'topLeft',
                onClose: ()=> onClose(),
                icon: <Icon type="wechat" style={{color:'#00b100'}}  />,
                message: <Fragment><Icon type="info-circle" style={{paddingRight:5,color:'#faad14'}} />还未关注公众号</Fragment>,
                description: '您还未关注微信公众号,关注后站内的消息将会同步发送到您的微信中。',
                duration: 8,
                btn: <Fragment>
                    <Button size='small' onClick={() => {notification.close(key); onClose()}} style={{marginRight:8}}>下次再说</Button>
                    <Button size='small' type="primary" onClick={() => {onGetBindInfo(2);onChange(2)}}>立马关注</Button>
                </Fragment>,
            });
        };

        const showStop2 = ()=>{
            notification.open({
                key,
                placement:'topLeft',
                onClose: ()=> onClose(),
                duration: 0,
                message: <Fragment><Icon type="wechat" style={{paddingRight:5,color:'#00b100'}} />关注 - 关注微信公众号</Fragment>,
                description: <Fragment><div>您可以直接关注<span style={{paddingLeft:5,paddingRight:5,fontWeight:900,fontSize:15,color:'#f5222d'}}>{loadingGetBindInfo ? <Icon type="loading" /> : publicNumberName}</span>微信公众号,<br/>或直接微信扫码关注。</div>{loadingGetBindInfo ? <Icon type="loading" /> : <img style={{width:180,height:180}} src={publicNumberQrCode}/>}{bindErrorMsg ? <div style={{color:'#f5222d',marginTop:8}}><Icon type="close-circle" style={{paddingRight:5}} />: {bindErrorMsg}</div> : null}</Fragment>,
                btn: <Fragment>
                    <Button size='small' onClick={() => onChange(1)} style={{marginRight:8}}>上一步</Button>
                    <Button size='small' type="primary" loading={loadingBind} onClick={() => onBind(3)}>我已经关注</Button>
                </Fragment>
            });
        };

        // const showStop3 = ()=>{
        //     notification.open({
        //         key,
        //         placement:'topLeft',
        //         onClose: ()=> onClose(),
        //         duration: 0,
        //         message: <Fragment><Icon type="wechat" style={{paddingRight:5,color:'#00b100'}} />验证 - 关注微信公众号</Fragment>,
        //         description: <Fragment><div>关注后,请您向公众号发送<span style={{paddingLeft:5,paddingRight:5,fontWeight:900,fontSize:15,color:'#f5222d'}}>{loadingGetBindInfo ? <Icon type="loading" /> : bindCode}</span>以便我们进行验证绑定。</div>{bindErrorMsg ? <div style={{color:'#f5222d',marginTop:8}}><Icon type="close-circle" style={{paddingRight:5}} />: {bindErrorMsg}</div> : null}</Fragment>,
        //         btn: <Fragment>
        //             <Button size='small' onClick={() => onChange(2)} style={{marginRight:8}}>上一步</Button>
        //             <Button size='small' type="primary" loading={loadingBind} onClick={() => onBind(4)}>已经发送</Button>
        //         </Fragment>
        //     });
        // };
        const showStop3 = ()=>{
            notification.open({
                key,
                placement:'topLeft',
                onClose: ()=> onClose(),
                duration: 0,
                description:
                    <Result
                        type="success"
                        title="绑定成功"
                        description="您已成功绑定公众号"
                        actions= {<Button type="primary" onClick={() => {notification.close(key); onClose()}}>完成</Button>}
                    />,
            });
        };

        if(step === 1)
            showStop1();
        else if(step === 2)
            showStop2();
        else if(step === 3)
            showStop3();
    }


    render() {
        return (
            <Fragment />
        );
    }
}

export default BindWeChat;