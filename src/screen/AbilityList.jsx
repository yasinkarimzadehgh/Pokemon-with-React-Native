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
    TextInput
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from 'react-native-vector-icons/Ionicons';
import SearchIcon from 'react-native-vector-icons/Feather';
import { useNavigation } from "@react-navigation/native";
import {
    getAbilitiesStored,
    showMoreAbilitiesRequest,
    showLessAbilitiesRequest,
    showMoreAbilitiesFailure
} from "../redux/abilityList/abilityListAction";

const STORAGE_KEY = "pokemonAbilitiesData";
const INITIAL_URL = "https://pokeapi.co/api/v2/ability/?offset=0&limit=10";

const AbilityList = () => {
    const { theme } = useSelector(state => state.theme);
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { abilities, next, loading, error } = useSelector((state) => state.abilityList);

    const [searchQuery, setSearchQuery] = useState("");
    const [filteredAbilities, setFilteredAbilities] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const handleNavigateToAbilityDetail = (item) => {
        navigation.navigate('ABILITY_DETAIL_STACK', {
            screen: 'ABILITY_DETAIL',
            params: { abilityName: item.name },
        });
    };

    const handleError = (error, message) => {
        console.error(error);
        dispatch(showMoreAbilitiesFailure(message));
        Alert.alert("Error", message, [{
            text: "Retry",
            onPress: () => dispatch(showMoreAbilitiesRequest(INITIAL_URL))
        }]);
    };

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

    useEffect(() => {
        if (searchQuery) {
            const filtered = abilities.filter(ability =>
                ability.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredAbilities(filtered);
            setIsSearching(true);
        } else {
            setFilteredAbilities([]);
            setIsSearching(false);
        }
    }, [searchQuery, abilities]);

    const handleShowMore = () => {
        if (next) {
            dispatch(showMoreAbilitiesRequest(next));
        }
    };

    const handleShowLess = () => {
        dispatch(showLessAbilitiesRequest());
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.abilityItem, { backgroundColor: theme.card }]}
            onPress={() => handleNavigateToAbilityDetail(item)}
            activeOpacity={0.7}
        >
            <View style={styles.abilityItemContent}>
                <Icon
                    name="sparkles"
                    size={23}
                    color={theme.primary}
                    style={styles.icon}
                />
                <Text style={[styles.abilityName, { color: theme.text }]}>
                    {item.name.replace(/-/g, " ")}
                </Text>
                <Icon
                    name="chevron-forward"
                    size={20}
                    color={theme.textSecondary}
                />
            </View>
        </TouchableOpacity>
    );

    const renderFooter = () => (
        loading ? (
            <ActivityIndicator
                size="large"
                color={theme.primary}
                style={styles.loadingIndicator}
            />
        ) : null
    );

    const dynamicStyles = {
        container: {
            backgroundColor: theme.background,
        },
        header: {
            backgroundColor: theme.headerBackground,
        },
        title: {
            color: theme.headerText,
        },
        searchContainer: {
            backgroundColor: theme.searchBackground,
        },
        searchInput: {
            color: theme.text,
        },
        emptySearchText: {
            color: theme.textMuted,
        },
        button: {
            backgroundColor: theme.primary,
        },
        disabledButton: {
            backgroundColor: theme.buttonDisabled,
        },
        errorText: {
            color: theme.error,
        },
    };

    return (
        <SafeAreaView style={[styles.container, dynamicStyles.container]}>
            <View style={[styles.header, dynamicStyles.header]}>
                <Text style={[styles.title, dynamicStyles.title]}>Pokemon Abilities</Text>
            </View>

            <View style={[styles.searchContainer, dynamicStyles.searchContainer]}>
                <SearchIcon
                    name="search"
                    size={20}
                    color={theme.textMuted}
                    style={styles.searchIcon}
                />
                <TextInput
                    style={[styles.searchInput, dynamicStyles.searchInput]}
                    placeholder="Search abilities..."
                    placeholderTextColor={theme.textMuted}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    clearButtonMode="while-editing"
                />
            </View>

            {error ? (
                <View style={styles.errorContainer}>
                    <Icon
                        name="warning"
                        size={50}
                        color={theme.error}
                    />
                    <Text style={[styles.errorText, dynamicStyles.errorText]}>{error}</Text>
                    <TouchableOpacity
                        style={[styles.retryButton, { backgroundColor: theme.primary }]}
                        onPress={() => dispatch(showMoreAbilitiesRequest(INITIAL_URL))}
                    >
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={isSearching ? filteredAbilities : abilities}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => `${item.name}-${index}`}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListFooterComponent={renderFooter}
                    ListEmptyComponent={
                        isSearching ? (
                            <View style={styles.emptySearchContainer}>
                                <Icon
                                    name="search-off"
                                    size={50}
                                    color={theme.textMuted}
                                />
                                <Text style={[styles.emptySearchText, dynamicStyles.emptySearchText]}>
                                    No abilities found matching "{searchQuery}"
                                </Text>
                            </View>
                        ) : null
                    }
                />
            )}

            <View style={[styles.buttonContainer, {
                backgroundColor: theme.card,
                borderTopColor: theme.border
            }]}>
                <TouchableOpacity
                    style={[
                        styles.button,
                        dynamicStyles.button,
                        ((abilities.length <= 10 || loading || isSearching) && dynamicStyles.disabledButton)
                    ]}
                    onPress={handleShowLess}
                    disabled={abilities.length <= 10 || loading || isSearching}
                    activeOpacity={0.7}
                >
                    <Text style={styles.buttonText}>Show Less</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.button,
                        dynamicStyles.button,
                        ((!next || loading || isSearching) && dynamicStyles.disabledButton)
                    ]}
                    onPress={handleShowMore}
                    disabled={!next || loading || isSearching}
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
    },
    header: {
        paddingVertical: 20,
        paddingHorizontal: 16,
        alignItems: "center",
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
        letterSpacing: 0.5,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        paddingHorizontal: 15,
        marginHorizontal: 16,
        marginVertical: 10,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        height: 50,
        fontSize: 16,
    },
    emptySearchContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    emptySearchText: {
        marginTop: 15,
        fontSize: 16,
        textAlign: 'center',
    },
    listContent: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 80,
    },
    abilityItem: {
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
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderTopWidth: 1,
    },
    button: {
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 10,
        alignItems: "center",
        flex: 0.48,
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
        fontSize: 16,
        textAlign: "center",
        marginVertical: 16,
    },
    retryButton: {
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