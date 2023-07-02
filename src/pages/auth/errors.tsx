/* eslint-disable @typescript-eslint/no-misused-promises */
import { Button, Title } from '@mantine/core'
import React from 'react'
import { useRouter } from 'next/router'

export default function Errors() {
  const router = useRouter()
  return (
    <div className='flex w-screen h-screen justify-center items-center'>
        <div className='flex flex-col items-center justify-center p-4 w-[400px] h-[200px] rounded-xl bg-red-500/30 border border-solid'>
            <Title>
                Erişim Yetkiniz Yok
            </Title>
            <Button onClick={()=>router.push('/')}>Ana Sayfaya Dön</Button>
        </div>
    </div>
  )
}
