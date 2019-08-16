import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Select,Spin } from 'antd';
const Option = Select.Option;

/**
 * 获取街道由高德提供，所以需要申请开发者key，见：https://lbs.amap.com/api/webservice/guide/api/district
 * @type {string}
 */
const key = '19693c0a3e1929156e961e17bdf30b25';

export default class SimpleRegionTown extends PureComponent {
    townList = [];

    state = {
        value:undefined,
        fetching:false,
    };

    static propTypes = {
        other: PropTypes.object,
        county  : PropTypes.object,
        onChange: PropTypes.func,
    };

    static defaultProps = {
        other: undefined,
        county: undefined,
        onChange: () => { },
    };

    constructor(props) {
        super(props);
    }

    selectItem = (item) => {
        this.setState({value: item});
        const {onChange} = this.props;
        onChange(item);
    };

    componentWillReceiveProps(props){
        const { county = {} , value} = props;
        if(!value){
            this.setState({ value: undefined });
        }
        if(county.code){
            if(! this.townList.find(item => Object.is(item.county*1,county.code*1)))
                this.fetch(county.code);
            if(this.countyCode !== county.code)
                this.setState({ value: undefined });
            this.countyCode = county.code;
        }
    }

    fetch = (countyCode) => {
        this.setState({ fetching: true });
        fetch(`https://restapi.amap.com/v3/config/district?key=${key}&keywords=${countyCode}&subdistrict=&extensions=`)
            .then(response => response.json())
            .then((body) => {
                if(Array.isArray(body.districts) && body.districts.length &&  Array.isArray(body.districts[0].districts) && body.districts[0].districts.length){
                    const list = body.districts[0].districts.map(item =>item.name);
                    this.townList = this.townList.concat({county:countyCode,'children':list});
                }
                this.setState({ fetching: false });
            })
            .catch(error =>  this.setState({ fetching: false }));
    };
    render() {
        const { other, county = {} } = this.props;
        const { fetching, value } = this.state;
        const list = (this.townList.find(item => Object.is(item.county*1, county.code*1)) || [])['children'] || [];
        const option = list.length ? list.map((item,index)=> <Option key={index} value={item}>{item}</Option>) : <Option key={0} value={0} disabled>没有找到选项</Option>;

        return (
            <Select
                // labelInValue
                value={value}
                notFoundContent={fetching ? <Spin size="small" /> : null}
                placeholder={fetching ? <span><Spin size="small" /> 加载中...</span> : '请选择街道'}
                onSelect={(item)=>this.selectItem(item)}
                showSearch={true}
                allowClear={true}
                {...other}
            >
               {option}
            </Select>
        );
    }
}