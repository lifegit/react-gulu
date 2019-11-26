import React, { PureComponent,Fragment } from 'react';
import SimpleRegion from '@/components/SimpleRegion';
import { Form,Button,Select } from 'antd';
const FormItem = Form.Item;
const { SimpleRegionTown } = SimpleRegion;


/**
 * 演示省市区组件及街道组件在表单中的使用
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
                            rules: [{
                                trigger:'change',
                                required: true,
                                validator:(rule, value = {}, callback)=>{
                                    const {province = {}, city = {}, county = {}} = value;
                                    province.name && city.name && county.name ? callback() : callback(new Error('请选择行政区域'));
                                },
                            }],
                        })(
                            <SimpleRegion
                                other={{
                                    changeOnSelect:false,// false后强制选到区
                                }}
                                onChange={(data)=>{ if(data.county){this.regionCounty = data.county;}}}
                            />
                        )}
                    </FormItem>
                    <FormItem
                        label="Town"
                        hasFeedback
                    >
                        {getFieldDecorator('town', {
                            rules: [{
                                trigger:'change',
                                required: true,
                                validator:(rule, value, callback)=>{
                                    value ? callback() : callback(new Error('请选择街道'));
                                },
                            }],
                        })(
                            <SimpleRegionTown county={this.regionCounty}/>
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
