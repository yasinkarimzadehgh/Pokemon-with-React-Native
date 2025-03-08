import {
    UPDATE_PROFILE_REQUEST,
    UPDATE_PROFILE_SUCCESS,
    UPDATE_PROFILE_FAILURE,
} from './userAction'


const initialState = {
    username: '',
    picProfile: null,
    theme: '',
    isLoading: false,
    error: ''
}


const userReducer = (state = initialState, payload) => ({

})