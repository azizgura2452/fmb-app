import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { IconButton } from 'react-native-paper';

const StarRating = ({ maxStars = 5, rating, onRatingChange, size }) => {
  const [currentRating, setCurrentRating] = useState(rating || 0);

  const handlePress = (star) => {
    setCurrentRating(star);
    onRatingChange(star);
  };

  return (
    <View style={{ flexDirection: 'row' }}>
      {[...Array(maxStars)].map((_, index) => {
        const starNumber = index + 1;
        return (
          <TouchableOpacity key={starNumber} onPress={() => handlePress(starNumber)} style={{marginLeft: -24}}>
            <IconButton
              icon={starNumber <= currentRating ? 'star' : 'star-outline'}
              size={size ?? 40}
              background={starNumber <= currentRating ? '#FFD700' : '#CCCCCC'}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default StarRating;
