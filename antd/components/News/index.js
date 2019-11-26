import {
    Modal,
    Switch,
    Icon,
} from 'antd';


const storageKey = 'newsIdA'


/**
 * @return {null}
 */
const News = (id = 1, news = '', visible = false, handClose = () =>{})=> {
  let isCheck = false;
  let lastVisible = visible;
  if (lastVisible && window.localStorage.getItem(storageKey) * 1 === id){
    lastVisible = false;
  }
  const spNews = lastVisible ? news.toString().replace(/(\r\n)|(\n)/g,'<br/>') : '';

  if(lastVisible){
    Modal.info({
      title: (<div><Icon type="notification" /> 公告</div>),
      maskClosable:true,
      content: (
        <div>
          {/* eslint-disable-next-line react/no-danger */}
          <p style={{ overflow: 'scroll',textAlign:'left',fontSize:18 }} dangerouslySetInnerHTML={{__html: spNews}} />
          <Switch onChange={(b)=>isCheck = b} size="small" checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="close" />}/> 相同不再提示
        </div>
      ),
      onOk() {
        if(isCheck){
          window.localStorage.setItem(storageKey,id);
        }

        handClose(false);
      },
    })
  }
}

export default News
