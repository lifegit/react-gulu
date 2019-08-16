/**
 * CookiesManager
 * 这是一个 cookies 管理器,可以对cookie进行set|get|del,支持所有数据类型(String,number,object,array)
 *
 * author : TheLife
 * time	: 2017-8-20
 * version :1.0
 * 
 * demo:
	const cookiesManager = new CookiesManager();
	cookiesManager.setCookie("key1","小王",'s30');
	cookiesManager.setCookie("key2",new Array('1','2'),'h1');
	console.log(cookiesManager.getCookie("key1"),cookiesManager.getCookie("key2"));
 */
export default class CookiesManager{
	/**
	 * 设置一个cookis
	 * @param {String} name
	 * @param {Object} value
	 * @param {String} time s|h|d 例:'s10'
	 */	
	setCookie (name, value, time) {
		//如果value是个object(比如Array,obj),进行序列化		
		if(typeof(value) === 'object')
			value='JSONSTR'+JSON.stringify(value);
		
		const strsec = this.getsec(time);
		const exp = new Date();
		exp.setTime(exp.getTime() + strsec * 1);
		window.document.cookie = name + '=' + escape(value) + ';path=/;expires=' + exp.toGMTString();
	}
	
	/**
	 * 获取一个cookie
	 * @param {String} name
	 */	
	getCookie (name) {
		const reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
		let arr;
		if(arr = document.cookie.match(reg)){
			let value = unescape(arr[2]);
			//解析object
			if(typeof(value) === 'string' && value.substr(0,7) === 'JSONSTR'){
				try{value = JSON.parse(value.substr(7));}catch(e){ }
			}
			return value;
		}else
			return null;		
	}
	
	/**
	 * 删除一个cookis
	 * @param {String} name
	 */	
	delCookie (name) {
		this.setCookie(name, '',false);
	}
	
	
	getsec(str = false) {
		if(! str)
			return -1;		
		const str1 = str.substring(1, str.length) * 1;
		const str2 = str.substring(0, 1);
		if(str2 === 's') {
			return str1 * 1000;
		} else if(str2 === 'h') {
			return str1 * 60 * 60 * 1000;
		} else if(str2 === 'd') {
			return str1 * 24 * 60 * 60 * 1000;
		}
	}
}
