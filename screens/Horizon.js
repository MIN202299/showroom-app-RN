import { StatusBar } from 'expo-status-bar'
import { BackHandler, Image, ImageBackground, StyleSheet, Text, View } from 'react-native'
import * as ScreenOrientation from 'expo-screen-orientation'

import { useNavigation } from '@react-navigation/native'
import { useEffect, useRef, useState } from 'react'

import { BlurView } from 'expo-blur'

// video 组件
import { ResizeMode, Video } from 'expo-av'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { companyData as companies } from '../data/companies'
import { STORAGE_KEY } from '../store/constant'
import { resourceMapping } from '../data/resourceMapping'

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

export default function Horizon() {
  const navigation = useNavigation()
  const video = useRef()
  const [com, setCom] = useState()
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // 屏幕锁定横向
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE)
    })
    AsyncStorage.getItem(STORAGE_KEY).then((res) => {
      if (res) {
        const screenName = JSON.parse(res).screenName
        const target = companies.find(item => item.screenName === screenName)
        target && setCom(target)
        // console.log(resourceMapping[target.product[0].src])
      }
    })
    return unsubscribe
  }, [])

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
    if (!video)
      return
    video.current.setPositionAsync(0)
    video.current.playAsync()
  }

  return (
    <ImageBackground source={require('../assets/bg/horizon-bg.png')} resizeMode='cover' style={styles.container}>
      <View style={{ width: '90%', height: '85%', padding: 2 }}>
        <BlurView intensity={20} style={{ flex: 1 }}>
          {
            com && (
              <View style={{ flex: 1, padding: '5%' }}>
                <View style={{ alignSelf: 'flex-start', paddingBottom: 3, marginLeft: 120, marginBottom: 4, borderBottomWidth: 4, borderStyle: 'dotted', borderBottomColor: '#fff' }}>
                  <Text style={[styles.textBold, { fontSize: 20, textShadowRadius: 4, textShadowColor: '#fff' }]}>{com.company}</Text>
                </View>
                <ImageBackground source={require('../assets/bg/h-border.png')} resizeMode='contain' style={{ flex: 1 }}>
                  <View style={{ flex: 1, paddingVertical: '5%', paddingHorizontal: '15%' }}>
                    {/* media video */}
                    <View style={{ flex: 1 }}>
                      <Video
                        ref={video}
                        source={resourceMapping[com.src]}
                        resizeMode={ResizeMode.CONTAIN}
                        useNativeControls
                        isLooping
                        onLoad={() => { handleAutoplay() }}
                        style={{ flex: 1 }}></Video>
                    </View>
                  </View>
                </ImageBackground>
              </View>
            )
          }
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
