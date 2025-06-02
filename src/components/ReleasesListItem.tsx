import React from 'react'
import { TouchableOpacity, View, StyleSheet, Text } from 'react-native'
import FastImage from 'react-native-fast-image'

import { unknownTrackImageUri } from '@/constants/images'
import { colors, fontSize } from '@/constants/tokens'
import { defaultStyles } from '@/styles'
import { Album } from '@/helpers/types'

export interface ReleaseListItemProps {
	item: Album
	onSelect: (item: Album) => void
}

/**
 * Spotify‑style row for subscriptions (artists, albums, playlists).
 *  - **Artist** → circular artwork
 *  - **Album / Playlist** → rounded‑corner square artwork
 */
export const ReleaseListItem: React.FC<ReleaseListItemProps> = ({ item, onSelect }) => {
	const handlePress = () => onSelect(item)

	return (
		<TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
			<View style={styles.container}>
				{/* Artwork */}
				<FastImage
					source={{
						uri: item.artwork ? item.artwork : unknownTrackImageUri,
						priority: FastImage.priority.normal,
					}}
					style={[styles.artwork, styles.defaultArtwork]}
					resizeMode={FastImage.resizeMode.cover}
				/>

				{/* Title & subtitle */}
				<View style={styles.textContainer}>
					<Text numberOfLines={1} style={styles.titleText}>
						{item.title}
					</Text>
					<Text numberOfLines={1} style={styles.subtitleText}>
						{item.subtitle ? `${item.type} • ${item.subtitle}` : item.type}
					</Text>
				</View>
			</View>
		</TouchableOpacity>
	)
}

// ───────────────────────────────────────── Styles ──────────────────────────────────────────
const ARTWORK_SIZE = 96

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 12,
	},
	artwork: {
		width: ARTWORK_SIZE,
		height: ARTWORK_SIZE,
		marginRight: 16,
	},
	defaultArtwork: {
		borderRadius: 3,
	},
	textContainer: {
		flex: 1,
		justifyContent: 'center',
	},
	titleText: {
		...defaultStyles.text,
		fontSize: fontSize.base,
		fontWeight: '600',
		color: colors.text,
	},
	subtitleText: {
		...defaultStyles.text,
		fontSize: fontSize.sm,
		color: colors.textMuted,
		marginTop: 2,
	},
})
