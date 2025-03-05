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
import { getPokemonListRequest } from "../redux/abilityDetail/action";
import Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


function AbilityDetail() {
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

    const renderEmptyList = () => (
        <View style={styles.emptyContainer}>
            <Icon name="ghost" size={60} color="#bdc3c7" style={styles.emptyIcon} />
            <Text style={styles.emptyText}>No Pokémon found with this ability</Text>
        </View>
    );

    const renderPokemonItem = ({ item: pokemon }) => (
        <View
            style={styles.pokemonCard}
        >
            <TouchableOpacity
                style={styles.pokemonCardInner}
                activeOpacity={0.3}
                onPress={() => navigation.navigate("POKEMON_DETAILS", { pokemonName: pokemon.name, pokemonSprite: pokemon.sprite })}
            >
                {pokemon.sprite ? (
                    <Image source={{ uri: pokemon.sprite }} style={styles.pokemonSprite} />
                ) : (
                    <View style={styles.noImage}>
                        <MaterialIcons name="image-not-supported" size={40} color="#bdc3c7" />
                    </View>
                )}

                <View style={styles.pokemonInfo}>
                    <Text style={styles.pokemonName}>
                        {pokemon.name
                            .split('-')
                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(' ')}
                    </Text>

                    <View style={styles.abilitiesContainer}>
                        <Text style={styles.primaryAbility}>
                            <Text style={styles.abilityLabel}>Primary: </Text>
                            {formatAbilityName(abilityName)}
                        </Text>

                        {pokemon.abilities && pokemon.abilities.length > 1 && (
                            <Text style={styles.otherAbilities}>
                                <Text style={styles.abilityLabel}>Others: </Text>
                                {pokemon.abilities
                                    .filter(ability => ability.name !== abilityName)
                                    .map(ability => formatAbilityName(ability.name))
                                    .join(", ")}
                            </Text>
                        )}
                    </View>
                </View>

                <View style={styles.arrowContainer}>
                    <MaterialIcons name="arrow-forward-ios" size={20} color="#95a5a6" />
                </View>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>

            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <Text style={styles.abilityName}>
                        {formatAbilityName(abilityName)}
                    </Text>

                    <View style={styles.navigationContainer}>
                        <TouchableOpacity
                            style={[styles.navButton, isPrevDisabled && styles.disabledButton]}
                            onPress={handlePrev}
                            disabled={isPrevDisabled}
                        >
                            <MaterialIcons name="arrow-back-ios" size={18} color={isPrevDisabled ? "#95a5a6" : "#fff"} />
                            <Text style={[styles.navText, isPrevDisabled && styles.disabledText]}>Prev</Text>
                        </TouchableOpacity>

                        <View style={styles.indexIndicator}>
                            <Text style={styles.indexText}>
                                {currentIndex + 1}/{abilities?.length || 0}
                            </Text>
                        </View>

                        <TouchableOpacity
                            style={[styles.navButton, isNextDisabled && styles.disabledButton]}
                            onPress={handleNext}
                            disabled={isNextDisabled}
                        >
                            <Text style={[styles.navText, isNextDisabled && styles.disabledText]}>Next</Text>
                            <MaterialIcons name="arrow-forward-ios" size={18} color={isNextDisabled ? "#95a5a6" : "#fff"} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Main Content */}
            {loading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#3498db" />
                    <Text style={styles.loadingText}>Loading Pokémon data...</Text>
                </View>
            ) : error ? (
                <View style={styles.errorContainer}>
                    <Icon name="exclamation-circle" size={60} color="#e74c3c" style={styles.errorIcon} />
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity
                        style={styles.retryButton}
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
                            <View style={styles.infoCard}>
                                <Icon name="info-circle" size={20} color="#3498db" style={styles.infoIcon} />
                                <Text style={styles.infoText}>
                                    Pokémon with the <Text style={styles.highlightText}>{formatAbilityName(abilityName)}</Text> ability
                                </Text>
                            </View>
                            <Text style={styles.pokemonCount}>
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
        backgroundColor: "#ebeaea",
    },
    header: {
        backgroundColor: "#2980b9",
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
        color: "#fff",
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
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 20,
    },
    navText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    disabledButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    disabledText: {
        color: '#95a5a6',
    },
    indexIndicator: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        paddingVertical: 5,
        paddingHorizontal: 11,
        borderRadius: 12,
    },
    indexText: {
        color: '#fff',
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
        backgroundColor: '#ebf7fd',
        padding: 12,
        marginBottom: 8,
        borderRadius: 10,
        borderLeftWidth: 4,
        borderLeftColor: '#3498db',
    },
    infoIcon: {
        marginRight: 10,
    },
    infoText: {
        fontSize: 14,
        color: '#2c3e50',
        flex: 1,
    },
    highlightText: {
        fontWeight: 'bold',
        color: '#3498db',
    },
    pokemonCount: {
        fontSize: 14,
        color: '#7f8c8d',
        marginBottom: 8,
    },
    pokemonCard: {
        marginBottom: 16,
        borderRadius: 12,
        backgroundColor: '#ffffff',
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
        backgroundColor: '#f4f4f4',
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
        color: '#2c3e50',
        marginBottom: 4,
    },
    abilitiesContainer: {
        marginTop: 4,
    },
    primaryAbility: {
        fontSize: 14,
        color: '#2c3e50',
        marginBottom: 2,
    },
    abilityLabel: {
        color: '#7f8c8d',
        fontWeight: '600',
    },
    otherAbilities: {
        fontSize: 14,
        color: '#2c3e50',
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
        color: '#7f8c8d',
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
        color: '#7f8c8d',
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
        color: '#e74c3c',
        textAlign: 'center',
        marginBottom: 16,
    },
    retryButton: {
        backgroundColor: '#e74c3c',
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