import React, {Component, Fragment} from "react";
// @ts-ignore
import ExportModal, { TypeCsv, TypeTxt } from '@/components/ExportModal';

export default class Index extends Component {
  creatFile = (id, callback)=>{
    setTimeout(()=>{
      const t = new Date().getTime()
      if (t % 2 === 0){
        callback(false, `网络错误${t}`)
      }else{
        callback(true, "成功", this.getFile()) // file: blob or string
      }
    },2000)
  };

  getFile = ()=>{
    // txt
    const file = new File(["Hello, world!"], "hello world.txt", {type: "text/plain;charset=utf-8"});
    return file

    // // jpg
    // const canvas = document.getElementById("my-canvas")
    // canvas.toBlob(function(blob) {
    //   const file = blob
    // });
    //
    // // csv
    // const exportPrefix = '\uFEFF';
    // const exportHeader = "任务ID,处理人ID \n";
    // const exportColumns = ['ID', 'Handler'];
    // let exportContent = exportPrefix + exportHeader;
    // const data = [
    //   {
    //     ID:1,
    //     Handler:2,
    //   },
    //   {
    //     ID:3,
    //     Handler:4,
    //   }
    // ]
    // for (const i in data) {
    //   for (const c in exportColumns) {
    //     exportContent += '' + data[i][exportColumns[c]] + '\t,';
    //   }
    //   exportContent += '\n';
    // }
    // const file = new Blob([exportContent], {type: "text/plain;charset=utf-8"});
  }

  render() {
    return (
      <Fragment>
        <div><a href='#' onClick={()=>this.exportModal.show([TypeCsv,TypeTxt])}>导出数据</a></div>
        {/* eslint-disable-next-line no-return-assign */}
        <ExportModal ref={(n)=>this.exportModal = n} onClick={this.creatFile} />
      </Fragment>
    );
  }
}
