import { NextPage } from 'next'
import { getSession } from 'next-auth/react'
import React from 'react'

const StudentPage : NextPage = ({session}:any) => {
  return (
    <div>index</div>
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
