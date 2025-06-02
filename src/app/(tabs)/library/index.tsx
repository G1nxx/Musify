import React, { useState, useEffect } from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import { defaultStyles } from '@/styles'
import { SubscriptionsList } from '@/components/SubscribtionsList'
import LibraryFilter from '@/components/LibraryFilter'
import { fetchSubscriptions } from '@/api/subscriptions'
//import { useAuth } from '@/contexts/AuthContext'; // Предполагается, что у вас есть контекст аутентификации
import { colors } from '@/constants/tokens'
import { SubscriptionItem } from '@/components/SubscriptionListItem'
import { useRouter } from 'expo-router'

const LibraryScreen = () => {
	const router = useRouter()

	//const { user } = useAuth(); // Получаем текущего пользователя
	const [activeFilter, setActiveFilter] = useState('All')
	const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const filters = ['All', 'Playlists', 'Artists', 'Albums']

	useEffect(() => {
		const loadSubscriptions = async () => {
			try {
				//if (!user?.id) return;

				setLoading(true)
				const data = await fetchSubscriptions({
					userId: 3,
					filter: activeFilter,
				})
				setSubscriptions(data)
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Unknown error')
			} finally {
				setLoading(false)
			}
		}

		loadSubscriptions()
	}, [activeFilter])

	const handleFilterChange = (filter: string) => {
		setActiveFilter(filter)
	}

	const handleSubscriptionPress = (item: SubscriptionItem) => {
		if (item.type == 'Artist') {
			router.navigate({
				pathname: '/(tabs)/artist',
				params: { item: JSON.stringify(item), type: 'push' },
			})
		} else if (item.type == 'Playlist') {
			router.navigate({
				pathname: '/(tabs)/playlist',
				params: { item: JSON.stringify(item), type: 'push' },
			})
		} else {
			router.navigate({
				pathname: '/(tabs)/album',
				params: { item: JSON.stringify(item), type: 'push' },
			})
		}

		console.log('Pressed:', item)
	}

	//   if (!user) {
	//     return (
	//       <View style={[defaultStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
	//         <Text style={{ color: colors.text, fontSize: 16 }}>Please login to view your library</Text>
	//       </View>
	//     );
	//   }

	if (loading) {
		return (
			<View style={[defaultStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
				<ActivityIndicator size="large" color={colors.primary} />
			</View>
		)
	}

	if (error) {
		return (
			<View style={[defaultStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
				<Text style={{ color: colors.text, fontSize: 16 }}>Error: {error}</Text>
			</View>
		)
	}

	return (
		<View style={[defaultStyles.container, { paddingTop: 16 }]}>
			<LibraryFilter
				activeFilter={activeFilter}
				onFilterChange={handleFilterChange}
				filters={filters}
			/>

			<SubscriptionsList
				items={subscriptions}
				onItemPress={handleSubscriptionPress}
				contentContainerStyle={{ paddingBottom: 148 }}
			/>
		</View>
	)
}

export default LibraryScreen
