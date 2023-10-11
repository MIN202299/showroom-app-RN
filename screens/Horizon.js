import { StatusBar } from 'expo-status-bar'
import { BackHandler, Image, ImageBackground, StyleSheet, Text, View } from 'react-native'
import * as ScreenOrientation from 'expo-screen-orientation'

import { useNavigation } from '@react-navigation/native'
import { useEffect, useRef } from 'react'

import { BlurView } from 'expo-blur'

// video 组件
import { ResizeMode, Video } from 'expo-av'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBold: {
    fontFamily: 'HarmonyOS-Sans-Bold',
    color: '#fff',
  },
})

export default function Horizon(props) {
  const navigation = useNavigation()
  const video = useRef()
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // 屏幕锁定横向
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE)
    })
    return unsubscribe
  }, [])

  const testVideoUri = '../assets/companies/kuangwei/video.mp4'

  // 返回键监听
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.navigate('Root')
      // 返回true不会冒泡
      return true
    })
    return () => backHandler.remove()
  }, [])

  function handleAutoplay() {
    video.current.setPositionAsync(0)
    video.current.playAsync()
  }

  return (
    <ImageBackground source={require('../assets/bg/horizon-bg.png')} resizeMode='cover' style={styles.container}>
      <View style={{ width: '90%', height: '85%', padding: 2 }}>
        <BlurView intensity={20} style={{ flex: 1 }}>
          <View style={{ flex: 1, padding: '5%' }}>
            <View style={{ alignSelf: 'flex-start', paddingBottom: 3, marginLeft: 120, marginBottom: 4, borderBottomWidth: 4, borderStyle: 'dotted', borderBottomColor: '#fff' }}>
              <Text style={[styles.textBold, { fontSize: 20, textShadowRadius: 4, textShadowColor: '#fff' }]}>某某公司</Text>
            </View>
            <ImageBackground source={require('../assets/bg/h-border.png')} resizeMode='contain' style={{ flex: 1 }}>
              <View style={{ flex: 1, paddingVertical: '5%', paddingHorizontal: '15%' }}>
                {/* media video */}
                <View style={{ flex: 1 }}>
                  <Video
                    ref={video}
                    source={require(testVideoUri)}
                    resizeMode={ResizeMode.CONTAIN}
                    useNativeControls
                    isLooping
                    onLoad={() => { handleAutoplay() }}
                    style={{ flex: 1 }}></Video>
                </View>
              </View>
            </ImageBackground>
          </View>
        </BlurView>
        {/* 四个角 */}
        <Image source={require('../assets/bg/corner.png')} style={{ position: 'absolute', width: 100, height: 100, left: 0, bottom: 0 }}></Image>
        <Image source={require('../assets/bg/corner.png')} style={{ position: 'absolute', width: 100, height: 100, left: 0, top: 0, transform: [{ rotate: '90deg' }] }}></Image>
        <Image source={require('../assets/bg/corner.png')} style={{ position: 'absolute', width: 100, height: 100, right: 0, bottom: 0, transform: [{ rotate: '-90deg' }] }}></Image>
        <Image source={require('../assets/bg/corner.png')} style={{ position: 'absolute', width: 100, height: 100, right: 0, top: 0, transform: [{ rotate: '-180deg' }] }}></Image>
      </View>
      <StatusBar style='auto' hidden></StatusBar>
    </ImageBackground>
  )
}
