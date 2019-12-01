import {badge} from '@/services/account/account';
import badgeManager from '@/utils/BadgeManager';

export default {

    state: {

    },

    effects: {
      * badge(_, { call,put }) {
        const response = yield call(badge);
        if( response instanceof Error) { return; }
        Object.keys(response).map(item => badgeManager.setNew(item,response[item]));

        yield put({
          type: 'save',
          payload: {
            bases: response,
          }
        });
      },
      * read({payload}, { put }) {
        yield put({
          type: 'save',
          payload: {
            info: payload,
          }
        });
        badgeManager.setRead(payload);
      },
    },

    reducers: {
        save(state, {payload}) {
            return {
                ...state,
                ...payload
            };
        },
    },
};
