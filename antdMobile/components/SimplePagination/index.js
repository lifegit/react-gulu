import React from 'react';
import { Pagination, Icon } from 'antd-mobile';
import styles from './index.less'

export default class SimplePagination extends React.Component {

    render() {
        const props =  this.props;
        return (
            <Pagination
                className={styles["custom-pagination-with-icon"] }
                locale={{
                    prevText: (<span className={styles["arrow-align"]}><Icon type="left" />上一页</span>),
                    nextText: (<span className={styles["arrow-align"]}>下一页<Icon type="right" /></span>),
                }}
                {...props}
            />
        );
    }
}
