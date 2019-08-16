import NumericInput from "@/components/NumericInput";
import React from 'react';

export default class Demo extends React.Component {
    constructor(props) {
        super(props);
        this.state = { value: '' };
    }

    onChange = (value) => {
        this.setState({ value });
    };

    render() {
        return (
            <NumericInput placeholder={"输入哇"} isTooltip={true} isFormat={true} value={this.state.value} onChange={this.onChange} />
        );
    }
}