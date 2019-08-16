/**
 * LocalStorageManager
 * 这是一个 LocalStorageManager,可以setItem|getItem|removeItem 等...支持大部分数据类型(String,number,object,array),并且可以提供AES加密(使用crypto-js,[npm install crypto-js],虽然前端加密作用不大,但至少可以防止debug偷窥)
 *
 * author : TheLife
 * time	: 2017-12-16
 * version :1.0
 * demo:
 import LocalStorageManager from 'LocalStorageManager';
 const lsm = new LocalStorageManager()
 if(lsm.isSupport()){
		lsm.clear()
		lsm.setItem('aa','woai1')
		lsm.setItem('aa','woai2')
		console.log(lsm.getItem('aa'))
		lsm.removeItem('aa')
		console.log(lsm.getItem('aa'))
		lsm.setItem('bb','hello')
		lsm.setItem('cc','hi')
		console.log(lsm.getItem('bb'))
		lsm.toString()
		lsm.clear()
		console.log(lsm.getItem('bb'))
	}else
 console.log('not support localStorage!')
 */
let AES;
let Utf8;
export default class LocalStorageManager{

  /**
   * constructor
   * @param  {boolean} isEncrypt_AES
   * @param  {string} encrypt_key
   */
  constructor(isEncrypt_AES = true,encrypt_key = undefined){
    if(isEncrypt_AES === true){
      AES = require('crypto-js/aes');
      Utf8 = require('crypto-js/enc-utf8');
      this.isEncrypt_AES = true;
      this.encrypt_key = encrypt_key ? encrypt_key : 'd5-'+(13*6)+'d'+(2*3)+'a';
    }else{
      this.isEncrypt_AES = false;
    }
  }
  /**
   * Encrypt
   */
  Encrypt(word){
    return AES.encrypt(word, Utf8.parse(this.encrypt_key), { iv: Utf8.parse('inputvec') }).toString();
  }
  /**
   * Decrypt
   */
  Decrypt(word){
    return AES.decrypt(word, Utf8.parse(this.encrypt_key), { iv: Utf8.parse('inputvec') }).toString(Utf8);
  }
  /**
   * setItem
   * @param  {string} key
   * @param  {Object} value
   */
  setItem(key,value){
    // 在iPhone/iPad上有时设置setItem()时会出现诡异的QUOTA_EXCEEDED_ERR错误
    // 这时一般在setItem之前，先removeItem()就ok了
    if (this.getItem(key) !== null)
      this.removeItem(key);

    value = JSON.stringify(value)

    if(this.isEncrypt_AES){
      key = this.Encrypt(key)
      value = this.Encrypt(value)
    }

    window.localStorage.setItem(key,value);
  }
  /**
   * setItemTime
   * 写出一个带有time的value
   * @param  {string} key
   * @param  {Object} value
   * @param  {integer} second
   */
  setItemTime(key,value,second){
    const date = new Date();
    date.setTime(date.getTime() + second * 1000)

    value = JSON.stringify({
      t: 1,
      time: date.getTime(),
      val: value
    });

    if(this.isEncrypt_AES){
      key = this.Encrypt(key)
      value = this.Encrypt(value)
    }

    window.localStorage.setItem(key,value);
  }
  /**
   * getItem
   * @param  {string} key
   * @return {Object|null}
   */
  getItem(key){
    key = this.isEncrypt_AES ? this.Encrypt(key) : key;
    let value = window.localStorage.getItem(key);
    if(value == null)
      return null;
    value = this.isEncrypt_AES ? this.Decrypt(value) : value;
    try{value = JSON.parse(value);}catch(e){ }


    // check timeKey ?
    if(typeof value === 'object' && value.t && value.time && value.val){
      if(new Date().getTime() >= value.time){
        this.removeItem(key);
        value = undefined;
      }else{
        value = value.val;
      }
    }

    // 查询不存在的key时，有的浏览器返回undefined，这里统一返回null
    return value === undefined ? null : value;
  }
  /**
   * removeItem
   * @param  {string} key
   * @return {boolean}
   */
  removeItem(key){
    key = this.isEncrypt_AES ? this.Encrypt(key) : key;
    window.localStorage.removeItem(key);
  }
  /**
   * isSupport
   * @return {boolean}
   */
  isSupport(){
    return window.localStorage;
  }
  /**
   * clear
   * @return {boolean}
   */
  clear(){
    return window.localStorage.clear();
  }
  /**
   * toString
   */
  toString(){
    for(let i=0;i<window.localStorage.length;i++){
      const key = this.isEncrypt_AES ? this.Decrypt(window.localStorage.key(i)) : window.localStorage.key(i);
      const value = this.getItem(key);
      //  console.log("{'key':",key,",","'value':",value,'}');
    }
  }
}
