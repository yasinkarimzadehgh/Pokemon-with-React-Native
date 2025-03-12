"use client"

import { useEffect, useState } from "react"
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
    useColorScheme,
} from "react-native"
import { launchImageLibrary } from "react-native-image-picker"
import { useDispatch, useSelector } from "react-redux"
import { syncProfileRequest, updateProfileRequest } from "../redux/user/userAction"
import { logout } from "../redux/auth/authAction"
import Icon from "react-native-vector-icons/MaterialIcons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { setDarkMode, setLightMode } from "../redux/theme/themeAction"

const ThemeButton = ({ label, active, onPress, style }) => {
    const { theme } = useSelector(state => state.theme);

    return (
        <TouchableOpacity
            style={[
                styles.themeButton,
                {
                    backgroundColor: active ? theme.primary : theme.card,
                    borderColor: active ? theme.primary : theme.border,
                },
                style,
            ]}
            onPress={onPress}
        >
            <Text style={[styles.themeButtonText, { color: active ? theme.headerText : theme.text }]}>{label}</Text>
        </TouchableOpacity>
    )
}

const Home = () => {

    const { theme } = useSelector(state => state.theme);

    const [username, setUsername] = useState("")
    const [themeMode, setLocalThemeMode] = useState("light")
    const [localPicProfile, setLocalPicProfile] = useState(null)


    const systemTheme = useColorScheme();

    const dispatch = useDispatch()
    const {
        username: storeUsername,
        picProfile: storePicProfile,
        theme: storeTheme,
        loading,
        error,
    } = useSelector((state) => state.userProfile)

    useEffect(() => {
        dispatch(syncProfileRequest())

        const intervalId = setInterval(() => {
            dispatch(syncProfileRequest())
        }, 50000)

        return () => clearInterval(intervalId)
    }, [dispatch])

    useEffect(() => {
        if (storeUsername) setUsername(storeUsername)
        if (storePicProfile) setLocalPicProfile(storePicProfile)
        if (storeTheme) setLocalThemeMode(storeTheme)
    }, [storeUsername, storePicProfile, storeTheme])

    const imagePickerOptions = {
        mediaType: "photo",
        includeBase64: false,
        maxHeight: 2000,
        maxWidth: 2000,
        quality: 0.8,
    }

    const handleImagePicker = () => {
        launchImageLibrary(imagePickerOptions, (response) => {
            if (response.didCancel) return

            if (response.errorCode) {
                Alert.alert("Image Selection Error", response.errorMessage || "Failed to select image")
                return
            }

            const image = response.assets?.[0]
            if (image) {
                const maxSizeInBytes = 5 * 1024 * 1024
                if (image.fileSize > maxSizeInBytes) {
                    Alert.alert("Image Too Large", "Please select an image smaller than 5MB")
                    return
                }
                setLocalPicProfile(image.uri)
            }
        })
    }

    const validateForm = () => {
        const errors = []
        if (!username.trim()) errors.push("Username is required")
        if (username.length < 3) errors.push("Username must be at least 3 characters")
        if (!localPicProfile) errors.push("Profile picture is required")
        return errors
    }

    const handleSubmit = () => {
        const validationErrors = validateForm()
        if (validationErrors.length > 0) {
            Alert.alert("Validation Errors", validationErrors.join("\n"))
            return
        }

        const formData = new FormData()
        formData.append("name", username.trim())
        formData.append("theme", themeMode)
        formData.append("picture", {
            uri: localPicProfile,
            type: "image/jpeg",
            name: "profile.jpg",
        })

        // Dispatch action to update profile
        dispatch(
            updateProfileRequest({
                formData,
                onSuccess: () => {
                    Alert.alert("Success", "Profile updated successfully!")
                    // Fetch the latest data right after update
                    dispatch(syncProfileRequest())
                    if (themeMode == 'dark') dispatch(setDarkMode());
                    if (themeMode == 'light') dispatch(setLightMode());
                },
                onFailure: (error) => {
                    Alert.alert("Submission Error", error || "Failed to submit form. Please try again.")
                },
            }),
        )
    }

    const handleLogout = () => {
        Alert.alert("Logout", "Are you sure you want to logout?", [
            {
                text: "Cancel",
                style: "cancel",
            },
            {
                text: "Logout",
                onPress: () => {
                    AsyncStorage.removeItem("isAuthenticated")
                    dispatch(logout())
                },
            },
        ])
    }

    const getImageSource = () => {
        if (!localPicProfile) return null

        if (localPicProfile.startsWith("file://") || localPicProfile.startsWith("content://")) {
            return { uri: localPicProfile }
        }

        return { uri: localPicProfile }
    }

    const dynamicStyles = {
        container: {
            backgroundColor: theme.background,
        },
        title: {
            color: theme.text,
        },
        imagePlaceholder: {
            backgroundColor: theme.card,
            borderColor: theme.border,
        },
        imagePickerText: {
            color: theme.textMuted,
        },
        profileImage: {
            borderColor: theme.primary,
        },
        input: {
            backgroundColor: theme.inputBackground,
            borderColor: theme.inputBorder,
            color: theme.text,
        },
        themeLabel: {
            color: theme.text,
        },
        submitButton: {
            backgroundColor: theme.primary,
        },
        submitButtonDisabled: {
            backgroundColor: theme.buttonDisabled,
        },
        errorText: {
            color: theme.error,
        },
        logoutButton: {
            backgroundColor: theme.error,
        },
    }

    const handleLightMode = () => {
        dispatch(setLightMode())
        setLocalThemeMode("light")
    }

    const handleDarkMode = () => {
        dispatch(setDarkMode())
        setLocalThemeMode("dark")
    }


    const handleSystemThemeMode = () => {
        setLocalThemeMode("system")
        if (systemTheme === "dark") {
            dispatch(setDarkMode())
        } else {
            dispatch(setLightMode())
        }
    }

    return (
        <KeyboardAvoidingView style={[styles.container, dynamicStyles.container]}>
            <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                <View style={styles.header}>
                    <Text style={[styles.title, dynamicStyles.title]}>Profile Settings</Text>
                    <TouchableOpacity style={[styles.logoutButton, dynamicStyles.logoutButton]} onPress={handleLogout}>
                        <Icon name="logout" size={20} color="#FFFFFF" />
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={handleImagePicker} style={styles.imagePickerContainer}>
                    {localPicProfile ? (
                        <Image
                            source={getImageSource()}
                            style={[styles.profileImage, dynamicStyles.profileImage]}
                            key={Date.now()}
                        />
                    ) : (
                        <View style={[styles.imagePlaceholder, dynamicStyles.imagePlaceholder]}>
                            <Text style={[styles.imagePickerText, dynamicStyles.imagePickerText]}>Select Profile Picture</Text>
                        </View>
                    )}
                </TouchableOpacity>

                <TextInput
                    style={[styles.input, dynamicStyles.input]}
                    placeholder="Enter Username"
                    value={username}
                    onChangeText={setUsername}
                    placeholderTextColor={theme.textMuted}
                    autoCorrect={false}
                    autoCapitalize="none"
                    maxLength={20}
                    returnKeyType="done"
                />

                <View style={styles.themeContainer}>
                    <Text style={[styles.themeLabel, dynamicStyles.themeLabel]}>Choose Theme</Text>
                    <View style={styles.themeButtonContainer}>
                        <ThemeButton style={styles.ThemeButtonCh1} label="Light" active={themeMode === "light"} onPress={() => handleLightMode()} />
                        <ThemeButton style={styles.ThemeButtonCh2} label="Dark" active={themeMode === "dark"} onPress={() => handleDarkMode()} />
                        <ThemeButton style={styles.ThemeButtonCh3} label="System theme" active={themeMode === "system"}
                            onPress={() => handleSystemThemeMode()} />
                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.submitButton, dynamicStyles.submitButton, loading && dynamicStyles.submitButtonDisabled]}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    <Text style={styles.submitButtonText}>{loading ? "Updating..." : "Submit"}</Text>
                </TouchableOpacity>

                {error && <Text style={[styles.errorText, dynamicStyles.errorText]}>{error}</Text>}
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        padding: 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 30,
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
    },
    logoutButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    logoutText: {
        color: "#FFFFFF",
        marginLeft: 5,
        fontWeight: "600",
    },
    imagePickerContainer: {
        alignSelf: "center",
        marginBottom: 30,
    },
    imagePlaceholder: {
        width: 180,
        height: 180,
        borderRadius: 90,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderStyle: "dashed",
    },
    profileImage: {
        width: 180,
        height: 180,
        borderRadius: 90,
        borderWidth: 3,
    },
    imagePickerText: {
        textAlign: "center",
        fontSize: 16,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 20,
        fontSize: 16,
    },
    themeContainer: {
        marginBottom: 30,
    },
    themeLabel: {
        fontSize: 18,
        marginBottom: 10,
        fontWeight: "500",
    },
    themeButtonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    themeButton: {
        padding: 12,
        marginHorizontal: 5,
        borderWidth: 1,
        borderRadius: 10,
    },
    ThemeButtonCh1: {
        flex: 1,
    },
    ThemeButtonCh2: {
        flex: 1,
    },
    ThemeButtonCh3: {
        flex: 3,
    },
    themeButtonText: {
        textAlign: "center",
        fontSize: 16,
        fontWeight: "500",
    },
    submitButton: {
        height: 50,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
    },
    submitButtonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
    errorText: {
        textAlign: "center",
        marginTop: 10,
    },
})

export default Home

