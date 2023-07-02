import { ActionIcon, Button, Container, Group, Select, TextInput } from '@mantine/core'
import { IconPlus, IconSearch } from '@tabler/icons-react'
import React, { useState } from 'react'
import { ClassCard } from '~/components/ClassCard'
import { HeaderBar } from '~/components/HeaderBar'
import { TabButton } from '~/components/TabButton'
import { UseFormReturnType, useForm } from '@mantine/form'
import { TableClass } from '~/components/TableClass'
import { Modal } from '@mantine/core'
import { Location } from '@prisma/client'
import { api } from '~/utils/api'
import { NextPage } from 'next'
import { getSession } from 'next-auth/react'
import { requireAdminAuth } from '~/utils/requireAdminAuth'

const Classes: NextPage = ({session}:any) => {
  
  const form = useForm({
    initialValues: {
        searchFilter: "",
        addClassModal: false,
        nameClass: "",
        location: Location,
        locationFilter: "tumu"
    }
  })
  return (
    <>
    <div className='relative flex flex-col h-screen w-screen'>
        <HeaderBar />
        <div className='mt-14 h-full w-full'>
            <Container size="xl">
                <div className='flex flex-row justify-between items-center'>
                    <TabButton form={form}/>
                    
                    <div className='flex gap-x-6 items-center justify-center flex-row relative min-w-[200px] max-w-[100px] md:max-w-[600px]'>
                        <ActionIcon onClick={()=>form.setFieldValue('addClassModal', true)} color='cyan' variant='filled'>
                            <IconPlus size={18} />
                        </ActionIcon>
                        <TextInput width={'100%'} icon={<IconSearch size={16}/>} {...form.getInputProps('searchFilter')} />
                    </div>
                </div>
                <div className='flex flex-col justify-center items-center mt-24 gap-y-4'>
                 <TableClass form={form} />
                </div>
            </Container>
        </div>
        <ClassModal form={form}/>
    </div>
    
    </>
  )
}

export default Classes

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

const ClassModal = ({form}:{form:UseFormReturnType<{
    searchFilter: string;
    addClassModal: boolean;
    nameClass: string;
    location: {
        ATAKUM: "ATAKUM";
        PERA: "PERA";
    };
    locationFilter: string;
}, (values: {
    searchFilter: string;
    addClassModal: boolean;
    nameClass: string;
    location: {
        ATAKUM: "ATAKUM";
        PERA: "PERA";
    };
    locationFilter: string;
}) => {
    searchFilter: string;
    addClassModal: boolean;
    nameClass: string;
    location: {
        ATAKUM: "ATAKUM";
        PERA: "PERA";
    };
    locationFilter: string;
}>}) => {
    const context = api.useContext()
    const {mutate: addClass} = api.class.addClass.useMutation({
        onSuccess: ()=>{
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            context.class.invalidate()
        }
    })
    return (
        <>
        <Modal zIndex={8} size='50%' opened={form.values.addClassModal} onClose={()=>form.setFieldValue('addClassModal', false)} title="Sınıf Ekle">
            <div className='flex w-full justify-between items-end'>
                <div className='md:w-1/3 w-1/2'>
                    <TextInput {...form.getInputProps('nameClass')} label="Sınıf Adı" />
                </div>
                <div className='md:w-1/6 w-1/2'>
                    <Select zIndex={100} dropdownPosition='bottom' data={[
                        {
                            value: 'ATAKUM', label: 'Atakum'
                        },
                        {
                            value: 'PERA', label: 'Pera'
                        }
                    ]} placeholder='Şube seçiniz' {...form.getInputProps('location')}/>
                </div>
            </div>
            <div className='mt-12'>
                <Button onClick={()=>{
                  addClass({
                    location: form.values.location as unknown as "ATAKUM" | "PERA",
                    name: form.values.nameClass
                })
                  form.setFieldValue('addClassModal', false)  
                }} disabled={form.values.nameClass === ""}>Oluştur</Button>
            </div>
        </Modal>
    </>
    )
}
