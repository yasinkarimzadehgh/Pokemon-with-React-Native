import {
    GET_ABILITY_DETAIL_REQUEST,
    GET_ABILITY_DETAIL_SUCCESS,
    GET_ABILITY_DETAIL_FAILURE,
} from './abilityDetailAction';

const initialState = {
    pokemonList: [],
    loading: false,
    error: null,
};

const abilityDetailReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ABILITY_DETAIL_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case GET_ABILITY_DETAIL_SUCCESS:
            return {
                ...state,
                pokemonList: action.payload,
                loading: false,
            };
        case GET_ABILITY_DETAIL_FAILURE:
            return {
                ...state,
                error: action.payload,
                loading: false,
            };
        default:
            return state;
    }
};

export default abilityDetailReducer;