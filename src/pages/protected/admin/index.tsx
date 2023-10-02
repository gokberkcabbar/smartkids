import { NextPage } from 'next'
import React from 'react'
import { getSession } from 'next-auth/react'
import { Role } from '@prisma/client'
import { requireAdminAuth } from '~/utils/requireAdminAuth'
import { HeaderBar } from '~/components/HeaderBar'
import { AppShell, Card, Container, Grid } from '@mantine/core'
import { api } from '~/utils/api'
import { Stats } from '~/components/admin/Stats'
const AdminPage: NextPage = ({session}:any) => {


  return (
    <AppShell
    header={<HeaderBar />}
    p={'xl'}
    className='max-h-screen w-screen overflow-y-hidden'
    >
      <div className='overflow-auto flex flex-col w-full'>
        <Stats />
      </div>
    </AppShell>
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

export default AdminPage
