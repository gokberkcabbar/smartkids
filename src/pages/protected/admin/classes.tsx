/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ActionIcon, AppShell, Box, Button, Container, Grid, Group, Loader, MultiSelect, Select, TextInput, rem } from '@mantine/core'
import { IconPlus, IconSearch } from '@tabler/icons-react'
import React, { useRef, useState } from 'react'
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
import { notifications } from '@mantine/notifications'
import { DateInput, TimeInput } from '@mantine/dates'
import { IconClock } from '@tabler/icons-react'
import { useMediaQuery } from '@mantine/hooks'

const Classes: NextPage = ({session}:any) => {

  const form = useForm<{
    searchFilter: string;
    addClassModal: boolean;
    nameClass: string;
    location: "ATAKUM" | "PERA"
    locationFilter: string;
    regularDay: string[],
    regularHour: string,
    regularMinute: number,
    startingMonth: Date | null,
    endingMonth: Date | null,
  }>({
    initialValues: {
        searchFilter: "",
        addClassModal: false,
        nameClass: "",
        location: "ATAKUM",
        locationFilter: "tumu",
        regularDay: [],
        regularHour: "",
        regularMinute: 0,
        startingMonth: null,
        endingMonth: null,
    }
  })
  return (
    <AppShell header={<HeaderBar />} className='mb-[-40px]'>
        <div className='h-full w-full flex'>
            <Container className='w-full h-auto mt-14' size="xl">
                <div className='flex flex-row justify-between items-center'>
                    <TabButton form={form}/>
                    
                    <div className='flex gap-x-6 items-center justify-center flex-row min-w-[200px] max-w-[100px] md:max-w-[600px]'>
                        <ActionIcon onClick={()=>form.setFieldValue('addClassModal', true)} color='cyan' variant='filled'>
                            <IconPlus size={18} />
                        </ActionIcon>
                        <TextInput width={'100%'} icon={<IconSearch size={16}/>} {...form.getInputProps('searchFilter')} />
                    </div>
                </div>
                <div style={{height: 'calc(100vh - 300px)'}} className='w-full flex flex-col mt-24'>
                 <Box sx={{overflow: 'auto'}}>
                    <Box>
                    <TableClass form={form} />
                    </Box>
                 </Box>
                </div>
            </Container>
        </div>
        <ClassModal form={form}/>
    </AppShell>
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
    location: "ATAKUM" | "PERA"
    locationFilter: string;
    regularDay: string[],
    regularHour: string,
    regularMinute: number,
    startingMonth: Date | null,
    endingMonth: Date | null,
}, (values: {
    searchFilter: string;
    addClassModal: boolean;
    nameClass: string;
    location: "ATAKUM" | "PERA"
    locationFilter: string;
    regularDay: string[],
    regularHour: string,
    regularMinute: number,
    startingMonth: Date | null,
    endingMonth: Date | null,
}) => {
    searchFilter: string;
    addClassModal: boolean;
    nameClass: string;
    location: "ATAKUM" | "PERA"
    locationFilter: string;
    regularDay: string[],
    regularHour: string,
    regularMinute: number,
    startingMonth: Date | null,
    endingMonth: Date | null,
}>}) => {
    const context = api.useContext()
    const ref = useRef<HTMLInputElement>(null);
    const {mutate: addClass, isLoading: loadingAddClass} = api.class.addClass.useMutation({
        onSuccess: ()=>{
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            context.class.invalidate()
            notifications.show({
                message: "Sınıf başarıyla oluşturuldu",
                color: 'green',
                autoClose: 2000
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
    console.log(form.values.regularDay)
    const smBreakpoint = useMediaQuery('(min-width: 768px)')
    return (
        <>
        <Modal h='100%' size={smBreakpoint ? '50%' : "100%"} opened={form.values.addClassModal} onClose={()=>form.setFieldValue('addClassModal', false)} title="Sınıf Ekle">
            <div className='flex w-full justify-between items-end z-[10000000000000]'>
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
            <div className='mt-32 w-full'>
                <Grid gutter={'xl'}>
                    <Grid.Col span={6}>
                        <MultiSelect multiple={true} maxDropdownHeight={100} zIndex={500} dropdownPosition='bottom' data={[
                            {
                                value: "1", label: "Pazartesi"
                            },
                            {
                                value: "2", label: "Salı"
                            },
                            {
                                value: "3", label: "Çarşamba"
                            },
                            {
                                value: "4", label: "Perşembe"
                            },
                            {
                                value: "5", label: "Cuma"
                            },
                            {
                                value: "6", label: "Cumartesi"
                            },
                            {
                                value: "0", label: "Pazar"
                            },
                            
                        ]} label="Ders Günü" {...form.getInputProps('regularDay')} />
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <TimeInput label="Ders Saati" ref={ref} rightSection={<ActionIcon variant="subtle" color="gray" onClick={() => ref.current?.showPicker()}>
      <IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
    </ActionIcon>} {...form.getInputProps('regularHour')} />
                    </Grid.Col>
                    <Grid.Col span={12} md={6}>
                        <DateInput label="Sınf Başlangıç Zamanı" {...form.getInputProps('startingMonth')}/>
                    </Grid.Col>
                    <Grid.Col span={6} md={6}>
                        <DateInput label="Sınıf Bitiş Günü" {...form.getInputProps('endingMonth')}/>
                    </Grid.Col>
                </Grid>
            </div>
            <div className='mt-12'>
                <Button onClick={()=>{
                  addClass({
                    location: form.values.location,
                    name: form.values.nameClass,
                    regularDay: form.values.regularDay.map((val)=>parseInt(val, 10)),
                    regularHour: parseInt(form.values.regularHour.replace(":", ""), 10),
                    startingMonth: form.values.startingMonth as Date,
                    endingMonth: form.values.endingMonth as Date
                })
                  form.setFieldValue('addClassModal', false)  
                }} disabled={form.values.nameClass === "" || form.values.endingMonth === null || !form.isDirty('regularHour') || form.values.startingMonth === null || loadingAddClass}>{loadingAddClass ? <Loader /> : "Oluştur"}</Button>
            </div>
        </Modal>
    </>
    )
}
