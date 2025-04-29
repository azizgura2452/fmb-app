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
import { setNotificationCounter, setRefetch } from '@/store/slices/commonSlice'
import { Alert, View } from 'react-native'
import { setUser } from '@/store/slices/authSlice'
import { isDateInPausedRange } from '@/lib/utils'
import * as SecureStore from 'expo-secure-store';
import AlertComponent from '@/lib/ui/components/AlertComponent'
import { translate } from '@shopify/react-native-skia'

const DrawerLayout = () => {
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
  const { notificationCounter } = useSelector((state) => state.common);
  useEffect(() => {
    if (user?.id) {
      if (isDateInPausedRange(user)) {
        setIsTodayPaused(true);
      }
    }
  }, [user])

  useEffect(() => {
    if (user?.txtAmountDue > 0 && notificationCounter === 0) {
      checkAndShowDueReminder(user?.txtAmountDue);
      dispatch(setNotificationCounter(notificationCounter + 1));
    }
  }, [user, notificationCounter]); // Depend on user and counter

  const checkAndShowDueReminder = async (amountDue: number) => {
    if (amountDue <= 0) return;

    const lastReminder = await SecureStore.getItemAsync('last_due_reminder');
    const now = new Date();

    if (lastReminder) {
      const lastDate = new Date(lastReminder);
      const daysDiff = Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

      // if (daysDiff < 30) return;
    }
    setVisible(true);
    await SecureStore.setItemAsync('last_due_reminder', now.toISOString());
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ModalBox open={visible} content={<AlertComponent title={<View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Icon name="alert-circle-outline" size={30} color={theme.colors.error} />
        <Text
          style={{
            color: theme.colors.error,
            marginLeft: 4,
            marginTop: -5,
            fontSize: 20
          }}
        >
          Payment Reminder
        </Text>
      </View>
      } content={`You have dues of KWD${user?.txtAmountDue}. Kindly clear your dues.`} onDismiss={hideModal} />} onDismiss={hideModal} />
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
            width: 350
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
            headerShown: false
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  )
}

export default DrawerLayout
