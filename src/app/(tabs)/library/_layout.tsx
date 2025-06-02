import { StackScreenWithSearchBar } from '@/constants/layout'
import { defaultStyles } from '@/styles/index'
import { Stack } from 'expo-router'
import { View } from 'react-native'

const LibraryScreenLayout = () => {
	return (
		<View style={[defaultStyles.container, { paddingTop: 0 }]}>
			<Stack>
				<Stack.Screen
					name="index"
					options={{
						...StackScreenWithSearchBar,
						headerTitle: 'Library',
						headerTitleStyle: {
							fontSize: 24,
						},
						headerTitleAlign: 'center',
						headerShadowVisible: false,
					}}
				/>
			</Stack>
		</View>
	)
}

export default LibraryScreenLayout
