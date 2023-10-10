import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'
import * as ScreenOrientation from 'expo-screen-orientation'

import { useNavigation } from '@react-navigation/native'
import { useEffect } from 'react'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default function Horizon(props) {
  const navigation = useNavigation()
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // 屏幕锁定横向
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE)
    })
    return unsubscribe
  }, [])

  return (
    <View style={styles.container} onLayout={props.onLayoutRootView}>
      <Text>Horizon</Text>
      <StatusBar style='auto' hidden></StatusBar>
    </View>
  )
}
