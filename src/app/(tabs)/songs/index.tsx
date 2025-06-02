import { TracksList } from '@/components/TracksList'
import { trackTitleFilter } from '@/helpers/filter'
import { useNavigationSearch } from '@/hooks/useNavigationSearch'
import { defaultStyles } from '@/styles'
import { useMemo } from 'react'
import { ScrollView, View } from 'react-native'
import { useTracks } from '@/store/library'

const SongsScreen = () => {
	const search = useNavigationSearch({
		searchBarOptions: {
			placeholder: 'Find in songs',
		},
	})

	const tracks = useTracks()

	const filteredTarcks = useMemo(() => {
		if (!search) return tracks

		return tracks.filter(trackTitleFilter(search))
	}, [search])

	return (
		<View style={{ ...defaultStyles.container, paddingBottom: 128 }}>
			<ScrollView
				contentInsetAdjustmentBehavior="automatic"
				style={{
					paddingLeft: 16,
					paddingTop: 10,
				}}
			>
				<TracksList tracks={filteredTarcks} scrollEnabled={false} />
			</ScrollView>
		</View>
	)
}

export default SongsScreen
