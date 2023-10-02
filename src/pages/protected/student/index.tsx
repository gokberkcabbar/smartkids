import { AppShell } from '@mantine/core'
import { NextPage } from 'next'
import { getSession } from 'next-auth/react'
import React from 'react'
import { HeaderBar } from '~/components/HeaderBar'

const StudentPage : NextPage = ({session}:any) => {
  return (
    <AppShell
    header={<HeaderBar />}
    >

    </AppShell>
  )
}

export async function getServerSideProps(context: any){
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const session = await getSession(context)
    if (!session){
        return {
            redirect: {
                destination: "/auth/errors",
                permanent: false
            }
        }
    }

    return {
        props: {currentSession: session}
    }
}

export default StudentPage
