/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useEffect, useState } from 'react'
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
import { ActionIcon, Card, Container, Grid, Group, Loader, Text } from '@mantine/core'
import { classProfilePageType } from '~/components/studentsProfileGeneric/EgitimTab'
import { IconTrash } from '@tabler/icons-react'
import { IconDownload } from '@tabler/icons-react'
import Link from 'next/link'
import { ParsedUrlQuery } from 'querystring'

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
  buttonSelected: "odeme" | "profil" | "egitim" | "odev";
}, (values: {
  buttonSelected: "odeme" | "profil" | "egitim" | "odev";
}) => {
  buttonSelected: "odeme" | "profil" | "egitim" | "odev";
}>

const Profile : NextPage<PageProps> = (props: PageProps) => {
  const {currentSession, userInfo} = props
  console.log(userInfo)
  console.log(currentSession)
  const form = useForm<{
    buttonSelected: "odeme" | "profil" | "egitim" | "odev"
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
  console.log(props.userInfo.transactionInfo)
  const {data: classProfilePage, isLoading: loadingClassProfilePage} = api.class.getClasssProfilePage.useQuery({className: classPageForm.values.className}, {refetchOnWindowFocus: false})
  const [fetched, setFetched] = useState<boolean>(false)
  const [tasksHtml, setTasksHtml] = useState<React.JSX.Element[]>([])
  const {data: getTasks, isFetched: getTasksFetched} = api.task.getTaskByUserNo.useQuery({userNo: props.userInfo.userNo as string})
  useEffect(() => {
    if(getTasksFetched && getTasks){
      const now = new Date()
      setTasksHtml(getTasks.map((val)=>(
        <Grid.Col key={val.fileLink} span={12} md={4}>
            <Card radius={15} p='md' >
            <div className="flex flex-col gap-3 w-full h-full">
              <div className="flex flex-col gap-3  w-full [@media(min-width:1024px)]:hidden">
                <Text fz='xl'>Ödev Adı: <Text fz='lg'>{val.name}</Text></Text>
                <Text fz='xl'>Sınıf Adı: <Text fz='lg'>{val.class?.name}</Text></Text>
              </div>
                <div className="flex flex-row justify-between items-center [@media(max-width:1024px)]:hidden">
                <Text fz='xl'>Ödev Adı: <Text fz='lg'>{val.name}</Text></Text>
                <Text fz='xl'>Sınıf Adı: <Text fz='lg'>{val.class?.name}</Text></Text>
                </div>
                <div className="flex flex-col gap-3  w-full [@media(min-width:1024px)]:hidden">
                  <Text>Ödev Oluşturma Tarihi: <Text color="blue">{val.createdAt.toLocaleDateString('tr-TR')}</Text></Text>
                  <Text>Son Teslim Tarihi: <Text color={val.deadline >= now ? "cyan" : "red"}>{val.deadline.toLocaleDateString('tr-TR')}</Text></Text>
                </div>
                <div className="flex flex-row justify-between items-center [@media(max-width:1024px)]:hidden">
                <Text>Ödev Oluşturma Tarihi: <Text color="blue">{val.createdAt.toLocaleDateString('tr-TR')}</Text></Text>
                <Text>Son Teslim Tarihi: <Text color={val.deadline >= now ? "cyan" : "red"}>{val.deadline.toLocaleDateString('tr-TR')}</Text></Text>
                </div>
                <Group position='right'>
                  <ActionIcon component={Link} download href={val.fileLink} variant="light">
                    <IconDownload size={30}/>
                  </ActionIcon>
                </Group>
            </div>
          </Card>
          </Grid.Col>
      )))
    }
    return () => {
      setTasksHtml([])
    }
  
  }, [getTasks])

  const router = useRouter()

  const [queryParam, setQueryParam] = useState<ParsedUrlQuery>({userId: ""})
  console.log(queryParam, router.query)
  useEffect(() => {
    setQueryParam(router.query)
  }, [router.query])

  const [refetchNeeded, setRefetchNeeded] = useState(false)
  useEffect(() => {
    if(refetchNeeded){
      router.replace(router.asPath)
      console.log("aha burada")
    }
    return () => {
      setRefetchNeeded(false)
    }
  }, [refetchNeeded])
  
  
  
  return (
    <>
      <div className='relative flex flex-col w-screen h-screen'>
        <GenericStudentProfile PageProps={props} form={form}>
          <>
            {form.values.buttonSelected === "profil" ? (
          <div className='flex flex-col w-full h-full'>
              <ProfileTab props={props}/>
          </div>
          ) : form.values.buttonSelected === "odeme" ? (
            <div className='flex flex-col w-full h-full'>
              <OdemeTab refetchNeeded={refetchNeeded} setRefetchNeeded={setRefetchNeeded} props={props}/>
            </div>
          ) : form.values.buttonSelected === "egitim" ? (
            loadingClassProfilePage ? (
              <div className='flex flex-col w-full h-full justify-center items-center'>
                <Loader />
              </div>
            ) : (
              <div className='flex flex-col w-full h-full'>
                <EgitimGrid fetched={fetched} setFetched={setFetched} className={classPageForm.values.className} classProfilePage={classProfilePage as classProfilePageType} />
            </div>
            )
          ) : (
            <div className='mx-auto w-full flex flex-col'>

                <Grid>
                  {tasksHtml}
                </Grid>

            </div>
          )}
          </>
        </GenericStudentProfile>
      </div>
      

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
  console.log(result)
  if(session.user.userNo === userId){
    await trpc.user.updateLastLogin({userNo: userId})
  }
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