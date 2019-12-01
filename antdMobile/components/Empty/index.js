import React from 'react';
import empty from './empty.svg';

export default function Empty({ children, text = '暂无数据' }) {
    return (
        <div style={{textAlign: 'center',padding:'60px 0px 50px 0px',backgroundColor: '#fff'}}>
            <img style={{width:120}} src={empty} alt={'暂无数据'}/>
            <p style={{ color: 'rgba(0,0,0,0.58)',fontSize: 14,lineHeight: '22px'}}>{text}</p>
            { children }
        </div>
    )
}
