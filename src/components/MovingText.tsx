import { useEffect } from 'react'
import { TextStyle } from 'react-native'
import Animated, {
	StyleProps,
	useAnimatedStyle,
	useSharedValue,
	withDelay,
	withRepeat,
	withTiming,
	Easing,
	cancelAnimation,
} from 'react-native-reanimated'

export type MovingTextProps = {
	text: string
	animationThreshold: number
	style?: StyleProps
	fontCoef: number
}

export const MovingText = ({ text, animationThreshold, style, fontCoef }: MovingTextProps) => {
	const translateX = useSharedValue(0)
	const shouldAnimate = text.length >= animationThreshold

	const textWidth = text.length * fontCoef

	useEffect(() => {
		if (!shouldAnimate) return

		translateX.value = withDelay(
			1000,
			withRepeat(
				withTiming(-textWidth, {
					duration: 7500,
					easing: Easing.linear,
				}),
				-1,
				false,
			),
		)

		return () => {
			cancelAnimation(translateX)
			translateX.value = 0
		}
	}, [translateX, text, animationThreshold, shouldAnimate, textWidth])

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{ translateX: translateX.value }],
		}
	})

	return (
		<Animated.Text
			numberOfLines={1}
			style={[
				style as TextStyle,
				animatedStyle,
				shouldAnimate && {
					width: 9999, // preventing the ellipsis from appearing
					paddingHorizontal: 16, //avoid the initial character being barely visible
				},
			]}
		>
			{text}
			{' '.repeat(fontCoef)}
			{shouldAnimate ? text : ''}
		</Animated.Text>
	)
}
