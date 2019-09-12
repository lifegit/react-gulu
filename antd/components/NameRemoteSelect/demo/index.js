import React, { PureComponent } from 'react';
import { connect } from 'dva';
import NameRemoteSelect from '@/components/NameRemoteSelect';
import {
    Card,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';


@connect(({ names,loading }) => ({
    names,
    nameLoading: loading.effects['names/name'],
}))

class Index extends PureComponent {

    handSearchName=(name)=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'names/namesHeadquarters',
            payload:{
                name,
                mobile:1,
            }
        });
    };
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('values',values,  this.props.namesHeadquarters[value.name.key].id);
            }
        });
    };
    render() {
        const {
            names :{namesHeadquarters},
            nameLoading,
        } = this.props;
        const { getFieldDecorator } = this.props.form;
        return (
            <PageHeaderWrapper title={'Demo'}>
                <Card bordered={false} style={{marginBottom:10}} bodyStyle={{paddingBottom:0,paddingTop:16}}>
                    <Form onSubmit={this.handleSubmit} >
                        <FormItem>
                            {getFieldDecorator('name', {
                                initialValue: {key: 2, label: "张三"},
                                rules: [
                                    {
                                        required: true,
                                        trigger:'change',
                                        validator: (rule, value, callback) => {
                                            return value ? callback() : callback(new Error(`请搜索姓名`));
                                        }
                                    }
                                ]
                            })(<NameRemoteSelect
                                    field={['name','mobile']}
                                    mode='default'
                                    loading = { nameLoading }
                                    names={namesHeadquarters}
                                    onSearch={this.handSearchName}
                                    placeholder="请搜索姓名"
                                />
                            )}
                        </FormItem>
                    </Form>
                </Card>
            </PageHeaderWrapper>
        );
    }
}

export default Index;
