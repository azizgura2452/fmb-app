import React from 'react'
import { StyleSheet } from 'react-native'
import { FAB } from 'react-native-paper'

const FabBtn = (props) => {
    return (
        <FAB
            icon="play"
            style={styles.fab}
            onPress={() => console.log('Pressed')}
            size='medium'
        />
    )
}
const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 80,
        borderRadius: 50
    },
})

export default FabBtn