import { useState, useEffect, useCallback } from 'react'
import { unfollowContent, followContent } from '@/api/userActivity'
import { userId } from '@/hooks/useAuth'
import { getFollowStatus } from '@/api/subscriptions'

type IsFollowingProps = {
  contentId: string
  contentType: string
  initialFollowing?: boolean
}

export const useIsFollowing = ({ 
  contentId, 
  contentType, 
  initialFollowing = false 
}: IsFollowingProps) => {
  const [isFollowing, setIsFollowing] = useState(initialFollowing)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const checkFollowStatus = async () => {
      try {
        setIsLoading(true)
        const status = await getFollowStatus({ 
          UserId: userId, 
          ContentId: contentId, 
          Type: contentType 
        })
        setIsFollowing(status)
      } catch (err) {
        setError(err as Error)
      } finally {
        setIsLoading(false)
      }
    }

    checkFollowStatus()
  }, [contentId, contentType])

  const toggleFollow = useCallback(async () => {
    try {
      setIsLoading(true)
      if (isFollowing) {
        await unfollowContent({ 
          UserId: userId, 
          ContentId: contentId, 
          Type: contentType 
        })
      } else {
        await followContent({ 
          UserId: userId, 
          ContentId: contentId, 
          Type: contentType 
        })
      }
      setIsFollowing(prev => !prev)
    } catch (err) {
      setError(err as Error)
    } finally {
      setIsLoading(false)
    }
  }, [isFollowing, contentId, contentType])

  return {
    isFollowing,
    isLoading,
    error,
    toggleFollow,
    setIsFollowing,
  }
}