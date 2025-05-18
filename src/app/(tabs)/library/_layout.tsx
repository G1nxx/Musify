import { defaultStyles } from '@/styles/index'
import { Stack } from 'expo-router'
import { View } from 'react-native'

const LibraryScreenLayout = () => {
	return (
		<View style={defaultStyles.container}>
			<Stack>
				<Stack.Screen
					name="index"
					options={{
						headerTitle: 'Library',
					}}
				/>
			</Stack>
		</View>
	)
}

export default LibraryScreenLayout
