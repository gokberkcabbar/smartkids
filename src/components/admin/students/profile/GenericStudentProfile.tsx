import { ActionIcon, Button, Divider, Navbar, Text } from '@mantine/core'
import { IconChecklist, IconPencil, IconTrash } from '@tabler/icons-react'
import { IconAddressBook, IconCurrencyLira } from '@tabler/icons-react'
import React from 'react'

export const GenericStudentProfile = () => {
  return (
    <>
    <Navbar height={'100%'} p="xs" width={{ base: 50, sm: 200 }}>
      <Navbar.Section className='flex flex-col gap-8' grow mt="md">
        <Button variant='light' fullWidth className='hidden [@media(min-width:768px)]:block' leftIcon={<IconCurrencyLira size={24}/>}>Ödeme Tablosu</Button>
        <ActionIcon variant='filled' color='violet' className='block [@media(min-width:768px)]:hidden'>
            <IconCurrencyLira size={24} />
        </ActionIcon>
        <Button variant='light' fullWidth className='hidden [@media(min-width:768px)]:block' leftIcon={<IconAddressBook size={24}/>}>Profil Bilgileri</Button>
        <ActionIcon variant='filled' color='violet' className='block [@media(min-width:768px)]:hidden'>
            <IconAddressBook size={24} />
        </ActionIcon>
        <Button variant='light' fullWidth className='hidden [@media(min-width:768px)]:block' leftIcon={<IconChecklist size={24}/>}>Eğitim</Button>
        <ActionIcon variant='filled' color='violet' className='block [@media(min-width:768px)]:hidden'>
            <IconChecklist size={24} />
        </ActionIcon>
      </Navbar.Section>
      
      
      <Navbar.Section className='flex flex-col gap-8' mt="md">
        <Divider />
        <Button variant='filled' color='red' fullWidth className='hidden [@media(min-width:768px)]:block' leftIcon={<IconCurrencyLira size={24}/>}>Sil</Button>
        <ActionIcon variant='filled' color='red' className='block [@media(min-width:768px)]:hidden'>
            <IconTrash size={24} />
        </ActionIcon>
        <Button variant='subtle' fullWidth className='hidden [@media(min-width:768px)]:block' leftIcon={<IconPencil size={24}/>}>Sınıf Değiştir</Button>
        <ActionIcon variant='subtle' color='violet' className='block [@media(min-width:768px)]:hidden'>
            <IconPencil size={24} />
        </ActionIcon>
      </Navbar.Section>
    </Navbar>

    </>
  )
}
