import { router } from 'expo-router'
import { Drawer } from 'expo-router/drawer'
import React, { useEffect, useState } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Appbar, Button, IconButton, Menu, Modal, Portal, Text, Tooltip, useTheme } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Locales from '@/lib/locales'
import { DrawerContent, DrawerHeader } from '@/lib/ui'
import PauseThaaliForm from '@/lib/ui/components/PauseThaaliForm'
import ModalBox from '@/lib/ui/components/ModalBox'
import { useDispatch, useSelector } from 'react-redux'
import { activateThaali, getThaaliData } from '@/services/thaali.api'
import { setRefetch } from '@/store/slices/commonSlice'
import { Alert } from 'react-native'
import { setUser } from '@/store/slices/authSlice'
import { isDateInPausedRange } from '@/lib/utils'
import KitchenDrawerContent from '@/lib/ui/components/KitchenDrawerContent'

const KitchenDrawerLayout = () => {
  const theme = useTheme();
  const [visible, setVisible] = React.useState(false);
  const { user } = useSelector((state) => state.auth);
  const [menuVisible, setMenuVisible] = React.useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const dispatch = useDispatch();

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const [isTodayPaused, setIsTodayPaused] = React.useState<boolean>(false);

  useEffect(() => {
    if (user?.id) {
      if (isDateInPausedRange(user)) {
        setIsTodayPaused(true);
      }
    }
  }, [user])

  const startThali = async () => {
    // console.log(user?.id)
    try {
      const res = await activateThaali(user?.id);
      dispatch(setRefetch(Math.floor(Math.random() * 100)));
    }
    catch (e) {
      console.log(e)
    }
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => (
          <KitchenDrawerContent
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
            width: 350
          },
          header: (props) => (
            <DrawerHeader navProps={props} children={undefined} />
          ),
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: Locales.t('dashboard'),
            title: Locales.t('dashboard'),
          }}
        />
        <Drawer.Screen
          name="logout"
          options={{
            drawerLabel: Locales.t('logout'),
            title: Locales.t('logout'),
            headerShown: false
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  )
}

export default KitchenDrawerLayout
