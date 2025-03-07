import { takeLatest, put, call, select } from "redux-saga/effects"
import AsyncStorage from "@react-native-async-storage/async-storage"
import {
    SHOW_MORE_ABILITY_REQUEST,
    SHOW_LESS_ABILITY_REQUEST,
    showMoreAbilitiesSuccess,
    showMoreAbilitiesFailure,
    showLessAbilitiesSuccess,
    showLessAbilitiesFailure,
} from "./abilityListAction"
import axios from "axios"

const STORAGE_KEY = "pokemonAbilitiesData"

// Helper function to fetch data from API
const fetchAbilities = async (url) => {
    const response = await axios.get(url)
    return response.data
}

// Helper function to store data in AsyncStorage
const storeInAsyncStorage = async (data) => {
    try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (error) {
        console.error("Error storing abilities in AsyncStorage:", error)
    }
}

// Selector to get the current state
const getAbilityListState = (state) => state.abilityList

export function* watchAbilityListSaga() {
    yield takeLatest(SHOW_MORE_ABILITY_REQUEST, showMoreAbilitySaga)
    yield takeLatest(SHOW_LESS_ABILITY_REQUEST, showLessAbilitySaga)
}

function* showMoreAbilitySaga(action) {
    try {
        const url = action.payload
        const data = yield call(fetchAbilities, url)
        const currentState = yield select(getAbilityListState)

        // Append new abilities to the existing list
        const updatedAbilities = [...currentState.abilities, ...data.results]

        const updatedState = {
            abilities: updatedAbilities,
            next: data.next,
            previous: data.previous,
        }

        // Store the updated data in AsyncStorage
        yield call(storeInAsyncStorage, updatedState)

        yield put(
            showMoreAbilitiesSuccess({
                results: updatedAbilities,
                next: data.next,
                previous: data.previous,
            }),
        )
    } catch (error) {
        yield put(showMoreAbilitiesFailure(error.message))
    }
}

function* showLessAbilitySaga() {
    try {
        const currentState = yield select(getAbilityListState)
        const { abilities, next } = currentState

        // Make sure we don't go below the initial 10 items
        if (abilities.length <= 10) {
            return
        }

        // Determine how many items to remove (7 if we're on the last page, otherwise 10)
        const itemsToRemove = abilities.length % 10 !== 0 ? 7 : 10

        // Remove the last 'itemsToRemove' items
        const updatedAbilities = abilities.slice(0, abilities.length - itemsToRemove)

        // Determine the new 'next' URL based on the number of remaining items
        // If we have exactly 10 items left, there's no previous page
        const updatedNext =
            updatedAbilities.length > 10
                ? `https://pokeapi.co/api/v2/ability/?offset=${updatedAbilities.length - 10}&limit=10`
                : "https://pokeapi.co/api/v2/ability/?offset=10&limit=10"

        // Determine the new 'previous' URL
        const updatedPrevious =
            updatedAbilities.length > 10
                ? `https://pokeapi.co/api/v2/ability/?offset=${Math.max(0, updatedAbilities.length - 20)}&limit=10`
                : null

        const updatedState = {
            abilities: updatedAbilities,
            next: updatedNext,
            previous: updatedPrevious,
        }

        // Store the updated data in AsyncStorage
        yield call(storeInAsyncStorage, updatedState)

        yield put(
            showLessAbilitiesSuccess({
                results: updatedAbilities,
                next: updatedNext,
                previous: updatedPrevious,
            }),
        )
    } catch (error) {
        yield put(showLessAbilitiesFailure(error.message))
    }
}

