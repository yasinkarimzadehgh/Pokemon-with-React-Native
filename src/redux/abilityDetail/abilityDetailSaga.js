import { takeLatest, put, call, all } from 'redux-saga/effects';
import {
    GET_ABILITY_DETAIL_REQUEST,
    GET_ABILITY_DETAIL_SUCCESS,
    GET_ABILITY_DETAIL_FAILURE,
} from './abilityDetailAction';
import axios from 'axios';

export function* watchAbilityDetailSaga() {
    yield takeLatest(GET_ABILITY_DETAIL_REQUEST, getAbilityDetailSaga);
}


function getPokemonSprite(sprites) {
    const spriteOptions = [
        sprites.front_default,
        sprites.front_female,
        sprites.front_shiny,
        sprites.front_shiny_female,
        sprites.back_default,
        sprites.back_female,
        sprites.back_shiny,
        sprites.back_shiny_female,

        sprites.other?.["dream_world"]?.front_default,
        sprites.other?.["dream_world"]?.front_female,

        sprites.other?.home?.front_default,
        sprites.other?.home?.front_female,
        sprites.other?.home?.front_shiny,
        sprites.other?.home?.front_shiny_female,

        sprites.other?.["official-artwork"]?.front_default,
        sprites.other?.["official-artwork"]?.front_shiny,

        sprites.other?.showdown?.front_default,
        sprites.other?.showdown?.front_female,
        sprites.other?.showdown?.front_shiny,
        sprites.other?.showdown?.front_shiny_female,
        sprites.other?.showdown?.back_default,
        sprites.other?.showdown?.back_female,
        sprites.other?.showdown?.back_shiny,
        sprites.other?.showdown?.back_shiny_female,
    ];

    return spriteOptions.find((sprite) => sprite !== null) || "";
}

function* getAbilityDetailSaga(action) {
    try {
        const response = yield call(axios.get, action.payload);
        const abilityDetail = response.data;
        const pokemonUrls = abilityDetail.pokemon.map(
            (pokemon) => pokemon.pokemon.url
        );

        const pokemonList = yield all(
            pokemonUrls.map(function* (url) {
                try {
                    const pokemonResponse = yield call(axios.get, url);
                    const pokemonData = pokemonResponse.data;
                    return {
                        name: pokemonData.name,
                        sprite: getPokemonSprite(pokemonData.sprites),
                        abilities: pokemonData.abilities.map((ability) => ({
                            name: ability.ability.name,
                        })),
                    };
                } catch (error) {
                    console.error(`Error fetching ${url}:`, error);
                    return null;
                }
            })
        );

        yield put({ type: GET_ABILITY_DETAIL_SUCCESS, payload: pokemonList });
    } catch (err) {
        console.error("Error fetching ability details:", err);
        yield put({ type: GET_ABILITY_DETAIL_FAILURE, payload: err.message });
    }
}

