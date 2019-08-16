import React, {Fragment} from '_react@16.8.6@react';
import SimpleListView from './SimpleListView'


export default class Index extends React.Component {
    list = [];

    state = {
        isLoading: false,
        data: {},
    };

    onChange = (page) => {
        console.log("page",page);
        // ajax
        this.setState({isLoading: true},()=>{
            setTimeout(()=>{
                const list = Array.from({length: 20}, (v, i) => i).map((item,index)=> ({
                    img: 'https://zos.alipayobjects.com/rmsportal/hfVtzEhPzTUewPm.png',
                    title: 'Eat the week',
                    des: '不是所有的兼职汪都需要风吹日晒',
                }));
                this.list = page == 1 ? list : this.list.concat(list);

                this.setState({
                    isLoading: false,
                    data: {list: this.list, page: {total: 100, size: 20}},
                });

            },3000)
        })
    };


    render() {
        const {isLoading, data} = this.state;
        return (
            <Fragment>
                <SimpleListView
                    loading={isLoading}
                    data={data}
                    onChange={this.onChange}
                    renderRow={(rowData, sectionID, rowID) => {
                        return (
                            <div key={rowID}
                                 style={{
                                     padding: '0 15px',
                                     backgroundColor: 'white',
                                 }}
                            >
                                <div style={{
                                    height: '50px',
                                    lineHeight: '50px',
                                    color: '#888',
                                    fontSize: '18px',
                                    borderBottom: '1px solid #ddd'
                                }}>
                                    {rowData.title}
                                </div>
                                <div style={{'display': '-webkit-box', 'display': 'flex', padding: '15px'}}>
                                    <img style={{height: '63px', width: '63px', marginRight: '15px'}}
                                         src={rowData.img} alt=""/>
                                    <div style={{display: 'inline-block'}}>
                                        <div style={{
                                            marginBottom: '8px',
                                            color: '#000',
                                            fontSize: '16px',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            maxWidth: '250px'
                                        }}>{rowData.des}</div>
                                        <div style={{fontSize: '16px'}}><span
                                            style={{fontSize: '30px', color: '#FF6E27'}}>{rowID}</span> 元/任务
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    }}/>
            </Fragment>
        )
    }
}
