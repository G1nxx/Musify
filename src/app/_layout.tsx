import { useSetupTrackPlayer } from '@/hooks/useSetupTrackPlayer'
import { Stack, useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { SplashScreen } from 'expo-router'
import { useCallback } from 'react'
import { useLogTrackPalyerState } from '@/hooks/useLogTrackPlayerState'
import { Platform, View } from 'react-native'
import {
	Directions,
	Gesture,
	GestureDetector,
	GestureHandlerRootView,
} from 'react-native-gesture-handler'
import { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import Animated from 'react-native-reanimated'

SplashScreen.preventAutoHideAsync()

const App = () => {
	const handleTrackPlayerLoaded = useCallback(() => {
		SplashScreen.hideAsync()
	}, [])

	useSetupTrackPlayer({
		onLoad: handleTrackPlayerLoaded,
	})

	useLogTrackPalyerState()

	return (
		<SafeAreaProvider>
			<GestureHandlerRootView style={{ flex: 1 }}>
				<RootNavigation />
				<StatusBar style="auto" />
			</GestureHandlerRootView>
		</SafeAreaProvider>
	)
}

const PlayerScreenWrapper = () => {
	const router = useRouter()
	const translateY = useSharedValue(0)
	const opacity = useSharedValue(1)

	const flingGesture = Gesture.Pan()
		.onUpdate((event) => {
			if (event.translationY > 0) {
				translateY.value = event.translationY
				opacity.value = 1 - event.translationY / 300
			}
		})
		.onEnd((event) => {
			if (event.translationY > 100) {
				translateY.value = withTiming(500, { duration: 200 })
				opacity.value = withTiming(0, { duration: 200 }, () => {
					router.back()
				})
			} else {
				translateY.value = withTiming(0, { duration: 200 })
				opacity.value = withTiming(1, { duration: 200 })
			}
		})

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ translateY: translateY.value }],
		opacity: opacity.value,
		flex: 1,
	}))

	return (
		<GestureDetector gesture={flingGesture}>
			<Animated.View style={animatedStyle}>
				<Stack.Screen
					name="player"
					options={{
						...Platform.select({
							ios: {
								presentation: 'card',
							},
							android: {
								animation: 'slide_from_bottom',
								cardStyle: { backgroundColor: 'transparent' },
							},
						}),
						headerShown: false,
						gestureEnabled: true,
						gestureDirection: 'vertical',
						animationDuration: 400,
					}}
				/>
			</Animated.View>
		</GestureDetector>
	)
}

const RootNavigation = () => {
	return (
		<Stack>
			<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
			<Stack.Screen
				name="player"
				options={{
					...Platform.select({
						ios: {
							presentation: 'modal',
						},
						android: {
							animation: 'slide_from_bottom',
							cardStyle: { backgroundColor: 'transparent' },
						},
					}),
					headerShown: false,
					gestureEnabled: true,
					gestureDirection: 'vertical',
					animationDuration: 400,
				}}
			/>
		</Stack>
	)
}

export default App
