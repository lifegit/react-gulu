// demo:
//     imgcheckAndCompress(file,(file,err)=>{
//         if(err){
//             Toast.fail(err.toString());
//             return ;
//         }
//     })

/**
 * 压缩与验证图片
 * @param file
 * @param callback
 * @param maxSize
 * @param maxWidth
 * @param maxHeight
 * @param quality
 * @param acceptArr
 */
export function imgcheckAndCompress(file, callback = () =>{} ,maxSize = 3145728, maxWidth = 1200, maxHeight = 900, quality = 0.7, acceptArr = ['jpeg','jpg','bmp','png','gif']) {
  imgCompress(file, maxWidth, maxHeight, quality).then((res) => {
    imgCheck(res.file,acceptArr,maxSize,callback)
  })
    .catch((err) => {
      imgCheck(file,acceptArr,maxSize,callback)
    });
}

/**
 * 验证图片
 * @param file
 * @param acceptArr
 * @param maxSize
 * @param func
 * @returns {boolean}
 */
export function imgCheck(file, acceptArr, maxSize, func) {

  if(! acceptArr.find(value=>file.type.indexOf(value))){
    func(file, new Error('图片错误: 不允许的文件格式!'));
    return false;
  }

  if (file.size > maxSize) {
    func(file, new Error(`图片错误: 文件太大! 最大:${maxSize/1024/1024}M!`));
    return false;
  }

  func(file);
}

export function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}



// demo:
// ck = ()=>{
//     const _this = this;
//     document.querySelector('#file').addEventListener('change', function () {
//         compress(this.files[0], 1200, 900, 1)
//             .then((res) => {
//                 // 处理成功会执行
//                 console.log('success',res);
//                 _this.setState({
//                     cc: window.URL.createObjectURL(res.blob),
//                 });
//             })
//             .catch(function (err) {
//                 // 处理失败会执行
//                 console.log('error',err);
//             });
//     };
// }
// render() (
//     <div>
//         <Button onClick={this.ck}/>
//         <img src={this.state.img} />
//     </div>
// );
/**
 * 图片压缩
 * @param file
 * @param maxWidth 最大宽度
 * @param maxHeight 最大高度
 * @param quality 压缩倍率 0-1，数值越小，图片越模糊
 * @returns {Promise<*>}
 */
export async function imgCompress(file, maxWidth = 1200, maxHeight = 900, quality = 0.7) {
  const fileType = file.name.indexOf(".");
  const img = new Image();
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const reader = new FileReader();
  let resolves;
  img.onload = function() {
    const originWidth = this.width;
    const originHeight = this.height;
    let targetWidth = originWidth;
    let targetHeight = originHeight;
    if (originWidth > maxWidth || originHeight > maxHeight) {
      if (originWidth / originHeight > maxWidth / maxHeight) {
        targetWidth = maxWidth;
        targetHeight = Math.round(maxWidth * (originHeight / originWidth))
      } else {
        targetHeight = maxHeight;
        targetWidth = Math.round(maxHeight * (originWidth / originHeight))
      }
    }
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    context.clearRect(0, 0, targetWidth, targetHeight);
    context.drawImage(img, 0, 0, targetWidth, targetHeight);
    canvas.toBlob(blob => resolves({'file':new File([blob], file.name.substring(0,fileType === -1 ? file.name.length : fileType ) + '.jpeg', {type: 'image/jpeg'}), blob}),'image/jpeg', quality);
  };

  reader.onload = e => {
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
  return new Promise( resolve => {
    resolves = resolve
  })
}
