import { DrawerContentComponentProps } from '@react-navigation/drawer'
import { router } from 'expo-router'
import React from 'react'
import { Divider, Drawer, DrawerSectionProps, Icon, Text } from 'react-native-paper'
import Locales from '@/lib/locales'
import { Image, Linking, TouchableOpacity, View } from 'react-native'
import { Colors } from '../styles'

interface DrawerContentProps extends DrawerSectionProps {
  navProps: DrawerContentComponentProps
}

const KitchenDrawerContent = (props: DrawerContentProps) => {
  const { index, routes } = props.navProps.state;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.light.gold.background }}>
      {/* Logo Section */}
      <View style={{ alignItems: 'center', paddingVertical: 20 }}>
        <Image
          source={require('@/assets/images/fmb-logo.png')}
          style={{ width: '90%', height: 100, resizeMode: 'contain' }}
        />
      </View>

      {/* Drawer Items */}
      <View style={{ flex: 1 }}>
        <Drawer.Section {...props}  showDivider={false}>
          <Drawer.Item
            label={Locales.t('titleHome')}
            icon={(props) => <Icon source="home" size={props.size} color={Colors.light.gold.primary} />}
            active={routes[index]?.name === "(kitchendrawer)"}
            onPress={() => router.push('/(guard)/(kitchendrawer)')}
          />
          <Divider />
          <Drawer.Item
            label={Locales.t('logout')}
            icon={(props) => <Icon source="logout" size={props.size} color={Colors.light.gold.primary} />}
            active={routes[index]?.name === "(drawer)/logout"}
            onPress={(e) => {
              props.navProps.navigation.closeDrawer();
              router.push('/(guard)/(drawer)/logout');
            }}
          />
        </Drawer.Section>
      </View>

      {/* Footer */}
      <View style={{ alignItems: 'center', padding: 15, borderTopWidth: 1, borderColor: '#E0E0E0' }}>
        <Text style={{ fontSize: 12, color: 'gray', marginBottom: 5 }}>Designed & Developed By Aziz Gura</Text>

        {/* Contact Section */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => Linking.openURL('mailto:azizgura@gmail.com')}>
            <Text style={{ fontSize: 12, color: Colors.light.gold.primary }}>azizgura@gmail.com</Text>
          </TouchableOpacity>

          <Text style={{ fontSize: 12, color: 'gray', marginHorizontal: 5 }}>|</Text>

          <TouchableOpacity onPress={() => Linking.openURL('tel:+918696673753')}>
            <Text style={{ fontSize: 12, color: Colors.light.gold.primary }}>+91 8696673753</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default KitchenDrawerContent;
