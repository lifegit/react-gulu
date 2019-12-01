/**
 * badgeStorage
 * 这是一个 badgeStorage,角标管理器
 *
 * author : TheLife
 * time	: 2019-12-01
 * version :1.0
 * demo:
 import BadgeManager from 'BadgeManager';
 const bad = new BadgeManager()
 bad.clear()
 console.log("bag",bad.isNew("feedback"))
 bad.setNew("feedback",1)
 console.log("bag",bad.isNew("feedback"))
 bad.setRead('feedback')
 console.log("bag",bad.isNew("feedback"))
 */

import LocalStorageManager from './LocalStorageManager';

const badgeStorage = 'badgeStorage';

export class BadgeManager{
  /**
   * constructor
   */
  constructor(){
    this.lm = new LocalStorageManager();
  }

  /**
   *
   * @param key
   * @returns {boolean}
   */
  isNew (key) {
    const bad = this.getBadge();
    const { tn = 0, tl = 0 } = bad[key] || {};
    if(!tn){
      return false;
    }
    return tn > tl;
  }

  /**
   *
   * @param key
   * @param tn int
   */
  setNew (key, tn) {
    if(!tn) return;
    const bad = this.getBadge();
    const obj = bad[key] || {};
    bad[key] = {...obj, tn};
    this.setBadge(bad);
  }

  /**
   *
   * @param key
   */
  setRead (key) {
    const bad = this.getBadge();
    const obj = bad[key] || {};
    if (Object.keys(obj) && obj.tn){
      bad[key] = {...obj, tl: obj.tn};
      this.setBadge(bad);
    }
  }

  setBadge(bag = {}){
    this.lm.setItem(badgeStorage, bag);
  }
  getBadge(){
    return  this.lm.getItem(badgeStorage) || {};// { key:string : {tn: int, tl: int} } // tn：最新time，tl：当前存储time
  }

  /**
   * clear
   * @return {boolean}
   */
  clear(){
    this.lm.removeItem(badgeStorage);
  }

  /**
   * toString
   */
  toString(){
    const bad = this.getBadge();
    return bad.toString();
  }
}

const badgeManager = new BadgeManager();
export default badgeManager;
