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
            autoplayInterval={3500}
            infinite
            // beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}
            // afterChange={index => console.log('slide to', index)}
          >
            {data.map((item,key) => (
              <a
                target='_blank'
                key={key}
                href={item.href || null}
                style={{ display: 'inline-block', width: '100%', cursor: item.href ? 'pointer' : 'default' }}
              >
                <img
                  src={item.img}
                  alt="广告"
                  style={{ width: '100%', verticalAlign: 'top', maxHeight: 300 }}
                  onLoad={() => {
                    // fire window resize event to change height
                    window.dispatchEvent(new Event('resize'));
                    // this.setState({ imgHeight: 'auto' });
                  }}
                />
                <span style={{
                  backgroundColor: 'rgba(225,225,225,0.4)',
                  fontWeight:600,
                  color:'#181818',
                  position:'absolute',
                  right: 20,
                  top: 10,
                }}>广告</span>
              </a>
            ))}
          </Carousel>
        ): null
      )
    )
  }
}
