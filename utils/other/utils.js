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

/**
 * 时间戳转时间字符串
 * @param {*} dateTime 
 * @param {object} opts 
 */
export function dateToString(dateTime, opts = {}){
  const add0 = function(m){
    return m < 10 ? '0' + m: m
  }
  const { isYear = true, isMonth = true, isDay = true, isHour = true, isMinute = true, isSecond = true } = opts;


  const c = Number.isFinite(dateTime * 1 ) && dateTime.toString().length < 13 ? dateTime * 1000 : dateTime
  const time = new Date(c)
  const year   = isYear   ? '-' + time.getFullYear() : '';
  const month  = isMonth  ? '-' + add0(time.getMonth() + 1) : '';
  const day    = isDay    ? '-' + add0(time.getDate()) : '';
  const hour   = isHour   ? ' ' + add0(time.getHours()) : '';
  const minute = isMinute ? ':' + add0(time.getMinutes()) : '';
  const second = isSecond ? ':' + add0(time.getSeconds()) : '';

  return (year + month + day + hour + minute + second).substring(1)
}


/**
 * request,get访问进行格式化数据
 * @return {string}
 */
export function formatGetData(params = {}) {
  return Object.keys(params).map(item => `${item}=${JSON.stringify(params[item])}` ).join('&');
}

/**
 * 对一个字符串转换成金额形式
 * @param num
 * @param n
 * @param isSymbol
 * @returns {string}
 */
export function toMoney (num = 0,n = 2, isSymbol = true) {
  const sp = String(num).split('.')
  const integer = sp[0] || 0

  let decimal = ''
  if (n){
    decimal = sp.length >= 2 ? sp[1].substr(0,n) : ''
    const len = n - decimal.length
    if (len > 0) {
      decimal = decimal + Array.from({length: len}).map(item => 0).join('')
    }
    decimal = `.${decimal}`
  }

  const number = integer + decimal
  return isSymbol ? `¥ ${number}` : number
}


/**
 * 秒转为 时分秒
 * @param second
 * @param opts
 * @returns {string}
 */
export function secondToFix(second, opts = {}){
  const add0 = (m)=> {
    return m < 10 ? `0${m}`: m;
  };
  const { isDay = true, isHour = true, isMinute = true, isSecond = true } = opts;
  let arr = [];
  let text = '';

  if (isDay) arr = arr.concat({tag:'天',second:86400});
  if (isHour) arr = arr.concat({tag:'时',second:3600});
  if (isMinute) arr = arr.concat({tag:'分',second:60});
  if (isSecond) arr = arr.concat({tag:'秒',second:1});

  arr.map(item => {
    let i = 0;
    while (second >= item.second){
      second -= item.second;
      i++;
    }
    if (i > 0){
      text += `${add0(i)}${item.tag} `;
    }
  })

  return text || '无时长';
}

/**
 * 判断是否过期
 * @param timeStamp
 * @returns {{expired: boolean, soon: *}|{expired: boolean}}
 */
export function isExpired(timeStamp) {
  timeStamp = Number.isFinite(timeStamp * 1 ) && timeStamp.toString().length < 13 ? timeStamp * 1000 : timeStamp;
  const nowTimeStamp = new Date().getTime();

  if (timeStamp - nowTimeStamp <= 0){
    return {expired: true};
  }

  return {expired: false, soon: timeStamp - nowTimeStamp <= 86400 * 1000 * 3};
}


/**
 * 判断是否到时
 * @param second
 * @returns {{expired: boolean, soon: *}|{expired: boolean}}
 */
export function isEnough(second) {
  const timeStamp = Date.now() + second * 1000;
  if (second <= 0) {
    return {expired: true, timeStamp};
  }

  return {expired: false, timeStamp, soon: second <= 86400 * 3};
}