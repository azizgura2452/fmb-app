import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { CommonActions } from '@react-navigation/native'
import React from 'react'
import { BottomNavigation, Text } from 'react-native-paper'
import { Colors } from '../styles'

const TabBar = (props: BottomTabBarProps) => (
  <BottomNavigation.Bar
    style={{ backgroundColor: '#b98027' }}
    activeColor={Colors.light.gold.onSecondaryContainer}
    inactiveColor='#fff'
    shifting={false}
    navigationState={props.state}
    safeAreaInsets={props.insets}
    onTabPress={({ route, preventDefault }) => {
      const event = props.navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      })

      if (event.defaultPrevented) {
        preventDefault()
      } else {
        props.navigation.dispatch({
          ...CommonActions.navigate(route.name, route.params),
          target: props.state.key,
        })
      }
    }}
    renderIcon={({ route, focused, color }) => {
      const { options } = props.descriptors[route.key]
      if (options.tabBarIcon) {
        return options.tabBarIcon({ focused, color, size: 24 })
      }

      return null
    }}
    getLabelText={({ route }) => {
      const { options } = props.descriptors[route.key]
      const label =
        options.tabBarLabel !== undefined
          ? options.tabBarLabel
          : options.title !== undefined
            ? options.title
            : route.title

      return (
        <Text style={{ color: '#fff'}}>
          {label}
        </Text>)
    }}
  />
)

export default TabBar
