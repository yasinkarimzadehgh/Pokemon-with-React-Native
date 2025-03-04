import { createStore, applyMiddleware, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects';

import abilityListReducer from './abilityList/reducer';
import abilityDetailReducer from './abilityDetail/reducer';
import pokemonDetailReducer from './pokemonDetail/reducer';

import { watchAbilityListSaga } from './abilityList/saga';
import { watchAbilityDetailSaga } from './abilityDetail/saga';
import { watchPokemonDetailSaga } from './pokemonDetail/saga';

const rootReducer = combineReducers({
    abilityList: abilityListReducer,
    abilityDetail: abilityDetailReducer,
    pokemonDetail: pokemonDetailReducer,
});

function* rootSaga() {
    yield all([
        watchAbilityListSaga(),
        watchAbilityDetailSaga(),
        watchPokemonDetailSaga(),
    ]);
}

const sagaMiddleware = createSagaMiddleware();

const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(rootSaga);

export default store;
