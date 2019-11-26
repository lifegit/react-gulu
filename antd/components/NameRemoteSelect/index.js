import React from 'react';
import { Select, Spin } from 'antd';
import debounce from 'lodash/debounce';

const Option = Select.Option;

export default class NameRemoteSelect extends React.Component {
    constructor(props) {
        super(props);
        this.handleSearch = debounce(this.handleSearch, 800);
        this.cacheSearch = [];
    }

    handleSearch = (value) => {
        if(value && ! this.cacheSearch.find(d => d === value)) {
            this.cacheSearch.push(value);
            const { onSearch =()=>{}  }  = this.props;
            onSearch(value);
        }
    };

    handleChange = (value) => {
      const { onChange =()=>{}  }  = this.props;
      onChange(value);
    };

    render() {
        const { names = [] , loading = false , style = undefined , field = [], fieldSign = '-', mode = 'multiple' , ...other } = this.props;
        return (
            <div>
                <Select
                    {...other}
                    showSearch
                    style={style ||  { width:'100%' }}
                    tokenSeparators={[',']}
                    mode={mode}
                    labelInValue
                    notFoundContent={loading ? <Spin size="small" /> : '未搜索到内容'}
                    filterOption={false}
                    allowClear={true}
                    onSearch={this.handleSearch}
                    onChange={this.handleChange}
                    onSelect={this.handleChange}
                    onDeselect={this.handleChange}
                >
                    {names.map( (d,index) =>
                        <Option key={d.id || index} >{(field.length ? field.map(t => d[t]) : Object.values(d) ).filter(t=>t).join(fieldSign)}</Option>
                    )}
                </Select>
            </div>

        );
    }
}
