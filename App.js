import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { useCallback } from 'react'

import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

// 自定义字体
import { setCustomText } from './utils'

import SelectScreen from './screens/SelectScreen'
import Horizon from './screens/Horizon'
import Vertical from './screens/Vertical'

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

  if (!fontsLoaded && !fontError)
    return null

  return (
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
  )
}
