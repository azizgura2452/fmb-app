import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, Divider, List, ActivityIndicator, useTheme, DataTable } from 'react-native-paper';
import { formatDate, isToday } from '@/lib/utils';
import { getPausedThaali, getWeeklyThaaliStatus } from '@/services/thaali.api';
import WithBg from './WithBg';
import InactiveThalisToday from './InactiveThalisToday';
import PausedThalis from './PausedThalis';

const KitchenDashboard = () => {
    return (
        <FlatList
            style={styles.container}
            contentContainerStyle={styles.scrollContent}
            data={[]} // Keep it empty as we're just using it for layout
            renderItem={null} // No list items needed
            ListHeaderComponent={
                <>
                    <Text variant="headlineSmall" style={[styles.marginLeft, { fontWeight: 'bold', color: '#4b3621', marginTop: 10 }]}>
                        Menu - Filling
                    </Text>
                    <Text variant="bodyMedium" style={[styles.marginLeft, { fontStyle: 'italic', marginBottom: 20 }]}>
                        Say no to israf, fill wisely
                    </Text>
                </>
            }
            ListFooterComponent={
                <>
                    <InactiveThalisToday />
                    <PausedThalis />
                </>
            }
        />
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1, // Ensure ScrollView takes full height
        padding: 10,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        marginBottom: 10,
    },
    todayHighlight: {
        borderWidth: 2,
        borderColor: 'green',
    },
    accordionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4b3621',
        paddingVertical: 12
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f0f0f0',
        padding: 10,
    },
    // headerText: {
    //     flex: 1,
    //     fontWeight: 'bold',
    //     textAlign: 'center',
    //     alignContent: 'center',
    // },
    // row: {
    //     flexDirection: 'row',
    //     padding: 10,
    //     borderBottomWidth: 1,
    //     borderBottomColor: '#ddd',
    // },
    // cell: {
    //     flex: 1,
    //     textAlign: 'center',
    // },
    lessQty: {
        color: 'red',
        fontWeight: 'bold',
    },
    fullQty: {
        color: 'green',
        fontWeight: 'bold',
    },
    marginLeft: {
        marginLeft: 12,
    },
    tableContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3, // For Android shadow
        marginHorizontal: 10,
        marginVertical: 15,
    },
    table: {
        borderRadius: 10,
        overflow: 'hidden',
    },
    header: {
        backgroundColor: '#4b3621',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    headerText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#fff',
    },
    row: {
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingVertical: 8,
    },
    evenRow: {
        backgroundColor: '#f9f9f9',
    },
    oddRow: {
        backgroundColor: '#fff',
    },
    cell: {
        fontSize: 14,
        paddingVertical: 8,
    },
    pausedStatus: {
        color: 'red',
        fontWeight: 'bold',
    },
    activeStatus: {
        color: 'green',
        fontWeight: 'bold',
    },
});

export default WithBg(KitchenDashboard);