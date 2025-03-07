export const GET_ABILITY_DETAIL_REQUEST = 'GET_ABILITY_DETAIL_REQUEST';
export const GET_ABILITY_DETAIL_SUCCESS = 'GET_ABILITY_DETAIL_SUCCESS';
export const GET_ABILITY_DETAIL_FAILURE = 'GET_ABILITY_DETAIL_FAILURE';

export const getPokemonListRequest = (url) => ({
    type: GET_ABILITY_DETAIL_REQUEST,
    payload: url,
});

export const getPokemonListSuccess = (abilityDetail) => ({
    type: GET_ABILITY_DETAIL_SUCCESS,
    payload: abilityDetail,
});

export const getPokemonListFailure = (error) => ({
    type: GET_ABILITY_DETAIL_FAILURE,
    payload: error,
});
