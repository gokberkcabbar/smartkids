import { Card, Loader } from '@mantine/core'
import { UseFormReturnType, useForm } from '@mantine/form'
import { NextPage } from 'next'
import { Session } from 'next-auth'
import { getSession } from 'next-auth/react'
import React from 'react'
import { HeaderBar } from '~/components/HeaderBar'
import { requireAdminAuth } from '~/utils/requireAdminAuth'
import { api } from '~/utils/api'
import { useMediaQuery } from '@mantine/hooks'
import { NotificationAvailable } from '~/components/notifications/NotificationAvailable'
import { NotificationFor } from '@prisma/client'
import { GetResult } from '@prisma/client/runtime'
import { NotificationNotAvailable } from '~/components/notifications/NotificationNotAvailable'

interface PageProps {
    currentSession: Session
}

export type notificationFormType = UseFormReturnType<{
    id: string;
    reportingEmail: string;
    notificationForSelection: ("MATERYAL1" | "MATERYAL2" | "AYLAR")[]
}, (values: {
    id: string;
    reportingEmail: string;
    notificationForSelection: ("MATERYAL1" | "MATERYAL2" | "AYLAR")[]
}) => {
    id: string;
    reportingEmail: string;
    notificationForSelection: ("MATERYAL1" | "MATERYAL2" | "AYLAR")[]
}>

export type getNotificationType = ({
    notificationFor: (GetResult<{
        id: string;
        notificateFor: NotificationFor;
        notificationSettingId: string;
        enabled: boolean;
    }, { [x: string]: () => unknown; }> & unknown)[];
} & GetResult<{
    id: string;
    reportingEmail: string
}, { [x: string]: () => unknown; }> & unknown) | undefined

const Notifications: NextPage<PageProps> = (props: PageProps) => {
  
  const notificationForm = useForm<{
    id: string,
    reportingEmail: string
    notificationForSelection: ("MATERYAL1" | "MATERYAL2" | "AYLAR")[]
  }>({
    initialValues: {
        id: "",
        reportingEmail: "",
        notificationForSelection: []
    }
  })
  const {data: getNotification, isFetched: notificationFetched} = api.notification.getNotificationSettings.useQuery()  
  console.log(getNotification)
  const lgBreakpoint = useMediaQuery('(min-width: 1200px)')
  return (
    <div className='flex flex-col w-screen h-screen'>
        <HeaderBar />
       {notificationFetched && getNotification ? (
            getNotification.length > 0 ? (
                <div className='w-full h-full flex flex-col justify-center items-center'>
                    <Card radius='md' withBorder w={lgBreakpoint ? 600 : 250}>
                        <NotificationAvailable getNotification={getNotification[0] as getNotificationType} notificationForm={notificationForm} />
                    </Card>
                </div>
            ) : (
                <NotificationNotAvailable notificationForm={notificationForm} />
            )
       ) : (
            <div className='flex w-full h-full justify-center items-center'>
                <Loader />
            </div>
       )}
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