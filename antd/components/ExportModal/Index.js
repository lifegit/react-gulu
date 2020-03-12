import React,{Fragment} from "react";
import {Card,Modal,Icon,Spin,Button} from "antd";
import { saveAs } from 'file-saver';
import styles from './styles.less'
import txtSvg from './img/txt.svg'
import csvSvg from './img/csv.svg'
import zipSvg from './img/zip.svg'

export const TypeWord = 1;
export const TypeJpg = 2;
export const TypePdf = 3;
export const TypeMd = 4;
export const TypeTxt = 5;
export const TypeCsv = 6;
export const TypeZip = 7;

const typeList = [
  {
    id: TypeWord,
    img:'https://gw.alipayobjects.com/zos/basement_prod/408f32c8-8385-4562-b037-c35ea82d2563.svg',
    name:'Word',
    expand:'.docx',
  },
  {
    id: TypeJpg,
    img:'https://gw.alipayobjects.com/zos/basement_prod/41bf1411-b8e6-4c23-96d8-3a3375109200.svg',
    name:'JPG',
    expand:'.jpg',
  },
  {
    id: TypePdf,
    img:'https://gw.alipayobjects.com/zos/basement_prod/59ddca13-029e-481f-ba4e-a3a30e047e24.svg',
    name:'PDF',
    expand:'.pdf',
  },
  {
    id: TypeMd,
    img:'https://gw.alipayobjects.com/zos/basement_prod/759ce648-47b7-46a4-8d56-66247bf923fc.svg',
    name:'Markdown',
    expand:'.md',
  },
  {
    id: TypeMd,
    img:'https://gw.alipayobjects.com/zos/basement_prod/759ce648-47b7-46a4-8d56-66247bf923fc.svg',
    name:'Markdown',
    expand:'.md',
  },
  {
    id: TypeTxt,
    img: txtSvg,
    name:'TXT',
    expand:'.txt',
  },
  {
    id: TypeCsv,
    img: csvSvg,
    name:'CSV',
    expand:'.csv',
  },
  {
    id: TypeZip,
    img: zipSvg,
    name:'ZIP',
    expand:'.zip',
  },
]


export default class Index extends React.Component {
  state = {
    visible: false,
    step:1,
    title:'导出',
    typeArr:[],
    type:{},
    loading:false,
    success:false,
    failInfo:'',
    file:undefined,
    width:520,
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  show = (list = [])=>{
    const l = typeList.filter(item => list.includes(item.id))
    this.setState({
      visible: true,
      step:1,
      title:'导出',
      typeArr: l,
      width: l.length >= 3 ? 520 : l.length * 220
    });
  }

  render() {
    const { visible, width, typeArr, type, step, file, success, failInfo, title, loading } = this.state;
    const { onClick = ()=>{} } = this.props

     const handClick  = (it)=>{
      this.setState({
        step: 2,
        type: it,
        title:`导出 ${it.name}`,
        width: 360,
        loading:true,
      },()=>{
        // eslint-disable-next-line no-shadow
        onClick(it.id, (bool = false, failInfo = '', file = undefined)=>{
          // console.log("callback", bool, file)
          this.setState({
            loading: false,
            success: !!bool,
            failInfo,
            file,
          })
        })
      })
    }

    const downFile = ()=>{
      const date = new Date();
      saveAs(file, `${date.getFullYear()  }${  date.getMonth() + 1  }${  date.getDate()  }${type.expand}`);
    }

    const getHref = ()=>{
      if (typeof(file) === 'string') {
        return { href: file, target:'_blank' }
      }
      return { onClick: downFile }
    }

    return (
      <div>
        <Modal
          maskClosable={false}
          width={width}
          visible={visible}
          footer={null}
          onCancel={this.handleCancel}
          keyboard={false}
        >
          <div style={{ marginBottom:5,fontSize:14,fontWeight:700,color:'#262626' }}>{title}</div>
          <Card style={{ border:0 }} bordered={false}>
            {
              // eslint-disable-next-line no-nested-ternary
              step === 1 ? (
                (typeArr || []).map( (item,key) => (
                  <Card.Grid
                    key={key}
                    className={styles.grid}
                    style={{
                      // eslint-disable-next-line no-nested-ternary
                      width: typeArr.length >= 3 ? '33%' : typeArr.length === 2 ? '50%': '100%',
                      textAlign: 'center',
                      border:'0',
                      cursor:'pointer',
                      transition:'all 0.3s',
                      boxShadow:'0 0 0 0 #fff'
                    }}
                    onClick={()=>handClick(item)}
                  >
                    <img src={item.img} alt={item.name} style={{ width:70,height:70,padding: (item.img || '').startsWith('http') ? 0 : 12  }} />
                    <div>{item.name}</div>
                    <div style={{ fontSize:12,color:'#8c8c8c' }}>{item.expand}</div>
                  </Card.Grid>
                    ))
                ) : step === 2 ? (
                  <div style={{ textAlign:'center' }}>
                    {
                      loading ? (
                        <Fragment>
                          <Spin indicator={<Icon type="loading" style={{ fontSize: 24,color:'#999' }} spin />} />
                          <div>正在导出中...</div>
                        </Fragment>
                      ):(
                        <Fragment>
                          {
                           success ? (
                             <Fragment>
                               <Icon type="check-circle" theme="filled" style={{ color:'#25b864',fontSize:22 }} />
                               <div style={{ lineHeight:'27px',fontWeight:500 }}>文件生成成功</div>
                               <a style={{ lineHeight:'27px' }} {...getHref()}>点击下载</a>
                             </Fragment>
                           ):(
                             <Fragment>
                               <Icon type="close-circle" style={{ color:'#f5222d',fontSize:22 }} />
                               <div style={{ lineHeight:'27px',fontWeight:500 }}>文件生成失败</div>
                               <div style={{ lineHeight:'27px',color:'#f5222d',marginBottom:5 }}>{failInfo}</div>
                               <Button src='small' onClick={()=>handClick(type)}><Icon type="reload" />重新生成</Button>
                             </Fragment>
                           )
                         }
                        </Fragment>
                      )
                    }
                  </div>
                ) : null
              }
          </Card>
        </Modal>
      </div>
    );
  }
}
