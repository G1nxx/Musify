import React from 'react'
import { FlatList, FlatListProps, View, Text } from 'react-native'
import { unknownTrackImageUri } from '@/constants/images'
import FastImage from 'react-native-fast-image'
import { utilsStyles } from '@/styles'
import { ReleaseListItem } from './ReleasesListItem'
import { Album } from '@/helpers/types'

export type ReleasesListProps = Partial<FlatListProps<Album>> & {
	items: Album[]
	onItemPress: (item: Album) => void
}

const ItemDivider = () => (
	<View
		style={{
			...utilsStyles.itemSeparator,
			marginVertical: 9,
			//marginLeft: 70,
		}}
	/>
)

export const ReleasesList = ({ items, onItemPress, ...flatListProps }: ReleasesListProps) => {
	return (
		<FlatList
			data={items}
			keyExtractor={(item) => item.id}
			ItemSeparatorComponent={ItemDivider}
			ListEmptyComponent={
				<View style={{ alignItems: 'center', marginTop: 40 }}>
					<Text style={utilsStyles.emptyContentText}>No subscriptions found</Text>
					<FastImage
						source={{ uri: unknownTrackImageUri, priority: FastImage.priority.normal }}
						style={utilsStyles.emptyContentImage}
						resizeMode={FastImage.resizeMode.contain}
					/>
				</View>
			}
			renderItem={({ item }) => <ReleaseListItem item={item} onSelect={onItemPress} />}
			contentContainerStyle={{
				paddingBottom: 20,
				...(items.length === 0 && { flex: 1, justifyContent: 'center' }),
			}}
			{...flatListProps}
		/>
	)
}
