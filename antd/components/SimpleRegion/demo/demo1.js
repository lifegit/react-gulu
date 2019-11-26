import React, { PureComponent,Fragment } from 'react';
import SimpleRegion from '@/components/SimpleRegion';
const { BuildRegionValue } = SimpleRegion;
import { Form,Button } from 'antd';
const FormItem = Form.Item;

/**
 * 演示省市区组件在表单中的使用
 */
@Form.create()
export default class Demo extends PureComponent {
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);

                this.props.form.resetFields();
            }
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Fragment>
                <Form onSubmit={this.handleSubmit}>
                    <FormItem
                        label="SimpleRegion"
                        hasFeedback
                    >
                        {getFieldDecorator('region', {
                            initialValue: BuildRegionValue('北京市','市辖区','西城区'), // 需要这么设置默认值
                            rules: [{
                                trigger:'change',
                                required: true,
                                validator:(rule, value = {}, callback)=>{callback();
                                    console.log('value',value)
                                    const {province = {}, city = {}, county = {}} = value;
                                    province.name || city.name || county.name ? callback() : callback(new Error('请选择行政区域'));
                                },
                            }],
                        })(
                            <SimpleRegion/>
                        )}
                    </FormItem>

                    <FormItem >
                        <Button type="primary" htmlType="submit">ok</Button>
                    </FormItem>
                </Form>
            </Fragment>
        );
    }
}
