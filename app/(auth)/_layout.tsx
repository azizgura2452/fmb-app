import { Stack } from 'expo-router'

import Locales from '@/lib/locales'
import { StackHeader } from '@/lib/ui'

const Layout = () => (
  <Stack
    screenOptions={{
      animation: 'slide_from_bottom',
      header: (props) => <StackHeader navProps={props} children={undefined} />,
    }}
  >
    <Stack.Screen name="login" options={{ title: Locales.t('login'), headerShown: false }}  />
  </Stack>
)

export default Layout
