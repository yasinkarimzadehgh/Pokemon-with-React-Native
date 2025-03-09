import React, { useEffect } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
    TouchableOpacity,
    StatusBar
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getPokemonDetailRequest } from '../redux/pokemonDetail/pokemonDetailAction';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


function PokemonDetail() {
    const route = useRoute();
    const { pokemonName } = route.params;

    const dispatch = useDispatch();
    const { pokemonDetail, loading, error } = useSelector(state => state.pokemonDetail);
    const { pokemonList } = useSelector(state => state.abilityDetail);

    const navigation = useNavigation();

    useEffect(() => {
        if (pokemonName) {
            dispatch(getPokemonDetailRequest(pokemonName));
        }
    }, [dispatch, pokemonName]);

    let currentIndex = -1;

    for (let i = 0; i < pokemonList.length; i++) {
        if (pokemonList[i]["name"] === pokemonName) {
            currentIndex = i;
            break;
        }
    }

    const handleBack = () => {
        if (currentIndex > 0) {
            const previousPokemonName = pokemonList[currentIndex - 1].name;
            navigation.navigate("POKEMON_DETAILS", { pokemonName: previousPokemonName });
        } else {
            navigation.goBack();
        }
    }

    const handleNext = () => {
        if (currentIndex < pokemonList.length - 1) {
            const nextPokemonName = pokemonList[currentIndex + 1].name;
            navigation.navigate("POKEMON_DETAILS", { pokemonName: nextPokemonName });
        }
    }

    const isPrevDisabled = currentIndex <= 0;
    const isNextDisabled = currentIndex >= pokemonList?.length - 1;


    const formatAbilityName = (name) => {
        return name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    if (loading)
        return (
            <View style={styles.centerContainer}>
                <StatusBar barStyle="light-content" backgroundColor="#4A90E2" />
                <ActivityIndicator size="large" color="#4A90E2" />
                <Text style={styles.loadingText}>Loading Pokémon details...</Text>
            </View>
        );

    if (error)
        return (
            <View style={styles.centerContainer}>
                <StatusBar barStyle="light-content" backgroundColor="#D32F2F" />
                <Text style={styles.errorText}>Oops! Something went wrong.</Text>
                <Text style={styles.errorDetail}>{error.message}</Text>
                <TouchableOpacity
                    style={styles.retryButton}
                    onPress={() => dispatch(getPokemonDetailRequest(pokemonName))}
                >
                    <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );

    if (!pokemonDetail)
        return (
            <View style={styles.centerContainer}>
                <StatusBar barStyle="light-content" backgroundColor="#757575" />
                <Text style={styles.noDataText}>Pokémon not found.</Text>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );


    return (
        <View style={styles.mainContainer}>
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <Text style={styles.pokemonName}>
                        {formatAbilityName(pokemonDetail.name)}
                    </Text>

                    <View style={styles.navigationContainer}>
                        <TouchableOpacity
                            style={[styles.navButton, isPrevDisabled && styles.disabledButton]}
                            onPress={handleBack}
                            disabled={isPrevDisabled}
                        >
                            <MaterialIcons name="arrow-back-ios" size={18} color={isPrevDisabled ? "#95a5a6" : "#fff"} />
                            <Text style={[styles.navText, isPrevDisabled && styles.disabledText]}>Prev</Text>
                        </TouchableOpacity>

                        <View style={styles.indexIndicator}>
                            <Text style={styles.indexText}>
                                {currentIndex + 1}/{pokemonList?.length || 0}
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

            <ScrollView
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.imageContainer}>
                    {pokemonDetail.sprites && (
                        <Image
                            source={{ uri: pokemonDetail.sprites.other['official-artwork'].front_default || pokemonDetail.sprites.front_default }}
                            style={styles.image}
                            resizeMode="contain"
                        />
                    )}
                </View>

                {/* Physical attributes */}
                <View style={styles.attributesContainer}>
                    <View style={styles.attributeItem}>
                        <Text style={styles.attributeValue}>{pokemonDetail.weight / 10} kg</Text>
                        <Text style={styles.attributeLabel}>Weight</Text>
                    </View>
                    <View style={styles.attributeDivider} />
                    <View style={styles.attributeItem}>
                        <Text style={styles.attributeValue}>{pokemonDetail.height / 10} m</Text>
                        <Text style={styles.attributeLabel}>Height</Text>
                    </View>
                </View>

                {/* Stats */}
                <View style={styles.card}>
                    <Text style={styles.subtitle}>Base Stats</Text>
                    {pokemonDetail.stats.map((stat, index) => (
                        <View key={index} style={styles.statRow}>
                            <Text style={styles.statName}>{stat.stat.name.replace(/-/g, ' ')}</Text>
                            <Text style={styles.statValue}>{stat.base_stat}</Text>
                        </View>
                    ))}
                </View>

                {/* Abilities */}
                <View style={styles.card}>
                    <Text style={styles.subtitle}>Abilities</Text>
                    {pokemonDetail.abilities && pokemonDetail.abilities.map((ability, index) => (
                        <View key={index} style={styles.abilityItem}>
                            <Text style={styles.abilityName}>
                                {ability.ability.name.replace(/-/g, ' ')}
                                {ability.is_hidden && <Text style={styles.hiddenAbility}> (Hidden)</Text>}
                            </Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    container: {
        flexGrow: 1,
        paddingBottom: 30,
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
    pokemonName: {
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
    imageContainer: {
        alignItems: 'center',
        marginTop: -60,
        marginBottom: 10,
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderWidth: 5,
        borderColor: '#FFFFFF',
        marginTop: 100
    },
    attributesContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 15,
        paddingHorizontal: 20,
    },
    attributeItem: {
        alignItems: 'center',
        flex: 1,
    },
    attributeValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
    },
    attributeLabel: {
        fontSize: 14,
        color: '#777777',
        marginTop: 4,
    },
    attributeDivider: {
        height: 40,
        width: 1,
        backgroundColor: '#E0E0E0',
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        marginHorizontal: 20,
        marginTop: 15,
        padding: 20,
    },
    subtitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 15,
        color: '#333333',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        paddingBottom: 8,
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    statName: {
        width: '85%',
        fontSize: 16,
        color: '#555555',
        textTransform: 'capitalize',
    },
    statValue: {
        width: '15%',
        fontSize: 16,
        fontWeight: 'bold',
        color: '#222222',
        textAlign: 'center',
    },
    abilityItem: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    abilityName: {
        fontSize: 16,
        color: '#333333',
        textTransform: 'capitalize',
    },
    hiddenAbility: {
        fontStyle: 'italic',
        color: '#777777',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#f5f5f5",
    },
    errorText: {
        color: '#D32F2F',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    errorDetail: {
        color: '#777',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 18,
        color: '#777',
    },
    noDataText: {
        fontSize: 20,
        color: '#777',
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: '#4A90E2',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        marginTop: 10,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    backButton: {
        backgroundColor: '#757575',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        marginTop: 10,
    },
    backButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
});

export default PokemonDetail;