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
  text: {
    fontFamily: 'PuHui',
  },
  textBold: {
    fontFamily: 'PuHui-Bold',
  },
})

export default function SelectScreen(props) {
  const navigation = useNavigation()

  useEffect(() => {
    navigation.navigate('Vertical')
    const unsubscribe = navigation.addListener('focus', () => {
      // 屏幕自动旋转
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT)
      // console.log('focus')
    })
    return unsubscribe
  }, [])

  return (
    <View style={styles.container} onLayout={props.onLayoutRootView}>
      <Text style={styles.textBold} onPress={() => navigation.navigate('Vertical')}>Select Screen</Text>
      <StatusBar style='auto' hidden></StatusBar>
    </View>
  )
}
