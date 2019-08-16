import React, {PureComponent} from 'react';
import Toast from '@/components/Toast';

export default class Demo extends PureComponent {

    componentDidMount() {
        Toast.success('success',7);
        setTimeout(() => {
                Toast.error('error')},
            2000);
    }
    render() {
        return (
            <div />
        );
    }
}