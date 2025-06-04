import { Track } from 'react-native-track-player'

export type Playlist = {
	id: string
	title: string
	subtitle: string
	description: string
	creatorId: string
	artwork: string
	type: string
	length?: number
	year?: string
	month?: string
	day?: string
	tracks: Track[]
	attachedTo: string
	saves: string
}

export type Album = {
	id: string
	title: string
	subtitle: string
	artwork: string
	type: string
	length?: number
	year?: string
	month?: string
	day?: string
	tracks: Track[]
	saves: string
}

export type Artist = {
	id: string
	title: string
	releases: Album[]
	attached: Playlist
	subtitle?: string
	artwork: string
	type: string
}

export type User = {
	id: string
	login: string
	email: string
}
