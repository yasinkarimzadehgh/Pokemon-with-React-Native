import { createStore, applyMiddleware, combineReducers } from "redux"
import createSagaMiddleware from "redux-saga"
import { all } from "redux-saga/effects"

import abilityListReducer from "./abilityList/abilityListReducer"
import abilityDetailReducer from "./abilityDetail/abilityDetailReducer"
import pokemonDetailReducer from "./pokemonDetail/pokemonDetailReducer"
import userReducer from "./user/userReducer"
import authReducer from "./auth/authReducer"

import { watchAbilityListSaga } from "./abilityList/abilityListSaga"
import { watchAbilityDetailSaga } from "./abilityDetail/abilityDetailSaga"
import { watchPokemonDetailSaga } from "./pokemonDetail/pokemonDetailSaga"
import { watchUserProfileSaga } from "./user/userSaga"
import { watchAuthSaga } from "./auth/authSaga"
import themeReducer from "./theme/themeReducer"

const rootReducer = combineReducers({
    abilityList: abilityListReducer,
    abilityDetail: abilityDetailReducer,
    pokemonDetail: pokemonDetailReducer,
    userProfile: userReducer,
    auth: authReducer,
    theme: themeReducer,
})

function* rootSaga() {
    yield all([
        watchAbilityListSaga(),
        watchAbilityDetailSaga(),
        watchPokemonDetailSaga(),
        watchUserProfileSaga(),
        watchAuthSaga(),
    ])
}

const sagaMiddleware = createSagaMiddleware()

const store = createStore(rootReducer, applyMiddleware(sagaMiddleware))

sagaMiddleware.run(rootSaga)

export default store