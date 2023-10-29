import { StatusBar } from 'expo-status-bar'
import { BackHandler, Image, ImageBackground, Modal, ScrollView, StyleSheet, Text, View } from 'react-native'
import * as ScreenOrientation from 'expo-screen-orientation'
import { BlurView } from 'expo-blur'

import { useNavigation } from '@react-navigation/native'

import { LinearGradient } from 'expo-linear-gradient'

import { useContext, useEffect, useRef, useState } from 'react'

import AsyncStorage from '@react-native-async-storage/async-storage'
import PagerView from 'react-native-pager-view'
import { ResizeMode, Video } from 'expo-av'
import { STORAGE_KEY, Theme } from '../store/constant'
import { companyData as companies } from '../data/companies'
import { resourceMapping } from '../data/resourceMapping'
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

export default function Vertical() {
  const navigation = useNavigation()
  const [com, setCom] = useState()
  const [dropleton] = useState()
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // 屏幕锁定横向
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT)
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
  }, [context.state])

  function getView(theme) {
    if (theme === Theme.DEFAULT) {
      return (
        <ImageBackground source={
          context.state.config.direction === '横向'
            ? require('../assets/bg/horizon-default.png')
            : require('../assets/bg/vertical-default.png')
        } style={{ width: '100%', height: '100%' }} resizeMode="stretch">
          {getScreenText(context.state.config.screenName)}
        </ImageBackground>
      )
    }
    else if (theme === Theme.COMPANY_INTRO || theme === Theme.DROPLETON) {
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
                  <Text style={[styles.textBold, { fontSize: 20, textShadowRadius: 4, textShadowColor: '#fff' }]}>
                    {
                      (context.state.theme === Theme.COMPANY_INTRO && com)
                        ? (<Text style={[styles.textBold, { fontSize: 16 }]}>{com.company}</Text>)
                        : (<Text style={[styles.textBold, { fontSize: 16 }]}>{dropleton[1].company}</Text>)
                    }
                  </Text>
                </View>
                <ImageBackground source={require('../assets/bg/v-border.png')}
                  resizeMode='contain'
                  style={{ flex: 1, paddingVertical: '15%', paddingLeft: '13%', paddingRight: '8%' }}>
                  <View style={{ flex: 1, paddingBottom: 10 }}>
                    {/* 产品标题 */}
                    <View style={{ marginLeft: 14 }}>
                      {
                        (context.state.theme === Theme.COMPANY_INTRO && com)
                          ? (<Text style={[styles.textBold, { fontSize: 16 }]}>{com.productName}</Text>)
                          : (<Text style={[styles.textBold, { fontSize: 16 }]}>{''}</Text>)
                      }
                    </View>
                    {/* 产品介绍 */}
                    <View style={{ flexWrap: 'nowrap', flexDirection: 'row', gap: 10, marginTop: 4 }}>
                      <LinearGradient colors={['#D8D8D8aa', 'transparent', '#D8D8D8aa']} style={{ flex: 1, aspectRatio: 1, padding: 1, borderRadius: 5, overflow: 'hidden' }}>
                        <View style={{ flex: 1, borderRadius: 4, overflow: 'hidden' }}>
                          <Image source={
                            (context.state.theme === Theme.COMPANY_INTRO && com)
                              ? resourceMapping[com.product[0].src]
                              : dropleton[1].product[0].src
                          } resizeMode='cover' style={{ width: '100%', height: '100%' }}></Image>
                        </View >
                        {
                          (context.state.theme === Theme.COMPANY_INTRO && com)
                            ? (com.product[0].name && (
                              <View style={{ position: 'absolute', bottom: 1, right: 1, borderBottomEndRadius: 4, width: '100%', overflow: 'hidden' }}>
                                <BlurView intensity={50} tint='dark' style={{ flex: 1, paddingHorizontal: 10, height: 30, justifyContent: 'center' }}>
                                  <Text style={{ textAlign: 'center', fontSize: 11 }}>{com.product[0].name}</Text>
                                </BlurView>
                              </View>
                            ))
                            : (
                              <View style={{ position: 'absolute', bottom: 1, right: 1, borderBottomEndRadius: 4, width: '100%', overflow: 'hidden' }}>
                                <BlurView intensity={50} tint='dark' style={{ flex: 1, paddingHorizontal: 10, height: 30, justifyContent: 'center' }}>
                                  <Text style={{ textAlign: 'center', fontSize: 11 }}>{dropleton[1].product[0].name}</Text>
                                </BlurView>
                              </View>
                            )
                        }
                      </LinearGradient>
                      <LinearGradient colors={['#D8D8D8aa', 'transparent', '#D8D8D8aa']} style={{ flex: 1, aspectRatio: 1, padding: 1, borderRadius: 5, overflow: 'hidden' }}>
                        <View style={{ flex: 1, borderRadius: 4, overflow: 'hidden' }}>
                          <Image source={
                            (context.state.theme === Theme.COMPANY_INTRO && com)
                              ? resourceMapping[com.product[1].src]
                              : dropleton[1].product[1].src}
                          resizeMode='cover'
                          style={{ width: '100%', height: '100%' }}></Image>
                        </View>
                        {
                          (context.state.theme === Theme.COMPANY_INTRO && com)
                            ? (
                              com.product[1].name && (
                                <View style={{ position: 'absolute', bottom: 1, right: 1, borderBottomEndRadius: 4, width: '100%', overflow: 'hidden' }}>
                                  <BlurView intensity={50} tint='dark' style={{ flex: 1, paddingHorizontal: 10, height: 30, justifyContent: 'center' }}>
                                    <Text style={{ textAlign: 'center', fontSize: 11 }}>{com.product[1].name}</Text>
                                  </BlurView>
                                </View>
                              )
                            )
                            : (
                              <View style={{ position: 'absolute', bottom: 1, right: 1, borderBottomEndRadius: 4, width: '100%', overflow: 'hidden' }}>
                                <BlurView intensity={50} tint='dark' style={{ flex: 1, paddingHorizontal: 10, height: 30, justifyContent: 'center' }}>
                                  <Text style={{ textAlign: 'center', fontSize: 11 }}>{dropleton[1].product[1].name}</Text>
                                </BlurView>
                              </View>
                            )

                        }
                      </LinearGradient>
                      {
                        (context.state.theme === Theme.COMPANY_INTRO && com)
                          ? (<View style={{ flex: 1, aspectRatio: 1, padding: 1, borderRadius: 5, overflow: 'hidden' }}>
                            {/* 产品标题 */}
                            <View style={{ marginBottom: 5 }}>
                              <Text style={[styles.textBold, { fontSize: 10 }]}>{com.productName}</Text>
                            </View>
                            <ScrollView style={{ flex: 1, overflow: 'scroll' }}>
                              <Text style={{ fontSize: 10, textAlign: 'justify', color: '#fff' }}>{com.productIntro}</Text>
                            </ScrollView>
                          </View>)
                          : (
                            <LinearGradient colors={['#D8D8D8aa', 'transparent', '#D8D8D8aa']} style={{ flex: 1, aspectRatio: 1, padding: 1, borderRadius: 5, overflow: 'hidden' }}>
                              <View style={{ flex: 1, borderRadius: 4, overflow: 'hidden' }}>
                                <Image source={
                                  dropleton[1].product[2].src}
                                resizeMode='cover'
                                style={{ width: '100%', height: '100%' }}></Image>
                              </View>

                              <View style={{ position: 'absolute', bottom: 1, right: 1, borderBottomEndRadius: 4, width: '100%', overflow: 'hidden' }}>
                                <BlurView intensity={50} tint='dark' style={{ flex: 1, paddingHorizontal: 10, height: 30, justifyContent: 'center' }}>
                                  <Text style={{ textAlign: 'center', fontSize: 11 }}>{dropleton[1].product[2].name}</Text>
                                </BlurView>
                              </View>

                            </LinearGradient>
                          )
                      }
                    </View>
                    {/* 产品介绍 */}
                    <View style={{ flex: 1, marginVertical: 10, borderWidth: 1, borderColor: '#D8D8D8aa', padding: 10, borderRadius: 5 }}>
                      { // swiper
                        (com && context.state.theme === Theme.COMPANY_INTRO)
                          ? (
                            (com.mediaType === 'video')
                              ? (
                                <Video
                                  ref={video}
                                  source={resourceMapping[com.src]}
                                  resizeMode={ResizeMode.CONTAIN}
                                  style={{ flex: 1, backgroundColor: 'black' }}
                                  useNativeControls
                                  isLooping
                                  onLoad={() => { handleAutoplay() }}></Video>
                              )
                              : (
                                (com.mediaType === 'swipe-image')
                                  ? (<PagerView style={{ flex: 1, backgroundColor: 'black' }} initialPage={0}>
                                    {
                                      Array.isArray(com.src)
                                        ? com.src.map((src, idx) => (
                                          <View style={{
                                            flex: 1,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                          }} key={idx}>
                                            <Image source={resourceMapping[src]} style={{ width: '100%', height: '100%' }} resizeMode='contain'></Image>
                                          </View>
                                        ))
                                        : (<View>
                                          <Image source={resourceMapping[com.src]} style={{ flex: 1 }} resizeMode='contain'></Image>
                                        </View>)
                                    }
                                  </PagerView>)
                                  : null
                              )
                          )
                          : (dropleton[1].mediaType === 'swipe-image')
                            ? (<PagerView style={{ flex: 1, backgroundColor: 'black' }} initialPage={0}>
                              {
                                Array.isArray(dropleton[1].src)
                                  ? dropleton[1].src.map((src, idx) => (
                                    <View style={{
                                      flex: 1,
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                    }} key={idx}>
                                      <Image source={src} style={{ width: '100%', height: '100%' }} resizeMode='contain'></Image>
                                    </View>
                                  ))
                                  : (<View>
                                    <Image source={dropleton[1].src} style={{ flex: 1 }} resizeMode='contain'></Image>
                                  </View>)
                              }
                            </PagerView>)
                            : null
                      }
                    </View>
                    {/* 公司介绍 */}
                    <View style={{ height: 200, borderWidth: 1, borderColor: '#D8D8D8aa', padding: 10, borderRadius: 5, marginBottom: 5 }}>
                      <View style={{ marginBottom: 4 }}>
                        <Text style={[styles.textBold, { fontSize: 16 }]}>{
                          (context.state.theme === Theme.COMPANY_INTRO && com)
                            ? com.company
                            : dropleton[1].company}</Text>
                      </View>
                      <ScrollView style={{ flex: 1 }}>
                        <Text style={[{ fontSize: 12, color: '#fff' }]}>{
                          (context.state.theme === Theme.COMPANY_INTRO && com)
                            ? com.companyIntro
                            : dropleton[1].companyIntro}</Text>
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
                <Image source={
                  (context.state.theme === Theme.COMPANY_INTRO && com)
                    ? resourceMapping[com.logo]
                    : require('../assets/companies/dropleton/logo.png')
                } resizeMode='contain' style={{ width: '66%', height: '66%' }}></Image>
              </ImageBackground>
            </View>
          }
        </View>
      )
    }
  }

  function getScreenText(screen) {
    switch (screen) {
      case '屏幕一':
        return (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={[styles.textBold, { fontSize: 100 }]}>云计算</Text>
            <Text style={{ color: '#fff', fontSize: 60 }}>Cloud Computing</Text>
          </View>
        )
      case '屏幕二':
        return (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={[styles.textBold, { fontSize: 100 }]}>算力</Text>
            <Text style={{ color: '#fff', fontSize: 60 }}>Computing Power</Text>
          </View>
        )
      case '屏幕三':
        return (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={[styles.textBold, { fontSize: 100 }]}>深度学习</Text>
            <Text style={{ color: '#fff', fontSize: 60 }}>Deep Learning</Text>
          </View>
        )
      case '屏幕四':
        return (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={[styles.textBold, { fontSize: 100 }]}>网络</Text>
            <Text style={{ color: '#fff', fontSize: 60 }}>Network</Text>
          </View>
        )
      case '屏幕五':
        return (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={[styles.textBold, { fontSize: 100 }]}>智能</Text>
            <Text style={{ color: '#fff', fontSize: 60 }}>A.I</Text>
          </View>
        )
      case '屏幕六':
        return (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={[styles.textBold, { fontSize: 100 }]}>数据</Text>
            <Text style={{ color: '#fff', fontSize: 60 }}>Data</Text>
          </View>
        )
      case '屏幕七':
        return (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={[styles.textBold, { fontSize: 100 }]}>算法</Text>
            <Text style={{ color: '#fff', fontSize: 60 }}>Algorithm</Text>
          </View>
        )
      case '屏幕八':
        return (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={[styles.textBold, { fontSize: 100 }]}>大语言模型</Text>
            <Text style={{ color: '#fff', fontSize: 60 }}>Large Language Model</Text>
          </View>
        )
      default:
        return null
    }
  }
  return (
    <ImageBackground source={require('../assets/bg/vertical-bg.png')} resizeMode='cover' style={[styles.container]}>
      {
        getView(context.state.theme)
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
