import LocalStorageManager from './LocalStorageManager';
import CookiesManager from './CookiesManager'

class US {
  getting(obj,key){
    return obj instanceof LocalStorageManager ? obj.getItem(key) :
      obj instanceof CookiesManager ? obj.getCookie(key) :
        obj[key]
  }

  setting(obj,key,val,second){
    return obj instanceof LocalStorageManager ? obj.setItemTime(key,val,second) :
      obj instanceof CookiesManager ? obj.setCookie(key,val,`s${second}`) :
        obj[key] = val
  }
  delting(obj,key){
    obj instanceof LocalStorageManager ? obj.removeItem(key) :
      obj instanceof CookiesManager ? obj.delCookie(key) :
        delete obj[key]
  }
}


const us = new US();
export default class UserStorage{
	constructor(type){
      this.obj = new LocalStorageManager();
    // this.localStorage = 1
    // this.cookie = 2
    // this.memory = 3
    //
	  // if(type === this.localStorage)
	  //   this.obj = new LocalStorageManager();
	  // else if(type === this.cookie){
    //   this.obj = new CookiesManager();
    // }else{
    //   this.obj = {}
    // }
	}


	loginOut(){
	  const key = this.getTokenKey();
    if(key)
      us.delting(this.obj,key)
	}

	isLogin(){
	  const key = this.getTokenKey();
	  return key ? !! us.getting(this.obj,key) : false;
	}

	setToken(tokenKey,tokenVal,second){
	  this.setTokenKey(tokenKey,second);
    us.setting(this.obj,tokenKey,tokenVal,second)
  }


  getTokenObj(){
	  const key = this.getTokenKey() || '';
	  const value = key ? us.getting(this.obj,key) : '';
	  return {key, value}
  }


  setTokenKey(key,second){
    us.setting(this.obj,'tokenKey',key,second)
  }

  getTokenKey(){
    return us.getting(this.obj,'tokenKey') || ''
  }

}






