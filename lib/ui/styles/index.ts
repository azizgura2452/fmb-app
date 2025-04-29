/**
 * Styles
 */

import { Dimensions, StyleSheet } from 'react-native'

import Colors from '@/lib/ui/styles/colors'
import Themes from '@/lib/ui/styles/themes'

let ScreenHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    gap: 16,
    padding: 16,
    backgroundColor: Colors.light.gold.elevation,
  },
  cardContainer: {
    margin: 12,
    borderRadius: 20,
    elevation: 4,
    backgroundColor: '#fff',  // Extremely light grey
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    borderTopWidth: 6,
    borderTopColor: Colors.light.gold.primary,
  },
  marginLeft: {
    marginLeft: 12
  }
})

export { Colors, Themes, styles }
