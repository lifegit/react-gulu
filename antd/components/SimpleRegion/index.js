import React, {PureComponent} from 'react';
import {Cascader} from 'antd';
import PropTypes from 'prop-types';
import bData from "./data.json";
import SimpleRegionTown from './SimpleRegionTown';

const forVL=(options)=>{
    return options.map(item=> {
        item.v = item.l;
        if(item.h) forVL(item.h);
        return item;
    });
};
const data = forVL(bData);


class SimpleRegion extends PureComponent {
    static propTypes = {
        other: PropTypes.object,
        filtered: PropTypes.object,
        onChange: PropTypes.func,
    };

    static defaultProps = {
        other: undefined,
        filtered: undefined,
        onChange: () => { },
    };

    constructor(props) {
        super(props);

        const value = props.value || {};
        const {province = {}, city = {}, county={} } = value;
        this.state = {
            province,city,county
        };
    }

    static getDerivedStateFromProps(nextProps) {
        // Should be a controlled component.
        if ('value' in nextProps) {
            return {
                ...(nextProps.value || {}),
            };
        }
        return null;
    }

    onCascaderChange = (value, selectedOptions) => {
        const info = {
            province: {code: undefined, name: undefined},
            city: {code: undefined, name: undefined},
            county: {code: undefined, name: undefined},
        };
        if (value.length && selectedOptions.length) {
            if (selectedOptions.length >= 1)
                info.province = {code: selectedOptions[0].c, name: selectedOptions[0].l};
            if (selectedOptions.length >= 2)
                info.city = {code: selectedOptions[1].c, name: selectedOptions[1].l};
            if (selectedOptions.length >= 3)
                info.county = {code: selectedOptions[2].c, name: selectedOptions[2].l};
        }
        if (!('value' in this.props)) {
            this.setState({ ...info });
        }

        const {onChange} = this.props;
        onChange(info);
    };

    render() {
        const {other, filtered} = this.props;
        const {province = {}, city = {}, county = {} } = this.state;

        // filtered
        let options = JSON.parse(JSON.stringify(data));// 必须要深拷贝
        if (Object.is(typeof filtered, 'object')) {
            const {province = [], city = [], county = []} = filtered;
            if (province.length) { // &&  && county.length
                options = options.filter(itemProvince => {
                    if (city.length) {
                        itemProvince.h = itemProvince.h.filter(itemCity => {
                            if (county.length) {
                                itemCity.h = itemCity.h.filter(itemCounty => {
                                    return county.includes(itemCounty.l);
                                });
                            }
                            return city.includes(itemCity.l);
                        });
                    }
                    return province.includes(itemProvince.l);
                });
            }
        }

        return (
            <Cascader
                 value={[province.name, city.name, county.name]}
                 style={{width: '100%'}}
                 autoFocus={true}
                 changeOnSelect
                 fieldNames={{label: 'l', value: 'v', children: 'h'}}
                 options={filtered ? options : data}
                 onChange={this.onCascaderChange}
                 placeholder="请搜索省市区名称"
                 showSearch={{matchInputWidth: true}}
                 notFoundContent={'无搜索结果'}
                 {...other}
            />
        );
    }
}

/**
 * 构造一个Region的value对象
 * @param provinceName
 * @param cityName
 * @param countyName
 * @returns {{province: {code: undefined, name: undefined}, city: {code: undefined, name: undefined}, county: {code: undefined, name: undefined}}}
 * @constructor
 */
SimpleRegion.BuildRegionValue = (provinceName,cityName,countyName)=>{
    const info = {
        province: {code: undefined, name: undefined},
        city: {code: undefined, name: undefined},
        county: {code: undefined, name: undefined},
    };
    let temp = data.find(item => item.l === provinceName);
    if(temp){
         info.province.code = temp.c;
         info.province.name = temp.l;
         temp = temp.h.find(item => item.l === cityName);
        if(temp){
            info.city.code = temp.c;
            info.city.name = temp.l;
            temp = temp.h.find(item => item.l === countyName);
            if(temp){
                info.county.code = temp.c;
                info.county.name = temp.l;
            }
        }
    }

    return info;
};
SimpleRegion.SimpleRegionTown = SimpleRegionTown;



export default SimpleRegion;
