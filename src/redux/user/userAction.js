const UPDATE_PROFILE_REQUEST = 'UPDATE_PROFILE_REQUEST'
const UPDATE_PROFILE_SUCCESS = 'UPDATE_PROFILE_SUCCESS'
const UPDATE_PROFILE_FAILURE = 'UPDATE_PROFILE_FAILURE'

const updateProfileRequest = (data) => ({
    type: UPDATE_PROFILE_REQUEST,
    payload: data
})

const updateProfileSuccess = (data) => ({
    type: UPDATE_PROFILE_REQUEST,
    payload: data
})

const updateProfileFailure = (error) => ({
    type: UPDATE_PROFILE_FAILURE,
    payload: error
})