import React, {PureComponent} from 'react';
import {connect} from 'dva';

import SimpleTable from '@/components/SimpleTable';

const type = ['', '开发者', '用户'];

const columns = [
    {
        title: '类型',
        dataIndex: 'type',
        align: 'center',
        width: 60,
        render: (text, record, index) => {
            return <div>{type[text]}</div>
        },
        filter: type,
    },
    {
        title: 'ID',
        dataIndex: 'id',
        align: 'center',
        width: 60,
    },
    {
        title: '名称',
        dataIndex: 'name',
        align: 'center',
        width: 40,
        selected: true,
    },
    {
        title: '工资',
        dataIndex: 'money',
        align: 'center',
        width: 50,
    }, {
        title: '密钥',
        dataIndex: 'code',
        align: 'center',
        width: 60,
    }, {
        title: '入职时间',
        dataIndex: 'time',
        align: 'center',
        width: 180,
        sorter: true,
    },
];

// production
// /* eslint react/no-multi-comp:0 */
// @connect(({record, loading}) => ({
//     record,
//     listLoading: loading.effects["record/list"]
// }))
export default class Demo extends PureComponent {
    showData = (data) => {
        // console.log(data);
        // { page: 1 , filtered: {type: Array(1)} , searched: {name: "1"} , sorted: {key: "time", order: "asc"} }

        // data建议直接交给后台
        // production
        // const {dispatch} = this.props;
        // dispatch({
        //     type: 'record/getData',
        //     payload: data,
        // });
    };
    render() {
        // production
        // const {
        //     record: {list},
        //     listLoading,
        // } = this.props;

        // development
        const list = {
            'list':[
                {'type':1,'id':1,'name':'王刚','money':'1.50','code':'2529','time':'2018-11-07 16:11:39'},
                {'type':2,'id':2,'name':'王华','money':'1.50','code':'6524','time':'2018-11-07 16:06:13'},
            ],
            'page':{'total':2,'size':20},
        };
        const listLoading = false;


        const table = {
            loading: listLoading,
            columns: columns,
            data: list,
        };
        return (
            <SimpleTable {...table} showData={this.showData}/>
        );
    }
}
