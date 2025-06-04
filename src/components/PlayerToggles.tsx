import { colors } from '@/constants/tokens'
import { useTrackPlayerRepeatMode } from '@/hooks/useTrackPlayerRepeatMode'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { ComponentProps, useEffect, useState } from 'react'
import TrackPlayer, {
	RepeatMode,
	State,
	Track,
	usePlaybackState,
	useProgress,
} from 'react-native-track-player'
import { match } from 'ts-pattern'

type IconProps = Omit<ComponentProps<typeof MaterialCommunityIcons>, 'name'>
type IconName = ComponentProps<typeof MaterialCommunityIcons>['name']

const repeatOrder = [RepeatMode.Off, RepeatMode.Queue, RepeatMode.Track] as const

export const PlayerRepeatToggle = ({ ...iconProps }: IconProps) => {
	const { repeatMode, changeRepeatMode } = useTrackPlayerRepeatMode()

	const toggleRepeatMode = () => {
		if (repeatMode == null) return

		const currentIndex = repeatOrder.indexOf(repeatMode)
		const nextIndex = (currentIndex + 1) % repeatOrder.length

		changeRepeatMode(repeatOrder[nextIndex])
	}

	const icon = match(repeatMode)
		.returnType<IconName>()
		.with(RepeatMode.Off, () => 'repeat-off')
		.with(RepeatMode.Queue, () => 'repeat')
		.with(RepeatMode.Track, () => 'repeat-once')
		.otherwise(() => 'repeat-off')

	return (
		<MaterialCommunityIcons
			name={icon}
			onPress={toggleRepeatMode}
			color={repeatMode != RepeatMode.Off ? '#1DB954' : colors.icon}
			{...iconProps}
		/>
	)
}

export const PlayerShuffleToggle = ({ ...iconProps }: IconProps) => {
	const [isShuffleEnabled, setIsShuffleEnabled] = useState(false)
	const [originalQueue, setOriginalQueue] = useState<Track[]>([])

	useEffect(() => {
		const loadInitialState = async () => {
			const queue = await TrackPlayer.getQueue()
			setOriginalQueue([...queue])
		}
		loadInitialState()
	}, [])

	const toggleShuffle = async () => {
		try {
			const queue = await TrackPlayer.getQueue()
			const currentTrackIndex = await TrackPlayer.getCurrentTrack()

			if (!isShuffleEnabled) {
				const upcomingTracks = queue.slice((currentTrackIndex || 0) + 1)

				const newQueue = [...upcomingTracks].sort(() => Math.random() - 0.5)

				await TrackPlayer.removeUpcomingTracks()
				await TrackPlayer.add(newQueue)

				setIsShuffleEnabled(true)
			} else {
				const newQueue = originalQueue.slice((currentTrackIndex || 0) + 1)
				await TrackPlayer.removeUpcomingTracks()
				await TrackPlayer.add(newQueue)

				setIsShuffleEnabled(false)
			}
		} catch (error) {
			console.error('Error toggling shuffle:', error)
		}
	}

	return (
		<MaterialCommunityIcons
			name={isShuffleEnabled ? 'shuffle-variant' : 'shuffle'}
			onPress={toggleShuffle}
			color={isShuffleEnabled ? '#1DB954' : colors.icon}
			{...iconProps}
		/>
	)
}
