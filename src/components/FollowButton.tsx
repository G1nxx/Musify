import { TouchableOpacity, Text, StyleSheet, Animated } from 'react-native'
import { colors } from '@/constants/tokens'
import { useIsFollowing } from '@/hooks/useIsFollowing'

type FollowButtonProps = {
	contentId: string
	contentType: string
}

export const FollowButton = (props: FollowButtonProps) => {
	const { isFollowing, isLoading, toggleFollow } = useIsFollowing({
		contentId: props.contentId,
		contentType: props.contentType,
	})
	const scaleValue = new Animated.Value(1)

	const handlePress = () => {
		Animated.sequence([
			Animated.timing(scaleValue, {
				toValue: 0.95,
				duration: 100,
				useNativeDriver: true,
			}),
			Animated.timing(scaleValue, {
				toValue: 1,
				duration: 100,
				useNativeDriver: true,
			}),
		]).start()

		toggleFollow()
	}

	return (
		<TouchableOpacity
			onPress={handlePress}
			disabled={isLoading}
			activeOpacity={0.8}
			style={[styles.button, isFollowing ? styles.followingButton : styles.notFollowingButton]}
		>
			<Animated.View style={{ transform: [{ scale: scaleValue }] }}>
				<Text style={styles.buttonText}>{isFollowing ? 'Following' : 'Follow'}</Text>
			</Animated.View>
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	button: {
		paddingVertical: 8,
		paddingHorizontal: 20,
		borderRadius: 20,
		borderWidth: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	notFollowingButton: {
		backgroundColor: colors.primary,
		borderColor: colors.primary,
	},
	followingButton: {
		backgroundColor: 'transparent',
		borderColor: colors.textMuted,
	},
	buttonText: {
		fontSize: 14,
		fontWeight: '600',
		color: colors.text,
	},
})
