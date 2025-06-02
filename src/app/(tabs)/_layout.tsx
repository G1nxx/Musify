import { colors, fontSize } from '@/constants/tokens'
import { Tabs } from 'expo-router'
import React from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { FloatingPlayer } from '@/components/FloatingPlayer'
import Animated from 'react-native-reanimated'
import { LinearGradient } from 'expo-linear-gradient'

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
						//backgroundColor: 'transparent',
						borderTopWidth: 0,
						elevation: 0,
						shadowOpacity: 0,
					},
					tabBarBackground: () => (
						<Animated.View style={{ flex: 1 }}>
							<LinearGradient
								colors={['rgba(0,0,0,0)', 'rgba(0,0,0,1)']}
								locations={[0, 1]}
								style={{ flex: 1 }}
								start={{ x: 0, y: 0 }}
								end={{ x: 0, y: 1 }}
							/>
						</Animated.View>
					),
				}}
			>
				<Tabs.Screen
					name="(home)"
					options={{
						title: 'Home',
						tabBarIcon: ({ color, focused }) => (
							<MaterialCommunityIcons
								name={focused ? 'home' : 'home-outline'}
								size={20}
								color={color}
							/>
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
				<Tabs.Screen name="album" options={{ href: null }} />
				<Tabs.Screen name="playlist" options={{ href: null }} />
				<Tabs.Screen name="artist" options={{ href: null }} />
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
