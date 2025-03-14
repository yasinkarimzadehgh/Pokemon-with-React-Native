export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const SET_AUTH_FROM_STORAGE = 'SET_AUTH_FROM_STORAGE';

export const LOGOUT = 'LOGOUT';

export const loginRequest = (userId) => ({
    type: LOGIN_REQUEST,
    payload: userId,
});

export const loginSuccess = (userId) => ({
    type: LOGIN_SUCCESS,
    payload: userId,
});

export const loginFailure = (error) => ({
    type: LOGIN_FAILURE,
    payload: error,
});

export const logout = () => ({
    type: LOGOUT,
});

export const setAuthFromStorage = (userId) => ({
    type: SET_AUTH_FROM_STORAGE,
    payload: userId,
});
