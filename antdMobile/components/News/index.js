import React from 'react';
import { Modal } from 'antd-mobile';

export default class News extends React.Component {
    onWrapTouchStart = (e) => {
        // fix touch to scroll background page on iOS
        if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
            return;
        }
        const pNode = this.closest(e.target, '.am-modal-content');
        if (!pNode) {
            e.preventDefault();
        }

    };
    closest=(el, selector)=> {
        const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
        while (el) {
            if (matchesSelector.call(el, selector)) {
                return el;
            }
            el = el.parentElement;
        }
        return null;
    }

    handClose = ()=>{
        const { handClose = () =>{}} = this.props;
        handClose(false);
    };

    render() {
        const { news = '' , visible = false } = this.props;
        const spNews = visible ? news.toString().replace(/(\r\n)|(\n)/g,'<br/>') : '';
        return (
            <Modal
                visible={visible}
                transparent
                maskClosable={false}
                title="每日一读"
                footer={[{ text: '好的', onPress: ()=>this.handClose()  }]}
                wrapProps={{ onTouchStart: this.onWrapTouchStart }}
            >
                <div style={{ overflow: 'scroll',textAlign:'left' }} dangerouslySetInnerHTML={{__html: spNews}} />
            </Modal>
        )
    }
}
