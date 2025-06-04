import { SubscriptionItem } from '@/components/SubscriptionListItem'
import { API_BASE_URL } from '@/constants/config'
import { LikedSongsImageUri } from '@/constants/images'
import { Album, Artist, Playlist } from '@/helpers/types'

interface FetchSubscriptionsParams {
	userId: number
	filter?: string
}

const getMonth = (num: string) => {
	let monthName
	switch (num) {
		case '01':
			monthName = 'January'
			break
		case '02':
			monthName = 'February'
			break
		case '03':
			monthName = 'March'
			break
		case '04':
			monthName = 'April'
			break
		case '05':
			monthName = 'May'
			break
		case '06':
			monthName = 'June'
			break
		case '07':
			monthName = 'July'
			break
		case '08':
			monthName = 'August'
			break
		case '09':
			monthName = 'September'
			break
		case '10':
			monthName = 'October'
			break
		case '11':
			monthName = 'November'
			break
		case '12':
			monthName = 'December'
			break
		default:
			monthName = 'Unknown Month'
	}
	return monthName
}

const getDuration = (length: number) => {
	const days = Math.floor(length / 86400)
	const hours = Math.floor((length % 86400) / 3600)
	const minutes = Math.floor((length % 3600) / 60)
	const seconds = Math.floor(length % 60)

	if (days > 0) {
		return `${days} d${hours > 0 ? ` ${hours} h` : ''}`
	}
	if (hours > 0) {
		return `${hours} h${minutes > 0 ? ` ${minutes} min` : ''}`
	}
	if (minutes > 0) {
		return `${minutes} min${seconds > 0 ? ` ${seconds} sec` : ''}`
	}
	return `${seconds} sec`
}

export const fetchSubscriptions = async (
	params: FetchSubscriptionsParams,
): Promise<SubscriptionItem[]> => {
	try {
		const { userId, filter = 'All' } = params

		const response = await fetch(`${API_BASE_URL}api/user/get_subscriptions`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				// 'Authorization': `Bearer ${yourToken}`,
			},
			body: JSON.stringify({
				user_id: userId,
				filter: filter,
			}),
		})

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}

		const data = await response.json()
		const updatedSubs = data
			.map((sub: any) => ({
				...sub,
				uId: sub.type + '_' + sub.id,
				title: sub.title || 'Unknown',
				subtitle: sub.subtitle || '',
				artwork:
					sub.title === 'Liked Songs' && sub.type === 'Playlist'
						? LikedSongsImageUri
						: API_BASE_URL + sub.artwork,
			}))
			.sort((a: SubscriptionItem, b: SubscriptionItem) => {
				if (a.title === 'Liked Songs' && a.type === 'Playlist') return -1
				if (b.title === 'Liked Songs' && b.type === 'Playlist') return 1
				return 0
			})

		return updatedSubs
	} catch (error) {
		console.error('Error fetching subscriptions:', error)
		throw error
	}
}

interface FetchAlbumParams {
	AlbumId: string
}

export const fetchAlbum = async (params: FetchAlbumParams): Promise<Album> => {
	try {
		const response = await fetch(`${API_BASE_URL}api/user/get_album_info`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				// 'Authorization': `Bearer ${yourToken}`,
			},
			body: JSON.stringify({
				album_id: String(params.AlbumId),
			}),
		})

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}

		const data = await response.json()
		//console.log(data.album.date)

		const day = data.album.date.substring(8, 10)

		const processedAlbum: Album = {
			...data.album,
			artwork: API_BASE_URL + data.album.artwork,
			year: data.album.date.substring(0, 4),
			day: day[0] == '0' ? day[1] : day,
			month: getMonth(data.album.date.substring(5, 7)),
			length: getDuration(Number(data.album.length)),
		}
		//console.log(processedAlbum)

		if (data.tracks && Array.isArray(data.tracks)) {
			processedAlbum.tracks = data.tracks.map((track: any) => ({
				...track,
				title: track.title || 'Unknown',
				artwork: API_BASE_URL + track.artwork,
				url: API_BASE_URL + track.url,
			}))
		}
		return processedAlbum
	} catch (error) {
		console.error('Error fetching subscriptions:', error)
		throw error
	}
}

interface FetchPlaylistParams {
	PlaylistId: string
}

export const fetchPlaylist = async (params: FetchPlaylistParams): Promise<Playlist> => {
	try {
		const response = await fetch(`${API_BASE_URL}api/user/get_playlist_info`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				// 'Authorization': `Bearer ${yourToken}`,
			},
			body: JSON.stringify({
				Playlist_id: String(params.PlaylistId),
			}),
		})

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}

		const data = await response.json()
		//console.log(data.playlist.date)

		const day = data.playlist.date.substring(8, 10)

		const processedPlaylist: Playlist = {
			...data.playlist,
			artwork: API_BASE_URL + data.playlist.artwork,
			year: data.playlist.date.substring(0, 4),
			day: day[0] == '0' ? day[1] : day,
			month: getMonth(data.playlist.date.substring(5, 7)),
			length: getDuration(Number(data.playlist.length)),
		}
		//console.log(processedPlaylist)

		if (data.tracks && Array.isArray(data.tracks)) {
			processedPlaylist.tracks = data.tracks.map((track: any) => ({
				...track,
				title: track.title || 'Unknown',
				artwork: API_BASE_URL + track.artwork,
				url: API_BASE_URL + track.url,
			}))
		}
		return processedPlaylist
	} catch (error) {
		console.error('Error fetching subscriptions:', error)
		throw error
	}
}

interface FetchArtistParams {
	ArtistId: string
}

export const fetchArtist = async (params: FetchArtistParams): Promise<Artist> => {
	try {
		const response = await fetch(`${API_BASE_URL}api/user/get_artist_info`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				// 'Authorization': `Bearer ${yourToken}`,
			},
			body: JSON.stringify({
				Artist_id: String(params.ArtistId),
			}),
		})

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}

		const data = await response.json()

		const processedArtist: Artist = {
			...data.artist,
			artwork: API_BASE_URL + data.artist.artwork,
		}
		console.log(processedArtist)

		processedArtist.attached = {
			...data.attached,
			artwork: API_BASE_URL + data.attached.artwork,
		}

		if (data.tracks && Array.isArray(data.tracks)) {
			processedArtist.attached.tracks = data.tracks.map((track: any) => ({
				...track,
				title: track.title || 'Unknown',
				artwork: API_BASE_URL + track.artwork,
				url: API_BASE_URL + track.url,
			}))
		}

		if (data.releases && Array.isArray(data.releases)) {
			processedArtist.releases = data.releases.map((release: any) => ({
				...release,
				title: release.title || 'Unknown',
				artwork: API_BASE_URL + release.artwork,
			}))
		}

		return processedArtist
	} catch (error) {
		console.error('Error fetching subscriptions:', error)
		throw error
	}
}

interface GetFollowStatusmParams {
	UserId: string
	ContentId: string
	Type: string
}

export const getFollowStatus = async (params: GetFollowStatusmParams): Promise<boolean> => {
	try {
		const response = await fetch(`${API_BASE_URL}api/user/get_follow_status`, {
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
		const data = await response.json()
		console.log(data)
		return data
	} catch (error) {
		console.error('Error fetching subscriptions:', error)
		throw error
	}
}
