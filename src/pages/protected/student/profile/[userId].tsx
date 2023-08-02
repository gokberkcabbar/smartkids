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
import { Session } from 'next-auth'
import { GetResult } from '@prisma/client/runtime'
import { TransactionFor } from '@prisma/client'
import { UseFormReturnType, useForm } from '@mantine/form'
import { ProfileTab } from '~/components/studentsProfileGeneric/ProfileTab'
import { OdemeTab } from '~/components/studentsProfileGeneric/OdemeTab'
import { EgitimGrid } from '~/components/studentsProfileGeneric/EgitimGrid'
import { Loader } from '@mantine/core'

export interface PageProps {
  currentSession: Session,
        userInfo: {
          age: number | null | undefined,
          name: string,
          image: string | null | undefined,
          userNo: string | undefined,
          classInfo: string | undefined,
          fName: string | null | undefined
          fJob: string | null | undefined
          fPhone: string | null | undefined
          mName: string | null | undefined
          mJob: string | null | undefined
          mPhone: string | null | undefined
          tPhone: string | null | undefined
          schoolClass: string | null | undefined
          transactionInfo: (GetResult<{
            id: string;
            transactionFor: TransactionFor;
            paid: boolean;
            amount: number | null;
            userId: string;
        // eslint-disable-next-line @typescript-eslint/ban-types
        }, {[x: string]: () => unknown;}> & {})[] | undefined
}
}

export type studentProfileAppShellProp = UseFormReturnType<{
  buttonSelected: "odeme" | "profil" | "egitim";
}, (values: {
  buttonSelected: "odeme" | "profil" | "egitim";
}) => {
  buttonSelected: "odeme" | "profil" | "egitim";
}>

const Profile : NextPage<PageProps> = (props: PageProps) => {
  const {currentSession, userInfo} = props
  console.log(userInfo)
  console.log(currentSession)
  const form = useForm<{
    buttonSelected: "odeme" | "profil" | "egitim"
  }>({
    initialValues: {
        buttonSelected: "profil"
    }
  })
  const classPageForm = useForm({
    initialValues: {
      className: props.userInfo.classInfo || "",
      isOpen: false
    }
  })
  const {data: classProfilePage, isLoading: loadingClassProfilePage} = api.class.getClasssProfilePage.useQuery({className: classPageForm.values.className}, {refetchOnWindowFocus: false})
  return (
    <>
      {currentSession.user.role === "ADMIN" ? (
      <div className='relative flex flex-col w-screen h-screen'>
        <GenericStudentProfile form={form} >
          <>
            {form.values.buttonSelected === "profil" ? (
          <div className='flex flex-col w-full h-full'>
              <ProfileTab props={props}/>
          </div>
          ) : form.values.buttonSelected === "odeme" ? (
            <div className='flex flex-col w-full h-full'>
              <OdemeTab props={props}/>
            </div>
          ) : (
            loadingClassProfilePage ? (
              <div className='flex flex-col w-full h-full justify-center items-center'>
                <Loader />
              </div>
            ) : (
              <div className='flex flex-col w-full h-full'>
                <EgitimGrid classProfilePage={classProfilePage} />
            </div>
            )
          )}
          </>
        </GenericStudentProfile>
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
  if (session.user.userNo !== userId && session.user.role !== "ADMIN"){
    return {
      redirect: {
          destination: "/auth/errors",
          permanent: false
      }
  }
  }
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
          classInfo: result?.class?.name ? result?.class?.name : "Ön Kayıt" ,
          fName: result?.fName,
          fJob: result?.fJob,
          fPhone: result?.fPhone,
          mName: result?.mName,
          mJob: result?.mJob,
          mPhone: result?.mPhone,
          tPhone: result?.mPhone,
          schoolClass: result?.schoolClass,
          transactionInfo: result?.transaction
        }
      }
  }
}


export default Profile