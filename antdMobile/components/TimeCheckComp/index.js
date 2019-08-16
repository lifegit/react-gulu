import React from "react";
import { timeNowContrast } from '@/utils/utils'
import styles from "./styles.less";
import { Statistic } from 'antd';

export default class extends React.PureComponent {

    state = {
      i: 0,
    };

    render() {
        const {start, end ,title = "时间", children} = this.props;

        return (
            ! children ? null : (
                !timeNowContrast(new Date(start).getTime()) ? (
                        <div style={{ marginBottom: 5,color:'red',fontSize:18,textAlign:'center' }}>{title}还未开始<div>
                            <span style={{ color:'#000',fontSize:15,paddingRight:5 }}>将于</span>
                            <Statistic.Countdown
                                onFinish={()=>this.setState({i: this.state.i + 1})} // 重新触发 render
                                className={styles.countdown}
                                format="D 天 H 时 m 分 s 秒"
                                valueStyle={{fontSize: 16,fontWeight:500}}
                                value={new Date(start).getTime()}/>
                            <span style={{ color:'#000',fontSize:15,paddingLeft:5 }}>后开始</span></div>
                        </div>
                    ) :
                    timeNowContrast(new Date(end).getTime()) ? (
                        <div style={{ marginBottom: 5,color:'red',fontSize:18,textAlign:'center' }}>{title}已截止</div>
                    ) : children
            )
        )
    }
}
