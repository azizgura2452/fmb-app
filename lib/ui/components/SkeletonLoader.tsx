import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { Card } from 'react-native-paper';

const SkeletonLoader = () => {
    const fadeAnim = useRef(new Animated.Value(1)).current; // Initial value for opacity

    // Function to start the fade animation
    const startFadeAnimation = () => {
        fadeAnim.setValue(1); // Reset animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 3000,
                    useNativeDriver: false,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0.5,
                    duration: 3000,
                    useNativeDriver: false,
                }),
            ])
        ).start();
    };

    useEffect(() => {
        startFadeAnimation();
    }, []);

    return (
        <Card style={styles.card}>
            <View style={styles.headerContainer}>
                <Animated.View style={[styles.skeletonHeader, { opacity: fadeAnim }]} />
                <Animated.View style={[styles.skeletonCaption, { opacity: fadeAnim }]} />
            </View>

            <Animated.View style={[styles.skeletonMenuItem, { opacity: fadeAnim }]} />
            <Animated.View style={[styles.skeletonMenuItem, { opacity: fadeAnim }]} />
            <Animated.View style={[styles.skeletonMenuItem, { opacity: fadeAnim }]} />
            <Animated.View style={[styles.skeletonMenuItem, { opacity: fadeAnim }]} />
        </Card>
    );
};
const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    card: {
        margin: 12,
        borderRadius: 20,
        padding: 16,
        backgroundColor: '#f0f0f0',
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        borderTopWidth: 6,
        borderTopColor: '#b98027', // Mimic the top border color from MenuCard
        maxWidth: '100%',
        justifyContent: 'space-evenly',
        width: screenWidth * 0.87,
    },
    headerContainer: {
        flexDirection: 'column', 
        alignItems: 'flex-start', 
        marginBottom: 30,
    },
    skeletonHeader: {
        width: '60%', 
        height: 35,
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
    },
    skeletonCaption: {
        width: '30%', 
        height: 25,
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
        marginTop: 8, 
    },
    skeletonMenuItem: {
        height: 30,
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
        marginBottom: 30, 
    },
});

export default SkeletonLoader;
