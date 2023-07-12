/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from 'react'
import { useRouter } from 'next/router'
import { NextPage } from 'next'
import { getSession } from 'next-auth/react'
import { api } from '~/utils/api'
import { appRouter } from '~/server/api/root'
import { HeaderBar } from '~/components/HeaderBar'
import { GenericStudentProfile } from '~/components/admin/students/profile/GenericStudentProfile'

const Profile : NextPage = (props: any) => {
  const {currentSession, userInfo} = props
  console.log(userInfo)
  console.log(currentSession)
  return (
    <>
      {currentSession.user.role === "ADMIN" ? (
      <div className='relative flex flex-col w-screen h-screen'>
        <div className='fixed top-0 left-0 right-0'>
          <HeaderBar />
        </div>
        <div className='mt-[50px] h-full'>
        <GenericStudentProfile />
        </div>
      </div>
      
      ) : (<div>Sa</div>)}
    </>
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
  const {query} = context
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const {userId} = context.query
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const trpc = appRouter.createCaller(context)
  const result = await trpc.user.getUserInfo({userNo: userId})

  return {
      props: {
        currentSession: session,
        userInfo: {
          age: result?.age,
          name: result!.name,
          image: result?.image,
          userNo: result?.userNo,
          classInfo: result?.class?.name,
          transactionInfo: result?.transaction
        }
      }
  }
}


export default Profile