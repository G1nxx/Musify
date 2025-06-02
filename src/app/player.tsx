import { MovingText } from '@/components/MovingText'
import { unknownArtistImageUri, unknownTrackImageUri } from '@/constants/images'
import { colors, fontSize, screenPadding } from '@/constants/tokens'
import { defaultStyles } from '@/styles'
import React from 'react'
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native'
import FastImage from 'react-native-fast-image'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useActiveTrack } from 'react-native-track-player'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { PlayerControls } from '@/components/PlayerControls'
import { PlayerProgressBar } from '@/components/PlayerProgressBar'
import { usePlayerBackground } from '@/hooks/usePlayerBackground'
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	runOnJS,
	withTiming,
	withSpring,
} from 'react-native-reanimated'
import { GestureDetector, Gesture } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import { interpolateColor, lightenColor } from '@/helpers/color'

const PlayerScreen = () => {
	const activeTrack = useActiveTrack()
	const { imageColors } = usePlayerBackground(activeTrack?.artwork ?? unknownTrackImageUri)
	const { top, bottom } = useSafeAreaInsets()
	const navigation = useNavigation()

	const translateY = useSharedValue(0)

	const panGesture = Gesture.Pan()
		.onUpdate((event) => {
			if (event.translationY > 0) {
				translateY.value = event.translationY
			}
		})
		.onEnd((event) => {
			if (event.translationY > 120) {
				translateY.value = withSpring(200)
				runOnJS(navigation.goBack)()
			} else {
				translateY.value = withSpring(0)
			}
		})

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ translateY: translateY.value }],
		borderTopLeftRadius: translateY.value > 10 ? 16 : 0,
		borderTopRightRadius: translateY.value > 10 ? 16 : 0,
		overflow: 'hidden',
		elevation: translateY.value > 10 ? 20 : 0,
	}))

	const isFavorite = true
	const toggleFavorite = () => {}

	if (!activeTrack) {
		return (
			<View style={[defaultStyles.container, { justifyContent: 'center' }]}>
				<ActivityIndicator color={colors.icon} />
			</View>
		)
	}

	return (
		<GestureDetector gesture={panGesture}>
			<Animated.View style={[{ flex: 1 }, animatedStyle]}>
				<LinearGradient
					style={{ flex: 1 }}
					colors={[
						imageColors?.lightVibrant || lightenColor(imageColors?.average || '#f8f8f8', 0.15),
						interpolateColor(imageColors?.average || '#f8f8f8', '#e0e0e0', 0.25),
						interpolateColor(imageColors?.average || '#f8f8f8', '#808080', 0.4),
						interpolateColor(imageColors?.average || '#f8f8f8', '#404040', 0.6),
						interpolateColor(imageColors?.average || '#f8f8f8', '#202020', 0.8),
						'#121212',
					]}
					locations={[0, 0.15, 0.35, 0.55, 0.75, 1]}
					start={{ x: 0.5, y: 0 }}
					end={{ x: 0.5, y: 1 }}
				>
					<View style={styles.overlayContainer}>
						<DismissPlayerSymbol />

						<View style={{ flex: 1, marginTop: top + 70, marginBottom: bottom }}>
							<View style={styles.artworkImageContainer}>
								<FastImage
									source={{
										uri: activeTrack.artwork ?? unknownArtistImageUri,
										priority: FastImage.priority.high,
									}}
									resizeMode="cover"
									style={styles.artworkImage}
								/>
							</View>

							<View style={{ flex: 1 }}>
								<View style={{ marginTop: 'auto', paddingBottom: 100 }}>
									<View style={{ height: 60 }}>
										<View
											style={{
												flexDirection: 'row',
												justifyContent: 'space-between',
												alignItems: 'center',
											}}
										>
											<View style={styles.trackTitleContainer}>
												<MovingText
													text={activeTrack.title ?? ''}
													animationThreshold={30}
													style={styles.trackTitleText}
													fontCoef={12}
												/>
											</View>
											<MaterialCommunityIcons
												name={isFavorite ? 'heart' : 'heart-outline'}
												size={20}
												color={isFavorite ? colors.primary : colors.icon}
												style={{ marginHorizontal: 14 }}
												onPress={toggleFavorite}
											/>
										</View>
										{activeTrack.artist && (
											<Text numberOfLines={1} style={[styles.trackArtistText, { marginTop: 6 }]}>
												{' '}
												{activeTrack.artist}{' '}
											</Text>
										)}
									</View>

									<PlayerProgressBar style={{ marginTop: 32 }} />
									<PlayerControls style={{ marginTop: 40 }} />
								</View>
							</View>
						</View>
					</View>
				</LinearGradient>
			</Animated.View>
		</GestureDetector>
	)
}

const DismissPlayerSymbol = () => {
	const { top } = useSafeAreaInsets()
	return (
		<View
			style={{
				position: 'absolute',
				top: top + 8,
				left: 0,
				right: 0,
				flexDirection: 'row',
				justifyContent: 'center',
			}}
		>
			<View
				accessible={false}
				style={{ width: 50, height: 8, borderRadius: 8, backgroundColor: '#ffffff', opacity: 0.7 }}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	overlayContainer: {
		...defaultStyles.container,
		paddingHorizontal: screenPadding.horizontal,
		backgroundColor: 'transparent',
		justifyContent: 'flex-end',
	},
	artworkImageContainer: {
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.44,
		shadowRadius: 11.0,
		elevation: 12,
		flexDirection: 'row',
		justifyContent: 'center',
		height: '45%',
	},
	artworkImage: {
		width: '100%',
		height: '100%',
		resizeMode: 'cover',
		borderRadius: 16,
	},
	trackTitleContainer: {
		flex: 1,
		overflow: 'hidden',
	},
	trackTitleText: {
		...defaultStyles.text,
		fontSize: 24,
		fontWeight: 'bold',
		color: '#fff',
	},
	trackArtistText: {
		...defaultStyles.text,
		fontSize: fontSize.base,
		opacity: 0.85,
		color: '#ddd',
		maxWidth: '90%',
	},
})

export default PlayerScreen
