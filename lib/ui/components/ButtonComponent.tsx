import React from 'react'
import { Button } from 'react-native-paper'

const ButtonComponent = (props) => {
    const {title, onPress} =props;
    return (
        <Button icon="star" mode="outlined" onPress={onPress} textColor='#b98027'>
            {title}
        </Button>
    )
}

export default ButtonComponent