import React from 'react';
import { PullToRefresh, ListView, Icon } from 'antd-mobile';
import PropTypes from 'prop-types';
import Empty from '@/components/Empty';
import ReactDOM from "react-dom";

export default class extends React.Component {

    state = {
      height: document.documentElement.clientHeight,
      dataSource: new ListView.DataSource({
          rowHasChanged: (row1, row2) => row1 !== row2,
      })
    };


    static propTypes = {
        loading: PropTypes.bool,
        data: PropTypes.object,
        onChange: PropTypes.func,
        renderRow: PropTypes.func,
    };

    static defaultProps = {
        loading: false,
        data: {list:[],page:{total:0,size:0}},
        onChange: ()=>{},
        renderRow: ()=>{},
    };

    current = 1;

    // If you use redux, the data maybe at props, you need use `componentWillReceiveProps`
    componentWillReceiveProps(nextProps) {
       const nextList = ((nextProps.data || {}).list || []);
       const thisList = ((this.props.data || {}).list || []);

      if ( nextList !== thisList) {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(nextList),
        });
      }
    }

    componentDidMount() {
      const height = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).offsetTop;
      this.setState({height});
      this.showData(1);
    }

    onRefresh = () => {
        this.showData(1);
    };

    onEndReached = (event) => {
        const { loading, data } = this.props;
        const { page = {} } = data;
        const { total = 0, size = 0 } = page;

        const hasMore = total  <= (this.current * size); //isLastPage
        if(loading || hasMore){
            return
        }

        this.showData(this.current + 1)
    };


    showData = (page) =>{
        this.current = page;
        const { onChange } = this.props;
        onChange(page)
    };

    render() {
        const { loading, data, renderRow } = this.props;
        const { list = [], page = { } } = data;
        const { total = 0, size = 0 } = page;
        const { dataSource,height } = this.state;

        const separator = (sectionID, rowID) => (
            <div
                key={`${sectionID}-${rowID}`}
                style={{
                    backgroundColor: '#F5F5F9',
                    height: 8,
                    borderTop: '1px solid #ECECED',
                    borderBottom: '1px solid #ECECED',
                }}
            />
        );


        return (
            <ListView
                ref={el => this.lv = el}
                dataSource={dataSource}
                renderSeparator={separator}
                renderRow={renderRow}
                renderFooter={() => (
                    <div style={{ padding: 25, textAlign: 'center' }}>
                        { loading ?
                            <span><Icon type={'loading'} /><span style={{verticalAlign:"20%",marginLeft:5}}>加载中...</span></span> :
                            list.length ? '已全部加载' : <Empty />
                        }
                    </div>
                )}
                style={{
                    height,
                    // border: '1px solid #ddd',
                    margin: '5px 0',
                }}
                pullToRefresh={
                    <PullToRefresh
                        refreshing={loading}
                        onRefresh={this.onRefresh}
                    />
                }
                onEndReached={this.onEndReached}
                onEndReachedThreshold={100}
                pageSize={size}
            />
        );
    }
}
