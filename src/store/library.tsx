import { Track } from 'react-native-track-player'
import library from '@/assets/data/tracks.json'
import { create } from 'zustand'

interface LibraryState {
	tracks: Track[]
	toggleTrackFavorite: (track: Track) => void
	addToPlaylist: (track: Track, playlistId: number) => void
}

export const useLibraryStore = create<LibraryState>()((set) => ({
	tracks: library,
	toggleTrackFavorite: () => {},
	addToPlaylist: () => {},
}))

export const useTracks = () => useLibraryStore((state) => state.tracks)
