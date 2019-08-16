import {
    message,
    notification,
} from 'antd';

function isMobile() {
    return window.innerWidth >= 768;
}


function showNotification(type,content,duration) {
    const typeStr = type === 'success' ? '成功' : '失败';

    notification[type]({
        style: {
            width: 330,
            marginLeft: 66,
        },
        duration:duration,
        message: typeStr,
        description: content,
    })
}

export const Toast = {
    success: function (content, duration = 3) {
        isMobile() ?  showNotification('success',content,duration) : message.success(content, duration);
    },
    error: function (content, duration = 3) {
        isMobile() ? showNotification('error',content,duration)  : message.error(content, duration);
    },
};

export default Toast;