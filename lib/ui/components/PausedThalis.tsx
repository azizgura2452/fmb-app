import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { DataTable, ActivityIndicator, Text } from 'react-native-paper';
import { formatDate } from '@/lib/utils';
import { getPausedThaaliRange } from '@/services/thaali.api';
import WithBg from './WithBg';

const PausedThalis = () => {
    const [loading, setLoading] = useState(true);
    const [weeklyData, setWeeklyData] = useState([]);

    useEffect(() => {
        fetchPausedRangeStatus();
    }, []);

    const fetchPausedRangeStatus = async () => {
        try {
            const response = await getPausedThaaliRange();
            console.log("Range Paused API Response:", response.data);
            setWeeklyData(response.data.data);
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
                {`Paused Thalis for ${new Date().toLocaleString('en-US', { month: 'long' })} (${weeklyData?.length})`}
            </Text>

            <View style={styles.tableContainer}>
                {weeklyData?.length > 0 ? (<DataTable style={styles.table}>
                    <DataTable.Header style={styles.header}>
                        <DataTable.Title textStyle={styles.headerText}>Start Date</DataTable.Title>
                        <DataTable.Title textStyle={styles.headerText}>End Date</DataTable.Title>
                        <DataTable.Title textStyle={styles.headerText}>Thali No</DataTable.Title>
                    </DataTable.Header>

                    {weeklyData.map((item, index) => (
                        <DataTable.Row
                            key={item.id}
                            style={[
                                styles.row,
                                index % 2 === 0 ? styles.evenRow : styles.oddRow
                            ]}
                        >
                            <DataTable.Cell textStyle={styles.cell}>{formatDate(item.start_date)}</DataTable.Cell>
                            <DataTable.Cell textStyle={styles.cell}>{formatDate(item.end_date)}</DataTable.Cell>
                            <DataTable.Cell textStyle={styles.cell}>{item.txtThaaliNo}</DataTable.Cell>
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
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
        elevation: 3,
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
});

export default WithBg(PausedThalis);
