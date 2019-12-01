import copy from 'copy-to-clipboard';
import Toast from '@/components/Toast';

export const copyText = (text)=>{
  copy(text)
  Toast.success("复制成功")
}
