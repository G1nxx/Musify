import { colors, fontSize } from '@/constants/tokens'
import { Tabs } from 'expo-router'
import React from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { FloatingPlayer } from '@/components/FloatingPlayer'

const TabsNavigation = () => {
	return (
		<>
			<Tabs
				screenOptions={{
					tabBarInactiveTintColor: colors.primary,
					tabBarLabelStyle: {
						fontSize: fontSize.xs,
						fontWeight: '500',
					},
					headerShown: false,
					tabBarStyle: {
						position: 'absolute',
						backgroundColor: 'transparent',
						borderTopWidth: 0,
						elevation: 0,
						shadowOpacity: 0,
					},
				}}
			>
				<Tabs.Screen
					name="(home)"
					options={{
						title: 'Home',
						tabBarIcon: ({ color }) => (
							<MaterialCommunityIcons name="home" size={20} color={color} />
						),
					}}
				/>
				<Tabs.Screen
					name="search"
					options={{
						title: 'Search',
						tabBarIcon: ({ color }) => (
							<MaterialCommunityIcons name="magnify" size={20} color={color} />
						),
					}}
				/>
				<Tabs.Screen
					name="library"
					options={{
						title: 'Library',
						tabBarIcon: ({ color }) => (
							<MaterialCommunityIcons name="playlist-play" size={20} color={color} />
						),
					}}
				/>
				<Tabs.Screen
					name="songs"
					options={{
						title: 'Songs',
						tabBarIcon: ({ color }) => (
							<MaterialCommunityIcons name="music" size={20} color={color} />
						),
					}}
				/>
			</Tabs>

			<FloatingPlayer 
				style={{
					position: 'absolute',
					left: 8,
					right: 8,
					bottom: 78,
				}}
			/>
		</>
	)
}

export default TabsNavigation
