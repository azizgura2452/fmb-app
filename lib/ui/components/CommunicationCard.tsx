import { formatDate } from '@/lib/utils';
import React, { useEffect } from 'react';
import { View, StyleSheet, useWindowDimensions, LogBox } from 'react-native';
import { Card, Text } from 'react-native-paper';
import RenderHTML from 'react-native-render-html';
import { styles as defaultStyle } from '@/lib/ui/styles'
import SkeletonLoader from './SkeletonLoader';

LogBox.ignoreAllLogs();

const CommunicationCard = (props) => {
  const { id, title, text, created_at, isLoading } = props;
  const date = formatDate(created_at);
  const { width } = useWindowDimensions();

  if(isLoading) return <SkeletonLoader />

  return (
    <View>
      <Card style={[defaultStyle.cardContainer, styles.card]}>
        <Card.Content>
          <Text style={styles.date}>{date}</Text>
          <Text style={styles.title}>{title}</Text>
          <RenderHTML
            contentWidth={width}
            source={{ html: text }}
            tagsStyles={{
              img: { width: width * 0.75, height: 'auto' }, // Ensure images are responsive
            }}
          />
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 1,
    marginBottom: 0
  },
  date: {
    fontSize: 14,
    color: '#999',
    marginBottom: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 14,
  },
});

export default CommunicationCard;
