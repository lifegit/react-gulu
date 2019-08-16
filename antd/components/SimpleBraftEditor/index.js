import 'braft-editor/dist/index.css';
import React from 'react';
import BraftEditor from 'braft-editor';

export default class SimpleBraftEditor extends React.Component {

  constructor(props){
    super(props);
    const { defaultValue = '' } = this.props;
    this.state = {
      editorState: BraftEditor.createEditorState(defaultValue), // 设置编辑器初始内容 eg:<p>Hello <b>World!</b></p>
      outputHTML: '',
    };
  }

  // componentDidMount() {
  //   this.isLivinig = true;
  //   // 3秒后更改编辑器内容
  //   // setTimeout(this.setEditorContentAsync, 3000);
  // }

  // componentWillUnmount() {
  //   this.isLivinig = false;
  // }

  // setEditorContentAsync = () => {
  //   this.isLivinig && this.setState({
  //     editorState: BraftEditor.createEditorState('<p>你好，<b>世界!</b><p>'),
  //   });
  // };

  handleChange = (editorState) => {
    const html = editorState.toHTML();
    this.setState({
      editorState: editorState,
      outputHTML: html,
    });
    const { onChange = () => {} } = this.props;
    onChange(html)
  };

  render() {
    const { disabled = false } = this.props;
    const { editorState, outputHTML } = this.state;

    return (
      <div style={{ minHeight: 600 }}>
        <div style={{
          border: '1px solid #d1d1d1',
          borderRadius: 5,
        }}>
          <BraftEditor
            disabled={disabled}
            value={editorState}
            onChange={this.handleChange}
          />
        </div>
        {/*<h5>输出内容</h5>*/}
        {/*<div className="output-content">{outputHTML}</div>*/}
      </div>
    );

  }

}
