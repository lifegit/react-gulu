import React from 'react';
import { Form, Modal,Input,Progress,Popover } from 'antd';
import { FormattedMessage } from 'react-intl';
import styles from "./styles.less";
import { formatMessage } from 'umi/locale';
import {legalRoutine} from '@/utils/validate';

const FormItem = Form.Item;

const passwordStatusMap = {
    ok: (
        <div className={styles.success}>
            <FormattedMessage id="validation.password.strength.strong" />
        </div>
    ),
    pass: (
        <div className={styles.warning}>
            <FormattedMessage id="validation.password.strength.medium" />
        </div>
    ),
    poor: (
        <div className={styles.error}>
            <FormattedMessage id="validation.password.strength.short" />
        </div>
    ),
};

const passwordProgressMap = {
    ok: 'success',
    pass: 'normal',
    poor: 'exception',
};

const passwordStrength = {
    strong: (
        <font className="strong">
            <FormattedMessage id="app.settings.security.strong" defaultMessage="Strong" />
        </font>
    ),
    medium: (
        <font className="medium">
            <FormattedMessage id="app.settings.security.medium" defaultMessage="Medium" />
        </font>
    ),
    weak: (
        <font className="weak">
            <FormattedMessage id="app.settings.security.weak" defaultMessage="Weak" />
            Weak
        </font>
    ),
};
const ModalNewPass = Form.create({ name: 'form_in_modal_pass' })(
    // eslint-disable-next-line
    class extends React.Component {
        state = {
            help: '',
            popoverVisible:false,
        };

        getPasswordStatus = () => {
            const { form } = this.props;
            const value = form.getFieldValue('new');
            if (value && value.length > 9) {
                return 'ok';
            }
            if (value && value.length > 5) {
                return 'pass';
            }
            return 'poor';
        };
        renderPasswordProgress = () => {
            const { form } = this.props;
            const value = form.getFieldValue('new');
            const passwordStatus = this.getPasswordStatus();
            return value && value.length ? (
                <div className={styles[`progress-${passwordStatus}`]}>
                    <Progress
                        status={passwordProgressMap[passwordStatus]}
                        className={styles.progress}
                        strokeWidth={6}
                        percent={value.length * 10 > 100 ? 100 : value.length * 10}
                        showInfo={false}
                    />
                </div>
            ) : null;
        };
        checkConfirm = (rule, value, callback) => {
            const { form } = this.props;
            if (value && value !== form.getFieldValue('new')) {
                callback(formatMessage({ id: 'validation.password.twice' }));
            } else {
                callback();
            }
        };
        checkPassword = (rule, value, callback) => {
            const { popoverVisible, confirmDirty } = this.state;
            if (!value) {
                this.setState({
                    help: formatMessage({ id: 'validation.password.required' }),
                  popoverVisible: !!value,
                });
                callback('error');
            } else {
                this.setState({
                    help: '',
                });
                if (!popoverVisible) {
                    this.setState({
                      popoverVisible: !!value,
                    });
                }
                if (value.length < 6) {
                    callback('error');
                } else {
                    const { form } = this.props;
                    if (value && confirmDirty) {
                        form.validateFields(['confirm'], { force: true });
                    }
                    callback();
                }
            }
        };

        render() {
            const {
                loading, visible, onCancel, onCreate, form, showNowPass = false
            } = this.props;
            const { getFieldDecorator,validateFields } = form;
            const { popoverVisible ,help} = this.state;
            const handleOk = () => {
              validateFields((err, values) => {
                if (err) {
                  return ;
                }
                console.log('Received values of form: ', values);
                form.resetFields();
                onCreate(values)
              });
            }
            return (
                <Modal
                    destroyOnClose
                    loading={loading}
                    visible={visible}
                    title="修改密码"
                    onCancel={onCancel}
                    onOk={handleOk}
                >
                    <Form layout="vertical" onSubmit={handleOk}>
                        {
                            showNowPass ? (
                                <FormItem>
                                    {getFieldDecorator('old', {
                                        rules: [
                                            {
                                                trigger:'change',
                                                required: true,
                                                validator:(rule, value, callback)=>{
                                                    let run; (run = legalRoutine(value,6,18,true,true,false,false)) === true ? callback() : callback(new Error(`当前密码${run}`))
                                                },
                                            },
                                        ],
                                    })(
                                        <Input
                                            size="large"
                                            type="password"
                                            placeholder={'请输入当前的密码'}
                                        />
                                    )}
                                </FormItem>
                            ) : null
                        }
                        <FormItem help={help}>
                            <Popover
                                content={
                                    <div style={{ padding: '4px 0' }}>
                                        {passwordStatusMap[this.getPasswordStatus()]}
                                        {this.renderPasswordProgress()}
                                        <div style={{ marginTop: 10 }}>
                                            <FormattedMessage id="validation.password.strength.msg" />
                                        </div>
                                    </div>
                                }
                                overlayStyle={{ width: 240 }}
                                placement="right"
                                visible={popoverVisible}
                            >
                                {getFieldDecorator('new', {
                                    rules: [
                                        {
                                            validator: this.checkPassword,
                                        },
                                    ],
                                })(
                                    <Input
                                        size="large"
                                        type="password"
                                        placeholder={`新密码${formatMessage({ id: 'form.password.placeholder' })}`}
                                    />
                                )}
                            </Popover>
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('confirm', {
                                rules: [
                                    {
                                        required: true,
                                        message: formatMessage({ id: 'validation.confirm-password.required' }),
                                    },
                                    {
                                        validator: this.checkConfirm,
                                    },
                                ],
                            })(
                                <Input
                                    size="large"
                                    type="password"
                                    placeholder={'新密码确认'}
                                />
                            )}
                        </FormItem>
                    </Form>
                </Modal>
            );
        }
    }
);
export  default ModalNewPass;
