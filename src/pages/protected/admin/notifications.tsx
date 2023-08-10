import { Card } from '@mantine/core'
import { useForm } from '@mantine/form'
import { NextPage } from 'next'
import { Session } from 'next-auth'
import { getSession } from 'next-auth/react'
import React from 'react'
import { HeaderBar } from '~/components/HeaderBar'
import { requireAdminAuth } from '~/utils/requireAdminAuth'

interface PageProps {
    currentSession: Session
}

const Notifications: NextPage<PageProps> = (props: PageProps) => {
  
  const form = useForm({
    initialValues: {
        notificationsEnabled: false
    }
  })  
  return (
    <div className='flex flex-col w-screen h-screen'>
        <HeaderBar />
        <div className='flex flex-col items-center justify-center mt-14 h-full w-full'>
            <Card>
                <div className='w-[200px] lg:w-[600px] flex flex-col'>
                                        
                </div>
            </Card>
        </div>
    </div>
  )
}

export async function getServerSideProps(context: any){
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const session = await getSession(context)
    return requireAdminAuth(context, ()=>{
        return {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            props: {currentSession: session}
        }
    })
}

export default Notifications