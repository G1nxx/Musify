import React from 'react'
import { TouchableOpacity, View, StyleSheet, Text } from 'react-native'
import FastImage from 'react-native-fast-image'

import { unknownTrackImageUri } from '@/constants/images'
import { colors, fontSize } from '@/constants/tokens'
import { defaultStyles } from '@/styles'

export type SubscriptionItemType = 'Artist' | 'Album' | 'Playlist' | 'EP' | 'Single'

export interface SubscriptionItem {
	id: string
	uId: string
	type: SubscriptionItemType
	title: string
	/**
	 * For artists this is usually "Artist", for albums – the artist name,
	 * for playlists – the owner name. Displayed in muted style beneath title.
	 */
	subtitle?: string
	artwork?: string
}

export interface SubscriptionListItemProps {
	item: SubscriptionItem
	onSelect: (item: SubscriptionItem) => void
}

/**
 * Spotify‑style row for subscriptions (artists, albums, playlists).
 *  - **Artist** → circular artwork
 *  - **Album / Playlist** → rounded‑corner square artwork
 */
export const SubscriptionListItem: React.FC<SubscriptionListItemProps> = ({ item, onSelect }) => {
	const handlePress = () => onSelect(item)

	const isArtist = item.type === 'Artist'

	return (
		<TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
			<View style={styles.container}>
				{/* Artwork */}
				<FastImage
					source={{
						uri: item.artwork ? item.artwork : unknownTrackImageUri,
						priority: FastImage.priority.normal,
					}}
					style={[styles.artwork, isArtist ? styles.artistArtwork : styles.defaultArtwork]}
					resizeMode={FastImage.resizeMode.cover}
				/>

				{/* Title & subtitle */}
				<View style={styles.textContainer}>
					<Text numberOfLines={1} style={styles.titleText}>
						{item.title}
					</Text>
					<Text numberOfLines={1} style={styles.subtitleText}>
						{isArtist ? item.type : item.subtitle ? `${item.type} • ${item.subtitle}` : item.type}
					</Text>
				</View>
			</View>
		</TouchableOpacity>
	)
}

// ───────────────────────────────────────── Styles ──────────────────────────────────────────
const ARTWORK_SIZE = 68
const ARTIST_RADIUS = ARTWORK_SIZE / 2

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 12,
		paddingHorizontal: 20,
	},
	artwork: {
		width: ARTWORK_SIZE,
		height: ARTWORK_SIZE,
		marginRight: 16,
	},
	artistArtwork: {
		borderRadius: ARTIST_RADIUS,
	},
	defaultArtwork: {
		borderRadius: 0,
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
