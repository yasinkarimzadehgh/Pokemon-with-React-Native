import { takeLatest, put } from 'redux-saga/effects';
import { LOGIN_REQUEST, loginSuccess, loginFailure } from './authAction';

function* loginSaga(action) {
    try {
        const userId = action.payload;

        // Check if userId is 17
        if (userId === '17') {
            yield put(loginSuccess(userId));
        } else {
            throw new Error('Invalid user ID. Only user ID 17 is allowed.');
        }
    } catch (error) {
        yield put(loginFailure(error.message));
    }
}

export function* watchAuthSaga() {
    yield takeLatest(LOGIN_REQUEST, loginSaga);
}