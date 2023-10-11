import { StatusBar } from 'expo-status-bar'
import { BackHandler, Image, ImageBackground, StyleSheet, Text, View } from 'react-native'
import * as ScreenOrientation from 'expo-screen-orientation'
import { BlurView } from 'expo-blur'

import { useNavigation } from '@react-navigation/native'

import { useEffect } from 'react'

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

export default function Vertical(props) {
  const navigation = useNavigation()
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // 屏幕锁定横向
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT)
    })
    return unsubscribe
  }, [])

  const testImageUri = '../assets/companies/beiming/s-1.gif'
  // 返回键监听
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.navigate('Root')
      // 返回true不会冒泡
      return true
    })
    return () => backHandler.remove()
  }, [])

  return (
    <ImageBackground source={require('../assets/bg/vertical-bg.png')} resizeMode='cover' style={styles.container}>
      <View style={{ width: '90%', height: '85%', padding: 2 }}>
        <BlurView intensity={20} style={{ flex: 1 }}>
          <View style={{ flex: 1, paddingVertical: '10%', paddingHorizontal: '2%' }}>
            <View style={{ flex: 1 }}>
              <View style={{ alignSelf: 'flex-start', paddingBottom: 3, marginLeft: 82, marginBottom: 4, borderBottomWidth: 4, borderStyle: 'dotted', borderBottomColor: '#fff' }}>
                <Text style={[styles.textBold, { fontSize: 20, textShadowRadius: 4, textShadowColor: '#fff' }]}>某某公司</Text>
              </View>
              <ImageBackground source={require('../assets/bg/v-border.png')} resizeMode='contain' style={{ flex: 1, paddingVertical: '6%', paddingLeft: '13%', paddingRight: '8%' }}>
                <View style={{ flex: 1 }}>
                  <View style={{ marginLeft: 14 }}>
                    <Text style={[styles.textBold, { fontSize: 16 }]}>产品标题</Text>
                  </View>
                  <View style={{ flexWrap: 'nowrap', flexDirection: 'row', gap: 10, marginTop: 4 }}>
                    <View style={{ flex: 1, aspectRatio: 1, backgroundColor: 'red', padding: 1, borderRadius: 5, overflow: 'hidden' }}>
                      <View style={{ flex: 1, borderRadius: 4, overflow: 'hidden' }}>
                        <Image source={require(testImageUri)} resizeMode='cover' style={{ width: '100%', height: '100%' }}></Image>
                      </View>
                    </View>
                    <View style={{ flex: 1, aspectRatio: 1, backgroundColor: 'red', padding: 1, borderRadius: 5, overflow: 'hidden' }}>
                      <View style={{ flex: 1, borderRadius: 4, overflow: 'hidden' }}>
                        <Image source={require(testImageUri)} resizeMode='cover' style={{ width: '100%', height: '100%' }}></Image>
                      </View>
                    </View>
                    <View style={{ flex: 1, aspectRatio: 1, backgroundColor: 'red', padding: 1, borderRadius: 5, overflow: 'hidden' }}>
                      <View style={{ flex: 1, borderRadius: 4, overflow: 'hidden' }}>
                        <Image source={require(testImageUri)} resizeMode='cover' style={{ width: '100%', height: '100%' }}></Image>
                      </View>
                    </View>
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
      </View>
      <StatusBar style='auto' hidden></StatusBar>
    </ImageBackground>
  )
}
