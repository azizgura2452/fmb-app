import { IMenu } from '@/lib/interfaces';
import { styles } from '@/lib/ui';
import MenuCard from '@/lib/ui/components/MenuCard';
import { isToday, isTomorrow } from '@/lib/utils';
import { getWeeklyMenu } from '@/services/menu.api';
import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, FlatList, Animated } from 'react-native';
import { Card, Text, Paragraph, Surface } from 'react-native-paper';

const { width: screenWidth } = Dimensions.get('window');
const WeeklyMenuSlider = () => {
  const [menu, setMenu] = useState<IMenu[]>();
  const [isLoading, setIsLoading] = useState(true);
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const flatRef = useRef();
  const [lastTime, setLastTime] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = (await getWeeklyMenu()).data;
        setMenu(res.data.menu);
        setLastTime(res.data.last_time);
        console.log(res.data)
      }
      catch (e) {
        console.log('Error fetching', e)
      }
      finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      let itemId = 0;
      menu?.filter((m, i) => {
        if (isToday(m.menu_date)) {
          itemId = i;
          return m;
        }
      });
      const itemSize = screenWidth * 0.95;
      const idCurrentItem = itemId;

      flatRef?.current?.scrollToOffset({
        animated: true,
        offset: itemSize * idCurrentItem,
      });
    }, 1500);

    return () => clearTimeout(timeoutId);
  }, [flatRef.current, menu])

  if (isLoading) {
    return <MenuCard isLoading={Boolean(true)} />
  }

  const renderMenuCard = ({ item }) => (
    <MenuCard {...item} isLoading={isLoading} lastTime={lastTime} />
  );

  return (
    <FlatList
      data={menu}
      renderItem={renderMenuCard}
      horizontal
      keyExtractor={(item) => item.id.toString()}
      showsHorizontalScrollIndicator={false}
      snapToAlignment="start"
      snapToInterval={screenWidth * 0.95}
      decelerationRate="fast"
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        { useNativeDriver: false }
      )}
      ref={flatRef}
    />
  );
};

export default WeeklyMenuSlider;
