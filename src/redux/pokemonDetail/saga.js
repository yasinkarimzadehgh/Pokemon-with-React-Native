import { takeLatest, call, put } from 'redux-saga/effects';
import axios from 'axios';
import {
    GET_POKEMON_DETAIL_REQUEST,
    getPokemonDetailSuccess,
    getPokemonDetailFailure,
} from './action';

export function* watchPokemonDetailSaga() {
    yield takeLatest(GET_POKEMON_DETAIL_REQUEST, getPokemonDetailSaga);
}

function* getPokemonDetailSaga(action) {
    try {
        const response = yield call(
            axios.get,
            `https://pokeapi.co/api/v2/pokemon/${action.payload}`
        );
        yield put(getPokemonDetailSuccess(response.data));
    } catch (error) {
        yield put(getPokemonDetailFailure(error));
    }
}