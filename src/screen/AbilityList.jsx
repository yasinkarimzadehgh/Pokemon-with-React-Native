import React, { useEffect, useState } from "react";
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    RefreshControl
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/native";
import {
    getAbilitiesStored,
    showMoreAbilitiesRequest,
    showLessAbilitiesRequest,
    showMoreAbilitiesFailure
} from "../redux/abilityList/action";

// Constants
const STORAGE_KEY = "pokemonAbilitiesData";
const INITIAL_URL = "https://pokeapi.co/api/v2/ability/?offset=0&limit=10";


const AbilityList = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { abilities, next, loading, error } = useSelector((state) => state.abilityList);
    const [refreshing, setRefreshing] = useState(false);

    // Navigation to Ability Detail
    const handleNavigateToAbilityDetail = (item) => {
        navigation.navigate('ABILITY_DETAIL_STACK', {
            screen: 'ABILITY_DETAIL',
            params: { abilityName: item.name },
        });
    };

    // Initial Data Fetch
    useEffect(() => {
        const checkStoredAbilities = async () => {
            try {
                const storedData = await AsyncStorage.getItem(STORAGE_KEY);
                if (storedData) {
                    dispatch(getAbilitiesStored(JSON.parse(storedData)));
                } else {
                    dispatch(showMoreAbilitiesRequest(INITIAL_URL));
                }
            } catch (error) {
                handleError(error, "Failed to load stored abilities.");
            }
        };
        checkStoredAbilities();
    }, []);

    // Refresh Handler
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        dispatch(showMoreAbilitiesRequest(INITIAL_URL));
        setRefreshing(false);
    }, []);

    // Show More/Less Handlers
    const handleShowMore = () => {
        if (next) {
            dispatch(showMoreAbilitiesRequest(next));
        }
    };

    const handleShowLess = () => {
        dispatch(showLessAbilitiesRequest());
    };

    // Error Handling
    const handleError = (error, message) => {
        console.error(error);
        dispatch(showMoreAbilitiesFailure(message));
        Alert.alert("Error", message, [{
            text: "Retry",
            onPress: () => dispatch(showMoreAbilitiesRequest(INITIAL_URL))
        }]);
    };

    // Render Individual Ability Item
    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.abilityItem}
            onPress={() => handleNavigateToAbilityDetail(item)}
            activeOpacity={0.7}
        >
            <View style={styles.abilityItemContent}>
                <Icon
                    name="sparkles"
                    size={24}
                    color="#2980b9"
                    style={styles.icon}
                />
                <Text style={styles.abilityName}>
                    {item.name.replace(/-/g, " ")}
                </Text>
                <Icon
                    name="chevron-forward"
                    size={20}
                    color="#697386"
                />
            </View>
        </TouchableOpacity>
    );

    // Loading Indicator
    const renderFooter = () => (
        loading ? (
            <ActivityIndicator
                size="large"
                color="#2980b9"
                style={styles.loadingIndicator}
            />
        ) : null
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Pokemon Abilities</Text>
            </View>

            {error ? (
                <View style={styles.errorContainer}>
                    <Icon
                        name="warning"
                        size={50}
                        color="#FF4E64"
                    />
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity
                        style={styles.retryButton}
                        onPress={() => dispatch(showMoreAbilitiesRequest(INITIAL_URL))}
                    >
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={abilities}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => `${item.name}-${index}`}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListFooterComponent={renderFooter}
                />
            )}

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[
                        styles.button,
                        (abilities.length <= 10 || loading) && styles.disabledButton
                    ]}
                    onPress={handleShowLess}
                    disabled={abilities.length <= 10 || loading}
                    activeOpacity={0.7}
                >
                    <Text style={styles.buttonText}>Show Less</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.button,
                        (!next || loading) && styles.disabledButton
                    ]}
                    onPress={handleShowMore}
                    disabled={!next || loading}
                    activeOpacity={0.7}
                >
                    <Text style={styles.buttonText}>Show More</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ebeaea",
    },
    header: {
        backgroundColor: "#2980b9",
        paddingVertical: 20,
        paddingHorizontal: 16,
        alignItems: "center",
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
        color: "#FFFFFF",
        letterSpacing: 0.5,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 80,
    },
    abilityItem: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        marginBottom: 12,
    },
    abilityItemContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
    },
    icon: {
        marginRight: 12,
    },
    abilityName: {
        flex: 1,
        fontSize: 16,
        fontWeight: "500",
        textTransform: "capitalize",
        color: "#1E2132",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: "#FFFFFF",
        borderTopWidth: 1,
        borderTopColor: "#E0E4EB",
    },
    button: {
        backgroundColor: "#2980b9",
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 10,
        alignItems: "center",
        flex: 0.48,
        shadowColor: "#2980b9",
    },
    disabledButton: {
        backgroundColor: "#E0E4EB",
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    errorText: {
        color: "#FF4E64",
        fontSize: 16,
        textAlign: "center",
        marginVertical: 16,
    },
    retryButton: {
        backgroundColor: "#2980b9",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    retryButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
    },
    loadingIndicator: {
        marginVertical: 20,
    },
});

export default AbilityList;