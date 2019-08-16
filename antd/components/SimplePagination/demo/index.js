import React, {PureComponent} from 'react';
import SimplePagination from '@/components/SimplePagination';

export default class Demo extends PureComponent {

    onChange = (page, pageSize)=>{
        console.log(page, pageSize)
    };

    render() {
        return (
            <SimplePagination current={1} pageSize={1} total={2} onChange={this.onChange}/>
        );
    }
}