import React from 'react'
import { TouchableOpacity, View, ViewStyle } from 'react-native'
import TrackPlayer, { useIsPlaying } from 'react-native-track-player'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { colors } from '@/constants/tokens'

type PlayerControlsProps = {
	style?: ViewStyle
}

type PlayerButtonProps = {
	style?: ViewStyle
	iconSize?: number
}

export const PlayPauseButton = ({ style, iconSize }: PlayerButtonProps) => {
	const { playing } = useIsPlaying()

	return (
		<View style={[{ height: iconSize }, style]}>
			<TouchableOpacity
				activeOpacity={0.85}
				onPress={playing ? TrackPlayer.pause : TrackPlayer.play}
			>
				<MaterialCommunityIcons
					name={playing ? 'pause' : 'play'}
					size={iconSize}
					color={colors.text}
				/>
			</TouchableOpacity>
		</View>
	)
}

export const SkipToNextButton = ({ iconSize = 30 }: PlayerButtonProps) => {
	return (
		<TouchableOpacity activeOpacity={0.7} onPress={() => TrackPlayer.skipToNext()}>
			<MaterialCommunityIcons name={'skip-forward'} size={iconSize} color={colors.text} />
		</TouchableOpacity>
	)
}

export const SkipToPreviousButton = ({ iconSize = 30 }: PlayerButtonProps) => {
	return (
		<TouchableOpacity activeOpacity={0.7} onPress={() => TrackPlayer.skipToPrevious()}>
			<MaterialCommunityIcons name={'skip-backward'} size={iconSize} color={colors.text} />
		</TouchableOpacity>
	)
}
