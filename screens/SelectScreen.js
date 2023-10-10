import { StatusBar } from 'expo-status-bar'
import { ImageBackground, StyleSheet, Text, View } from 'react-native'
import * as ScreenOrientation from 'expo-screen-orientation'
import { useEffect } from 'react'

// 导航
import { useNavigation } from '@react-navigation/native'

// 背景模糊组件
import { BlurView } from '@react-native-community/blur'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: 'PuHui',
    color: 'white',

  },
  textBold: {
    fontFamily: 'PuHui-Bold',
  },
})

export default function SelectScreen(props) {
  const navigation = useNavigation()

  useEffect(() => {
    // navigation.navigate('Vertical')
    const unsubscribe = navigation.addListener('focus', () => {
      // 屏幕自动旋转
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT)
      // console.log('focus')
    })
    return unsubscribe
  }, [])

  return (
    <ImageBackground source={require('../assets/bg/horizon-bg.png')} resizeMode='cover' style={styles.container}>
      <View style={styles.container} onLayout={props.onLayoutRootView}>
        <Text style={styles.text} onPress={() => navigation.navigate('Vertical')}>Select Screen</Text>
        <BlurView style={{}}></BlurView>
        <StatusBar style='auto' hidden></StatusBar>
      </View>
    </ImageBackground>
  )
}
