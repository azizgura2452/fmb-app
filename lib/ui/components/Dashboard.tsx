import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Surface, Text } from 'react-native-paper';
import ProfileCard from './ProfileCard';
import { useSelector } from 'react-redux';
import { styles } from '../styles';
import WithBg from './WithBg';
import WeeklyMenuSlider from './WeeklyMenuSlider';

const Dashboard = () => {
    const { user } = useSelector((state) => state?.auth);

    return (
        <ScrollView contentContainerStyle={styles2.outer}>
            <Surface style={styles.screen}>
                {user && <ProfileCard data={user} />}
                <Text variant="headlineSmall" style={[styles.marginLeft, { fontWeight: 'bold', color: '#4b3621' }]}>Weekly Menu</Text>
                <Text variant="bodyMedium" style={[styles.marginLeft, {fontStyle: 'italic', marginVertical: -12}]}>Say no to israf, choose wisely</Text>
                <WeeklyMenuSlider />
            </Surface>
        </ScrollView>
    );
};

const styles2 = StyleSheet.create({
    outer: {
        flexGrow: 1,
    },
});

export default WithBg(Dashboard);
