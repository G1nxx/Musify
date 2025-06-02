import React, { useRef } from 'react'
import { FlatList, FlatListProps, View, Text } from 'react-native'
import { TrackListItem } from '@/components/TrackListItem'
import { utilsStyles } from '@/styles'
import TrackPlayer, { Track } from 'react-native-track-player'
import FastImage from 'react-native-fast-image'
import { unknownTrackImageUri } from '@/constants/images'
import { useQueue } from '@/store/queue'

export type TracksListProps = Partial<FlatListProps<Track>> & {
	id: string
	tracks: Track[]
	showArtwork?: boolean
	tracksToShow?: number
}

const ItemDivider = () => (
	<View
		style={{
			...utilsStyles.itemSeparator,
			marginVertical: 9,
			marginLeft: 60,
		}}
	/>
)

export const TracksList = ({
	id,
	tracks,
	showArtwork,
	tracksToShow,
	...flatlistProps
}: TracksListProps) => {
	const queueOffset = useRef(0)
	const { activeQueueId, setActiveQueueId } = useQueue()

	// const handleTrackSelect = async (track: Track) => {
	// 	const currentTrack = await TrackPlayer.getActiveTrack()
	// 	if (currentTrack?.url === track.url) return
	// 	await TrackPlayer.load(track)
	// }

	const handleTrackSelect = async (selectedTrack: Track) => {
		const trackIndex = tracks.findIndex((track) => track.url === selectedTrack.url)

		if (trackIndex === -1) return

		const isChangingQueue = id !== activeQueueId

		//if (isChangingQueue) {
		const beforeTracks = tracks.slice(0, trackIndex)
		const afterTracks = tracks.slice(trackIndex + 1)

		await TrackPlayer.reset()

		// we construct the new queue
		await TrackPlayer.add(selectedTrack)
		await TrackPlayer.add(afterTracks)
		await TrackPlayer.add(beforeTracks)

		await TrackPlayer.play()

		queueOffset.current = trackIndex
		setActiveQueueId(id)
		// } else {
		// 	const nextTrackIndex =
		// 		trackIndex - queueOffset.current < 0
		// 			? tracks.length + trackIndex - queueOffset.current
		// 			: trackIndex - queueOffset.current

		// 	await TrackPlayer.skip(nextTrackIndex)
		// 	TrackPlayer.play()
		// }
	}

	return (
		<FlatList
			data={tracksToShow ? tracks.slice(0, tracksToShow) : tracks}
			keyExtractor={(item) => item.id ?? item.url}
			ListFooterComponent={ItemDivider}
			ItemSeparatorComponent={ItemDivider}
			ListEmptyComponent={
				<View style={{ alignItems: 'center', marginTop: 40 }}>
					<Text style={utilsStyles.emptyContentText}>No tracks found</Text>
					<FastImage
						source={{ uri: unknownTrackImageUri, priority: FastImage.priority.normal }}
						style={utilsStyles.emptyContentImage}
						resizeMode={FastImage.resizeMode.contain}
					/>
				</View>
			}
			renderItem={({ item: track }) => (
				<TrackListItem
					track={track}
					onTrackSelect={handleTrackSelect}
					showArtwork={showArtwork ?? true}
				/>
			)}
			{...flatlistProps}
		/>
	)
}
