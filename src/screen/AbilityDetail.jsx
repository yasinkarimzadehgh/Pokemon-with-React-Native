import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Image,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { getPokemonListRequest } from "../redux/abilityDetail/abilityDetailAction";
import Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from "../theme/ThemeContext";

function AbilityDetail() {
    const { theme } = useTheme();
    const route = useRoute();
    const { abilityName } = route.params || { abilityName: "stench" };

    const dispatch = useDispatch();
    const { abilities } = useSelector(state => state.abilityList);
    const { pokemonList, loading, error } = useSelector(state => state.abilityDetail);

    const navigation = useNavigation();

    useEffect(() => {
        dispatch(getPokemonListRequest(`https://pokeapi.co/api/v2/ability/${abilityName}`));
    }, [abilityName, dispatch]);

    const currentIndex = abilities ? abilities.findIndex(ability => ability.name === abilityName) : -1;

    const handlePrev = () => {
        if (currentIndex > 0) {
            const prevAbilityName = abilities[currentIndex - 1].name;
            navigation.navigate("ABILITY_DETAIL", { abilityName: prevAbilityName });
        }
    };

    const handleNext = () => {
        if (currentIndex < abilities.length - 1) {
            const nextAbilityName = abilities[currentIndex + 1].name;
            navigation.navigate("ABILITY_DETAIL", { abilityName: nextAbilityName });
        }
    };

    const isPrevDisabled = currentIndex <= 0;
    const isNextDisabled = currentIndex >= abilities?.length - 1;

    const formatAbilityName = (name) => {
        return name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    // Create dynamic styles based on theme
    const dynamicStyles = {
        container: {
            backgroundColor: theme.background,
        },
        header: {
            backgroundColor: theme.headerBackground,
        },
        abilityName: {
            color: theme.headerText,
        },
        navButton: {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
        },
        navText: {
            color: theme.headerText,
        },
        disabledButton: {
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
        },
        disabledText: {
            color: theme.textMuted,
        },
        indexIndicator: {
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
        },
        indexText: {
            color: theme.headerText,
        },
        infoCard: {
            backgroundColor: theme.infoCard,
            borderLeftColor: theme.primary,
        },
        infoText: {
            color: theme.text,
        },
        highlightText: {
            color: theme.primary,
        },
        pokemonCount: {
            color: theme.textMuted,
        },
        pokemonCard: {
            backgroundColor: theme.card,
        },
        pokemonName: {
            color: theme.text,
        },
        primaryAbility: {
            color: theme.text,
        },
        abilityLabel: {
            color: theme.textMuted,
        },
        otherAbilities: {
            color: theme.text,
        },
        emptyText: {
            color: theme.textMuted,
        },
        loadingText: {
            color: theme.textMuted,
        },
        errorText: {
            color: theme.error,
        },
        retryButton: {
            backgroundColor: theme.error,
        },
    };

    const renderEmptyList = () => (
        <View style={styles.emptyContainer}>
            <Icon name="ghost" size={60} color={theme.textMuted} style={styles.emptyIcon} />
            <Text style={[styles.emptyText, dynamicStyles.emptyText]}>No Pokémon found with this ability</Text>
        </View>
    );

    const renderPokemonItem = ({ item: pokemon }) => (
        <View
            style={[styles.pokemonCard, dynamicStyles.pokemonCard]}
        >
            <TouchableOpacity
                style={styles.pokemonCardInner}
                activeOpacity={0.3}
                onPress={() => navigation.navigate("POKEMON_DETAILS", { pokemonName: pokemon.name })}
            >
                {pokemon.sprite ? (
                    <Image source={{ uri: pokemon.sprite }} style={styles.pokemonSprite} />
                ) : (
                    <View style={[styles.noImage, { backgroundColor: theme.isDark ? '#2A2A2A' : '#f4f4f4' }]}>
                        <MaterialIcons name="image-not-supported" size={40} color={theme.textMuted} />
                    </View>
                )}

                <View style={styles.pokemonInfo}>
                    <Text style={[styles.pokemonName, dynamicStyles.pokemonName]}>
                        {pokemon.name
                            .split('-')
                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(' ')}
                    </Text>

                    <View style={styles.abilitiesContainer}>
                        <Text style={[styles.primaryAbility, dynamicStyles.primaryAbility]}>
                            <Text style={[styles.abilityLabel, dynamicStyles.abilityLabel]}>Primary: </Text>
                            {formatAbilityName(abilityName)}
                        </Text>

                        {pokemon.abilities && pokemon.abilities.length > 1 && (
                            <Text style={[styles.otherAbilities, dynamicStyles.otherAbilities]}>
                                <Text style={[styles.abilityLabel, dynamicStyles.abilityLabel]}>Others: </Text>
                                {pokemon.abilities
                                    .filter(ability => ability.name !== abilityName)
                                    .map(ability => formatAbilityName(ability.name))
                                    .join(", ")}
                            </Text>
                        )}
                    </View>
                </View>

                <View style={styles.arrowContainer}>
                    <MaterialIcons name="arrow-forward-ios" size={20} color={theme.textMuted} />
                </View>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={[styles.container, dynamicStyles.container]}>
            <View style={[styles.header, dynamicStyles.header]}>
                <View style={styles.headerContent}>
                    <Text style={[styles.abilityName, dynamicStyles.abilityName]}>
                        {formatAbilityName(abilityName)}
                    </Text>

                    <View style={styles.navigationContainer}>
                        <TouchableOpacity
                            style={[styles.navButton, dynamicStyles.navButton, isPrevDisabled && dynamicStyles.disabledButton]}
                            onPress={handlePrev}
                            disabled={isPrevDisabled}
                        >
                            <MaterialIcons name="arrow-back-ios" size={18} color={isPrevDisabled ? theme.textMuted : theme.headerText} />
                            <Text style={[styles.navText, dynamicStyles.navText, isPrevDisabled && dynamicStyles.disabledText]}>Prev</Text>
                        </TouchableOpacity>

                        <View style={[styles.indexIndicator, dynamicStyles.indexIndicator]}>
                            <Text style={[styles.indexText, dynamicStyles.indexText]}>
                                {currentIndex + 1}/{abilities?.length || 0}
                            </Text>
                        </View>

                        <TouchableOpacity
                            style={[styles.navButton, dynamicStyles.navButton, isNextDisabled && dynamicStyles.disabledButton]}
                            onPress={handleNext}
                            disabled={isNextDisabled}
                        >
                            <Text style={[styles.navText, dynamicStyles.navText, isNextDisabled && dynamicStyles.disabledText]}>Next</Text>
                            <MaterialIcons name="arrow-forward-ios" size={18} color={isNextDisabled ? theme.textMuted : theme.headerText} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Main Content */}
            {loading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color={theme.primary} />
                    <Text style={[styles.loadingText, dynamicStyles.loadingText]}>Loading Pokémon data...</Text>
                </View>
            ) : error ? (
                <View style={styles.errorContainer}>
                    <Icon name="exclamation-circle" size={60} color={theme.error} style={styles.errorIcon} />
                    <Text style={[styles.errorText, dynamicStyles.errorText]}>{error}</Text>
                    <TouchableOpacity
                        style={[styles.retryButton, dynamicStyles.retryButton]}
                        onPress={() => dispatch(getPokemonListRequest(`https://pokeapi.co/api/v2/ability/${abilityName}`))}
                    >
                        <Text style={styles.retryText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    contentContainerStyle={styles.listContainer}
                    data={pokemonList}
                    keyExtractor={(item, index) => `pokemon-${index}-${item.name}`}
                    renderItem={renderPokemonItem}
                    ListEmptyComponent={renderEmptyList}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={
                        <View style={styles.listHeader}>
                            <View style={[styles.infoCard, dynamicStyles.infoCard]}>
                                <Icon name="info-circle" size={20} color={theme.primary} style={styles.infoIcon} />
                                <Text style={[styles.infoText, dynamicStyles.infoText]}>
                                    Pokémon with the <Text style={[styles.highlightText, dynamicStyles.highlightText]}>{formatAbilityName(abilityName)}</Text> ability
                                </Text>
                            </View>
                            <Text style={[styles.pokemonCount, dynamicStyles.pokemonCount]}>
                                {pokemonList?.length || 0} Pokémon found
                            </Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingTop: 20,
        paddingHorizontal: 16,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        height: 100,
    },
    headerContent: {
        flex: 1,
        justifyContent: 'space-between',
    },
    abilityName: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: 'center'
    },
    navigationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    navButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    navText: {
        fontSize: 14,
        fontWeight: '600',
    },
    indexIndicator: {
        paddingVertical: 5,
        paddingHorizontal: 11,
        borderRadius: 12,
    },
    indexText: {
        fontSize: 12,
        fontWeight: '600',
    },
    listContainer: {
        padding: 16,
    },
    listHeader: {
        marginBottom: 16,
    },
    infoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        marginBottom: 8,
        borderRadius: 10,
        borderLeftWidth: 4,
    },
    infoIcon: {
        marginRight: 10,
    },
    infoText: {
        fontSize: 14,
        flex: 1,
    },
    highlightText: {
        fontWeight: 'bold',
    },
    pokemonCount: {
        fontSize: 14,
        marginBottom: 8,
    },
    pokemonCard: {
        marginBottom: 16,
        borderRadius: 12,
    },
    pokemonCardInner: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
    },
    pokemonSprite: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#f4f4f4',
    },
    noImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pokemonInfo: {
        flex: 1,
        marginLeft: 16,
    },
    pokemonName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    abilitiesContainer: {
        marginTop: 4,
    },
    primaryAbility: {
        fontSize: 14,
        marginBottom: 2,
    },
    abilityLabel: {
        fontWeight: '600',
    },
    otherAbilities: {
        fontSize: 14,
    },
    arrowContainer: {
        padding: 8,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    emptyIcon: {
        marginBottom: 16,
    },
    emptyText: {
        fontSize: 16,
        textAlign: 'center',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorIcon: {
        marginBottom: 16,
    },
    errorText: {
        fontSize: 16,
        fontWeight: 700,
        textAlign: 'center',
        marginBottom: 16,
    },
    retryButton: {
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 24,
    },
    retryText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    }
});

export default AbilityDetail;