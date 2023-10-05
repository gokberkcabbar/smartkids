import { ActionIcon, AppShell, Box, Button, Container, Menu, TextInput } from '@mantine/core'
import { NextPage } from 'next'
import { getSession } from 'next-auth/react'
import React from 'react'
import { HeaderBar } from '~/components/HeaderBar'
import { TabButtonStudent } from '~/components/admin/students/TabButtonStudent'
import { requireAdminAuth } from '~/utils/requireAdminAuth'
import { useForm } from '@mantine/form'
import { IconPlus } from '@tabler/icons-react'
import { IconSearch } from '@tabler/icons-react'
import { TableStudent } from '~/components/admin/students/TableStudent'
import { AddStudentModal } from '~/components/admin/students/AddStudentModal'

const Students : NextPage = ({session}:any) => {
  const studentsForm = useForm<{
    isVerified: "tumu" | "kayit" | "onkayit",
    addStudentModal: boolean,
    searchFilter: string,
    filterBy: "İsim / Numara" | "Sınıf" | "Baba Mesleği" | "Anne Mesleği" | "Ödeme" 
  }>({
    initialValues: {
        isVerified: "tumu",
        addStudentModal: false,
        searchFilter: "",
        filterBy: "İsim / Numara"
    }
  })
  return (
    <AppShell header={<HeaderBar />} className='h-screen w-screen flex'>
        <div className='flex h-full w-full'>
            <div className='h-full w-full'>
            <Container className='w-full h-auto mt-12' size="xl">
                <div className='flex flex-row w-full h-auto justify-between items-center'>
                        <TabButtonStudent studentsForm={studentsForm}/>
                    
                    <div className='flex gap-x-6 items-center justify-center flex-row relative min-w-[200px] max-w-[100px] md:max-w-[600px]'>
                        <ActionIcon onClick={()=>studentsForm.setFieldValue('addStudentModal', true)} color='cyan' variant='filled'>
                            <IconPlus size={18} />
                        </ActionIcon>
                        <TextInput width={'100%'} icon={<IconSearch size={16}/>} {...studentsForm.getInputProps('searchFilter')} />
                        <Menu>
                            <Menu.Target>
                                <Button variant='light' color='cyan'>{studentsForm.values.filterBy}</Button>
                            </Menu.Target>
                            <Menu.Dropdown>
                                <Menu.Item onClick={()=>studentsForm.setFieldValue('filterBy', "İsim / Numara")}>İsim / Numara</Menu.Item>
                                <Menu.Item onClick={()=>studentsForm.setFieldValue('filterBy', "Sınıf")}>Sınıf</Menu.Item>
                                <Menu.Item onClick={()=>studentsForm.setFieldValue('filterBy', "Baba Mesleği")}>Baba Mesleği</Menu.Item>
                                <Menu.Item onClick={()=>studentsForm.setFieldValue('filterBy', "Anne Mesleği")}>Anne Mesleği</Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </div>
                </div>
                <div style={{height: 'calc(100vh - 280px)'}} className='flex flex-col overflow-auto w-full mt-24 gap-y-4'>
                    <Box sx={{ overflow: "auto" }}>
                        <Box>
                        <TableStudent studentsForm = {studentsForm} />
                        </Box>
                    </Box>
                </div>
            </Container>
        </div>
            <AddStudentModal studentsForm={studentsForm} />
    </div>
    </AppShell>
  )
}

export async function getServerSideProps(context: any){
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const session = await getSession(context)
    return requireAdminAuth(context, ()=>{
        return {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            props: {currentSession: session}
        }
    })
}

export default Students

