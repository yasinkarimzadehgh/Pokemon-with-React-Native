import { takeLatest, call, put } from 'redux-saga/effects';
import axios from 'axios';
import {
    SYNC_PROFILE_REQUEST,
    syncProfileSuccess,
    syncProfileFailure,
    UPDATE_PROFILE_REQUEST,
    updateProfileSuccess,
    updateProfileFailure
} from './userAction';

// Watcher Saga: Watch for actions
export function* watchUserProfileSaga() {
    yield takeLatest(SYNC_PROFILE_REQUEST, syncProfileSaga);
    yield takeLatest(UPDATE_PROFILE_REQUEST, updateProfileSaga);
}

// Worker Saga: Fetch profile data
function* syncProfileSaga() {
    try {
        const timestamp = Date.now();
        const response = yield call(axios.get,
            `http://192.99.8.135/pokemon_api.php?route=get_info&user_id=17&_t=${timestamp}`, {
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
            },
        });

        const { name, picture, theme } = response.data;

        // Add timestamp to picture URL to prevent caching
        const picWithTimestamp = picture.includes('?') ?
            `${picture}&_t=${timestamp}` :
            `${picture}?_t=${timestamp}`;

        yield put(syncProfileSuccess({
            name,
            picture: picWithTimestamp,
            theme
        }));
    } catch (error) {
        yield put(syncProfileFailure(error.message || 'Failed to fetch profile data'));
    }
}

// Worker Saga: Update profile data
function* updateProfileSaga(action) {
    try {
        const { formData, onSuccess, onFailure } = action.payload;

        yield call(axios.post,
            'http://192.99.8.135/pokemon_api.php?route=set_info&user_id=17',
            formData,
            {
                headers: { 'Content-Type': 'multipart/form-data' },
            }
        );

        yield put(updateProfileSuccess());

        if (onSuccess) {
            onSuccess();
        }

    } catch (error) {
        yield put(updateProfileFailure(error.message || 'Failed to update profile'));

        if (action.payload.onFailure) {
            action.payload.onFailure(error.message);
        }
    }
}

