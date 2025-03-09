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
import { useTheme } from '../theme/ThemeContext';

function PokemonDetail() {
    const { theme } = useTheme();
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

    // Create dynamic styles based on theme
    const dynamicStyles = {
        mainContainer: {
            backgroundColor: theme.background,
        },
        header: {
            backgroundColor: theme.headerBackground,
        },
        pokemonName: {
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
        image: {
            backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.8)',
            borderColor: theme.card,
        },
        attributeValue: {
            color: theme.text,
        },
        attributeLabel: {
            color: theme.textMuted,
        },
        attributeDivider: {
            backgroundColor: theme.border,
        },
        card: {
            backgroundColor: theme.card,
        },
        subtitle: {
            color: theme.text,
            borderBottomColor: theme.border,
        },
        statName: {
            color: theme.textSecondary,
        },
        statValue: {
            color: theme.text,
        },
        statRow: {
            borderBottomColor: theme.border,
        },
        abilityItem: {
            borderBottomColor: theme.border,
        },
        abilityName: {
            color: theme.text,
        },
        hiddenAbility: {
            color: theme.textMuted,
        },
        centerContainer: {
            backgroundColor: theme.background,
        },
        errorText: {
            color: theme.error,
        },
        errorDetail: {
            color: theme.textMuted,
        },
        loadingText: {
            color: theme.textMuted,
        },
        noDataText: {
            color: theme.textMuted,
        },
        retryButton: {
            backgroundColor: theme.primary,
        },
        backButton: {
            backgroundColor: theme.textMuted,
        },
    };

    if (loading)
        return (
            <View style={[styles.centerContainer, dynamicStyles.centerContainer]}>
                <StatusBar barStyle={theme.isDark ? "light-content" : "dark-content"} backgroundColor={theme.headerBackground} />
                <ActivityIndicator size="large" color={theme.primary} />
                <Text style={[styles.loadingText, dynamicStyles.loadingText]}>Loading Pokémon details...</Text>
            </View>
        );

    if (error)
        return (
            <View style={[styles.centerContainer, dynamicStyles.centerContainer]}>
                <StatusBar barStyle="light-content" backgroundColor={theme.error} />
                <Text style={[styles.errorText, dynamicStyles.errorText]}>Oops! Something went wrong.</Text>
                <Text style={[styles.errorDetail, dynamicStyles.errorDetail]}>{error.message}</Text>
                <TouchableOpacity
                    style={[styles.retryButton, dynamicStyles.retryButton]}
                    onPress={() => dispatch(getPokemonDetailRequest(pokemonName))}
                >
                    <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );

    if (!pokemonDetail)
        return (
            <View style={[styles.centerContainer, dynamicStyles.centerContainer]}>
                <StatusBar barStyle="light-content" backgroundColor={theme.textMuted} />
                <Text style={[styles.noDataText, dynamicStyles.noDataText]}>Pokémon not found.</Text>
                <TouchableOpacity
                    style={[styles.backButton, dynamicStyles.backButton]}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );

    return (
        <View style={[styles.mainContainer, dynamicStyles.mainContainer]}>
            <View style={[styles.header, dynamicStyles.header]}>
                <View style={styles.headerContent}>
                    <Text style={[styles.pokemonName, dynamicStyles.pokemonName]}>
                        {formatAbilityName(pokemonDetail.name)}
                    </Text>

                    <View style={styles.navigationContainer}>
                        <TouchableOpacity
                            style={[styles.navButton, dynamicStyles.navButton, isPrevDisabled && dynamicStyles.disabledButton]}
                            onPress={handleBack}
                            disabled={isPrevDisabled}
                        >
                            <MaterialIcons name="arrow-back-ios" size={18} color={isPrevDisabled ? theme.textMuted : theme.headerText} />
                            <Text style={[styles.navText, dynamicStyles.navText, isPrevDisabled && dynamicStyles.disabledText]}>Prev</Text>
                        </TouchableOpacity>

                        <View style={[styles.indexIndicator, dynamicStyles.indexIndicator]}>
                            <Text style={[styles.indexText, dynamicStyles.indexText]}>
                                {currentIndex + 1}/{pokemonList?.length || 0}
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

            <ScrollView
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.imageContainer}>
                    {pokemonDetail.sprites && (
                        <Image
                            source={{ uri: pokemonDetail.sprites.other['official-artwork'].front_default || pokemonDetail.sprites.front_default }}
                            style={[styles.image, dynamicStyles.image]}
                            resizeMode="contain"
                        />
                    )}
                </View>

                {/* Physical attributes */}
                <View style={styles.attributesContainer}>
                    <View style={styles.attributeItem}>
                        <Text style={[styles.attributeValue, dynamicStyles.attributeValue]}>{pokemonDetail.weight / 10} kg</Text>
                        <Text style={[styles.attributeLabel, dynamicStyles.attributeLabel]}>Weight</Text>
                    </View>
                    <View style={[styles.attributeDivider, dynamicStyles.attributeDivider]} />
                    <View style={styles.attributeItem}>
                        <Text style={[styles.attributeValue, dynamicStyles.attributeValue]}>{pokemonDetail.height / 10} m</Text>
                        <Text style={[styles.attributeLabel, dynamicStyles.attributeLabel]}>Height</Text>
                    </View>
                </View>

                {/* Stats */}
                <View style={[styles.card, dynamicStyles.card]}>
                    <Text style={[styles.subtitle, dynamicStyles.subtitle]}>Base Stats</Text>
                    {pokemonDetail.stats.map((stat, index) => (
                        <View key={index} style={[styles.statRow, dynamicStyles.statRow]}>
                            <Text style={[styles.statName, dynamicStyles.statName]}>{stat.stat.name.replace(/-/g, ' ')}</Text>
                            <Text style={[styles.statValue, dynamicStyles.statValue]}>{stat.base_stat}</Text>
                        </View>
                    ))}
                </View>

                {/* Abilities */}
                <View style={[styles.card, dynamicStyles.card]}>
                    <Text style={[styles.subtitle, dynamicStyles.subtitle]}>Abilities</Text>
                    {pokemonDetail.abilities && pokemonDetail.abilities.map((ability, index) => (
                        <View key={index} style={[styles.abilityItem, dynamicStyles.abilityItem]}>
                            <Text style={[styles.abilityName, dynamicStyles.abilityName]}>
                                {ability.ability.name.replace(/-/g, ' ')}
                                {ability.is_hidden && <Text style={[styles.hiddenAbility, dynamicStyles.hiddenAbility]}> (Hidden)</Text>}
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
    },
    container: {
        flexGrow: 1,
        paddingBottom: 30,
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
    pokemonName: {
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
    imageContainer: {
        alignItems: 'center',
        marginTop: -60,
        marginBottom: 10,
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 100,
        borderWidth: 5,
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
    },
    attributeLabel: {
        fontSize: 14,
        marginTop: 4,
    },
    attributeDivider: {
        height: 40,
        width: 1,
    },
    card: {
        borderRadius: 20,
        marginHorizontal: 20,
        marginTop: 15,
        padding: 20,
    },
    subtitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 15,
        borderBottomWidth: 1,
        paddingBottom: 8,
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
    },
    statName: {
        width: '85%',
        fontSize: 16,
        textTransform: 'capitalize',
    },
    statValue: {
        width: '15%',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    abilityItem: {
        paddingVertical: 10,
        borderBottomWidth: 1,
    },
    abilityName: {
        fontSize: 16,
        textTransform: 'capitalize',
    },
    hiddenAbility: {
        fontStyle: 'italic',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    errorDetail: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 18,
    },
    noDataText: {
        fontSize: 20,
        marginBottom: 20,
    },
    retryButton: {
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