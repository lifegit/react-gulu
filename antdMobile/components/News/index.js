import React from 'react';
import { Checkbox,Modal } from 'antd-mobile';

const AgreeItem = Checkbox.AgreeItem;
const storageKey = 'newsId'

// <News id={2} visible={true} news={"22"} handClose={(visible)=>this.handClose(visible)} />
export default class News extends React.Component {
  state = {
    isCheck : false,
  };
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



    render() {
        const { isCheck } = this.state;
        const { id = 1, news = ''  } = this.props;
        let {visible = false} = this.props
        const spNews = visible ? news.toString().replace(/(\r\n)|(\n)/g,'<br/>') : '';

        if (visible && window.localStorage.getItem(storageKey) * 1 === id){
          visible = false;
        }

        const handlerClose = ()=>{
          const { handClose = () =>{}} = this.props;
          if(isCheck){
            window.localStorage.setItem(storageKey,id);
          }

          handClose(false);
        };


        return (
            <Modal
                visible={visible}
                transparent
                maskClosable={false}
                title="每日一读"
                footer={[{ text: '好的', onPress: ()=>handlerClose()  }]}
                wrapProps={{ onTouchStart: this.onWrapTouchStart }}
            >

              {/* eslint-disable-next-line react/no-danger */}
            <div style={{ overflow: 'scroll',textAlign:'left' }} dangerouslySetInnerHTML={{__html: spNews}} />
            <AgreeItem style={{ marginLeft: -3 }} onChange={e => this.setState({isCheck:!isCheck})}>相同内容不再提示</AgreeItem>
            </Modal>
        )
    }
}
