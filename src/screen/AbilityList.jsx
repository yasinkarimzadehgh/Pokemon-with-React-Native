import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAbilitiesStored, showMoreAbilitiesRequest, showLessAbilitiesRequest, showMoreAbilitiesFailure } from "../redux/abilityList/action";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from "@react-navigation/native";

const STORAGE_KEY = "pokemonAbilitiesData";
const INITIAL_URL = "https://pokeapi.co/api/v2/ability/?offset=0&limit=10";

const AbilityList = () => {
    const navigation = useNavigation();
    const handleNavigateToAbilityDetail = (item) => {
        navigation.navigate('ABILITY_DETAIL_STACK', {
            screen: 'ABILITY_DETAIL',
            params: { abilityName: item.name },
        });
    };

    const dispatch = useDispatch();
    const { abilities, next, loading, error } = useSelector((state) => state.abilityList);
    const [refreshing, setRefreshing] = useState(false);

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

    const handleShowMore = () => {
        if (next) {
            dispatch(showMoreAbilitiesRequest(next));
        }
    };

    const handleShowLess = () => {
        dispatch(showLessAbilitiesRequest());
    };

    const handleError = (error, message) => {
        console.error(error);
        dispatch(showMoreAbilitiesFailure(message));
        Alert.alert("Error", message, [{ text: "Retry", onPress: () => dispatch(showMoreAbilitiesRequest(INITIAL_URL)) }]);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.abilityItem}
            onPress={() => handleNavigateToAbilityDetail(item)}
        >
            <Icon name="bolt" size={20} color="#3498db" style={styles.icon} />
            <Text style={styles.abilityName}>{item.name.replace(/-/g, " ")}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Pokemon Abilities</Text>
            </View>
            {error ? (
                <Text style={styles.errorText}>{error}</Text>
            ) : (
                <>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={abilities}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => `${item.name}-${index}`}
                        style={styles.list}
                    />
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, abilities.length <= 10 && styles.disabledButton]}
                            onPress={handleShowLess}
                            disabled={abilities.length <= 10}
                        >
                            <Text style={styles.buttonText}>Show Less</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, !next && styles.disabledButton]}
                            onPress={handleShowMore}
                            disabled={!next}
                        >
                            <Text style={styles.buttonText}>Show More</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </SafeAreaView>
    );
};

export default AbilityList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",

    },
    header: {
        backgroundColor: "#2980b9",
        paddingVertical: 20,
        alignItems: "center",
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    title: {
        fontSize: 30,
        fontWeight: "bold",
        color: "#fff",
        letterSpacing: 1.5,
    },
    list: {
        flex: 1,
        paddingHorizontal: 16,
        marginTop: 10,
    },
    abilityItem: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
        flexDirection: "row",
        alignItems: "center",
    },
    icon: {
        marginRight: 10,
    },
    abilityName: {
        fontSize: 18,
        textTransform: "capitalize",
        color: "#333",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginVertical: 20,
        paddingHorizontal: 16,
    },
    button: {
        backgroundColor: "#2980b9",
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: "center",
        flex: 1,
        marginHorizontal: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    disabledButton: {
        backgroundColor: "#bdc3c7",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    errorText: {
        color: "red",
        textAlign: "center",
        marginVertical: 10,
    },
});