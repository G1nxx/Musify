import unknowArtistImage from '@/assets/unknown_artist.png'
import unknowTrackImage from '@/assets/unknown_track.png'
import likedSongsImage from '@/assets/Liked Songs.jpg'
import { Image } from 'react-native'

export const unknownArtistImageUri = Image.resolveAssetSource(unknowArtistImage).uri
export const unknownTrackImageUri = Image.resolveAssetSource(unknowTrackImage).uri
export const LikedSongsImageUri = Image.resolveAssetSource(likedSongsImage).uri
