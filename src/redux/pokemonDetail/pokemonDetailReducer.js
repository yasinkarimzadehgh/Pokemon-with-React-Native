import {
    GET_POKEMON_DETAIL_REQUEST,
    GET_POKEMON_DETAIL_SUCCESS,
    GET_POKEMON_DETAIL_FAILURE,
} from './pokemonDetailAction';

const initialState = {
    pokemonDetail: null,
    loading: false,
    error: null,
};

const pokemonDetailReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_POKEMON_DETAIL_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case GET_POKEMON_DETAIL_SUCCESS:
            return {
                ...state,
                pokemonDetail: action.payload,
                loading: false,
            };
        case GET_POKEMON_DETAIL_FAILURE:
            return {
                ...state,
                error: action.payload,
                loading: false,
            };
        default:
            return state;
    }
};

export default pokemonDetailReducer;