import { API_BASE_URL } from '@/constants/config'

interface FollowContentParams {
	UserId: string
	ContentId: string
	Type: string
}

export const followContent = async (params: FollowContentParams) => {
	try {
		const response = await fetch(`${API_BASE_URL}api/user/subs/to_content`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				// 'Authorization': `Bearer ${yourToken}`,
			},
			body: JSON.stringify({
				user_id: String(params.UserId),
				content_id: String(params.ContentId),
				type: String(params.Type),
			}),
		})

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}
	} catch (error) {
		console.error('Error fetching subscriptions:', error)
		throw error
	}
}

export const unfollowContent = async (params: FollowContentParams) => {
	try {
        console.log(params);
        
		const response = await fetch(`${API_BASE_URL}api/user/subs/from_content`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				// 'Authorization': `Bearer ${yourToken}`,
			},
			body: JSON.stringify({
				user_id: params.UserId,
				content_id: String(params.ContentId),
				type: params.Type,
			}),
		})

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}
	} catch (error) {
		console.error('Error fetching subscriptions:', error)
		throw error
	}
}
