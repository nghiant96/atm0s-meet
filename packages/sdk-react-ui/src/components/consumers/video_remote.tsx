import { useEffect, useRef } from 'react'
import { RemoteTrack, useConsumer } from '@atm0s-media-sdk/react-hooks/lib'

type Props = {
  track: RemoteTrack
}

export const VideoRemote: React.FC<Props> = ({ track }) => {
  const consumer = useConsumer(track)
  const videoRef = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    consumer.attach({
      priority: 10,
      maxSpatial: 2,
      maxTemporal: 2,
    })
    return () => {
      consumer.detach()
    }
  }, [consumer])

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = consumer.stream
    }
  }, [consumer, videoRef.current])

  return <video muted autoPlay className="h-full aspect-video" ref={videoRef} />
}
