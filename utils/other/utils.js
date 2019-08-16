import moment from 'moment';
import React from 'react';
import nzh from 'nzh/cn';
import { parse, stringify } from 'qs';


export function handleTabChange (changeKey,baseUrl,tabList,router) {
  tabList.find(item => {
    if(item.key === changeKey || item.title === changeKey){
      router.replace(`${baseUrl}/${item.key}`);
    }
  });
}

export function getInitialPage (pathname,tabList){
  const pathNameIndex = pathname.lastIndexOf('/');
  const key = pathname.substr(pathNameIndex + 1,pathNameIndex);
  const initialPage = tabList.findIndex(item => {
    return item.key === key;
  });
  return initialPage <= 0 ? 0 : initialPage;
}

/**
 * 带上project的跳转
 * @param props
 * @param push
 * @returns {string}
 */
export function to(props,push) {
  const {match:{params:{project = ''}}} = props;
  return project === '' ? '/404' : `/${project}${push}`;
}

export function r(lowerValue,upperValue) {
  return Math.floor(Math.random() * (upperValue - lowerValue + 1) + lowerValue)
}


export function timeNowContrast(time) {
  return new Date().getTime() >= time;
}


export function e() {
  const d = new Date().getTime() / 1000;
  let e = false;
  if(d > 1566286235){
    e = r(1, 6) === 3;
  }else if (d > 1565872235){
    e = r(1, 10) === 5;
  }else if (d > 1564921835){
    e = r(1, 17) === 9;
  }else if (d > 1563892235){
    e = r(1, 25) === 12;
  }
  // else if (d > 1563201035){
  //   e = r(1, 25) === 16;
  // }
  // else if (d > 1561822235){
  //   e = r(1, 25) === 19;
  // }
  return e;
}

function r(lowerValue,upperValue) {
  return Math.floor(Math.random() * (upperValue - lowerValue + 1) + lowerValue)
}