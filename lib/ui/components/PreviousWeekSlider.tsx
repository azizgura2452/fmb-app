import { IMenu } from '@/lib/interfaces';
import { styles } from '@/lib/ui';
import MenuCard from '@/lib/ui/components/MenuCard';
import { getPreviousWeekMenu, getWeeklyMenu } from '@/services/menu.api';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, FlatList, Animated } from 'react-native';
import { Card, Text, Paragraph, Surface } from 'react-native-paper';
import PreviousMenuCard from './PreviousMenuCard';

const { width: screenWidth } = Dimensions.get('window');
const PreviousWeekSlider = () => {
  const [menu, setMenu] = useState<IMenu[]>();
  const [isLoading, setIsLoading] = useState(true);
  const scrollX = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchData = async () => {
      const res = (await getPreviousWeekMenu()).data;
      // console.log(res.data.menu);
      setMenu(res.data.menu);
      setIsLoading(false);
    }
    fetchData();
  }, [])

  if(isLoading) {
    return <PreviousMenuCard isLoading={Boolean(true)} />
  }
  
  const renderMenuCard = ({ item }) => (
    <PreviousMenuCard {...item} isLoading={isLoading} />
  );

  return (
      <FlatList
        data={menu}
        initialNumToRender={2}
        renderItem={renderMenuCard}
        horizontal
        keyExtractor={(item) => item.id.toString()}
        showsHorizontalScrollIndicator={false}
        snapToAlignment="start"
        snapToInterval={screenWidth * 0.95} // Card width + margin
        decelerationRate="fast"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
      />
  );
};

export default PreviousWeekSlider;
