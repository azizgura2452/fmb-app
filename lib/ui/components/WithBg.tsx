import React from 'react'
import { ImageBackground } from 'react-native';
import { Text } from 'react-native-paper'

const WithBg = (WrappedComponent) => {
    return (props) => (
        <ImageBackground source={require('@/assets/images/fmb-bg.png')} resizeMode="repeat" style={{ flex: 1 }}>
            <WrappedComponent {...props} />
        </ImageBackground>
    )
}

export default WithBg;