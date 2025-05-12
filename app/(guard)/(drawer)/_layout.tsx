import AsyncStorage from '@react-native-async-storage/async-storage'
import { Drawer } from 'expo-router/drawer'
import * as SecureStore from 'expo-secure-store'
import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Text, useTheme } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { useDispatch, useSelector } from 'react-redux'

import Locales from '@/lib/locales'
import { DrawerContent, DrawerHeader } from '@/lib/ui'
import AlertComponent from '@/lib/ui/components/AlertComponent'
import ModalBox from '@/lib/ui/components/ModalBox'
import { setNotificationCounter } from '@/store/slices/commonSlice'

const DrawerLayout = () => {
  const theme = useTheme()
  const [visible, setVisible] = React.useState(false)
  const { user } = useSelector((state) => state.auth)
  const [modalContent, setModalContent] = useState('')
  const [modalTitle, setModalTitle] = useState(null)
  const dispatch = useDispatch()
  const hideModal = () => {
    setVisible(false)
    setModalTitle(null)
    setModalContent('')
  }
  const { notificationCounter } = useSelector((state) => state.common)

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const isFirstLaunch = await AsyncStorage.getItem('isFirstLaunch')
        if (isFirstLaunch === null) {
          // First launch detected
          if (!visible) {
            setVisible(true)
            const titleObj = (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: [{ translateY: 30 }],
                }}
              >
                <Text
                  style={{
                    color: theme.colors.primary,
                    fontSize: 40,
                  }}
                >
                  أهلاً وسهلاً
                </Text>
              </View>
            )
            setModalTitle(titleObj)
            setModalContent('')
          }
          await AsyncStorage.setItem('isFirstLaunch', 'false')
        } else {
          if (user?.txtAmountDue > 0 && notificationCounter === 0 && !visible) {
            checkAndShowDueReminder(user.txtAmountDue)
            dispatch(setNotificationCounter(notificationCounter + 1))
          }
        }
      } catch (error) {
        console.error('Error checking app launch status:', error)
      }
    }

    checkFirstLaunch()
  }, [user, notificationCounter, theme, dispatch])

  const checkAndShowDueReminder = async (amountDue: number) => {
    if (amountDue <= 0) return

    try {
      const lastReminder = await SecureStore.getItemAsync('last_due_reminder')
      const now = new Date()

      if (lastReminder) {
        const lastDate = new Date(lastReminder)
        const daysDiff = Math.floor(
          (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24),
        )
        if (daysDiff < 30) return
      }

      setVisible(true)
      const titleObj = (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon
            name="alert-circle-outline"
            size={30}
            color={theme.colors.error}
          />
          <Text
            style={{
              color: theme.colors.error,
              marginLeft: 4,
              marginTop: -5,
              fontSize: 20,
            }}
          >
            Payment Reminder
          </Text>
        </View>
      )

      setModalTitle(titleObj)
      setModalContent(
        `You have an outstanding balance of KWD${amountDue}. Kindly clear your dues.`,
      )
      await SecureStore.setItemAsync('last_due_reminder', now.toISOString())
    } catch (error) {
      console.error('Error handling due reminder:', error)
    }
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ModalBox
        open={visible}
        content={
          <AlertComponent
            title={modalTitle}
            content={modalContent}
            onDismiss={hideModal}
            containerStyle={{
              justifyContent: 'center',
              textAlign: 'center',
              alignItems: 'center',
              textAlignVertical: 'center',
              width: 'max-content',
              paddingVertical: 0, //hi
              paddingHorizontal: 30,
            }}
            dismissableProp={false}
          />
        }
        onDismiss={hideModal}
        dismissableProp={false}
        containerStyle={{
          justifyContent: 'center',
          alignItems: 'center',
          textAlignVertical: 'center',
        }}
      />
      <Drawer
        drawerContent={(props) => (
          <DrawerContent
            navProps={props}
            showDivider={false}
            children={undefined}
            title="Menu"
          />
        )}
        screenOptions={{
          drawerStyle: {
            backgroundColor: theme.colors.background,
            paddingTop: 50,
            width: 350,
          },
          header: (props) => (
            <DrawerHeader navProps={props} children={undefined} />
          ),
        }}
      >
        <Drawer.Screen
          name="(tabs)"
          options={{
            drawerLabel: Locales.t('titleHome'),
            title: Locales.t('titleHome'),
          }}
        />
        <Drawer.Screen
          name="communication"
          options={{
            drawerLabel: Locales.t('communication'),
            title: Locales.t('communication'),
          }}
        />
        <Drawer.Screen
          name="organization"
          options={{
            drawerLabel: Locales.t('memberTree'),
            title: Locales.t('memberTree'),
          }}
        />
        <Drawer.Screen
          name="logout"
          options={{
            drawerLabel: Locales.t('logout'),
            title: Locales.t('logout'),
            headerShown: false,
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  )
}

export default DrawerLayout
