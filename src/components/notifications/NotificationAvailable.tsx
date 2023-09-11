/* eslint-disable @typescript-eslint/no-floating-promises */
import { ActionIcon, Button, Checkbox, Group, Text, TextInput } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconTrash } from '@tabler/icons-react'
import React, {useEffect, useState} from 'react'
import { getNotificationType, notificationFormType } from '~/pages/protected/admin/notifications'
import { api } from '~/utils/api'

export const NotificationAvailable = ({getNotification, notificationForm}:{notificationForm: notificationFormType ,getNotification: getNotificationType}) => {
   const [firstFetch, setFirstFetch] = useState(false)
   const context = api.useContext()
   const {mutate: updateNotification} = api.notification.updateNotificationSettings.useMutation({
    onSuccess: ()=>{
      context.class.invalidate()
      context.user.invalidate()
      notifications.show({
          message: "Bildirim başarıyla güncellendi",
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
   
   const {mutate: deleteNotification} = api.notification.deleteNotificationSettings.useMutation({
    onSuccess: ()=>{
      context.class.invalidate()
      context.user.invalidate()
      context.notification.invalidate()
      notifications.show({
          message: "Bildirim başarıyla silindi",
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

    useEffect(() => {
      if(getNotification){
        notificationForm.setFieldValue('id', getNotification.id)
        notificationForm.setFieldValue('notificationForSelection', getNotification.notificationFor.map((val)=>val.notificateFor))
        notificationForm.setFieldValue('reportingEmail', getNotification.reportingEmail)
        setFirstFetch(true)
      }
    
    }, [getNotification])

    useEffect(() => {
      if(firstFetch){
        notificationForm.resetDirty()
        setFirstFetch(false)
      }
    }, [firstFetch])
    
console.log(notificationForm.isDirty())
  return (
    <div className='flex flex-col w-full'>
        <div className='flex flex-row items-center justify-between p-4'>
            <Text>ID: {getNotification?.id}</Text>
            <ActionIcon>
                <IconTrash onClick={()=>deleteNotification({
                  id: notificationForm.values.id
                })} size={20} />
            </ActionIcon>
        </div>
        <div className='flex flex-col mt-4 w-full gap-3'>
            <TextInput {...notificationForm.getInputProps('reportingEmail')} label="Reporting Mail" value={notificationForm.values.reportingEmail} />
            <Checkbox.Group
                label="Bildirimler"
                {...notificationForm.getInputProps('notificationForSelection')}
            >
                <Group mt='xs'>
                    <Checkbox value={"MATERYAL1"} label="Materyal 1" />
                    <Checkbox value={"MATERYAL2"} label="Materyal 2" />
                    <Checkbox value={"AYLAR"} label="Ay ödemeleri" />
                </Group>
            </Checkbox.Group>

          <div className='flex w-full items-center justify-center'>
          <Button onClick={()=>updateNotification({
            id: notificationForm.values.id,
            email: notificationForm.values.reportingEmail,
            notificatingFor: notificationForm.values.notificationForSelection
          })} w={100} color='cyan' radius='lg' disabled={!notificationForm.isDirty()}>Değiştir</Button>
          </div>
        </div>
    </div>
  )
}
