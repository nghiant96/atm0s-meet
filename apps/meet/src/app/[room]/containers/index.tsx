'use client'

import { Meeting } from './meeting'
import { SettingsMedia } from './settings-media'
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import { useParams, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { AudioMixerMode, SessionConfig } from '@atm0s-media-sdk/core'
import { Atm0sMediaProvider } from '@atm0s-media-sdk/react-hooks'
import { Atm0sMediaUIProvider } from '@atm0s-media-sdk/react-ui/lib'
import { env } from '@/config/env'

type Props = {
  host: string | null
  username?: RequestCookie
}

export const Room: React.FC<Props> = ({ host, username }) => {
  const params = useParams()
  const searchParams = useSearchParams()
  const gatewayIndex = parseInt(searchParams!.get('gateway') || '0')
  const token = searchParams!.get('token') || ''
  const room = params?.room as string
  const peer = searchParams!.get('peer') || ''

  const cfg = {
    token,
    join: {
      room,
      peer,
      publish: { peer: true, tracks: true },
      subscribe: { peers: true, tracks: true },
      features: {
        mixer: {
          mode: AudioMixerMode.AUTO,
          outputs: 3,
        },
      },
    },
  } as SessionConfig

  const [inRoom, setInRoom] = useState(false)

  return (
    <Atm0sMediaProvider gateway={env.GATEWAYS[gatewayIndex]!} cfg={cfg} prepareAudioReceivers={3} prepareVideoReceivers={3}>
      <Atm0sMediaUIProvider>
        {!inRoom && <SettingsMedia onConnected={() => setInRoom(true)} username={username} />}
        {inRoom && <Meeting host={host} />}
      </Atm0sMediaUIProvider>
    </Atm0sMediaProvider>
  )
}
