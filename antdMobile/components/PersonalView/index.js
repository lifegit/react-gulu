import React,{Fragment} from "react";
import {Flex , Button} from 'antd-mobile';
// import {Avatar} from 'antd';
import Loading from '@/components/Loading'

const InfoView = ({title = '', text = ''}) => (
    <Flex.Item style={{textAlign: 'center'}}>
        <div style={{fontSize: 13, fontWeight: 600}}>
            { text }
        </div>
        <div style={{fontSize: 12}}>
            { title }
        </div>
    </Flex.Item>
);

const PersonalView = ({ list = {},username = '', loading = false,onClickRefresh = ()=>{} }) => {

    return (
        <div style={{background: '#fff'}}>
            {
                loading ? <Loading/> : (
                    <Fragment>
                        <Flex style={{paddingTop: 30}}>
                            <Flex.Item>
                                <img style={{float: 'right', marginRight: 10,width:64,height:64}} src={'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'} alt="" />
                                {/*<Avatar size={64} src={'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'} style={{float: 'right', marginRight: 10}}/>*/}
                            </Flex.Item>
                            <Flex.Item>
                                <h3 style={{fontSize: 17, fontWeight: 600, marginBottom: 2}}>{username}</h3>
                                {/*<Button style={{padding: 0, width: '50px', height: '23px', lineHeight: '23px'}} type="ghost"*/}
                                {/*size="small">充值</Button>*/}
                                <Button style={{padding: 0, width: '50px', height: '23px', lineHeight: '23px'}} type="ghost" size="small" onClick={onClickRefresh}>刷新</Button>
                            </Flex.Item>
                        </Flex>
                        <Flex style={{marginTop: 15,paddingBottom:10}}>
                            { list.map((item,key) => <InfoView key={key} title={item.title} text={item.text}/> ) }
                        </Flex>
                    </Fragment>
                )
            }
        </div>
    )
};
export default PersonalView;
