export const GET_ABILITIES_STORED = "GET_ABILITIES_STORED"

export const SHOW_MORE_ABILITY_REQUEST = "SHOW_MORE_ABILITY_REQUEST"
export const SHOW_MORE_ABILITY_SUCCESS = "SHOW_MORE_ABILITY_SUCCESS"
export const SHOW_MORE_ABILITY_FAILURE = "SHOW_MORE_ABILITY_FAILURE"

export const SHOW_LESS_ABILITY_REQUEST = "SHOW_LESS_ABILITY_REQUEST"
export const SHOW_LESS_ABILITY_SUCCESS = "SHOW_LESS_ABILITY_SUCCESS"
export const SHOW_LESS_ABILITY_FAILURE = "SHOW_LESS_ABILITY_FAILURE"

export const getAbilitiesStored = (data) => ({
    type: GET_ABILITIES_STORED,
    payload: data,
})

export const showMoreAbilitiesRequest = (url) => ({
    type: SHOW_MORE_ABILITY_REQUEST,
    payload: url,
})

export const showMoreAbilitiesSuccess = (data) => ({
    type: SHOW_MORE_ABILITY_SUCCESS,
    payload: data,
})

export const showMoreAbilitiesFailure = (error) => ({
    type: SHOW_MORE_ABILITY_FAILURE,
    payload: error,
})

export const showLessAbilitiesRequest = () => ({
    type: SHOW_LESS_ABILITY_REQUEST,
})

export const showLessAbilitiesSuccess = (data) => ({
    type: SHOW_LESS_ABILITY_SUCCESS,
    payload: data,
})

export const showLessAbilitiesFailure = (error) => ({
    type: SHOW_LESS_ABILITY_FAILURE,
    payload: error,
})

