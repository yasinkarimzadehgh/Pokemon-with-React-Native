import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    StyleSheet,
    Alert,
    ScrollView,
    KeyboardAvoidingView,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import {
    syncProfileRequest,
    updateProfileRequest
} from '../redux/user/userAction';

const ThemeButton = ({ label, active, onPress }) => (
    <TouchableOpacity
        style={[styles.themeButton, active && styles.themeButtonActive]}
        onPress={onPress}
    >
        <Text style={[styles.themeButtonText, active && styles.themeButtonTextActive]}>
            {label}
        </Text>
    </TouchableOpacity>
);

const Home = () => {
    // Local state for form handling
    const [username, setUsername] = useState('');
    const [theme, setTheme] = useState('light');
    const [localPicProfile, setLocalPicProfile] = useState(null);

    // Get data from Redux store
    const dispatch = useDispatch();
    const {
        username: storeUsername,
        picProfile: storePicProfile,
        theme: storeTheme,
        loading,
        error
    } = useSelector(state => state.userProfile);

    // Fetch profile data on component mount
    useEffect(() => {
        dispatch(syncProfileRequest());

        // Setup interval to regularly fetch profile data
        const intervalId = setInterval(() => {
            dispatch(syncProfileRequest());
        }, 50000);

        return () => clearInterval(intervalId);
    }, [dispatch]);

    // Update local state when Redux store changes
    useEffect(() => {
        if (storeUsername) setUsername(storeUsername);
        if (storePicProfile) setLocalPicProfile(storePicProfile);
        if (storeTheme) setTheme(storeTheme);
    }, [storeUsername, storePicProfile, storeTheme]);

    const imagePickerOptions = {
        mediaType: 'photo',
        includeBase64: false,
        maxHeight: 2000,
        maxWidth: 2000,
        quality: 0.8,
    };

    const handleImagePicker = () => {
        launchImageLibrary(imagePickerOptions, (response) => {
            if (response.didCancel) return;

            if (response.errorCode) {
                Alert.alert('Image Selection Error', response.errorMessage || 'Failed to select image');
                return;
            }

            const image = response.assets?.[0];
            if (image) {
                const maxSizeInBytes = 5 * 1024 * 1024;
                if (image.fileSize > maxSizeInBytes) {
                    Alert.alert('Image Too Large', 'Please select an image smaller than 5MB');
                    return;
                }
                setLocalPicProfile(image.uri);
            }
        });
    };

    const validateForm = () => {
        const errors = [];
        if (!username.trim()) errors.push('Username is required');
        if (username.length < 3) errors.push('Username must be at least 3 characters');
        if (!localPicProfile) errors.push('Profile picture is required');
        return errors;
    };

    const handleSubmit = () => {
        const validationErrors = validateForm();
        if (validationErrors.length > 0) {
            Alert.alert('Validation Errors', validationErrors.join('\n'));
            return;
        }

        // Prepare form data
        const formData = new FormData();
        formData.append('name', username.trim());
        formData.append('theme', theme);
        formData.append('picture', {
            uri: localPicProfile,
            type: 'image/jpeg',
            name: 'profile.jpg',
        });

        // Dispatch action to update profile
        dispatch(updateProfileRequest({
            formData,
            onSuccess: () => {
                Alert.alert('Success', 'Profile updated successfully!');
                // Fetch the latest data right after update
                dispatch(syncProfileRequest());
            },
            onFailure: (error) => {
                Alert.alert('Submission Error', error || 'Failed to submit form. Please try again.');
            }
        }));
    };

    // Display current image with timestamp to prevent caching
    const getImageSource = () => {
        if (!localPicProfile) return null;

        // If it's a local file (from image picker)
        if (localPicProfile.startsWith('file://') || localPicProfile.startsWith('content://')) {
            return { uri: localPicProfile };
        }

        // It's a remote URL, so it already has timestamp
        return { uri: localPicProfile };
    };

    return (
        <KeyboardAvoidingView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                <Text style={styles.title}>Profile Settings</Text>

                <TouchableOpacity onPress={handleImagePicker} style={styles.imagePickerContainer}>
                    {localPicProfile ? (
                        <Image
                            source={getImageSource()}
                            style={styles.profileImage}
                            key={Date.now()}
                        />
                    ) : (
                        <View style={styles.imagePlaceholder}>
                            <Text style={styles.imagePickerText}>Select Profile Picture</Text>
                        </View>
                    )}
                </TouchableOpacity>

                <TextInput
                    style={styles.input}
                    placeholder="Enter Username"
                    value={username}
                    onChangeText={setUsername}
                    placeholderTextColor="#888"
                    autoCorrect={false}
                    autoCapitalize="none"
                    maxLength={20}
                    returnKeyType="done"
                />

                <View style={styles.themeContainer}>
                    <Text style={styles.themeLabel}>Choose Theme</Text>
                    <View style={styles.themeButtonContainer}>
                        <ThemeButton label="Light" active={theme === 'light'} onPress={() => setTheme('light')} />
                        <ThemeButton label="Dark" active={theme === 'dark'} onPress={() => setTheme('dark')} />
                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    <Text style={styles.submitButtonText}>{loading ? 'Updating...' : 'Submit'}</Text>
                </TouchableOpacity>

                {error && (
                    <Text style={styles.errorText}>{error}</Text>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
        color: '#333',
    },
    imagePickerContainer: {
        alignSelf: 'center',
        marginBottom: 30,
    },
    imagePlaceholder: {
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: '#e1e1e1',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: '#999',
    },
    profileImage: {
        width: 180,
        height: 180,
        borderRadius: 90,
        borderWidth: 3,
        borderColor: "#2980b9",
    },
    imagePickerText: {
        color: '#888',
        textAlign: 'center',
        fontSize: 16,
    },
    input: {
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 20,
        backgroundColor: 'white',
        fontSize: 16,
    },
    themeContainer: {
        marginBottom: 30,
    },
    themeLabel: {
        fontSize: 18,
        marginBottom: 10,
        color: '#333',
        fontWeight: '500',
    },
    themeButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    themeButton: {
        flex: 1,
        padding: 12,
        marginHorizontal: 5,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        backgroundColor: 'white',
    },
    themeButtonActive: {
        backgroundColor: "#2980b9",
        borderColor: "#2980b9",
    },
    themeButtonText: {
        textAlign: 'center',
        color: '#333',
        fontSize: 16,
        fontWeight: '500',
    },
    themeButtonTextActive: {
        color: 'white',
    },
    submitButton: {
        backgroundColor: "#2980b9",
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    submitButtonDisabled: {
        backgroundColor: '#a0c4e8',
    },
    submitButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 10,
    }
});

export default Home;