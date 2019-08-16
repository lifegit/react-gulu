import React, {Component} from "react";
import {Card, Icon} from "antd";
import PageHeaderWrapper from "@/components/PageHeaderWrapper";
import SimpleTable from "@/components/SimpleTable";
import SimpleRegion from '@/components/SimpleRegion';

/**
 * 演示省市区组件在表格中的使用
 */
export default class Demo extends Component {

    showData = (data) => {
        if(data.filtered && data.filtered.province){
            const filtered = {
                province:[data.filtered.province[0].province.name],
                city     :[data.filtered.province[0].city.name],
                county   :[data.filtered.province[0].county.name],
            };
            Object.assign(data.filtered,filtered);
        }
        console.log(data)

        // const {dispatch} = this.props;
        // dispatch({
        //     type: 'data/list',
        //     payload: data,
        // });
    };


    columns = [
        {
            title: '姓名',
            dataIndex: 'name',
            align: "center",
            width: 100,
        },
        {
            title: '行政区域',
            dataIndex: 'province',
            align: "center",
            width: 200,
            children: [{
                title: '省',
                dataIndex: 'province',
                align: "center",
                width: 100,
            },{
                title: '市',
                dataIndex: 'city',
                align: "center",
                width: 100,
            },{
                title: '区',
                dataIndex: 'county',
                align: "center",
                width: 100,
            }],
            filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
                <SimpleRegion
                    other={{
                        onPopupVisibleChange:(visible)=>{ if(!visible) confirm() } // 因为在表格中往往不是onchang而触发搜索，而是在弹窗消失时触发搜索，我们我们监听弹窗
                    }}
                    onChange={(data)=>{data.province.name || data.county.name || data.province.name ? setSelectedKeys([data]) : clearFilters() }}
                    filtered={{province:['山东省'],city:['济南市'],county:['历下区']}} // 过滤
                />
            ),
            filterIcon: filtered => <Icon type="environment" style={{color: filtered ? '#108ee9' : '#aaa'}}/>,
        },
    ];

    render() {
        const list = {
            'data':[
                {name:'张三',province:'山东省',city:'济南市',county:'历下区'},
                {name:'王五',province:'山东省',city:'淄博市',county:'张店区'}
            ],
            'page':{'allLength':2,'pageLength':20},
        };

        const table = {
            loading: false,
            columns: this.columns,
            data: list,
        };

        return (
            <PageHeaderWrapper title={"行政区域"}>
                <Card bordered={false}>
                    <SimpleTable {...table} showData={this.showData}/>
                </Card>
            </PageHeaderWrapper>
        );
    }
}