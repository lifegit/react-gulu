import React,{Fragment} from "react";
import ReactDOM from "react-dom";
import { ImagePicker,Tag,Toast,Button} from 'antd-mobile';
import styles from "./styles.less";
import Zmage from 'react-zmage'
import { imgcheckAndCompress } from '@/utils/imgUtils'


const isAdd = {
    ready:'ready',
    success: 'success',
    fail: 'fail',
};

class ImagePickerDetailed extends React.PureComponent {
    state = {
        zmageIndex:-1,
        imgs: [],
    };


    handImgChange = (imgs, type, index) => {
        console.log(imgs, type, index);

        if(type === 'add'){
            this.addImg(imgs);
            return ;
        }

        this.setState({ imgs });
    };

    addImg = (imgs) => {
        const _this = this;
        const img = imgs[imgs.length - 1];
        imgcheckAndCompress(img.file,(file,err)=>{
            if(err){
                Toast.fail(err.toString());
                return ;
            }
            img.file = file;
            img.isAdd = isAdd.ready;
            _this.setState({ imgs: imgs.filter((item,key) => key < imgs.length-1 ).concat(img) })
        })
    };

    /**
     * 上传图片
     */
    handUpload = ()=>{
        const _this = this;
        const { onUploadImg = ()=> {} , onUploadAllImgSuccess = ()=>{} } = this.props;
        const { imgs } = this.state;
        imgs.map((item,key) => {
            if(item.isAdd !== isAdd.success){
                // 回调去上传图片
                onUploadImg(item,(isBool)=> {
                    imgs[key].isAdd = isBool ?  isAdd.success : isAdd.fail;
                    // 更新状态
                    _this.setState({ imgs },()=>{
                        // 检查是否全部成功
                        const { imgs } = _this.state;
                        if(! imgs.find(item => item.isAdd !== isAdd.success)){
                            onUploadAllImgSuccess();
                        }
                    })
                })
            }
        })
    };
    clearAllImgs = () =>{
        this.setState({imgs:[]})
    };
    getAllImgsLength = () =>{
        const { imgs = [] } = this.state;
        return imgs.length || 0;
    };

    render() {
        const { uploadImgLoading = false, maxLen = 3, style = {} ,...other }  = this.props;
        const { imgs ,zmageIndex } = this.state;
        return (
            <Fragment>
                {
                    zmageIndex >= 0 ? (
                        <Zmage
                            style={{width:0,height:0,display:'none'}}
                            ref={node => (this.zmage = ReactDOM.findDOMNode(node))} // eslint-disable-line
                            src={imgs[zmageIndex].url}
                        />
                    ): null
                }
                <ImagePicker
                    className={styles.ImagePickerSimple}
                    style={{padding: '5px 0px 0px 0px',...style}}
                    length={6}
                    files={imgs}
                    onChange={this.handImgChange}
                    onImageClick={(index, fs) => this.setState({zmageIndex: index},()=>this.zmage.click()) }
                    selectable={imgs.length < maxLen}
                    multiple={false}
                    {...other}
                />
                <div style={{padding: '5px 0px 10px 10px',textAlign:'left'}}>
                    {
                        imgs.map((item,key) => <Tag key={key} style={{color:'#ffffff',padding:'0px 8px',marginRight:15,backgroundColor:`${item.isAdd === isAdd.success ? '#87d068' : item.isAdd === isAdd.fail ? '#f50' : '#efeff4'}`}} disabled>{item.isAdd === isAdd.ready ? '还未上传' : item.isAdd === isAdd.success ? '上传成功' : item.isAdd === isAdd.fail ? '上传失败' : null }</Tag>)
                    }
                </div>
                {
                    ! imgs.find(item => item.isAdd === isAdd.fail) ? null : (
                        <div style={{color:'#ff5759',height:30,marginTop:10,textAlign:'left'}}><span>您有图片未成功提交,请重新上传</span> <Button size={"small"} type={"warning"} loading={uploadImgLoading} onClick={this.handUpload}  inline style={{ height:23,lineHeight:'23px',verticalAlign:'-20%'}}>重新上传</Button></div>
                    )
                }
            </Fragment>
        )
    }
}

export default ImagePickerDetailed;
