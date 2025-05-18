import { NativeStackNavigationOptions } from '@react-navigation/native-stack'
import { colors } from './tokens'
import { Platform } from 'react-native'

export const StackScreenWithSearchBar: NativeStackNavigationOptions = {
	headerLargeTitle: Platform.select({
		ios: true,
		android: false,
	}),
	headerLargeStyle: {
		backgroundColor: colors.background,
	},
	headerLargeTitleStyle: {
		color: colors.text,
	},
	headerTintColor: colors.text,
	headerTransparent: Platform.select({
		ios: true,
		android: false,
	}),
	headerBlurEffect: Platform.select({
		ios: 'prominent',
		android: undefined,
	}),
	headerShadowVisible: false,

	...(Platform.OS === 'android' && {
		headerStyle: {
			backgroundColor: colors.background,
		},
		headerTitleStyle: {
			color: colors.text,
			fontSize: 20,
		},
	}),
}
