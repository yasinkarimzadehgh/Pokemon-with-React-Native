import { takeLatest, put, call } from 'redux-saga/effects';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LOGIN_REQUEST, loginSuccess, loginFailure, setAuthFromStorage, LOGOUT } from './authAction';

function* loginSaga(action) {
    try {
        const userId = action.payload;

        if (userId === '17') {
            yield call(AsyncStorage.setItem, 'userId', userId);
            yield put(loginSuccess(userId));
        } else {
            throw new Error('Invalid user ID. Only user ID 17 is allowed.');
        }
    } catch (error) {
        yield put(loginFailure(error.message));
    }
}

function* checkAuthSaga() {
    try {
        const storedUserId = yield call(AsyncStorage.getItem, 'userId');
        if (storedUserId) {
            yield put(setAuthFromStorage(storedUserId));
        }
    } catch (error) {
        console.error("Error loading authentication state:", error);
    }
}

function* logoutSaga() {
    try {
        yield call(AsyncStorage.removeItem, 'userId');
    } catch (error) {
        console.error("Error clearing AsyncStorage:", error);
    }
}

export function* watchAuthSaga() {
    yield takeLatest(LOGIN_REQUEST, loginSaga);
    yield takeLatest(LOGOUT, logoutSaga);
    yield call(checkAuthSaga);
}
