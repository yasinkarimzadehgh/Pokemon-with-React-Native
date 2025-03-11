import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme } from './themes';
import { SET_DARK_MODE, SET_LIGHT_MODE } from './themeAction';

const initialState = {
    isDark: false,
    theme: lightTheme,
};

const themeReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_DARK_MODE:
            AsyncStorage.setItem('app_theme_mode', 'dark');
            return {
                ...state,
                isDark: true,
                theme: darkTheme,
            };

        case SET_LIGHT_MODE:
            AsyncStorage.setItem('app_theme_mode', 'light');
            return {
                ...state,
                isDark: false,
                theme: lightTheme,
            };
        default:
            return state;
    }
};

export default themeReducer;
