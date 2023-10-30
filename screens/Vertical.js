import { StatusBar } from 'expo-status-bar'
import { BackHandler, Image, ImageBackground, Modal, ScrollView, StyleSheet, Text, View } from 'react-native'
import * as ScreenOrientation from 'expo-screen-orientation'
import { BlurView } from 'expo-blur'

import { useNavigation } from '@react-navigation/native'

import { LinearGradient } from 'expo-linear-gradient'

import { useContext, useEffect, useMemo, useRef, useState } from 'react'

import AsyncStorage from '@react-native-async-storage/async-storage'
import PagerView from 'react-native-pager-view'
import { ResizeMode, Video } from 'expo-av'
import { DefaultScreenWords, STORAGE_KEY } from '../store/constant'
import { resourceMapping } from '../data/resourceMapping'
import { AppContext } from '../store'
import data from '../data'

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

export default function Vertical() {
  const navigation = useNavigation()
  const [com, setCom] = useState([])
  const [screenName, setScreenName] = useState('')
  const screenData = useMemo(() => {
    return com.find(item => item.screenName === screenName)
  }, [com, screenName])

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // 屏幕锁定横向
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT)
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
  const video = useRef()
  function handleAutoplay() {
    if (!video)
      return
    video.current.setPositionAsync(0)
    video.current.playAsync()
  }

  const [modal, setModal] = useState('')
  const context = useContext(AppContext)
  useEffect(() => {
    // console.log('context', context)
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
    setCom(data[context.state.theme])
  }, [context.state])

  function getView() {
    if (!context.state.config || !screenName)
      return null
    if (!screenData) {
      return (
        <ImageBackground source={
          context.state.config.direction === '横向'
            ? require('../assets/bg/horizon-default.png')
            : require('../assets/bg/vertical-default.png')
        } style={{ width: '100%', height: '100%' }} resizeMode="stretch">
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={[styles.textBold, { fontSize: 100 }]}>{DefaultScreenWords[screenName][0]}</Text>
            <Text style={{ color: '#fff', fontSize: 60 }}>{DefaultScreenWords[screenName][1]}</Text>
          </View>
        </ImageBackground>
      )
    }
    else {
      return (
        <View style={{ width: '90%', height: '85%', padding: 2 }}>
          <BlurView intensity={20} style={{ flex: 1 }}>
            <View style={{ flex: 1, paddingVertical: '10%', paddingHorizontal: '2%' }}>
              <View style={{ flex: 1 }}>
                <View style={{
                  alignSelf: 'flex-start',
                  paddingBottom: 3,
                  marginLeft: 82,
                  borderBottomWidth: 4,
                  borderStyle: 'dotted',
                  borderBottomColor: '#fff',
                  position: 'absolute',
                  top: 35,
                  left: 10,
                }}>
                  <View style={[styles.textBold, { fontSize: 20, textShadowRadius: 4, textShadowColor: '#fff' }]}>
                    <Text style={[styles.textBold, { fontSize: 16 }]}>{screenData.company}</Text>
                  </View>
                </View>
                <ImageBackground source={require('../assets/bg/v-border.png')}
                  resizeMode='contain'
                  style={{ flex: 1, paddingVertical: '15%', paddingLeft: '10%', paddingRight: '8%' }}>
                  <View style={{ flex: 1, paddingBottom: 10, paddingTop: 40 }}>
                    {/* 产品标题 */}
                    <View style={{ marginLeft: 14, marginBottom: 10 }}>
                      <Text style={[styles.textBold, { fontSize: 16 }]}>{screenData.productName}</Text>
                    </View>
                    {/* 产品介绍 */}
                    <View style={{ flexWrap: 'nowrap', flexDirection: 'row', gap: 15, marginTop: 4 }}>
                      <LinearGradient colors={['#D8D8D8aa', 'transparent', '#D8D8D8aa']} style={{ flex: 1, aspectRatio: 1, padding: 1, borderRadius: 5, overflow: 'hidden' }}>
                        <View style={{ flex: 1, borderRadius: 4, overflow: 'hidden' }}>
                          <Image source={resourceMapping[screenData.product[0].src]} resizeMode='cover' style={{ width: '100%', height: '100%' }}></Image>
                        </View >
                        {
                          (screenData.product[0].name && (
                            <View style={{ position: 'absolute', bottom: 1, right: 1, borderBottomEndRadius: 4, width: '100%', overflow: 'hidden' }}>
                              <BlurView intensity={50} tint='dark' style={{ flex: 1, paddingHorizontal: 10, height: 30, justifyContent: 'center' }}>
                                <Text style={{ textAlign: 'center', fontSize: 11 }}>{screenData.product[0].name}</Text>
                              </BlurView>
                            </View>
                          ))
                        }
                      </LinearGradient>
                      <LinearGradient colors={['#D8D8D8aa', 'transparent', '#D8D8D8aa']} style={{ flex: 1, aspectRatio: 1, padding: 1, borderRadius: 5, overflow: 'hidden' }}>
                        <View style={{ flex: 1, borderRadius: 4, overflow: 'hidden' }}>
                          <Image source={resourceMapping[screenData.product[1].src]}
                            resizeMode='cover'
                            style={{ width: '100%', height: '100%' }}></Image>
                        </View>
                        {
                          screenData.product[1].name && (
                            <View style={{ position: 'absolute', bottom: 1, right: 1, borderBottomEndRadius: 4, width: '100%', overflow: 'hidden' }}>
                              <BlurView intensity={50} tint='dark' style={{ flex: 1, paddingHorizontal: 10, height: 30, justifyContent: 'center' }}>
                                <Text style={{ textAlign: 'center', fontSize: 11 }}>{screenData.product[1].name}</Text>
                              </BlurView>
                            </View>
                          )

                        }
                      </LinearGradient>
                      <View style={{ flex: 1, aspectRatio: 1, padding: 1, borderRadius: 5, overflow: 'hidden' }}>
                        {/* 产品标题 */}
                        <View style={{ marginBottom: 5 }}>
                          <Text style={[styles.textBold, { fontSize: 10 }]}>{screenData.productName}</Text>
                        </View>
                        <ScrollView style={{ flex: 1, overflow: 'scroll' }}>
                          <Text style={{ fontSize: 10, textAlign: 'justify', color: '#fff' }}>{screenData.productIntro}</Text>
                        </ScrollView>
                      </View>
                    </View>
                    {/* 产品介绍 */}
                    <View style={{ flex: 1, marginVertical: 20, borderWidth: 1, borderColor: '#D8D8D8aa', padding: 20, borderRadius: 5 }}>
                      { // swiper
                        (screenData.mediaType === 'video')
                          ? (
                            <Video
                              ref={video}
                              source={resourceMapping[screenData.src]}
                              resizeMode={ResizeMode.CONTAIN}
                              style={{ flex: 1 }}
                              useNativeControls
                              isLooping
                              onLoad={() => { handleAutoplay() }}></Video>
                          )
                          : (
                            (screenData.mediaType === 'swipe-image')
                              ? (<PagerView style={{ flex: 1 }} initialPage={0}>
                                {
                                  Array.isArray(screenData.src)
                                    ? screenData.src.map((src, idx) => (
                                      <View style={{
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                      }} key={idx}>
                                        <Image source={resourceMapping[src]} style={{ width: '100%', height: '100%' }} resizeMode='contain'></Image>
                                      </View>
                                    ))
                                    : (<View>
                                      <Image source={resourceMapping[screenData.src]} style={{ width: '100%', height: '100%' }} resizeMode='contain'></Image>
                                    </View>)
                                }
                              </PagerView>)
                              : null
                          )
                      }
                    </View>
                    {/* 公司介绍 */}
                    <View style={{ height: 200, borderWidth: 1, borderColor: '#D8D8D8aa', padding: 10, borderRadius: 5, marginBottom: 10 }}>
                      <View style={{ marginBottom: 4 }}>
                        <Text style={[styles.textBold, { fontSize: 16 }]}>{ screenData.company }</Text>
                      </View>
                      <ScrollView style={{ flex: 1 }}>
                        <Text style={[{ fontSize: 12, color: '#fff' }]}>{ screenData.companyIntro }</Text>
                      </ScrollView>
                    </View>
                  </View>
                </ImageBackground>
              </View>
            </View>
          </BlurView>
          {/* 四个角 */}
          <Image source={require('../assets/bg/corner.png')} style={{ position: 'absolute', width: 100, height: 100, left: 0, bottom: 0 }}></Image>
          <Image source={require('../assets/bg/corner.png')} style={{ position: 'absolute', width: 100, height: 100, left: 0, top: 0, transform: [{ rotate: '90deg' }] }}></Image>
          <Image source={require('../assets/bg/corner.png')} style={{ position: 'absolute', width: 100, height: 100, right: 0, bottom: 0, transform: [{ rotate: '-90deg' }] }}></Image>
          <Image source={require('../assets/bg/corner.png')} style={{ position: 'absolute', width: 100, height: 100, right: 0, top: 0, transform: [{ rotate: '-180deg' }] }}></Image>
          {/* logo */}
          {
            <View style={{ position: 'absolute', top: 15, left: 15, height: 100, width: 120 }}>
              <ImageBackground source={require('../assets/bg/logo-bg.png')} resizeMode='contain' style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <Image source={resourceMapping[screenData.logo]} resizeMode='contain' style={{ width: '66%', height: '66%' }}></Image>
              </ImageBackground>
            </View>
          }
        </View>
      )
    }
  }

  return (
    <ImageBackground source={require('../assets/bg/vertical-bg.png')} resizeMode='cover' style={[styles.container]}>
      {
        getView()
      }
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

      <StatusBar style='auto' hidden></StatusBar>
    </ImageBackground>
  )
}
