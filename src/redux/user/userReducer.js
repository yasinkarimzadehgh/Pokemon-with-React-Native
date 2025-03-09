import {
    SYNC_PROFILE_REQUEST,
    SYNC_PROFILE_SUCCESS,
    SYNC_PROFILE_FAILURE,
    UPDATE_PROFILE_REQUEST,
    UPDATE_PROFILE_SUCCESS,
    UPDATE_PROFILE_FAILURE
} from './userAction';

const initialState = {
    username: null,
    picProfile: null,
    theme: 'light',
    loading: false,
    error: null,
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case SYNC_PROFILE_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        case SYNC_PROFILE_SUCCESS:
            return {
                ...state,
                username: action.payload.name,
                picProfile: action.payload.picture,
                theme: action.payload.theme,
                loading: false,
                error: null
            };
        case SYNC_PROFILE_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        case UPDATE_PROFILE_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        case UPDATE_PROFILE_SUCCESS:
            return {
                ...state,
                loading: false,
                error: null
            };
        case UPDATE_PROFILE_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        default:
            return state;
    }
};

export default userReducer;
