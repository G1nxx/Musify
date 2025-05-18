import { defaultStyles } from '@/styles/index'
import { Stack } from 'expo-router'
import { View } from 'react-native'

const HomeScreenLayout = () => {
	return (
		<View style={defaultStyles.container}>
			<Stack>
				<Stack.Screen
					name="index"
					options={{
						headerTitle: 'Home',
					}}
				/>
			</Stack>
		</View>
	)
}

export default HomeScreenLayout
