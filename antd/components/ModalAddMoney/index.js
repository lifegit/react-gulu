import React from 'react';
import {Select, Modal,Form,} from "antd";
const FormItem = Form.Item;
const Option = Select.Option;
import NumericInput from  '@/components/NumericInput'
import {legalNum} from '@/utils/validate';

const ModalAddMoney = Form.create({ name: 'form_in_modal' })(
    // eslint-disable-next-line
    class extends React.Component {
    handOK = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { onClick = ()=>{},id } = this.props;
                onClick({id,...values});
            }
        });
    };
    render() {
        const { visible , loading , visibleCallBack = () =>{} } = this.props;
        const {getFieldDecorator, getFieldValue} = this.props.form;

        return (
            <Modal
                title="加款"
                visible={visible}
                onOk={this.handOK}
                onCancel={()=>visibleCallBack(false)}
                okText="充值"
                cancelText="取消"
                confirmLoading={loading}
            >
                <Form
                    onSubmit={this.handOK}
                    hideRequiredMark
                >
                    <Form.Item>
                        {getFieldDecorator('type', {
                            initialValue:'1',
                            rules: [{ required: true, message: 'Please select your country!' }],
                        })(
                            <Select>
                                <Option value="1">加款</Option>
                                <Option value="2">减款</Option>
                            </Select>,
                        )}
                    </Form.Item>
                    <FormItem>
                        {getFieldDecorator('money', {
                            rules: [
                                {
                                    trigger:'change',
                                    required: true,
                                    validator:(rule, value, callback)=>{
                                        let run;(run = legalNum(value,1,9999,2)) === true?callback():callback(new Error(`金额${run}`))
                                    },
                                },
                            ],
                        })(
                            <NumericInput addonBefore="金额:" isTooltip={true} placeholder="请输入金额" />
                        )}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
});

export default ModalAddMoney;
