import React from 'react';
import { styles } from '../styles';
import { Surface, Text, Button } from 'react-native-paper';

const AlertComponent = ({ title, content, onDismiss }) => {
  return (
    <Surface style={styles.cardContainer}>
      <Text variant="headlineLarge" style={{ marginVertical: 10 }}>
        {title}
      </Text>
      <Text variant="bodyLarge" style={{ marginBottom: 20 }}>
        {content}
      </Text>
      <Button mode="outlined" onPress={onDismiss}>
        Close
      </Button>
    </Surface>
  );
};

export default AlertComponent;
