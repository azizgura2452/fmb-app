import React from 'react'
import { styles } from '../styles'
import { Surface, Text, Button, IconButton, useTheme } from 'react-native-paper'
import { StyleSheet } from 'react-native'

const AlertComponent = ({
  title,
  content,
  onDismiss,
  containerStyle,
  dismissableProp,
}) => {
  const theme = useTheme()
  return (
    <Surface style={[styles.cardContainer, containerStyle]}>
      <IconButton
        icon="close"
        size={20}
        onPress={onDismiss}
        style={styles2.closeButton}
        iconColor={theme.colors.primary}
      />

      <Text variant="headlineLarge" style={{ marginVertical: 10 }}>
        {title}
      </Text>

      {content ? (
        <Text variant="bodyLarge" style={{ marginBottom: 20 }}>
          {content}
        </Text>
      ) : null}

      {/* Button to close if dismissableProp is true */}
      {dismissableProp && (
        <Button mode="outlined" onPress={onDismiss}>
          Close
        </Button>
      )}
    </Surface>
  )
}

const styles2 = StyleSheet.create({
  closeButton: {
    position: 'absolute',
    top: 0,
    right: -8,
    zIndex: 1,
  },
})

export default AlertComponent
