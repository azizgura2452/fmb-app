import { DrawerHeaderProps as BaseProps } from '@react-navigation/drawer'
import { getHeaderTitle } from '@react-navigation/elements'
import React from 'react'
import { Appbar, AppbarProps } from 'react-native-paper'
import { Colors } from '../styles'

interface DrawerHeaderProps extends AppbarProps {
  navProps: BaseProps
}

const DrawerHeader = (props: DrawerHeaderProps) => (
  <Appbar.Header {...props} style={{backgroundColor: '#f5f5f5'}}>
    <Appbar.Action
      icon="menu"
      onPress={() => props.navProps.navigation.openDrawer()}
    />

    <Appbar.Content
      title={getHeaderTitle(props.navProps.options, props.navProps.route.name)}
      color={Colors.light.gold.onPrimaryContainer}
      titleStyle={{
        fontWeight: 'bold',
      }}
    />

    {props.navProps.options.headerRight
      ? props.navProps.options.headerRight({})
      : undefined}
  </Appbar.Header>
)

export default DrawerHeader
