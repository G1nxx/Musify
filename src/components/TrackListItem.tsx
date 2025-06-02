import { unknownTrackImageUri } from '@/constants/images'
import { colors, fontSize } from '@/constants/tokens'
import { defaultStyles } from '@/styles'
import React from 'react'
import { TouchableHighlight, View, StyleSheet, Text } from 'react-native'
import FastImage from 'react-native-fast-image'
import { Track, useActiveTrack, useIsPlaying } from 'react-native-track-player'
import { Entypo, Ionicons } from '@expo/vector-icons'
import { play } from 'react-native-track-player/lib/trackPlayer'

export type TrackListItemProps = {
	track: Track
	showArtwork?: boolean
	onTrackSelect: (track: Track) => void
}

export const TrackListItem = ({
	track,
	showArtwork,
	onTrackSelect: handleTrackSelect,
}: TrackListItemProps) => {
	const isActiveTrack = useActiveTrack()?.url === track.url
	const { playing } = useIsPlaying()

	const handleOnPress = () => {
		handleTrackSelect(track)
		play()
	}
	return (
		<TouchableHighlight onPress={handleOnPress}>
			<View style={styles.trackItemContainer}>
				{showArtwork && (
					<View>
						<FastImage
							source={{
								uri: track.artwork ? track.artwork : unknownTrackImageUri,
								priority: FastImage.priority.normal,
							}}
							style={{
								...styles.trackArtworkImage,
								opacity: isActiveTrack ? 0.6 : 1,
							}}
						/>
					</View>
				)}

				<View
					style={{
						flex: 1,
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center',
						paddingRight: 12,
					}}
				>
					<View style={{ width: '100%' }}>
						<Text
							numberOfLines={1}
							style={{
								...styles.trackTitleText,
								color: isActiveTrack ? colors.primary : colors.text,
							}}
						>
							{track.title}
						</Text>

						{track.artist && (
							<Text
								numberOfLines={1}
								style={{
									...styles.trackArtistText,
								}}
							>
								{track.artist}
							</Text>
						)}
					</View>

					<Entypo name="dots-three-vertical" size={18} color={colors.icon} />
				</View>
			</View>
		</TouchableHighlight>
	)
}

const styles = StyleSheet.create({
	trackItemContainer: {
		flexDirection: 'row',
		columnGap: 14,
		alignItems: 'center',
		paddingRight: 20,
	},
	trackArtworkImage: {
		borderRadius: 8,
		width: 50,
		height: 50,
	},
	trackTitleText: {
		...defaultStyles.text,
		fontSize: fontSize.sm,
		fontWeight: '600',
		maxWidth: '90%',
	},
	trackArtistText: {
		...defaultStyles.text,
		color: colors.textMuted,
		fontSize: 14,
		marginTop: 4,
	},
})
