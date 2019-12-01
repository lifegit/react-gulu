import { Fragment } from 'react';
import { Icon } from 'antd';
import Zmage from 'react-zmage';
import {copyText} from './utils';

const font = {fontSize: 15};

export const LaunchQQ = (qq)=>{
  if (!qq) return null;
  const url = navigator.userAgent.match(/AppleWebKit.*Mobile.*/) ? `mqqwpa://im/chat?chat_type=wpa&uin=${qq}` : `http://wpa.qq.com/msgrd?V=3&Uin=${qq}&Site=qq&Menu=yes`
  return <Fragment>{qq}<a style={{ marginLeft:5,...font }} target='blank' href={url}><Icon type="qq" /></a></Fragment>
};

export const LaunchUrl = (url, isCopy = true, isOpen = true)=>{
  if (!url) return null;
  const styles = { marginRight: 5,...font }

  return (
    <Fragment>
      { ! isOpen ? null : <a style={styles} href={url} target='_blank'><Icon type="link" /></a> }
      { ! isCopy ? null : <a style={styles}><Icon type="copy" onClick={()=>copyText(url)} /></a> }
    </Fragment>
  )
};

export const LaunchImg = (src, icon = 'picture')=>{
  if (!src) return null;
  return <a onClick={() => Zmage.browsing({ src })} style={{ marginRight:10,...font }}><Icon type={icon} /></a>
};

export const LaunchMobile = (mobile, icon = 'phone')=>{
  if (!mobile) return null;
  return <Fragment>{mobile}<a style={{ marginLeft:5,...font }} target='blank' href={`tel:${mobile}`}><Icon type={icon} /></a></Fragment>
};
