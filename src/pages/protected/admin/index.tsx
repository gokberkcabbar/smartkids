import { NextPage } from 'next'
import React from 'react'
import { getSession } from 'next-auth/react'
import { Role } from '@prisma/client'
import { requireAdminAuth } from '~/utils/requireAdminAuth'
import { HeaderBar } from '~/components/HeaderBar'

const AdminPage: NextPage = ({session}:any) => {
  return (
    <HeaderBar />
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
