/**
 * Author:TheLife
 * Version:2.0
 * Time:2018-11-08
 */

/**
 * 是否为 小写字母
 * @param str
 * @returns {boolean}
 */
export function validateLowerCase(str) {
    const reg = /^[a-z]+$/;
    return reg.test(str);
}

/**
 * 是否为 大写字母
 * @param str
 * @returns {boolean}
 */
export function validateUpperCase(str) {
    const reg = /^[A-Z]+$/;
    return reg.test(str);
}

/**
 * 是否为 大小写字母
 * @param str
 * @returns {boolean}
 */
export function validateAlphabets(str) {
    const reg = /^[A-Za-z]+$/;
    return reg.test(str);
}

/**
 * 是否为 中文
 * @param str
 * @returns {boolean}
 */
export function isChinese(str){
    const reg = /^[\u4E00-\u9FA5]+$/;
    return reg.test(str);
}

/**
 * 是否为 11位手机号
 * @param str
 * @returns {boolean}
 */
export function validateMobile(str) {
    const reg = /^[1][3,4,5,7,8][0-9]{9}$/;
    return reg.test(str);
}

/**
 * 是否为 固定电话
 * @param str
 * @returns {boolean}
 */
export function validateTelephone(str) {
    const reg = /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/
    return reg.test(str);
}

// form中验证邮箱或url请使用： rules: [{trigger:'change', required: true, type:'url|email', message: '主页应为一个正确地址或邮箱!', min:3, max:200,},
/**
 * 是否为 邮箱
 * @param str
 * @returns {boolean}
 */
export function legalEmail(str) {
    const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    return reg.test(str);
}

/**
 * 是否为 URL
 * @param str
 * @returns {boolean}
 */
export function legalURL(str) {
    const reg = /^((https?|ftp):\/\/|)([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2,5}))(:[0-9]+)*/;
    return reg.test(str);
}

/**
 * 常规检测
 * @param value
 * @param minLen number default:6  最短长度
 * @param maxLen number default:18 最长长度
 * @param allowLetter boolean default:true 是否允许字母
 * @param allowNumber boolean default:true 是否允许数字
 * @param allowChinese boolean default:false 是否允许中文
 * @param allowSymbol boolean default:false 是否允许符号
 * @returns {*} 正确返回 true , 错误返回 原因(字符串)
 */
export function legalRoutine(value, minLen = 6, maxLen = 18, allowLetter = true , allowNumber = true , allowChinese = false, allowSymbol = false){
    if(! value)
        return '不能为空';
    if(!(value = ('' + value).trim()).length)
        return '不能为空';

    if(value.length < minLen || value.length > maxLen)
        return minLen === maxLen ? `只能为${maxLen}个字符` :`应在${minLen}-${maxLen}个字符之间`;

    const arr = [];
    const letter = allowLetter ? 'a-zA-Z' : '';
    allowLetter  ? arr.push('字母') : null;
    const number = allowNumber ? '0-9' : '';
    allowNumber  ? arr.push('数字') : null;
    const chinese = allowChinese ? '\u4E00-\u9FA5' : '';
    allowChinese ? arr.push('汉字') : null;
    const symbol = allowSymbol ? '\'\r\n`~!@#\\$%\\^&\\*\\(\\)-_=\\+\\[\\]\\{\\}\\|、;:"<>,\\./\\?\\\\' : '';
    allowSymbol  ? arr.push('半角符号') : null;

    const reg = new RegExp( '\^['+ letter + number + chinese + symbol + ']+$', 'gi');
    if(! reg.test(value))
        return '只能为' + arr.toString().replace(/,/g, '、');

    return true;
}

/**
 * 数字检测
 * @param value
 * @param min number 最小值
 * @param max number 最大值
 * @param decimal number default:0 小数点位数
 * @returns {*} 正确返回 true , 错误返回 原因(字符串)
 */
export function legalNum(value, min, max, decimal = 0){
    if(! value && ! Number.isFinite((value+'')*1))
        return '不能为空';

    if(!(value = ('' + value).trim()).length)
        return '不能为空';

    const reg=/^[0-9]+([.]{1}[0-9]+){0,1}$/;
    if(! reg.test(value))
        return '只能为数字';

    if(decimal >= 0){
        if (value.indexOf('.') > -1 && value.split('.')[1].length > decimal) {
            return decimal === 0 ? '只能为整数' : `最多${decimal}位小数`;
        }
    }

    value = value * 1;
    if(value < min || value > max)
        return min === max ? `只能为${max}` :`应在${min}-${max}之间`;
    return true;
}
