import React from 'react'
import { FlatList, FlatListProps, View, Text } from 'react-native'
import { SubscriptionItem, SubscriptionListItem } from '@/components/SubscriptionListItem'
import { unknownTrackImageUri } from '@/constants/images'
import FastImage from 'react-native-fast-image'
import { utilsStyles } from '@/styles'

export type SubscriptionsListProps = Partial<FlatListProps<SubscriptionItem>> & {
	items: SubscriptionItem[]
	onItemPress: (item: SubscriptionItem) => void
}

const ItemDivider = () => (
	<View
		style={{
			...utilsStyles.itemSeparator,
			marginVertical: 9,
			marginLeft: 70,
		}}
	/>
)

export const SubscriptionsList = ({
	items,
	onItemPress,
	...flatListProps
}: SubscriptionsListProps) => {
	return (
		<FlatList
			data={items}
			keyExtractor={(item) => item.uId}
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
			renderItem={({ item }) => <SubscriptionListItem item={item} onSelect={onItemPress} />}
			contentContainerStyle={{
				paddingBottom: 20,
				paddingHorizontal: 16,
				...(items.length === 0 && { flex: 1, justifyContent: 'center' }),
			}}
			{...flatListProps}
		/>
	)
}
