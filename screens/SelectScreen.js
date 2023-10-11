import { StatusBar } from 'expo-status-bar'
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import * as ScreenOrientation from 'expo-screen-orientation'
import { useEffect, useState } from 'react'

// 使用本地存储
import AsyncStorage from '@react-native-async-storage/async-storage'

// 导航
import { useNavigation } from '@react-navigation/native'

// 背景模糊组件
import { BlurView } from 'expo-blur'

// 常量
import { STORAGE_KEY } from '../store/constant'

import { padding } from '../utils'

import { companyData as companies } from '../data/companies'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 30,
    paddingBottom: 50,
  },
  textBold: {
    fontFamily: 'HarmonyOS-Sans-Bold',
    color: 'white',
  },
  blurContainer: {
    width: 100,
    height: 100,
  },
})

const verticalCom = companies.filter(item => item.type === 'vertical')
const horizonCom = companies.filter(item => item.type === 'horizon')

export default function SelectScreen(props) {
  const navigation = useNavigation()
  // 第几步
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState('') // ''| '横向' | '竖向'
  const [screenName, setScreenName] = useState('')
  const labels = ['横向', '竖向']
  const [test, setTest] = useState(true)
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // 屏幕自动旋转
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT)
      setTest(true)
    })
    return unsubscribe
  }, [])

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((res) => {
      if (res) {
        JSON.parse(res).direction === '横向'
          ? navigation.navigate('Horizon')
          : navigation.navigate('Vertical')
      }
    })
  }, [])

  function handleNext() {
    if (!direction)
      return
    setStep(1)
  }

  function handleBack() {
    setScreenName('')
    setStep(0)
  }

  async function handleSave() {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ screenName, direction }))
      direction === '横向'
        ? navigation.navigate('Horizon')
        : navigation.navigate('Vertical')
      setTest(false)
    }
    catch (e) {
      throw new Error(e)
    }
  }

  return (
    <ImageBackground source={require('../assets/bg/horizon-bg.png')} resizeMode='cover' style={[styles.container]}>
      <View style={[styles.container]} onLayout={props.onLayoutRootView}>
        {/* fix slide 闪动 */}
        <View style={{ flex: 1, alignItems: 'center', maxWidth: 400, opacity: test ? 1 : 0 }}>
          {
            step === 0
              ? (<Text style={[styles.textBold, { fontSize: 30 }]}>请选择屏幕方向</Text>)
              : (<Text style={[styles.textBold, { fontSize: 30 }]}>请选择屏幕序号</Text>)
          }
          <View style={{ flexWrap: 'wrap', flexDirection: 'row', gap: 20, marginTop: 20, justifyContent: 'center' }}>
            {
              step === 0
                ? (labels.map((label, idx) => (
                  <TouchableOpacity key={`${idx}`} onPress={() => { setDirection(label) }}>
                    <View style={{ borderRadius: 2, overflow: 'hidden', backgroundColor: direction === label ? '#6d28d9' : undefined }} >
                      <BlurView intensity={direction === label ? 10 : 50} tint='light'>
                        <Text style={{ color: 'white', ...padding(10, 50), fontSize: 20 }}>{label}</Text>
                      </BlurView>
                    </View>
                  </TouchableOpacity>
                )))
                : (
                  direction === '横向'
                    ? (
                      horizonCom.map((com, idx) => (
                        <TouchableOpacity key={`${idx}`} onPress={() => { setScreenName(com.screenName) }}>
                          <View style={{ borderRadius: 2, overflow: 'hidden', backgroundColor: com.screenName === screenName ? '#6d28d9' : undefined }} >
                            <BlurView intensity={com.screenName === screenName ? 10 : 50} tint='light'>
                              <Text style={{ color: 'white', ...padding(10, 50), fontSize: 20 }}>{com.screenName}</Text>
                            </BlurView>
                          </View>
                        </TouchableOpacity>
                      ))
                    )
                    : (
                      verticalCom.map((com, idx) => (
                        <TouchableOpacity key={`${idx}`} onPress={() => { setScreenName(com.screenName) }}>
                          <View style={{ borderRadius: 2, overflow: 'hidden', backgroundColor: com.screenName === screenName ? '#6d28d9' : undefined }} >
                            <BlurView intensity={com.screenName === screenName ? 10 : 50} tint='light'>
                              <Text style={{ color: 'white', ...padding(10, 50), fontSize: 20 }}>{com.screenName}</Text>
                            </BlurView>
                          </View>
                        </TouchableOpacity>
                      ))
                    )
                )
            }
          </View>
        </View>
        {/* 下一步 */}
        <View style={{ opacity: test ? 1 : 0 }}>
          {
            (direction && step === 0)
              ? (
                <TouchableOpacity onPress={handleNext}>
                  <View style={{ borderRadius: 2, overflow: 'hidden' }}>
                    <BlurView intensity={50} tint='light'>
                      <Text style={{ color: 'white', ...padding(10, 42), fontSize: 20 }}>下一步</Text>
                    </BlurView>
                  </View>
                </TouchableOpacity>
              )
              : (
                <View style={{ flexWrap: 'wrap', flexDirection: 'row', gap: 20, marginTop: 20 }}>
                  <TouchableOpacity onPress={handleBack}>
                    <View style={{ borderRadius: 2, overflow: 'hidden' }}>
                      <BlurView intensity={50} tint='light'>
                        <Text style={{ color: 'white', ...padding(10, 42), fontSize: 20 }}>上一步</Text>
                      </BlurView>
                    </View>
                  </TouchableOpacity>
                  {
                    (step === 1 && screenName) && (
                      <TouchableOpacity onPress={handleSave}>
                        <View style={{ borderRadius: 2, overflow: 'hidden' }}>
                          <BlurView intensity={50} tint='light'>
                            <Text style={{ color: 'white', ...padding(10, 50), fontSize: 20 }}>保存</Text>
                          </BlurView>
                        </View>
                      </TouchableOpacity>)
                  }
                </View>
              )
          }
        </View>

        <StatusBar style='auto' hidden></StatusBar>
      </View>
    </ImageBackground>
  )
}
