export const SYNC_PROFILE_REQUEST = 'FETCH_PROFILE_REQUEST';
export const SYNC_PROFILE_SUCCESS = 'FETCH_PROFILE_SUCCESS';
export const SYNC_PROFILE_FAILURE = 'FETCH_PROFILE_FAILURE';

export const UPDATE_PROFILE_REQUEST = 'UPDATE_PROFILE_REQUEST';
export const UPDATE_PROFILE_SUCCESS = 'UPDATE_PROFILE_SUCCESS';
export const UPDATE_PROFILE_FAILURE = 'UPDATE_PROFILE_FAILURE';

// Sync profile actions
export const syncProfileRequest = () => ({
    type: SYNC_PROFILE_REQUEST
});

export const syncProfileSuccess = (data) => ({
    type: SYNC_PROFILE_SUCCESS,
    payload: data
});

export const syncProfileFailure = (error) => ({
    type: SYNC_PROFILE_FAILURE,
    payload: error
});

// Update profile actions
export const updateProfileRequest = (data) => ({
    type: UPDATE_PROFILE_REQUEST,
    payload: data
});

export const updateProfileSuccess = () => ({
    type: UPDATE_PROFILE_SUCCESS,
});

export const updateProfileFailure = (error) => ({
    type: UPDATE_PROFILE_FAILURE,
    payload: error
});