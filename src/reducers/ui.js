import {handleActions} from 'redux-actions';

const initialState = {};

export default handleActions({
    REQUEST_START(state, action) {
        return { ...state, ...action.payload };
    },

    REQUEST_SUCCESSFUL(state, action) {
        return { ...state,loading:false, ...action.payload };
    },

    REQUEST_FAILED(state, action) {
        return { ...state,loading:false, ...action.payload };
    },

    RESET() {
        return { ...initialState };
    },

    SHOW_LOADING(state){
        return { ...state, loading: true };
    },

    CLEAR_LOADING(state){
        return { ...state, loading: false };
    },

    SHOW_TOAST(state, action) {
        return { ...state, loading: false, ...action.payload };
    },

    CLEAR_TOAST(state,action) {
        return {...state, ...{type: "",data:null}};
    }
}, initialState);