import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { Tabs, router } from 'expo-router'
import React from 'react'
import Locales from '@/lib/locales'
import { TabBar, TabsHeader } from '@/lib/ui'

const TabLayout = () => {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        tabBarHideOnKeyboard: true,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: Locales.t('dashboard'),
          tabBarIcon: (props) => (
            <MaterialCommunityIcons
              {...props}
              size={24}
              name={props.focused ? 'home' : 'home-outline'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="weeklymenu"
        options={{
          title: Locales.t('weeklyFeedback'),
          tabBarIcon: (props) => (
            <MaterialCommunityIcons
              {...props}
              size={24}
              name={props.focused ? 'star' : 'star-outline'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="contribution"
        options={{
          title: Locales.t('contributions'),
          tabBarIcon: (props) => (
            <MaterialIcons
              {...props}
              size={24}
              name={props.focused ? 'goat' : 'goat'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="managethali"
        options={{
          title: Locales.t('manageThaali'),
          tabBarIcon: (props) => (
            <MaterialCommunityIcons
              {...props}
              size={24}
              name={props.focused ? 'inbox' : 'inbox-multiple'}
            />
          ),
        }}
      />
    </Tabs>
  )
}

export default TabLayout;
