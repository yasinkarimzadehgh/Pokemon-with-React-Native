import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    LOGOUT,
    SET_AUTH_FROM_STORAGE
} from './authAction';

const initialState = {
    userId: null,
    isAuthenticated: false,
    loading: false,
    error: null,
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_REQUEST:
            return { ...state, loading: true, error: null };
        case LOGIN_SUCCESS:
            return { ...state, userId: action.payload, isAuthenticated: true, loading: false, error: null };
        case LOGIN_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case SET_AUTH_FROM_STORAGE:
            return { ...state, userId: action.payload, isAuthenticated: true };
        case LOGOUT:
            return initialState;
        default:
            return state;
    }
};

export default authReducer;
