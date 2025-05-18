import { FlatList, FlatListProps, View } from 'react-native'
import { TrackListItem } from '@/components/TrackListItem'
import { utilsStyles } from '@/styles'
import TrackPlayer, { Track } from 'react-native-track-player'

export type TracksListProps = Partial<FlatListProps<Track>> & {
	tracks: Track[]
}

const ItemDivider = () => {
	return (
		<View
			style={{
				...utilsStyles.itemSeparator,
				marginVertical: 9,
				marginLeft: 60,
			}}
		/>
	)
}

export const TracksList = ({ tracks, ...flatlistProps }: TracksListProps) => {
	const handleTrackSelect = async (track: Track) => {
		// console.log(track)
		await TrackPlayer.load(track)
	}

	return (
		<FlatList
			data={tracks}
			ItemSeparatorComponent={ItemDivider}
			renderItem={({ item: track }) => (
				<TrackListItem track={track} onTrackSelect={handleTrackSelect} />
			)}
		/>
	)
}
