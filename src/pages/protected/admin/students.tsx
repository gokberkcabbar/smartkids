import { NextPage } from 'next'
import { getSession } from 'next-auth/react'
import React from 'react'
import { HeaderBar } from '~/components/HeaderBar'
import { requireAdminAuth } from '~/utils/requireAdminAuth'

const Students : NextPage = ({session}:any) => {
  return (
    <div className='relative flex flex-col h-screen w-screen'>
        <div className='fixed top-0 left-0 right-0'>
            <HeaderBar />
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

export default Students