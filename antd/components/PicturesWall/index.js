import React from 'react';
import { Upload, Modal,Icon,Button,Tag } from 'antd';
import { imgcheckAndCompress,getBase64 } from '@/utils/imgUtils'
import Toast from "@/components/Toast";
import PropTypes from 'prop-types';


const status = {
  ready:'ready',
  uploading:'uploading',
  done: 'done',
  error: 'error',
  removed: 'removed',
};
export default class Index extends React.Component {

  static propTypes = {
    loading: PropTypes.bool,
    tag: PropTypes.bool,
    max: PropTypes.number,
    disabled: PropTypes.bool,
    cut: PropTypes.object,
    defaultValue: PropTypes.array,
    onUploadImg: PropTypes.func,
    onUploadAllImgSuccess: PropTypes.func,
  };

  static defaultProps = {
    loading: false,
    tag: true,
    max:5,
    cut:{maxSize: 3145728, maxWidth: 1200, maxHeight: 900, quality: 0.7},
    disabled: false,
    defaultValue: [],
    onUploadImg: () => { },
    onUploadAllImgSuccess: () => { },
  };




  constructor(props){
    super(props);

    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList : [],
      isDefault:true,
    };
  }

  static getDerivedStateFromProps(nextProps,prevState) {
    // Should be a controlled component.
    if (prevState.isDefault && 'defaultValue' in nextProps) {
      const fileList = nextProps.defaultValue.map((item,index) => {
        if(item.id && item.img){
          return {
            uid: -1 * (index + 1),
            name: item.img.substr(item.img.lastIndexOf('/')+1,item.img.length),
            status: status.done,
            url: item.img,
            ...item
          }
        }
        return item;
      });
      return {
        fileList: fileList || [],
      };
    }
    return null;
  }



  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  handleChange = ({ file }) => {
    const { isDefault } = this.state
    if(isDefault){
      this.setState({ isDefault:false })
    }
    if(file.status === status.removed){
      this.setState({fileList: this.state.fileList.filter(item => item.uid !== file.uid && item.name !== file.name) })
      return;
    }

    this.addImg(file);
  };

  addImg = file => {
    const _this = this;
    const { cut } = this.props;
    imgcheckAndCompress(file,(resFile,err)=>{
      if(err){
        Toast.fail(err.toString());
        return ;
      }

      const { lastModified,lastModifiedDate ,name,size,type} = resFile;
      const o = {
        lastModified,
        lastModifiedDate,
        name,
        size,
        type,
        originFileObj: resFile,
        percent: 0,
        response: "",
        status: status.ready,
        uid: file.uid,
      };

      _this.setState({fileList: _this.state.fileList.concat(o)})
    },cut.maxSize,cut.maxWidth,cut.maxHeight,cut.quality)
  };
  /**
   * 上传图片
   */
  upload = ()=>{
    const _this = this;
    const { onUploadImg, onUploadAllImgSuccess} = this.props;

    _this.state.fileList.map((item,key) => {
      if([status.ready,status.error].includes(item.status)){
        // 回调去上传图片
        _this.setState({
          fileList: _this.state.fileList.map(listItem => {
            if (item.uid === listItem.uid)
              listItem.status = status.uploading;
            return listItem;
          })
        },()=>{
          onUploadImg(item.originFileObj,(isBool,resData = {})=> {
            // 更新状态
            _this.setState({
              fileList: _this.state.fileList.map(listItem => {
                if (item.uid === listItem.uid){
                  listItem.status = isBool ?  status.done : status.error;
                  Object.assign(listItem,resData)
                }

                return listItem;
              })
            },()=>{
              // 检查是否全部成功
              if(! _this.state.fileList.find(listItem => listItem.status !== status.done)) {
                onUploadAllImgSuccess();
              }
            })
          })
        })
      }
    })
  };

  clearAllImgs = () =>{
    this.setState({fileList:[]})
  };
  getAllImgs = () =>{
    const { fileList = [] } = this.state;
    return fileList
  };

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const { loading, tag, max, disabled } = this.props;

    const uploadButton = (
        <div>
        <Icon type="plus" />
        <div className="ant-upload-text">选择图片</div>
        </div>
  );
    return (
        <div className="clearfix">
        <div>
        <Upload
    accept='image/*'
    listType="picture-card"
    fileList={fileList}
    beforeUpload={()=>{return false}}
    onPreview={this.handlePreview}
    onChange={this.handleChange}
    onRemove={()=>{ disabled ? Toast.error('只读状态不允许删除!') : null; return !disabled }}
  >
    {disabled || fileList.length >= max ? null : uploadButton}
  </Upload>
    </div>
    <div style={{clear:"both"}}>
    {
      ! tag ? null :
    <div style={{padding: '5px 0px 10px 14px',textAlign:'left'}}>
      {
        fileList.map((item,key) =>
        <Tag
        key={key}
        style={{padding:'0px 15px',marginRight:31}}
        disabled
        color={
              item.status === status.error ? '#ff5500' :
              item.status === status.done ? '#87D068' :
                  item.status === status.uploading ? '#2DB7F5' : ''}
            >{
              item.status === status.error ? '上传失败' :
                  item.status === status.done ? '上传成功' :
                      item.status === status.uploading ? '正在上传' :
                          item.status === status.ready ? '还未上传' : ''
            }
            </Tag>
      )
      }
    </div>
    }
    {
      ! fileList.find(item => item.status === status.error) ? null : (
          <div style={{color:'#ff5759',height:30,marginTop:10,textAlign:'left'}}><span>您有图片未成功提交,请重新上传</span> <Button size={"small"} loading={loading} onClick={this.upload} style={{ height:23,lineHeight:'23px'}}>重新上传</Button></div>          )
    }
  </div>
    <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
        <img alt="图片加载失败" style={{ width: '100%' }} src={previewImage} />
    </Modal>
    </div>
  );
  }
}
