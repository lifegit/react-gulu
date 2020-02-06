import React from 'react';
import { Carousel } from 'antd-mobile';

export default class Index extends React.PureComponent {
    state = {
        imgHeight: 170,
    }


    render() {
        const { data = [ ] } = this.props;
        return(
          (
            data.length ? (
              <Carousel
                autoplay={true}
                autoplayInterval={5000}
                infinite
                // beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}
                // afterChange={index => console.log('slide to', index)}
              >
                {data.map((item,key) => (
                  <a
                    target='_blank'
                    key={key}
                    href={item.href}
                    style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
                  >
                    <img
                      src={item.img}
                      alt=""
                      style={{ width: '100%', verticalAlign: 'top' }}
                      onLoad={() => {
                        // fire window resize event to change height
                        window.dispatchEvent(new Event('resize'));
                        this.setState({ imgHeight: 'auto' });
                      }}
                    />
                  </a>
                ))}
              </Carousel>
            ): null
          )
        )
    }
}
