/* eslint-disable @typescript-eslint/no-floating-promises */
import { Button, Checkbox, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import React from 'react'
import { notificationFormType } from '~/pages/protected/admin/notifications'
import { api } from '~/utils/api'

export const NotificationNotAvailable = ({notificationForm}:{notificationForm: notificationFormType}) => {
  const context = api.useContext()
  const {mutate: createNotification} = api.notification.createNotificationSettings.useMutation({
    onSuccess: ()=>{
      context.class.invalidate()
      context.user.invalidate()
      context.notification.invalidate()
      notifications.show({
          message: "Bildirim başarıyla oluşturuldu",
          color: 'green',
          autoClose: 2000,
      })
  },
  onError: (error)=>{
      notifications.show({
          message: error.message,
          color: 'red',
          autoClose: 2000
      })
  }
  })
  return (
    <div className='w-screen h-screen flex flex-col items-center mt-4'>
        <div className='mt-8 w-[275px] [@media(min-width:1200px)]:w-[450px] p-4 rounded-md relative'>
            <div className='absolute top-0 left-0 right-0 flex flex-col gap-4 [@media(min-width:1200px)]:gap-8'>
                <TextInput {...notificationForm.getInputProps('id')} withAsterisk label="Bildirim Adı"/>
                <Checkbox.Group
                label="Bildirimler"
                withAsterisk
                {...notificationForm.getInputProps('notificationForSelection')}
                >
                    <div className='flex flex-row items-center gap-x-2 [@media(min-width:1200px)]:gap-x-6'>
                    <Checkbox value={"MATERYAL1"} label="Materyal 1" />
                    <Checkbox value={"MATERYAL2"} label="Materyal 2" />
                    <Checkbox value={"AYLAR"} label="Ay Ödemeleri" />
                    </div>
                </Checkbox.Group>
                <TextInput {...notificationForm.getInputProps('reportingEmail')} withAsterisk label="Email" />
                <Button onClick={()=>createNotification({
                  email: notificationForm.values.reportingEmail,
                  id: notificationForm.values.id,
                  notificatingFor: notificationForm.values.notificationForSelection
                })} color='cyan' radius='md'>Oluştur</Button>
            </div>
        </div>
    </div>
  )
}
