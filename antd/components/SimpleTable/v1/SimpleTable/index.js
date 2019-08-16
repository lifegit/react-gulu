import React, { PureComponent,Fragment } from 'react';
import produce from 'immer'
import SimplePagination from  '@/components/SimplePagination'
import {
    Table,
    Input,
    Button,
    Icon,
} from 'antd';

import styles from './index.less';

export default class SimpleTable extends PureComponent {
    state = {
        table:{
            page:{
                current:1,
            },
            condition:{
                sorted:{

                },
                filtered:{

                },
                searched:{

                },
            },
        },
    };
    componentDidMount() {
        this.showData(1);
    }
    showData=(page = 1)=>{
        const condition = this.state.table.condition;
        const data = {page};
        Object.keys(condition).forEach(function(key){
            if(key === 'sorted'){
                if(condition.sorted.key && condition.sorted.order)
                    data.sorted = condition.sorted;
            }else if(key === 'searched'){
                data.searched = {};
                Object.keys(condition.searched).forEach(function(key_searched){
                    if(condition.searched[key_searched]){
                        data.searched[key_searched] = condition.searched[key_searched];
                    }
                });
                if(Object.keys(data.searched).length === 0)
                    delete  data.searched;
            }else if (key === 'filtered'){
                data.filtered = {};
                Object.keys(condition.filtered).forEach(function(key_filtered){
                    if(Array.isArray(condition.filtered[key_filtered]) && condition.filtered[key_filtered].length > 0 ){
                        data.filtered[key_filtered] = condition.filtered[key_filtered];
                    }
                });
                if(Object.keys(data.filtered).length === 0)
                    delete  data.filtered;
            }
        });

        this.setState(produce(draft => {
            draft.table.page.current = page;
        }),()=>{
            this.props.showData(data);
        });
    };

    handleChange = (pagination, filters, sorter) => {
        const filters_ = {...filters};
        Object.keys(this.state.table.condition.searched).forEach(function(key){
            if(filters_.hasOwnProperty(key))
                delete filters_[key];
        });
        const sorterOrder = sorter.order ? sorter.order.toString().split('end')[0] : null;
        const sorterKey = sorter.columnKey ? sorter.columnKey : null;

        this.setState(produce(draft => {
            draft.table.condition.filtered = filters_;
            draft.table.condition.sorted.key = sorterKey;
            draft.table.condition.sorted.order = sorterOrder;
        }),()=>{
            //console.log('Various parameters',this.state.table.condition,pagination, filters_, sorter);
            this.showData(1);
        });
    };


    creatSelected = (dataIndex) =>{
        return {
            filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
                <div className={styles.customFilterDropdown}>
                    <Input
                        ref={ele => this.searchInput = ele}
                        placeholder="搜索"
                        value={selectedKeys[0]}
                        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => {
                            this.setState(produce(draft => {
                                draft.table.condition.searched[dataIndex] = selectedKeys[0]
                            }), () => {
                                confirm();
                            });
                        }}
                    />
                    <Button type="primary" onClick={() => {
                        this.setState(produce(draft => {
                            draft.table.condition.searched[dataIndex] = selectedKeys[0]
                        }), () => {
                            confirm();
                        });
                    }}>搜索</Button>
                    <Button style={{marginRight:0}} onClick={() => {
                        clearFilters();
                        this.setState(produce(draft => {
                            draft.table.condition.searched[dataIndex] = null
                        }))
                    }}>重置</Button>
                </div>
            ),
            filterIcon: filtered => <Icon type="search" style={{color: filtered ? '#108ee9' : '#aaa'}}/>,
            onFilterDropdownVisibleChange: (visible) => {
                if (visible) {
                    setTimeout(() => {
                        this.searchInput.focus();
                    });
                }
            },
        };
    };

    render() {
        const _this = this;
        const columns_ = [...this.props.columns];
        let width = 0;
        columns_.forEach(function (item,index) {

            if (item.selected) {
                columns_[index] = Object.assign(item, _this.creatSelected(item.dataIndex));
            }
            if(item.width){
                width += item.width;
            }
            if(item.filter){
                //const typeFilters = item.filter.map((value,index,array) => (if(value){ 'text': value, 'value': index }));
                const typeFilters = [];
                item.filter.forEach(function(value,index,array){
                    if(value){
                        typeFilters.push( { 'text': value, 'value': index });
                    }
                });
                delete columns_[index].filter;
                columns_[index].filters = typeFilters;
            }
        });

        const {columns,...table} = _this.props;
        const data = table.data && table.data.data ? table.data.data : [];
        const page = table.data && table.data.page ? table.data.page : {pageLength:1,allLength:1};
        const {current} = this.state.table.page;
        const {childrenColumnName = undefined} = this.props

        const children = childrenColumnName || 'children';
        data.forEach(function(value,index,array){
            data[index].key = index;
            if(data[index][children]){
                data[index][children].forEach(function(value,i,array){
                    data[index][children][i].key = index+'_'+i;
                });
            }
        });

        return (
            <Fragment>
                <Table dataSource={data} rowKey='key' columns={columns_} onChange={this.handleChange} bordered size='middle' pagination={false} scroll={{ x: width+50 }} {...table} />
                {page !== null ? (<SimplePagination onChange={(page)=>this.showData(page)} current={current} pageSize={page.pageLength} total={page.allLength}/>) :null}
            </Fragment>
        );
    }
}