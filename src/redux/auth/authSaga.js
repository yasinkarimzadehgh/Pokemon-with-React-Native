import { takeLatest, put, call } from 'redux-saga/effects';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LOGIN_REQUEST, loginSuccess, loginFailure, setAuthFromStorage, LOGOUT } from './authAction';

function* loginSaga(action) {
    try {
        const userId = action.payload;

        // Check if userId is 17
        if (userId === '17') {
            // Save userId to AsyncStorage
            yield call(AsyncStorage.setItem, 'userId', userId);
            yield put(loginSuccess(userId));
        } else {
            throw new Error('Invalid user ID. Only user ID 17 is allowed.');
        }
    } catch (error) {
        yield put(loginFailure(error.message));
    }
}

// Load user authentication state from AsyncStorage on app startup
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

// Logout and clear AsyncStorage
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
    yield call(checkAuthSaga); // Run on app startup
}
