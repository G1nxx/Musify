import { ReleasesList } from '@/components/ReleasesList'
import { releaseTitleFilter } from '@/helpers/filter'
import { useNavigationSearch } from '@/hooks/useNavigationSearch'
import { defaultStyles } from '@/styles'
import { useEffect, useMemo, useState } from 'react'
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native'
import FastImage from 'react-native-fast-image'
import { Album, Artist, Playlist } from '@/helpers/types'
import { unknownTrackImageUri } from '@/constants/images'
import { useLocalSearchParams, useFocusEffect, router } from 'expo-router'
import { fetchArtist } from '@/api/subscriptions'
import { useCallback } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { usePlayerBackground } from '@/hooks/usePlayerBackground'
import { TracksList } from '@/components/TracksList'
import { interpolateColor, lightenColor } from '@/helpers/color'

const ArtistScreen = () => {
	const params = useLocalSearchParams()
	const [artist, setArtist] = useState<Artist>()
	const artistId = (JSON.parse(params.item as string) as Artist).id

	const [releases, setReleases] = useState<Album[]>([])
	const [attached, setAttached] = useState<Playlist>()
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const search = useNavigationSearch({
		searchBarOptions: {
			placeholder: 'Find in songs',
		},
	})

	const refreshData = useCallback(() => {
		console.log('Refreshing artist data...')
		loadArtistData()
	}, [])

	const loadArtistData = useCallback(async () => {
		if (!artistId) return

		try {
			setLoading(true)
			setError(null)
			const data = await fetchArtist({ ArtistId: artistId })
			setReleases(data.releases)
			setAttached(data.attached)
			setArtist(data)
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Unknown error')
		} finally {
			setLoading(false)
		}
	}, [artistId])

	const { imageColors } = usePlayerBackground(artist?.artwork ?? unknownTrackImageUri)

	useFocusEffect(
		useCallback(() => {
			loadArtistData()
		}, [loadArtistData]),
	)

	const filteredReleases = useMemo(() => {
		if (!search) {
			return [...releases].sort((a, b) => {
				const aSaves = parseInt(a.saves || '0', 10)
				const bSaves = parseInt(b.saves || '0', 10)

				if (aSaves !== bSaves) {
					return bSaves - aSaves
				}

				if (!a.saves) return 1
				if (!b.saves) return -1

				return 0
			})
		}
		return releases.filter(releaseTitleFilter(search))
	}, [search, releases])

	if (loading) {
		return (
			<View style={[defaultStyles.container, styles.loadingContainer]}>
				<ActivityIndicator size="large" color="#ffffff" />
			</View>
		)
	}

	if (error) {
		return (
			<View style={[defaultStyles.container, styles.errorContainer]}>
				<Text style={styles.errorText}>{error}</Text>
			</View>
		)
	}
	const handleReleasePress = (item: Album) => {
		router.navigate({
			pathname: '/(tabs)/album',
			params: { item: JSON.stringify(item), type: 'push' },
		})

		console.log('Pressed:', item)
	}

	return (
		<View style={styles.container}>
			<ScrollView contentContainerStyle={styles.scrollContent}>
				<LinearGradient
					style={{ flex: 1 }}
					colors={[
						imageColors?.lightVibrant || lightenColor(imageColors?.average || '#f8f8f8', 0.15),
						interpolateColor(imageColors?.dominant || '#f8f8f8', '#e0e0e0', 0.2),
						interpolateColor(imageColors?.average || '#f8f8f8', '#b0b0b0', 0.35),
						interpolateColor(imageColors?.average || '#f8f8f8', '#808080', 0.5),
						interpolateColor(imageColors?.average || '#f8f8f8', '#606060', 0.65),
						interpolateColor(imageColors?.average || '#f8f8f8', '#404040', 0.75),
						interpolateColor(imageColors?.average || '#f8f8f8', '#282828', 0.85),
						'#181818',
						'#0a0a0a',
						'#000000',
					]}
					locations={[0, 0.03, 0.07, 0.1, 0.15, 0.2, 0.25, 0.3, 0.4, 1]}
					start={{ x: 0.5, y: 0 }}
					end={{ x: 0.5, y: 1 }}
				>
					<View style={styles.artworkWrapper}>
						<FastImage
							source={{ uri: artist?.artwork || unknownTrackImageUri }}
							style={styles.artistArtwork}
							resizeMode="cover"
						/>
					</View>

					<View style={styles.artistHeader}>
						<LinearGradient
							colors={['rgba(0,0,0,0.8)', 'transparent']}
							style={styles.headerGradient}
						/>
						<Text style={styles.artistTitle}>{artist?.title}</Text>
					</View>

					<View style={styles.artistHeader}>
						<Text style={styles.sectionTitle}>Popular</Text>

						<TracksList
							// style={{
							// 	paddingLeft: 16,
							// }}
							tracks={attached?.tracks ?? []}
							id=""
							showArtwork={true}
							tracksToShow={5}
							scrollEnabled={false}
							contentContainerStyle={styles.tracksListContent}
						/>

						<Text style={styles.sectionTitle}>Releases</Text>

						<ReleasesList items={releases} scrollEnabled={false} onItemPress={handleReleasePress} />
					</View>
				</LinearGradient>
			</ScrollView>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#000000',
	},
	scrollContent: {
		paddingBottom: 100,
	},
	artistHeader: {
		paddingHorizontal: 20,
		paddingTop: 8,
		paddingBottom: 20,
	},
	artistArtwork: {
		width: '100%',
		aspectRatio: 1,
		alignSelf: 'center',
		borderRadius: 4,
		marginBottom: 24,
	},
	artistTitle: {
		color: '#ffffff',
		fontSize: 36,
		fontWeight: 'bold',
		paddingBottom: 12,
	},
	artistSubtitle: {
		color: '#b3b3b3',
		fontSize: 14,
		textTransform: 'uppercase',
		letterSpacing: 1,
		marginBottom: 8,
	},
	tracksListContent: {
		paddingVertical: 4,
	},
	statsContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 16,
	},
	statsText: {
		color: '#b3b3b3',
		fontSize: 12,
		marginRight: 16,
	},
	actionButtons: {
		flexDirection: 'row',
		marginBottom: 24,
	},
	playButton: {
		backgroundColor: '#1DB954',
		borderRadius: 50,
		paddingVertical: 12,
		paddingHorizontal: 32,
		marginRight: 16,
	},
	playButtonText: {
		color: '#000',
		fontWeight: 'bold',
		fontSize: 14,
		letterSpacing: 1,
	},
	followButton: {
		borderColor: '#b3b3b3',
		borderWidth: 1,
		borderRadius: 50,
		paddingVertical: 12,
		paddingHorizontal: 24,
	},
	followButtonText: {
		color: '#fff',
		fontWeight: 'bold',
		fontSize: 14,
		letterSpacing: 1,
	},
	sectionTitle: {
		color: '#fff',
		fontSize: 26,
		fontWeight: 'bold',
		marginBottom: 16,
	},
	artworkWrapper: {
		height: 350, // Фиксированная высота изображения
		width: '100%',
		zIndex: 0,
	},
	headerGradient: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		height: 120,
		zIndex: -1,
	},
	releasesItem: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 8,
		paddingHorizontal: 20,
	},
	releasesNumber: {
		color: '#b3b3b3',
		width: 30,
		fontSize: 16,
	},
	releasesInfo: {
		flex: 1,
		marginLeft: 12,
	},
	releasesTitle: {
		color: '#fff',
		fontSize: 16,
		marginBottom: 4,
	},
	releasesDetails: {
		color: '#b3b3b3',
		fontSize: 14,
	},
	releasesDuration: {
		color: '#b3b3b3',
		fontSize: 14,
		width: 50,
		textAlign: 'right',
	},
	popularSection: {
		marginTop: 32,
	},
	gradientBackground: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		height: 300,
		zIndex: -1,
	},
	loadingContainer: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	errorContainer: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	errorText: {
		color: '#ff0000',
		fontSize: 16,
	},
})

export default ArtistScreen
