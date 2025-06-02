import { TracksList } from '@/components/TracksList'
import { trackTitleFilter } from '@/helpers/filter'
import { useNavigationSearch } from '@/hooks/useNavigationSearch'
import { defaultStyles } from '@/styles'
import { useEffect, useMemo, useState } from 'react'
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native'
import FastImage from 'react-native-fast-image'
import { Album } from '@/helpers/types'
import { unknownTrackImageUri } from '@/constants/images'
import { useLocalSearchParams, useFocusEffect } from 'expo-router'
import { fetchAlbum } from '@/api/subscriptions'
import { Track } from 'react-native-track-player'
import { useCallback } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { interpolateColor, lightenColor } from '@/helpers/color'
import { usePlayerBackground } from '@/hooks/usePlayerBackground'

const AlbumScreen = () => {
	const params = useLocalSearchParams()
	const [album, setAlbum] = useState<Album>()
	const albumId = (JSON.parse(params.item as string) as Album).id

	const [tracks, setTracks] = useState<Track[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const search = useNavigationSearch({
		searchBarOptions: {
			placeholder: 'Find in songs',
		},
	})

	const refreshData = useCallback(() => {
		console.log('Refreshing album data...')
		loadAlbumData()
	}, [])

	const loadAlbumData = useCallback(async () => {
		if (!albumId) return

		try {
			setLoading(true)
			setError(null)
			const data = await fetchAlbum({ AlbumId: albumId })
			setTracks(data.tracks)
			setAlbum(data)
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Unknown error')
		} finally {
			setLoading(false)
		}
	}, [albumId])

	const { imageColors } = usePlayerBackground(album?.artwork ?? unknownTrackImageUri)

	useFocusEffect(
		useCallback(() => {
			loadAlbumData()
		}, [loadAlbumData]),
	)

	const filteredTracks = useMemo(() => {
		if (!search) return tracks.sort((a, b) => a.number - b.number)
		return tracks.filter(trackTitleFilter(search))
	}, [search, tracks])

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

	return (
		<View style={[defaultStyles.container, styles.container]}>
			<ScrollView
				contentInsetAdjustmentBehavior="automatic"
				style={{
					//paddingLeft: 16,
					paddingTop: 10,
					paddingBottom: 128,
				}}
			>
				{/* <View style={styles.header} /> */}
				<LinearGradient
					style={{ flex: 1 }}
					colors={[
						imageColors?.lightVibrant || lightenColor(imageColors?.average || '#f8f8f8', 0.15),
						interpolateColor(imageColors?.average || '#f8f8f8', '#e0e0e0', 0.2),
						interpolateColor(imageColors?.average || '#f8f8f8', '#b0b0b0', 0.35),
						interpolateColor(imageColors?.average || '#f8f8f8', '#808080', 0.5),
						interpolateColor(imageColors?.average || '#f8f8f8', '#606060', 0.65),
						interpolateColor(imageColors?.average || '#f8f8f8', '#404040', 0.75),
						interpolateColor(imageColors?.average || '#f8f8f8', '#282828', 0.85),
						'#181818',
						'#0a0a0a',
						'#000000',
					]}
					locations={[0, 0.15, 0.3, 0.4, 0.5, 0.55, 0.6, 0.75, 0.9, 1]}
					start={{ x: 0.5, y: 0 }}
					end={{ x: 0.5, y: 1 }}
				>
					<View
						style={{
							paddingLeft: 16,
						}}
					>
						<FastImage
							source={{
								uri: album?.artwork ? album.artwork : unknownTrackImageUri,
								priority: FastImage.priority.normal,
							}}
							style={styles.albumArtwork}
							resizeMode={FastImage.resizeMode.cover}
						/>
						<Text style={styles.albumTitle}>{album?.title}</Text>
					</View>
					<View
						style={{
							paddingLeft: 16,
						}}
					>
						<Text style={styles.artist}>{album?.subtitle}</Text>
						<Text style={styles.details}>
							{album?.type} • {album?.year}
						</Text>
					</View>
				</LinearGradient>
				{/* <Text style={styles.details}>Album • {album.releaseYear || 'Unknown'}</Text> */}
				<TracksList
					style={{
						paddingLeft: 16,
					}}
					tracks={filteredTracks}
					id=""
					showArtwork={false}
					scrollEnabled={false}
					contentContainerStyle={styles.tracksListContent}
				/>

				<View style={{ ...styles.footer, paddingLeft: 16 }}>
					<Text style={styles.footerText}>
						{album?.month} {album?.day}, {album?.year}
					</Text>
					<Text style={styles.footerText}>
						{album?.tracks.length} songs • {album?.length}
					</Text>

					<Text style={styles.footerTag}>{album?.subtitle}</Text>
				</View>
			</ScrollView>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		paddingTop: 10,
		backgroundColor: '#000000',
	},
	header: {
		alignItems: 'center',
		marginBottom: 20,
	},
	albumTitle: {
		color: '#ffffff',
		fontSize: 28,
		fontWeight: 'bold',
		textAlign: 'left',
		marginBottom: 18,
		lineHeight: 32,
	},
	albumArtwork: {
		width: '100%',
		aspectRatio: 1,
		maxHeight: 220,
		alignSelf: 'center',
		marginVertical: 20,
		shadowColor: '#000000',
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.3,
		shadowRadius: 6,
		elevation: 8,
	},
	albumSubtitle: {
		color: '#ffffff',
		fontSize: 20,
		marginTop: 10,
		textAlign: 'center',
	},
	artist: {
		color: '#aaaaaa',
		fontSize: 16,
		marginVertical: 5,
	},
	details: {
		color: '#aaaaaa',
		fontSize: 14,
		marginVertical: 5,
	},
	divider: {
		borderBottomColor: '#333333',
		borderBottomWidth: 1,
		marginVertical: 20,
	},
	tracksListContent: {
		paddingVertical: 4,
	},
	trackItem: {
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: '#222222',
	},
	trackTitle: {
		color: '#ffffff',
		fontSize: 16,
		fontWeight: '600',
	},
	trackArtist: {
		color: '#aaaaaa',
		fontSize: 14,
		marginTop: 4,
	},
	trackType: {
		color: '#666666',
		fontSize: 12,
		marginTop: 4,
	},
	footer: {
		marginTop: 6,
		paddingBottom: 158,
		paddingTop: 6,
	},
	footerText: {
		color: '#ffffff',
		fontSize: 16,
	},
	footerTag: {
		color: '#ffffff',
		fontSize: 26,
		marginTop: 5,
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

export default AlbumScreen
