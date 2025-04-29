import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, Divider, List, ActivityIndicator, useTheme, DataTable } from 'react-native-paper';
import { formatDate, isToday } from '@/lib/utils';
import { getPausedThaali, getWeeklyThaaliStatus } from '@/services/thaali.api';
import WithBg from './WithBg';

const InactiveThalisToday = () => {
    const [loading, setLoading] = useState(true);
    const [weeklyData, setWeeklyData] = useState([]);

    useEffect(() => {
        fetchDailyPausedStatus();
    }, []);

    // useEffect(() => {
    //     if (weeklyData) {
    //         const todayDate = Object.keys(weeklyData).find((date) => isToday(date));
    //         // if (todayDate) {
    //         //     setExpandedAccordion(todayDate); // Set today's date as the expanded accordion
    //         // }
    //     }
    // }, [weeklyData]);

    // const fetchWeeklyStatus = async () => {
    //     try {
    //         const response = await getWeeklyThaaliStatus();
    //         setWeeklyData(response.data.data);
    //         console.log(response.data.data);
    //     } catch (error) {
    //         console.error("Error fetching Thaali status:", error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const fetchDailyPausedStatus = async () => {
        try {
            const response = await getPausedThaali();
            console.log("Daily Paused API Response:", response.data); // Debugging log
            setWeeklyData(response.data.data); // Corrected: Extract `data` from response
        } catch (error) {
            console.error("Error fetching Thaali status:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <ActivityIndicator animating size="large" style={styles.loader} />;
    }

    return (
        <>
            <Text
                variant="headlineSmall"
                style={[styles.marginLeft, { fontWeight: 'bold', color: '#4b3621', marginTop: 10 }]}
            >
                Inactive Thalis Today ({weeklyData?.length || 0})
            </Text>
            <View style={styles.tableContainer}>
                {weeklyData?.length > 0 ? (<DataTable style={styles.table}>
                    <DataTable.Header style={styles.header}>
                        <DataTable.Title textStyle={styles.headerText}>Date</DataTable.Title>
                        <DataTable.Title textStyle={styles.headerText}>Thali No</DataTable.Title>
                        <DataTable.Title textStyle={styles.headerText}>Status</DataTable.Title>
                    </DataTable.Header>

                    {/* Render Rows using map to avoid FlatList inside FlatList */}
                    {weeklyData.map((item, index) => (
                        <DataTable.Row
                            key={item.id.toString()}
                            style={[
                                styles.row,
                                index % 2 === 0 ? styles.evenRow : styles.oddRow
                            ]}
                        >
                            <DataTable.Cell textStyle={styles.cell}>{formatDate(item.date)}</DataTable.Cell>
                            <DataTable.Cell textStyle={styles.cell}>{item.thaali_no}</DataTable.Cell>
                            <DataTable.Cell
                                textStyle={[
                                    styles.cell,
                                    item.status === 'PAUSED' ? styles.pausedStatus : styles.activeStatus
                                ]}
                            >
                                {item.status}
                            </DataTable.Cell>
                        </DataTable.Row>
                    ))}
                </DataTable>)
                    : <Text
                        variant="bodyMedium"
                        style={[styles.marginLeft, { fontWeight: 'bold', color: '#4b3621', paddingVertical: 10 }]}
                    >
                        No records found
                    </Text>
                }
            </View>
        </>
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

export default WithBg(InactiveThalisToday);