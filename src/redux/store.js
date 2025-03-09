import { createStore, applyMiddleware, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects';

import abilityListReducer from './abilityList/abilityListReducer';
import abilityDetailReducer from './abilityDetail/abilityDetailReducer';
import pokemonDetailReducer from './pokemonDetail/pokemonDetailReducer';
import userReducer from './user/userReducer';

import { watchAbilityListSaga } from './abilityList/abilityListSaga';
import { watchAbilityDetailSaga } from './abilityDetail/abilityDetailSaga';
import { watchPokemonDetailSaga } from './pokemonDetail/pokemonDetailSaga';
import { watchUserProfileSaga } from './user/userSaga';

const rootReducer = combineReducers({
    abilityList: abilityListReducer,
    abilityDetail: abilityDetailReducer,
    pokemonDetail: pokemonDetailReducer,
    userProfile: userReducer,
});

function* rootSaga() {
    yield all([
        watchAbilityListSaga(),
        watchAbilityDetailSaga(),
        watchPokemonDetailSaga(),
        watchUserProfileSaga(),
    ]);
}

const sagaMiddleware = createSagaMiddleware();

const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(rootSaga);

export default store;
