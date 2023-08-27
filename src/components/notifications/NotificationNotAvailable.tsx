import { Button, Checkbox, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import React from 'react'
import { notificationFormType } from '~/pages/protected/admin/notifications'

export const NotificationNotAvailable = ({notificationForm}:{notificationForm: notificationFormType}) => {


  return (
    <div className='w-screen h-screen flex flex-col items-center mt-4'>
        <div className='w-[200px] [@media(min-width:1200px)]:w-[550px] p-4 rounded-md relative'>
            <div className='absolute top-0 left-0 right-0 flex flex-col gap-3'>
                <TextInput {...notificationForm.getInputProps('id')} withAsterisk label="Bildirim ID"/>
                <Checkbox.Group
                label="Bildirimler"
                withAsterisk
                {...notificationForm.getInputProps('enableds')}
                >
                    <Checkbox value={"MATERYAL1"} label="Materyal 1" />
                    <Checkbox value={"MATERYAL2"} label="Materyal 2" />
                    <Checkbox value={"AYLAR"} label="Ay Ödemeleri" />
                </Checkbox.Group>
                <TextInput {...notificationForm.getInputProps('reportingEmail')} withAsterisk label="Email" />
                <Button color='cyan' radius='md'>Oluştur</Button>
            </div>
        </div>
    </div>
  )
}
