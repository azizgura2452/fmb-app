import React, { useEffect, useState } from 'react'
import { Animated, FlatList, StyleSheet, View } from 'react-native'
import { Button, Card, List, Text } from 'react-native-paper'
import { Colors } from '../styles'
import { getContribution } from '@/services/thaali.api'
import { formatDate } from '@/lib/utils'
import { useSelector } from 'react-redux'
import LoadingIndicator from './LoadingIndicator'

const ContributionList = ({ refetch, type }) => {
    const [record, setRecord] = useState([]);
    const { user } = useSelector((state) => state.auth);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getContribution(type, user?.id);
                if (res?.data) {
                    // console.log('refetching..', type)
                    setRecord(res.data?.data)
                    setIsLoading(false);
                }
            }
            catch (e) {
                console.log('error', e)
                setIsLoading(false);
            }
        }
        fetchData();
    }, [user, refetch]);

    const renderCard = ({ item }) => <Card style={customStyles.card}>
        <Card.Content>
            <Text style={customStyles.date}>{formatDate(item.date)}</Text>
            <Text style={customStyles.title}>In the memory of:</Text>
            <Text variant="bodyMedium" style={customStyles.text}>
                {item.name_of}
            </Text>
        </Card.Content>
    </Card>

    const renderList = ({ item }) => (
        <List.Item
            title="Zabihat"
            description={formatDate(item.date)}
            left={props => <List.Icon {...props} icon="star" />}
        />
    );

    const render = () => {
        if (isLoading) {
            return <LoadingIndicator />
        }
        else {
            if (record.length > 0) {
                return <FlatList
                    data={record}
                    renderItem={type === 'SALAWAAT' ? renderCard : renderList}
                    horizontal={false}
                    keyExtractor={(item) => item.id.toString()}
                    showsHorizontalScrollIndicator={false}
                    snapToAlignment="start"
                    decelerationRate="fast"
                    scrollEnabled={false}
                    initialNumToRender={3}
                />
            }
            else return <Text variant="bodyMedium" style={{ textAlign: 'center', marginVertical: 24 }}>No records found</Text>
        }
    }
    return (
        <View>
            {
                render()
            }
        </View>
    )
}

const customStyles = StyleSheet.create({
    card: {
        backgroundColor: Colors.light.gold.background,
        marginBottom: 16
    },
    quote: {
        fontWeight: 'bold',
        fontStyle: 'italic',
        textAlign: 'center',
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginBottom: 10,
    },
    tabButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderBottomWidth: 2,
        borderColor: 'transparent',
    },
    activeTab: {
        borderColor: Colors.light.gold.primary,
    },
    tabText: {
        fontSize: 16,
        fontWeight: '600',
    },
    date: {
        fontSize: 14,
        color: '#999',
        marginBottom: 2,
        alignSelf: 'flex-end'
    },
    title: {
        fontSize: 14,
        fontStyle: 'italic'
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.light.gold.onPrimaryContainer
    },
});

export default ContributionList;