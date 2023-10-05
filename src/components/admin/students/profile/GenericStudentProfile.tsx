import { ActionIcon, AppShell, Avatar, Button, Divider, Navbar, Text } from '@mantine/core'
import { IconChecklist, IconPencil, IconSchool, IconTrash } from '@tabler/icons-react'
import { IconAddressBook, IconCurrencyLira } from '@tabler/icons-react'
import React from 'react'
import { HeaderBar } from '~/components/HeaderBar'
import { PageProps, studentProfileAppShellProp } from '~/pages/protected/student/profile/[userId]'
import { useForm } from '@mantine/form'
import { ProfileTab } from '~/components/studentsProfileGeneric/ProfileTab'
import { OdemeTab } from '~/components/studentsProfileGeneric/OdemeTab'
import { useSession } from 'next-auth/react'


export const GenericStudentProfile = ({PageProps, form, children}:{PageProps: PageProps, form: studentProfileAppShellProp, children: React.ReactNode}) => {
  const session = useSession()
  return (
    <AppShell
     navbar={
        <Navbar height={'calc(100vh - 60px)'} p="xs" width={{ base: 50, sm: 200 }}>
      <Navbar.Section className='flex flex-col gap-8' grow mt="md">
        <Button variant={form.values.buttonSelected === "odeme" ? "filled" : "light"} fullWidth onClick={()=>form.setFieldValue('buttonSelected', "odeme")} className='hidden [@media(min-width:768px)]:block' leftIcon={<IconCurrencyLira size={24}/>}>Ödeme Tablosu</Button>
        <ActionIcon variant={form.values.buttonSelected === "odeme" ? "filled" : "light"} onClick={()=>form.setFieldValue('buttonSelected', "odeme")} color='violet' className='block [@media(min-width:768px)]:hidden'>
            <IconCurrencyLira size={24} />
        </ActionIcon>
        <Button variant={form.values.buttonSelected === "profil" ? "filled" : "light"} fullWidth onClick={()=>form.setFieldValue('buttonSelected', "profil")} className='hidden [@media(min-width:768px)]:block' leftIcon={<IconAddressBook size={24}/>}>Profil Bilgileri</Button>
        <ActionIcon variant={form.values.buttonSelected === "profil" ? "filled" : "light"} onClick={()=>form.setFieldValue('buttonSelected', "profil")} color='violet' className='block [@media(min-width:768px)]:hidden'>
            <IconAddressBook size={24} />
        </ActionIcon>
        <Button variant={form.values.buttonSelected === "egitim" ? "filled" : "light"} fullWidth onClick={()=>form.setFieldValue('buttonSelected', "egitim")} className='hidden [@media(min-width:768px)]:block' leftIcon={<IconSchool size={24}/>}>Eğitim</Button>
        <ActionIcon variant={form.values.buttonSelected === "egitim" ? "filled" : "light"} onClick={()=>form.setFieldValue('buttonSelected', "egitim")} color='violet' className='block [@media(min-width:768px)]:hidden'>
            <IconSchool size={24} />
        </ActionIcon>
        <Button variant={form.values.buttonSelected === "odev" ? "filled" : "light"} fullWidth onClick={()=>form.setFieldValue('buttonSelected', "odev")} className='hidden [@media(min-width:768px)]:block' leftIcon={<IconChecklist size={24}/>}>Ödev</Button>
        <ActionIcon variant={form.values.buttonSelected === "odev" ? "filled" : "light"} onClick={()=>form.setFieldValue('buttonSelected', "odev")} color='violet' className='block [@media(min-width:768px)]:hidden'>
            <IconChecklist size={24} />
        </ActionIcon>
      </Navbar.Section>
      
      
      <Navbar.Section className='flex flex-col gap-8' mt="md">
        <Divider />
        {session.data?.user.role === "ADMIN" ? (
          <>
            <Button disabled={PageProps.currentSession.user.role !== "ADMIN"} variant='filled' color='red' fullWidth className='hidden [@media(min-width:768px)]:block' leftIcon={<IconTrash size={24}/>}>Sil</Button>
          <ActionIcon variant='filled' color='red' className='block [@media(min-width:768px)]:hidden'>
          <IconTrash size={24} />
      </ActionIcon>
          </>
        ) : (
          null
        )}
      </Navbar.Section>
    </Navbar>
     }
     styles={(theme) => ({
        main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
      })}
      padding='md'
      header={<HeaderBar />}
    >
        {children}
    </AppShell>
  )
}
