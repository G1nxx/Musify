import { TracksList } from '@/components/TracksList'
import { trackTitleFilter } from '@/helpers/filter'
import { useNavigationSearch } from '@/hooks/useNavigationSearch'
import { defaultStyles } from '@/styles'
import { useMemo } from 'react'
import { View } from 'react-native'
import Library from '@/assets/data/tracks.json'

const SongsScreen = () => {
	const search = useNavigationSearch({
		searchBarOptions: {
			placeholder: 'Find in songs',
		},
	})

	const filteredTarcks = useMemo(() => {
		if (!search) return Library

		return Library.filter(trackTitleFilter(search))
	}, [search])

	return (
		<View style={defaultStyles.container}>
			<View
				style={{
					paddingLeft: 16,
					paddingTop: 10,
					paddingBottom: 128,
				}}
			>
				<TracksList tracks={filteredTarcks} scrollEnabled={false} />
			</View>
		</View>
	)
}

export default SongsScreen
