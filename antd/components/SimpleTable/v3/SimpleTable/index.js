import React, { PureComponent,Fragment } from 'react';
import PropTypes from 'prop-types';
import { Table, Input, Button, Icon } from 'antd';
import SimplePagination from  '@/components/SimplePagination'
import styles from './index.less';

export const OrderAsc  = 'asc';
export const OrderDesc = 'desc';

/**
 * author : TheLife
 * time	: 2019-12-02
 * version :3.0
 */
export default class SimpleTable extends PureComponent {
  static propTypes = {
    loading: PropTypes.bool,
    columns: PropTypes.array,
    data: PropTypes.object,
    defaultValue: PropTypes.object,
    childrenColumnName: PropTypes.string,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    loading: false,
    columns: [],
    data: {list:[],page:{total:0,size:0}},
    defaultValue: {filteredInfo:{},sortedInfo:{}},
    childrenColumnName: 'children',
    onChange: ()=>{}
  };

  constructor(props){
    super(props);

    const {defaultValue = {}, columns = {} } = this.props;
    const {filteredInfo = {}, sortedInfo = {}} = defaultValue;

    const filteredInfoOk = {};
    const sortedInfoOk = {};
    // eslint-disable-next-line array-callback-return
    columns.map(item => {
      const o = filteredInfo[item.dataIndex];
      if (o){
        if(item.selected){
          filteredInfoOk[item.dataIndex] = o.toString()
        }else if(item.filter && Array.isArray(o)){
          filteredInfoOk[item.dataIndex] = o
        }
      }else if(sortedInfo.field === item.dataIndex){
        if([OrderDesc,OrderAsc].includes(sortedInfo.order)){
          Object.assign(sortedInfoOk, sortedInfo)
        }
      }
    });
    // console.log('Table DefaultValue','filteredInfo',filteredInfoOk,'sortedInfo',sortedInfoOk)

    this.state = {
      current: 1,
      filteredInfo: filteredInfoOk, // {filterKey: array, selectedKey: string},
      sortedInfo: sortedInfoOk, // {field: string, order:'asc|desc'},
    };
    this.handData()
  }

  clear = () => {
    this.setState({ filteredInfo: {}, sortedInfo: {} });
  };

  handleTableChange = (pagination, filters, sorter) => {
    // console.log('Table Various parameters', pagination, filters, sorter);
    this.setState({ filteredInfo: filters, sortedInfo: sorter, },()=>{
      this.handData()
    });
  };

  handlePageChange = (current) =>{
    this.setState({current},()=>{
      this.handData()
    })
  };

  handData = () => {
    const {current, filteredInfo, sortedInfo} = this.state;
    // filtered
    const filtered = {};
    const { columns } = this.props;
    // eslint-disable-next-line array-callback-return
    Object.keys(filteredInfo).map(value => {
      const o = filteredInfo[value];
      if(o && o.length){
        const f = columns.find(it => it.dataIndex === value);
        filtered[value] = f.selected ? o.toString().trim() : o
      }
    });

    // sorted
    const sorted = sortedInfo.order ? {field: sortedInfo.field, type: sortedInfo.order.toString().split('end')[0]} : {};

    // onChange
    const { onChange } = this.props;
    const param = {page: current};
    if(Object.keys(filtered).length){ param.filtered = filtered }
    if(Object.keys(sorted).length)  { param.sorted   = sorted }

    onChange(param)
  };

  // eslint-disable-next-line react/sort-comp
  selected = {
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div className={styles.customFilterDropdown}>
        <Input
          ref={ele => this.searchInput = ele}
          placeholder="搜索"
          value={selectedKeys ? selectedKeys.toString() : ''}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => { confirm() }}
        />
        <Button
          type="primary"
          onClick={() => { confirm() }}
        >搜索
        </Button>
        <Button
          style={{ marginRight: 0 }}
          onClick={() => { clearFilters() }}
        >重置
        </Button>
      </div>
    ),
    filterIcon: filtered =>  <Icon type="search" style={{ color: filtered ? '#108ee9' : '#aaa' }} />,
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => {
          this.searchInput.focus();
        });
      }
    },
  };


  render() {
    const { current = 1, sortedInfo = {}, filteredInfo = {} } = this.state;
    const { columns, childrenColumnName, data = {},onChange, ...other } = this.props;
    const {  list = [] , page = {}  } = data;
    const { size = 1, total = 1 } = page;

    // eslint-disable-next-line no-unused-vars
    let width = 0;
    const intactColumns = columns.map(item => {
      if(item.width){
        width += item.width
      }
      if (item.selected) {
        // eslint-disable-next-line no-use-before-define
        Object.assign(item, this.selected)
        // eslint-disable-next-line no-param-reassign
        item.filteredValue = filteredInfo[item.dataIndex] || null;
      }
      if(Array.isArray(item.filter)){
        // eslint-disable-next-line no-param-reassign
        item.filters = item.filter.map((value,index) => ({ 'text': value, 'value': index })).filter(value => value.text);
        // eslint-disable-next-line no-param-reassign
        item.filteredValue = filteredInfo[item.dataIndex] || null;
      }
      if(item.sorter){
        // eslint-disable-next-line no-param-reassign
        item.sortOrder = sortedInfo.field === item.dataIndex && sortedInfo.order
      }

      return item
    });


    // eslint-disable-next-line no-use-before-define
    const dataSource = randKey(list,childrenColumnName);

    return (
      <Fragment>
        <Table
          bordered
          size='middle'
          rowKey='key'
          pagination={false}
          scroll={{ x: width + 50 }}
          columns={intactColumns}
          dataSource={dataSource}
          onChange={this.handleTableChange}
          {...other}
        />
        <SimplePagination
          current={current}
          total={total}
          pageSize={size}
          onChange={this.handlePageChange}
        />
      </Fragment>
    );
  }
}

const randKey = (list,childrenColumnName,level = 0) => (
  list.map((item,index) => {
    // eslint-disable-next-line no-param-reassign,no-plusplus
    level++;
    // eslint-disable-next-line no-param-reassign
    item.key = `${level}-${index}`;
    if(Array.isArray(item[childrenColumnName])){
      // eslint-disable-next-line no-param-reassign,no-plusplus
      item[childrenColumnName] = randKey(item[childrenColumnName],childrenColumnName,level + index)
    }
    return item;
  })
)

