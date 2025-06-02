import { StackScreenWithSearchBar } from '@/constants/layout'
import { defaultStyles } from '@/styles/index'
import { Stack } from 'expo-router'
import { View } from 'react-native'

const AlbumScreenLayout = () => {
	return (
		<View style={defaultStyles.container}>
			<Stack>
				<Stack.Screen
					name="index"
					options={{
						//...StackScreenWithSearchBar,
						headerTitle: '',
						headerTransparent: true,
						headerTintColor: '#ffffff',
						headerBlurEffect: 'regular',
						headerStyle: {
							backgroundColor: 'rgba(0,0,0,0)',
						},
						headerTitleStyle: {
							fontWeight: 'bold',
							color: '#fff',
						},
					}}
				/>
			</Stack>
		</View>
	)
}

export default AlbumScreenLayout
