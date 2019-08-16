import React, { PureComponent } from 'react';
import { Pagination } from 'antd';

export default class SimplePagination extends PureComponent {

    render() {
        const { current = 1 ,pageSize = 1 , total = 0} = this.props;
        return (
           // simple
            <Pagination current={current} pageSize={pageSize} total={total}  size="small" showQuickJumper hideOnSinglePage={true} onChange={(page, pageSize)=>{this.props.onChange(page, pageSize)}} style={{ textAlign:'right',paddingTop:10 }} />
      );
    }
}