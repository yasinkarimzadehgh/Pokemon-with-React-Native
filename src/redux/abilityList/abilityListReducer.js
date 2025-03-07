import {
    GET_ABILITIES_STORED,
    SHOW_MORE_ABILITY_REQUEST,
    SHOW_MORE_ABILITY_SUCCESS,
    SHOW_MORE_ABILITY_FAILURE,
    SHOW_LESS_ABILITY_REQUEST,
    SHOW_LESS_ABILITY_SUCCESS,
    SHOW_LESS_ABILITY_FAILURE,
} from "./abilityListAction"

const initialState = {
    abilities: [],
    next: null,
    previous: null,
    loading: false,
    error: null,
}

const abilityListReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ABILITIES_STORED:
            return {
                ...state,
                abilities: action.payload.abilities,
                next: action.payload.next,
                previous: action.payload.previous,
                loading: false,
                error: null,
            }

        case SHOW_MORE_ABILITY_REQUEST:
        case SHOW_LESS_ABILITY_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            }

        case SHOW_MORE_ABILITY_SUCCESS:
        case SHOW_LESS_ABILITY_SUCCESS:
            return {
                ...state,
                abilities: action.payload.results,
                next: action.payload.next,
                previous: action.payload.previous,
                loading: false,
                error: null,
            }

        case SHOW_MORE_ABILITY_FAILURE:
        case SHOW_LESS_ABILITY_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            }

        default:
            return state
    }
}

export default abilityListReducer

