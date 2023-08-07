/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ActionIcon, Button, Loader, Modal, Title } from '@mantine/core'
import React, { SetStateAction, useState } from 'react'
import { classPageFormTypes } from '../TableClass'
import { api } from '~/utils/api'
import { notifications } from '@mantine/notifications'
import { EgitimGrid } from './EgitimGrid'
import { classProfilePageTypes, dbLayoutType, layoutItem } from '~/utils/layoutParser'
import { IconDeviceMobile } from '@tabler/icons-react'
import { IconDeviceIpadHorizontal } from '@tabler/icons-react'
import { IconDeviceDesktop } from '@tabler/icons-react'
import { useMediaQuery } from '@mantine/hooks'

export type classProfilePageType = classProfilePageTypes[]

export const EgitimTab = (classPageForm : classPageFormTypes) => {
  const {data: classProfilePage, isLoading: loadingClassProfilePage} = api.class.getClasssProfilePage.useQuery({className: classPageForm.values.className}, {refetchOnWindowFocus: false})
  const context = api.useContext()
  const [classPage, setClassPage] = useState()
  const [fetched, setFetched] = useState<boolean>(false)
  const {mutate: createClassProfilePage, isLoading: createClassProfilePageLoading} = api.class.createClassProfilePage.useMutation({
    onSuccess: ()=>{
      context.class.invalidate()
      context.user.invalidate()
      notifications.show({
        message: 'Başarılı bir şekilde sınıf sayfası oluşturdunuz',
        color: 'green'
      })
    },
    onError: (e)=>{
      notifications.show({
        message: e.message,
        color: 'red'
      })
    }
  })
  const {mutate: addCard, isLoading: loadingAddCard} = api.class.addCardClassProfilePage.useMutation({
    onSuccess: ()=>{
      context.class.invalidate()
      context.user.invalidate()
      notifications.show({
        message: 'Başarılı bir şekilde sınıf sayfası oluşturdunuz',
        color: 'green'
      }),
      setFetched(false)
    },
    onError: (e)=>{
      notifications.show({
        message: e.message,
        color: 'red'
      })
    }
  })
  
  const [mediaQuery, setMediaQuery] = useState<768 | 1024 | 1184>(1184)
  return (
    <>
        <Modal opened={classPageForm.values.isOpen!== undefined ? classPageForm.values.isOpen : false} onClose={()=>classPageForm.setFieldValue('isOpen', false)} fullScreen>
          <div className='flex flex-col w-full h-full'>
            {loadingClassProfilePage ? (
              <Loader />
            ) : (
              classProfilePage ? (
                <>
                  <div className='flex flex-row p-3 justify-between items-center mt-2'>
              <Title>{classPageForm.values.className}</Title>
              <div className='flex flex-row gap-6 items-center'>
                <ActionIcon variant={mediaQuery === 768 ? "filled" : "subtle"} onClick={()=>setMediaQuery(768)}>
                  <IconDeviceMobile size={30} />
                </ActionIcon>
                <ActionIcon variant={mediaQuery === 1024 ? "filled" : "subtle"} onClick={()=>setMediaQuery(1024)}>
                  <IconDeviceIpadHorizontal size={30} />
                </ActionIcon>
                <ActionIcon variant={mediaQuery === 1184 ? "filled" : "subtle"} onClick={()=>setMediaQuery(1184)}>
                  <IconDeviceDesktop size={30} />
                </ActionIcon>
              </div>
              <div className='flex flex-row items-center gap-4'>
                <Button color='cyan' onClick={()=>addCard({
                  className: classPageForm.values.className
                })} radius='lg'>{loadingAddCard ? <Loader /> : "+"}</Button>
                <Button color='grape' radius='md'>Kaydet</Button>
              </div>
            </div>
              <EgitimGrid fetched={fetched} setFetched={setFetched} className={classPageForm.values.className} classProfilePage={classProfilePage as classProfilePageType}/>
                </>
              ) : (
                <Button onClick={()=>createClassProfilePage({
                  className: classPageForm.values.className
                })}>{createClassProfilePageLoading ? <Loader /> : "Sınıf profili oluştur"}</Button>
              )
            )}
          </div>
        </Modal> 
    </>
  )
}
