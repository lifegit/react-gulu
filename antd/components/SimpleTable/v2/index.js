import React, { PureComponent,Fragment } from 'react';
import PropTypes from 'prop-types';
import SimplePagination from  '@/components/SimplePagination'
import { Table, Input, Button, Icon } from 'antd';
import styles from './index.less';

/**
 * author : TheLife
 * time	: 2019-07-30
 * version :2.0
 */
export default class SimpleTable extends PureComponent {
  static propTypes = {
    loading: PropTypes.bool,
    columns: PropTypes.array,
    data: PropTypes.object,
    childrenColumnName: PropTypes.string,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    loading: false,
    columns: [],
    data: {list:[],page:{total:0,size:0}},
    childrenColumnName: 'children',
    onChange: ()=>{}
  };

  filtered = {};

  sorted = {};

  current = 1;

  // eslint-disable-next-line react/sort-comp
  componentDidMount(){
    this.showData(1)
  }

  selected = {
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div className={styles.customFilterDropdown}>
        <Input
          ref={ele => this.searchInput = ele}
          placeholder="搜索"
          value={selectedKeys[0]}
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
    filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#108ee9' : '#aaa' }} />,
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => {
          this.searchInput.focus();
        });
      }
    },
  };

  handleChange = (pagination, filters, sorter) => {
    // filtered
    this.filtered = {};
    const { columns } = this.props;
    // eslint-disable-next-line array-callback-return
    Object.keys(filters).filter(value => {
      if(filters[value].length){
        const f = columns.find(it => it.dataIndex === value);
        this.filtered[value] = f.selected ? filters[value][0].trim() : filters[value]
      }
    });
    // sorted
    this.sorted = sorter.columnKey ? {name: sorter.columnKey, type: sorter.order.toString().split('end')[0]} : {};

    this.showData(1)
  };

  showData = (page) =>{
    this.current = page;
    const res = {page};
    if(Object.keys(this.filtered).length){ res.filtered = this.filtered }
    if(Object.keys(this.sorted).length)  { res.sorted   = this.sorted }

    const { onChange} = this.props;
    onChange(res)
  };


  render() {
    const { columns, childrenColumnName, data = {},onChange, ...other } = this.props;
    const {  list = [] , page = {}  } = data;
    const { size = 1, total = 1 } = page;

    // eslint-disable-next-line no-unused-vars
    let width = 0;
    const intactColumns = columns.map(item => {
      if (item.selected) {
        // eslint-disable-next-line no-use-before-define
        Object.assign(item, this.selected)
      }
      if(item.width){
        width += item.width
      }
      if(Array.isArray(item.filter)){
        // eslint-disable-next-line no-param-reassign
        item.filters = item.filter.map((value,index) => ({ 'text': value, 'value': index })).filter(value => value.text);
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
          onChange={this.handleChange}
          {...other}
        />
        <SimplePagination
          current={this.current}
          total={total}
          pageSize={size}
          onChange={this.showData}
        />
      </Fragment>
    )
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
