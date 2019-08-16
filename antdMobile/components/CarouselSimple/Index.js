import React from "react";
import { Carousel } from 'antd-mobile';

export default class Index extends React.Component {
    state = {
        imgHeight: 300,
    }


    render() {

        const { data = [ ] } = this.props;

        return(
            <Carousel
                autoplay={true}
                autoplayInterval={5000}
                infinite
                // beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}
                // afterChange={index => console.log('slide to', index)}
            >
                {/*{this.state.data.map(val => (*/}
                {/*    <a*/}
                {/*        key={val}*/}
                {/*        href="http://www.alipay.com"*/}
                {/*        style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}*/}
                {/*    >*/}
                {/*        <img*/}
                {/*            src={`https://zos.alipayobjects.com/rmsportal/${val}.png`}*/}
                {/*            alt=""*/}
                {/*            style={{ width: '100%', verticalAlign: 'top' }}*/}
                {/*            onLoad={() => {*/}
                {/*                // fire window resize event to change height*/}
                {/*                window.dispatchEvent(new Event('resize'));*/}
                {/*                this.setState({ imgHeight: 'auto' });*/}
                {/*            }}*/}
                {/*        />*/}
                {/*    </a>*/}
                {/*))}*/}

                {data.map((val,key) => (
                    <img
                        key={key}
                        src={val}
                        alt=""
                        style={{ width: '100%', verticalAlign: 'top' }}
                        onLoad={() => {
                            // fire window resize event to change height
                            window.dispatchEvent(new Event('resize'));
                            this.setState({ imgHeight: 'auto' });
                        }}
                    />
                ))}
            </Carousel>
        )
    }
}
