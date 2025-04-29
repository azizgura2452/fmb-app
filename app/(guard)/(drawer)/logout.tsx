import { logout, setAuth } from '@/store/slices/authSlice';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Surface, Text, IconButton } from 'react-native-paper';
import { useDispatch } from 'react-redux';

const Logout = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        signout();
    }, []);

    const signout = () => {
        dispatch(logout());
        router.push('/(auth)/login');
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Surface style={styles.surface}>
                <IconButton
                    icon="account-off" // Icon indicating logout
                    size={60}
                    style={styles.icon}
                />
                <Text variant="displayMedium" style={styles.title}>
                    You have been logged out
                </Text>
                <Text style={styles.subtitle}>
                    Thank you for using our app. See you next time!
                </Text>
            </Surface>
        </ScrollView>
    );
};

// Styles for the Logout screen
const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        height: '100%',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5', // Light background color for contrast
    },
    surface: {
        alignItems: 'center',
        height: 300,
        justifyContent: 'center',
        borderRadius: 15,
        elevation: 4, // Slight elevation for depth
        padding: 20,
        backgroundColor: '#ffffff', // Surface background color
    },
    icon: {
        marginBottom: 20, // Space below the icon
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333', // Dark color for title
    },
    subtitle: {
        fontSize: 16,
        color: '#777', // Lighter color for subtitle
        textAlign: 'center',
        paddingHorizontal: 20, // Padding for better readability
    },
});

export default Logout;
