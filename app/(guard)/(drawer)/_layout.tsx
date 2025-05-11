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
  // const [menuVisible, setMenuVisible] = React.useState(false);

  // const openMenu = () => setMenuVisible(true);
  // const closeMenu = () => setMenuVisible(false);

  const dispatch = useDispatch()

  // const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false)

  // const [isTodayPaused, setIsTodayPaused] = React.useState<boolean>(false);
  const { notificationCounter } = useSelector((state) => state.common)
  // useEffect(() => {
  //   if (user?.id) {
  //     if (isDateInPausedRange(user)) {
  //       setIsTodayPaused(true);
  //     }
  //   }
  // }, [user])

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const isFirstLaunch = await AsyncStorage.getItem('isFirstLaunch')
        // AsyncStorage.clear()
        if (isFirstLaunch === null) {
          setVisible(true)
          const titleObj = (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="flower-tulip-outline" size={30} color={theme.colors.primary} />
              <Text
                style={{
                  color: theme.colors.primary,
                  marginLeft: 4,
                  marginTop: -5,
                  fontSize: 20,
                }}
              >
                Ahlan Wasahlan
              </Text>
            </View>
          )

          setModalTitle(titleObj)
          setModalContent(
            `Ahlan Wasahlan to Faiz Ul Mawaid il Burhaniyah, Hakimi Mohalla, Hawally🌷`,
          )
          await AsyncStorage.setItem('isFirstLaunch', 'false')
        } else {
          if (user?.txtAmountDue > 0 && notificationCounter === 0) {
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
              `You have dues of KWD${user?.txtAmountDue}. Kindly clear your dues.`,
            )
            checkAndShowDueReminder(user?.txtAmountDue)
            dispatch(setNotificationCounter(notificationCounter + 1))
          }
        }
      } catch (error) {
        console.error('Error checking app launch status:', error)
      }
    }

    checkFirstLaunch()
  }, [user, notificationCounter])

  // useEffect(() => {
  //   if (user?.txtAmountDue > 0 && notificationCounter === 0) {
  //     checkAndShowDueReminder(user?.txtAmountDue)
  //     dispatch(setNotificationCounter(notificationCounter + 1))
  //   }
  // }, [user, notificationCounter]) // Depend on user and counter

  const checkAndShowDueReminder = async (amountDue: number) => {
    if (amountDue <= 0) return

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
    await SecureStore.setItemAsync('last_due_reminder', now.toISOString())
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
          />
        }
        onDismiss={hideModal}
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
            // headerRight: (props) => (
            //   <Menu
            //     visible={menuVisible}
            //     onDismiss={closeMenu}
            //     anchorPosition="bottom"
            //     mode="elevated"
            //     theme={theme}
            //     contentStyle={{ backgroundColor: '#fff'}}
            //     style={{marginLeft: -20, paddingVertical: 30}}
            //     anchor={
            //       <IconButton
            //         icon="dots-vertical"
            //         onPress={openMenu}
            //       />
            //     }
            //   >
            //     <Menu.Item onPress={() => {
            //       setMenuVisible(false)
            //       setVisible(true)
            //     }} title="Stop Thali Temporarily" leadingIcon={() => (
            //       <Icon name="clock" size={18} color={theme.colors.outline} />
            //     )} />
            //     <Menu.Item onPress={() => {
            //       startThali()
            //       setMenuVisible(false)
            //     }} title="Activate Thali" leadingIcon={() => (
            //       <Icon name="reload" size={18} color={theme.colors.outline} />
            //     )} />

            //   </Menu>
            // )
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
