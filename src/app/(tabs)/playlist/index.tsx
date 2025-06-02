import { TracksList } from '@/components/TracksList'
import { trackTitleFilter } from '@/helpers/filter'
import { useNavigationSearch } from '@/hooks/useNavigationSearch'
import { defaultStyles } from '@/styles'
import { useEffect, useMemo, useState } from 'react'
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native'
import FastImage from 'react-native-fast-image'
import { Playlist } from '@/helpers/types'
import { unknownTrackImageUri } from '@/constants/images'
import { useLocalSearchParams, useFocusEffect } from 'expo-router'
import { fetchPlaylist } from '@/api/subscriptions'
import { Track } from 'react-native-track-player'
import { useCallback } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { interpolateColor, lightenColor } from '@/helpers/color'
import { usePlayerBackground } from '@/hooks/usePlayerBackground'

const PlaylistScreen = () => {
	const params = useLocalSearchParams()
	const [playlist, setPlaylist] = useState<Playlist>()
	const playlistId = (JSON.parse(params.item as string) as Playlist).id

	const [tracks, setTracks] = useState<Track[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const search = useNavigationSearch({
		searchBarOptions: {
			placeholder: 'Find in songs',
		},
	})

	const refreshData = useCallback(() => {
		console.log('Refreshing playlist data...')
		loadPlaylistData()
	}, [])

	const loadPlaylistData = useCallback(async () => {
		if (!playlistId) return

		try {
			setLoading(true)
			setError(null)
			const data = await fetchPlaylist({ PlaylistId: playlistId })
			setTracks(data.tracks)
			setPlaylist(data)
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Unknown error')
		} finally {
			setLoading(false)
		}
	}, [playlistId])

	const { imageColors } = usePlayerBackground(playlist?.artwork ?? unknownTrackImageUri)

	useFocusEffect(
		useCallback(() => {
			loadPlaylistData()
		}, [loadPlaylistData]),
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
								uri: playlist?.artwork ? playlist.artwork : unknownTrackImageUri,
								priority: FastImage.priority.normal,
							}}
							style={styles.playlistArtwork}
							resizeMode={FastImage.resizeMode.cover}
						/>
						<Text style={styles.description}>{playlist?.description}</Text>
						{playlist?.attachedTo == '0' && (
							<Text style={styles.playlistTitle}>{playlist?.title}</Text>
						)}
					</View>
					<View
						style={{
							paddingLeft: 16,
						}}
					>
						<Text style={styles.artist}>{playlist?.subtitle}</Text>
						<Text style={styles.details}>
							{playlist?.saves || 0} {playlist?.saves == '1' ? 'save' : 'saves'} •{' '}
							{playlist?.length}
						</Text>
					</View>
				</LinearGradient>
				{/* <Text style={styles.details}>Playlist • {playlist.releaseYear || 'Unknown'}</Text> */}
				<TracksList
					style={{
						paddingLeft: 16,
					}}
					tracks={filteredTracks}
					id=""
					scrollEnabled={false}
					contentContainerStyle={styles.tracksListContent}
				/>

				<View style={{ ...styles.footer, paddingLeft: 16 }}>
					{tracks[0] && <Text style={styles.footerTag}>{tracks[0]?.artist}</Text>}
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
	playlistTitle: {
		color: '#ffffff',
		fontSize: 28,
		fontWeight: 'bold',
		textAlign: 'left',
		marginBottom: 18,
		lineHeight: 32,
	},
	playlistArtwork: {
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
	playlistSubtitle: {
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
	description: {
		color: '#aaaaaa',
		fontSize: 14,
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

export default PlaylistScreen
