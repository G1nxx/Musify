import { TouchableOpacity, View, ViewProps, Text, StyleSheet } from 'react-native'
import { Track, useIsPlaying } from 'react-native-track-player'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { colors } from '@/constants/tokens'
import TrackPlayer from 'react-native-track-player'
import { PlayerShuffleToggle } from './PlayerToggles'
import { FollowButton } from './FollowButton'

type QueueControlsProps = {
	tracks: Track[]
	contentId: string
	type: string
} & ViewProps

export const QueueControls = ({
	tracks,
	style,
	contentId,
	type,
	...viewProps
}: QueueControlsProps) => {
	const { playing } = useIsPlaying()
	const handlePlay = async () => {
		await TrackPlayer.setQueue(tracks)
		await TrackPlayer.play()
	}
	return (
		<View style={[styles.container, style]} {...viewProps}>
			<View
				style={
					{
						//paddingRight: 50
					}
				}
			>
				<FollowButton contentId={contentId} contentType={type} />
			</View>

			{/* Shuffle toggle */}
			<PlayerShuffleToggle style={styles.shuffleButton} size={30} />

			{/* Play button */}
			<TouchableOpacity
				style={styles.playButton}
				activeOpacity={0.7}
				onPress={playing ? TrackPlayer.pause : handlePlay}
			>
				<MaterialCommunityIcons name={playing ? 'pause' : 'play'} size={30} color="black" />
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-end',
		paddingRight: 16,
		gap: 12,
	},
	playButton: {
		width: 64,
		height: 64,
		borderRadius: 32,
		backgroundColor: colors.primary,
		justifyContent: 'center',
		alignItems: 'center',
		elevation: 3,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.3,
		shadowRadius: 3,
	},
	shuffleButton: {
		justifyContent: 'center',
		alignItems: 'center',
	},
})
