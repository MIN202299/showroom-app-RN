import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { useCallback, useEffect, useRef, useState } from 'react'

import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import AsyncStorage from '@react-native-async-storage/async-storage'

// 自定义字体
import { io } from 'socket.io-client'
import { SOCKET_URL, STORAGE_KEY, Theme } from './store/constant'
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
    theme: Theme.DEFAULT,
    config: null,
    connected: false,
    err: null,
  })

  const socket = useRef()

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((res) => {
      if (res) {
        console.log('res', JSON.parse(res))
        setState({ ...state, config: JSON.parse(res) })
      }
    })
    socket.current = io(SOCKET_URL, {
      timeout: 10000,
      transports: ['websocket'],
    })

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
    <AppContext.Provider value={{ state, setGlobalContext: setState }}>
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
