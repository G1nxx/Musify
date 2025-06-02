import { SubscriptionItem } from '@/components/SubscriptionListItem'
import { Track } from 'react-native-track-player'
import { Album } from './types'

export const trackTitleFilter = (title: string) => (track: Track) =>
	track.title?.toLowerCase().includes(title.toLowerCase())

export const subscriptionTitleFilter = (title: string) => (sub: SubscriptionItem) =>
	sub.title?.toLowerCase().includes(title.toLowerCase())

export const releaseTitleFilter = (title: string) => (rel: Album) =>
	rel.title?.toLowerCase().includes(title.toLowerCase())
