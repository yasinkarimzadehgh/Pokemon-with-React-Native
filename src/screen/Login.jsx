import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loginRequest } from '../redux/auth/authAction';
import { useTheme } from '../theme/ThemeContext';

const Login = () => {
    const { theme } = useTheme();
    const [userId, setUserId] = useState('');
    const dispatch = useDispatch();
    const { loading, error } = useSelector(state => state.auth);

    useEffect(() => {
        if (error) {
            Alert.alert('Login Error', error);
        }
    }, [error]);

    const handleLogin = () => {
        if (!userId.trim()) {
            Alert.alert('Error', 'Please enter a user ID');
            return;
        }
        dispatch(loginRequest(userId));
    };

    const dynamicStyles = {
        container: {
            backgroundColor: theme.background,
        },
        title: {
            color: theme.text,
        },
        input: {
            backgroundColor: theme.inputBackground,
            borderColor: theme.inputBorder,
            color: theme.text,
        },
        loginButton: {
            backgroundColor: theme.primary,
        },
        loginButtonDisabled: {
            backgroundColor: theme.buttonDisabled,
        },
        errorText: {
            color: theme.error,
        },
    };

    return (
        <View style={[styles.container, dynamicStyles.container]}>
            <Text style={[styles.title, dynamicStyles.title]}>Pokemon App</Text>
            <Text style={[styles.subtitle, dynamicStyles.title]}>Login</Text>

            <TextInput
                style={[styles.input, dynamicStyles.input]}
                placeholder="Enter User ID"
                placeholderTextColor={theme.textMuted}
                value={userId}
                onChangeText={setUserId}
                keyboardType="numeric"
                autoCapitalize="none"
                editable={!loading}
            />

            <TouchableOpacity
                style={[
                    styles.loginButton,
                    dynamicStyles.loginButton,
                    loading && dynamicStyles.loginButtonDisabled,
                ]}
                onPress={handleLogin}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#FFFFFF" />
                ) : (
                    <Text style={styles.loginButtonText}>Login</Text>
                )}
            </TouchableOpacity>

            {error && (
                <Text style={[styles.errorText, dynamicStyles.errorText]}>
                    {error}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 30,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 20,
        fontSize: 16,
    },
    loginButton: {
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    errorText: {
        marginTop: 10,
        textAlign: 'center',
        fontSize: 14,
    },
});

export default Login;