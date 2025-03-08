import axios from 'axios';
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
    const [picProfile, setPicProfile] = useState(null);
    const [username, setUsername] = useState('');
    const [theme, setTheme] = useState('light');
    const [isSubmitting, setIsSubmitting] = useState(false);
    console.log('picProfile', picProfile)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://192.99.8.135/pokemon_api.php?route=get_info&user_id=17');
                const { name, picture, theme } = response.data;

                setUsername(name);
                setPicProfile(picture);
                setTheme(theme);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        // Fetch data initially
        fetchData();

        // Set interval to fetch data every 50 second
        const intervalId = setInterval(fetchData, 50000);

        // Cleanup function to clear interval when component unmounts
        return () => clearInterval(intervalId);
    }, []);



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
                setPicProfile(image.uri);
            }
        });
    };

    const validateForm = () => {
        const errors = [];
        if (!username.trim()) errors.push('Username is required');
        if (username.length < 3) errors.push('Username must be at least 3 characters');
        if (!picProfile) errors.push('Profile picture is required');
        return errors;
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;
        const validationErrors = validateForm();
        if (validationErrors.length > 0) {
            Alert.alert('Validation Errors', validationErrors.join('\n'));
            return;
        }
        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('name', username.trim());
            formData.append('theme', theme);
            formData.append('picture', {
                uri: picProfile,
                type: 'image/jpeg',
                name: 'profile.jpg',
            });

            await axios.post('http://192.99.8.135/pokemon_api.php?route=set_info&user_id=17', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            Alert.alert('Success', 'Profile updated successfully!', [{
                text: 'OK', onPress: () => setIsSubmitting(false),
            }]);
        } catch (error) {
            console.error('Error submitting form:', error);
            Alert.alert('Submission Error', 'Failed to submit form. Please try again.');
            setIsSubmitting(false);
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                <Text style={styles.title}>Profile Settings</Text>

                <TouchableOpacity onPress={handleImagePicker} style={styles.imagePickerContainer}>
                    {picProfile ? (
                        <Image source={{ uri: picProfile }} style={styles.profileImage} />
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
                    style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                >
                    <Text style={styles.submitButtonText}>{isSubmitting ? 'Updating...' : 'Submit'}</Text>
                </TouchableOpacity>
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
});

export default Home;