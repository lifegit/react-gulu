import React, { PureComponent } from 'react';
import {
    Form,
    Input,
    Button,
    InputNumber,
    Icon,
    Tooltip,
} from 'antd';

import Toast from '@/components/Toast'
import {legalNum,legalURL,legalRoutine,legalEmail,validateMobile} from '@/utils/validate';
import NumericInput from  '@/components/NumericInput'

const FormItem = Form.Item;
const FormDemo =  Form.create()(
class Demo extends React.Component {
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                Toast.success('success');
            }
        });
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 8,
                },
            },
        };

        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem {...formItemLayout} label={'账号'} hasFeedback>
                    {getFieldDecorator('username', {
                        initialValue:'testVD',
                        rules: [
                            {
                                trigger:'change',
                                required: true,
                                validator:(rule, value, callback)=>{
                                    let run; (run = legalRoutine(value,6,18)) === true ? callback() : callback(new Error(`账号${run}`))
                                },
                            },
                        ],
                    })(<Input placeholder="请输入账号" />)}
                </FormItem>
                <FormItem {...formItemLayout} label={'密码'} hasFeedback>
                    {getFieldDecorator('password', {
                        rules: [
                            {
                                trigger:'change',
                                required: true,
                                validator:(rule, value, callback)=>{
                                    let run;
                                    if((run = legalRoutine(value,6,18,true,true,false,true)) !== true)
                                        callback(new Error(`密码${run}`));
                                    const form = this.props.form;
                                    if (value && form.getFieldValue('password2')) {
                                        form.validateFields(['password2'], { force: true });
                                    }
                                    callback();
                                },
                            }
                        ],
                    })(<Input.Password type="password" placeholder="请输入密码" />)}
                </FormItem>
                <FormItem {...formItemLayout} label="确认密码" hasFeedback>
                    {getFieldDecorator('password2', {
                        rules: [
                            {
                                trigger:'change',
                                required: true,
                                validator:(rule, value, callback)=>{
                                    let run;
                                    if((run = legalRoutine(value,6,18,true,true,false,true)) !== true)
                                        callback(new Error(`密码${run}`));
                                    const form = this.props.form;
                                    if (value && value !== form.getFieldValue('password')) {
                                        callback('两次密码不一致!');
                                    } else {
                                        callback();
                                    }
                                }
                            },
                        ]
                    })(
                        <Input.Password type="password" placeholder="请输入确认密码"/>
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label={'姓名'} hasFeedback>
                    {getFieldDecorator('name', {
                        rules: [
                            {
                                trigger:'change',
                                required: true,
                                validator:(rule, value, callback)=>{
                                    let run; (run = legalRoutine(value,1,10,true,false,true)) === true ? callback() : callback(new Error(`姓名${run}`))
                                },
                            },
                        ],
                    })(<Input placeholder="请输入姓名" />)}
                </FormItem>
                <FormItem {...formItemLayout} label={'备注'} hasFeedback>
                    {getFieldDecorator('other', {
                        rules: [
                            {
                                trigger:'change',
                                validator:(rule, value, callback)=>{
                                    if(!value) callback();
                                    let run; (run = legalRoutine(value,1,20,true,true,true,true)) === true ? callback():callback(new Error(`备注${run}`))
                                },
                            },
                        ],
                    })(<Input placeholder="请输入备注" />)}
                </FormItem>
                <FormItem {...formItemLayout} label={'手机号'} hasFeedback>
                    {getFieldDecorator('mobile', {
                        rules: [
                            {
                                trigger:'change',
                                required: true,
                                min:11,
                                max:11,
                                validator:(rule, value, callback)=>{
                                    let run; (run = validateMobile(value)) === true ? callback() : callback(new Error(`请正确输入手机号`))
                                },
                            },
                        ],
                    })(<NumericInput isTooltip={true} isFormat={false} placeholder="请输入手机号"/>)}

                </FormItem>
                <FormItem{...formItemLayout} label={'邮箱'} hasFeedback>
                    {getFieldDecorator('email2', {
                        rules: [{
                            trigger:'change',
                            required: true,
                            type: 'email',
                            message: '请正确输入邮箱!',
                            min:3,
                            max:30,
                        }],
                    })(
                        <Input placeholder="请输入邮箱"/>
                    )}
                </FormItem>

                <FormItem {...formItemLayout} hasFeedback
                          label={
                              <span>
                              主页
                                <Tooltip title="个人博客" className="form-optional">
                                  <Icon type="info-circle-o" style={{ marginRight: 4 }} />
                                </Tooltip>
                              </span>
                          }>
                    {getFieldDecorator('blog', {
                        rules: [
                            {
                                trigger:'change',
                                required: true,
                                type:'url',
                                message: '主页应为一个正确地址!',
                                min:3,
                                max:200,
                            },
                        ],
                    })(<Input placeholder="请输入主页" />)}
                </FormItem>
                <FormItem {...formItemLayout} label={'税前工资'} hasFeedback>
                    {getFieldDecorator('wages', {
                        initialValue:'3333.33',
                        rules: [
                            {
                                trigger:'change',
                                required: true,
                                validator:(rule, value, callback)=>{
                                    let run;(run = legalNum(value,0,10000,2)) === true?callback():callback(new Error(`工资${run}`))
                                },
                            },
                        ],
                    })(<InputNumber placeholder="输入工资" min={0} max={10000} style={{width:200}} />)}
                </FormItem>
                <FormItem {...formItemLayout} label={'税款'} hasFeedback>
                    {getFieldDecorator('tax', {
                        rules: [
                            {
                                trigger:'change',
                                required: true,
                                validator:(rule, value, callback)=>{
                                    let run;(run = legalNum(value,0,10000)) === true?callback():callback(new Error(`税款${run}`))
                                },
                            },
                        ],
                    })(<InputNumber placeholder="请输入税款" min={0} max={10000} style={{width:200}} onPressEnter={this.handleSubmit}/>)}
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">生成</Button>
                </FormItem>
            </Form>
        );
    }
});


export default class BasicForms extends PureComponent {
    render() {
        return (
            <FormDemo/>
        );
    }
}
