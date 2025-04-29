import Locales from '@/lib/locales'
import { ScreenInfo, styles } from '@/lib/ui'
import CardBox from '@/lib/ui/components/CardBox'
import CommunicationCard from '@/lib/ui/components/CommunicationCard'
import WithBg from '@/lib/ui/components/WithBg'
import { getCommunication } from '@/services/communication.api'
import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { FlatList, RefreshControl, ScrollView } from 'react-native'
import { Button, Card, Surface } from 'react-native-paper'

const Communication = () => {
  const [post, setPost] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = (await getCommunication()).data;
      // console.log(res.data);
      setPost(res.data);
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
    catch (e) {
      console.log(e)
    }
  }

  const onRefresh = React.useCallback(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const renderCard = ({ item }) => <CommunicationCard {...item} isLoading={isLoading} />

  return (
    <Surface style={styles.screen}>
      {post.length > 0 ? (
        <FlatList
          data={post}
          renderItem={renderCard}
          horizontal={false}
          keyExtractor={(item) => item.id.toString()}
          snapToAlignment="start"
          decelerationRate="fast"
          initialNumToRender={3}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      ) : (
        <Card style={{ padding: 20, alignItems: 'center', justifyContent: 'center' }}>
          <Card.Content>
            <Button icon="message-alert" mode="contained" disabled>
              No communication found
            </Button>
          </Card.Content>
        </Card>
      )}
    </Surface>
  );
}

export default WithBg(Communication)