import { bind, unbind, info } from '@/services/message/wechat';
import Toast from "@/components/Toast";

export default {
    namespace: 'bindWeChat',
    state: {
        step: 0,
        publicNumberName: '',
        publicNumberQrCode: '',

        bindErrorMsg:'',
    },

    effects: {
        * step({payload}, { call, put }) {
            yield put({
                type: "saveStep",
                payload: payload
            });
        },
        * bind({payload,callback}, { call, put }) {
            try {
                const response = yield call(bind, payload);
                const {success,...other} = response.body;
                yield put({
                    type: "saveBind",
                    payload: {bindErrorMsg:''},
                });
                yield put({
                    type: 'account/updateInfoHandle',
                    payload: {
                        ...other
                    },
                });
                if (callback) callback();
            } catch (e) {
                Toast.error(e.toString());
                yield put({
                    type: "saveBind",
                    payload: {bindErrorMsg:e.toString()},
                });
            }
        },
        * unbind({payload,callback}, { call, put }) {
            try {
                const response = yield call(unbind, payload);
                yield put({
                    type: "saveBind",
                    payload: {step:0},
                });
                yield put({
                    type: 'account/updateInfoHandle',
                    payload: {
                        wechatopenid:'',
                    },
                });
            } catch (e) {
                Toast.error(e.toString());
            }
        },
        * getBindInfo({payload}, { call, put, select }) {
            if(! (yield select(state => state.bindWeChat.publicNumberName))){
                try {
                    const response = yield call(info, payload);
                    yield put({
                        type: "saveBind",
                        payload: {
                            publicNumberName: response.body.info.name,
                            publicNumberQrCode: response.body.info.qccode,
                        }
                    });
                } catch (e) {
                    Toast.error(e.toString());
                }
            }
        },
    },

    reducers: {
        saveStep(state, { payload }) {
            return {
                ...state,
                step: payload.step,
            };
        },
        saveBind(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
    },
};
