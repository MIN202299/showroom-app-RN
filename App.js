import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import AsyncStorage from '@react-native-async-storage/async-storage'

// 自定义字体
import { io } from 'socket.io-client'
import { Keyboard } from 'react-native'
import { DEFAULT_URL, SOCKET_URL, STORAGE_KEY, ThemeEnum } from './store/constant'
import { setCustomText } from './utils'

import SelectScreen from './screens/SelectScreen'
import Horizon from './screens/Horizon'
import Vertical from './screens/Vertical'

import { AppContext } from './store'

SplashScreen.preventAutoHideAsync()

const Stack = createNativeStackNavigator()

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    'HarmonyOS-Sans': require('./assets/font/HarmonyOS_Sans_SC_Regular.ttf'),
    'HarmonyOS-Sans-Bold': require('./assets/font/HarmonyOS_Sans_SC_Bold.ttf'),
  })

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      setCustomText()
      await SplashScreen.hideAsync()
    }
  }, [fontsLoaded, fontError])

  const [state, setState] = useState({
    theme: '默认',
    config: null,
    connected: false,
    err: null,
  })

  const [allThemesMap, setAllThemesMap] = useState({})

  const currentTheme = useMemo(() => {
    if (!state.config || !allThemesMap || !state.theme)
      return []
    return allThemesMap[state.theme] || []
  }, [state, allThemesMap])

  // useEffect(() => {
  //   console.log('currentTheme', currentTheme)
  // }, [currentTheme])

  const socket = useRef()

  async function getAllConfig() {
    try {
      const res = await fetch(`${DEFAULT_URL}/config/getAll`, {
        method: 'GET',
      })
      const data = await res.json()

      if (data.code === 200) {
        const _allThemes = data.data.filter(item => item.themeType === ThemeEnum.screen_8)
        const _allThemesMap = _allThemes.reduce((result, current) => {
          const _detail = JSON.parse(current.detail)
          result[current.themeName] = _detail.map(item => Object.assign(item, { themeName: current.themeName }))
          return result
        }, {})
        setAllThemesMap(_allThemesMap)
        // console.log('_allThemesMap', _allThemesMap['链城'])
      }
    }
    catch (err) {
      console.error('查询失败', err)
    }
  }

  useEffect(() => {
    getAllConfig()
  }, [])

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((res) => {
      if (res) {
        console.log('res', JSON.parse(res))
        setState({ ...state, config: JSON.parse(res) })
      }
    })
    socket.current = io(SOCKET_URL, {
      timeout: 5000,
    })
    // 隐藏虚拟键盘
    Keyboard.dismiss()
    return () => {
      socket.current.disconnect()
    }
  }, [])

  useEffect(() => {
    socket.current.on('error', (err) => {
      console.log('socket 连接失败', err)
      setState({ ...state, err: 'socket 连接出现错误' })
    })
    socket.current.on('connect', () => {
      console.log('socket 连接成功')
      console.log('state', state)
      setState({ ...state, connected: true })
    })
    socket.current.on('disconnect', () => {
      console.log('socket 连接断开')
      setState({ ...state, connected: false })
    })
    socket.current.on('server', (res) => {
      setState({ ...state, theme: res })
    })
    return () => {
      socket.current.off()
    }
  }, [state])

  if (!fontsLoaded && !fontError)
    return null

  return (
    <AppContext.Provider value={{ state, setGlobalContext: setState, currentTheme }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{
          headerShown: false,
          animationTypeForReplace: 'push',
          animation: 'slide_from_right',
        }}>
          <Stack.Screen name="Root" options={{
            animationEnable: false,
          }}>
            {() => <SelectScreen onLayoutRootView={onLayoutRootView} />}
          </Stack.Screen>
          <Stack.Screen name="Horizon" >
            {() => <Horizon />}
          </Stack.Screen>
          <Stack.Screen name="Vertical" >
            {() => <Vertical />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </AppContext.Provider>
  )
}
