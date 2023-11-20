import { StatusBar } from 'expo-status-bar'
import { BackHandler, Image, ImageBackground, Modal, StyleSheet, Text, View } from 'react-native'
import * as ScreenOrientation from 'expo-screen-orientation'

import { useNavigation } from '@react-navigation/native'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'

import { BlurView } from 'expo-blur'

// video 组件
import { ResizeMode, Video } from 'expo-av'

import AsyncStorage from '@react-native-async-storage/async-storage'
import PagerView from 'react-native-pager-view'
import { STORAGE_KEY } from '../store/constant'
import { AppContext } from '../store'

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
const DEV = false

export default function Horizon() {
  const navigation = useNavigation()
  const video = useRef()
  const [com, setCom] = useState([])
  const [screenName, setScreenName] = useState('')
  const screenData = useMemo(() => {
    return com.find(item => item.screenName === screenName)
  }, [com, screenName])

  // useEffect(() => {
  //   console.log('screenData', screenData)
  // }, [screenData])

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // 屏幕锁定横向
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE)
    })
    AsyncStorage.getItem(STORAGE_KEY).then((res) => {
      if (res) {
        const screenName = JSON.parse(res).screenName
        setScreenName(screenName)
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

  const [modal, setModal] = useState('')
  const context = useContext(AppContext)
  useEffect(() => {
    // console.log('horizon context', context)
    if (!context.state.connected)
      setModal('Socket连接已断开，请重启应用，或者检查服务器')

    else
      setModal('')

    if (context.state.err)
      setModal(context.state.err)

    if (context.state.config) {
      context.state.config.direction === '横向'
        ? navigation.navigate('Horizon')
        : navigation.navigate('Vertical')
    }
    setCom(context.currentTheme)
  }, [context])

  function handleAutoplay() {
    if (!video)
      return
    video.current.setPositionAsync(0)
    video.current.playAsync()
  }
  function getView() {
    if (!context.state.config || !screenName || !context.state.theme || !screenData)
      return null
    if (context.state.theme === '默认') {
      return (
        <ImageBackground source={
          context.state.config.direction === '横向'
            ? require('../assets/bg/horizon-default.png')
            : require('../assets/bg/vertical-default.png')
        } style={{ width: '100%', height: '100%' }} resizeMode="stretch">
          <View style={{ width: '100vw', height: '100vh' }}>
            {
              screenData.mediaType === 'video'
                ? (<Video
                  ref={video}
                  source={{ uri: screenData.src }}
                  resizeMode={ResizeMode.STRETCH}
                  useNativeControls={false}
                  isLooping
                  isMuted
                  onLoad={() => { handleAutoplay() }}
                  style={{ width: '100%', height: '100%' }}></Video>)
                : (<Image source={{ uri: screenData.src }} style={{ width: '100%', height: '100%' }} resizeMode='contain'></Image>)
            }
          </View>
        </ImageBackground>
      )
    }
    else {
      return (
        <View style={{ width: '90%', height: '85%', padding: 2 }}>
          <BlurView intensity={20} style={{ flex: 1 }}>
            <View style={{ flex: 1, padding: 30 }}>
              <View style={{ alignSelf: 'flex-start', paddingBottom: 3, marginLeft: 200, marginBottom: 0, borderBottomWidth: 4, borderStyle: 'dotted', borderBottomColor: '#fff' }}>
                <Text style={[styles.textBold, { fontSize: 20, textShadowRadius: 4, textShadowColor: '#fff' }]}>{screenData.company}</Text>
              </View>
              <ImageBackground source={require('../assets/bg/h-border.png')} resizeMode='contain' style={{ flex: 1 }}>
                <View style={{ flex: 1, paddingVertical: '5%', paddingHorizontal: '15%' }}>
                  {/* media video */}
                  <View style={{ flex: 1, overflow: 'visible' }}>
                    {
                      screenData.mediaType === 'video'
                        ? (<Video
                          ref={video}
                          source={{ uri: screenData.src }}
                          resizeMode={ResizeMode.CONTAIN}
                          useNativeControls
                          isLooping
                          onLoad={() => { handleAutoplay() }}
                          style={{ flex: 1 }}></Video>)
                        : (<PagerView style={{ flex: 1 }} index={1} initialPage={0}>
                          {
                            Array.isArray(screenData.src)
                              ? screenData.src.map((src, idx) => (
                                <View style={{
                                  flex: 1,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }} key={idx}>
                                  <Image source={{ uri: src }} style={{ width: '100%', height: '100%' }} resizeMode='contain'></Image>
                                </View>
                              ))
                              : (<View>
                                <Image source={{ uri: screenData.src }} style={{ flex: 1, width: '100%', height: '100%' }} resizeMode='contain'></Image>
                              </View>)
                          }
                        </PagerView>)
                    }
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
          {/* 弹框 */}
          {
            !DEV && (
              <Modal animationType='slide' transparent={true} visible={!!modal}>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                  <View style={{ borderRadius: 4, overflow: 'hidden' }}>
                    <BlurView
                      intensity={80}
                      tint='light'
                      style={{ paddingHorizontal: 20, paddingVertical: 40 }}>
                      <Text style={[styles.textBold, { color: '#ef4444' }]}>{modal}</Text>
                    </BlurView>
                  </View>
                </View>
              </Modal>
            )
          }
        </View>
      )
    }
  }

  return (
    <ImageBackground source={require('../assets/bg/horizon-bg.png')} resizeMode='cover' style={styles.container}>
      {
        getView()
      }
      <StatusBar style='auto' hidden></StatusBar>
    </ImageBackground>
  )
}
