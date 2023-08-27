import { ActionIcon, Checkbox, Group, Text, TextInput } from '@mantine/core'
import { IconTrash } from '@tabler/icons-react'
import React, {useEffect} from 'react'
import { getNotificationType, notificationFormType } from '~/pages/protected/admin/notifications'



export const NotificationAvailable = ({getNotification, notificationForm}:{notificationForm: notificationFormType ,getNotification: getNotificationType}) => {
  
    useEffect(() => {
      if(getNotification){
        notificationForm.setFieldValue('isEnabled', getNotification.notificationFor ? true : false)
        notificationForm.setFieldValue('notificationForSelection', getNotification.notificationFor.map((val)=>val.notificateFor))
      }
    
    }, [getNotification])
    
  return (
    <div className='flex flex-col w-full'>
        <div className='flex flex-row items-center justify-between p-4'>
            <Text>ID: {getNotification?.id}</Text>
            <ActionIcon>
                <IconTrash size={15} />
            </ActionIcon>
        </div>
        <div className='flex flex-col mt-4 w-full gap-3'>
            <TextInput {...notificationForm.getInputProps('reportingEmail')} label="Reporting Mail" />
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

            
        </div>
    </div>
  )
}
