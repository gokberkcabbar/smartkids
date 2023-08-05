/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { ActionIcon, Button, Loader, Modal, Select, Table, TextInput } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import React, { SetStateAction, useEffect, useState } from 'react';
import { api } from '~/utils/api';
import { useForm } from '@mantine/form';
import { Location, User } from '@prisma/client';
import { IconPencil, IconPlus, IconSearch, IconTrash } from '@tabler/icons-react';
import { StudentsInClassDetail } from './StudentsInClassDetail';
import { StudentsAddToClassTable } from './StudentsAddToClassTable';
import { notifications } from '@mantine/notifications';
import { IconAppWindow } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { EgitimTab } from './studentsProfileGeneric/EgitimTab';
import { useMediaQuery } from '@mantine/hooks';


export type classPageFormTypes = UseFormReturnType<{
  className: string;
  isOpen: boolean;
}, (values: {
  className: string;
  isOpen: boolean;
}) => {
  className: string;
  isOpen: boolean;
}>
export const TableClass = ({form}:{form:UseFormReturnType<{
  searchFilter: string;
  addClassModal: boolean;
  nameClass: string;
  location: "ATAKUM" | "PERA"
  locationFilter: string;
}, (values: {
  searchFilter: string;
  addClassModal: boolean;
  nameClass: string;
  location: "ATAKUM" | "PERA"
  locationFilter: string;
}) => {
  searchFilter: string;
  addClassModal: boolean;
  nameClass: string;
  location: "ATAKUM" | "PERA"
  locationFilter: string;
}>}) => {
  const formClassDetail = useForm<{
    nameClass: string;
    modalClassDetail: boolean;
    location: "ATAKUM" | "PERA"
  }>({
    initialValues: {
      location: 'ATAKUM',
      modalClassDetail: false,
      nameClass: ""
    }
    
  })
  const context = api.useContext()
  const {data: elements, isFetched} = api.class.getClasses.useQuery()
  const {mutate: deleteClass} = api.class.deleteClass.useMutation({
    onSuccess: ()=>{
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      context.class.invalidate()
      notifications.show({
        message: "Sınıf başarıyla silindi",
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
  const [rows, setRows] = useState<React.JSX.Element[]>([])
  const classPageForm = useForm<{
    className: string,
    isOpen: boolean,
  }>({
    initialValues: {
      className: "",
      isOpen: false,
    }
  })
  useEffect(() => {
    if(elements){
        setRows(elements.filter((val)=>{
          if(form.values.locationFilter === "tumu"){
            return val
          }
          if(form.values.locationFilter === "atakum" && val.location === "ATAKUM"){
            return val
          }
          if(form.values.locationFilter === "pera" && val.location === "PERA"){
            return val
          }
        }).filter((val)=>{
          if(val.name.includes(form.values.searchFilter)){
            return val
          }
        }).map((element) => (
            <tr key={element.name}>
              <td>{element.name}</td>
              <td>{element.location}</td>
              <td>{element.user.length}</td>
              <td className='flex flex-row gap-4 items-center mt-[-1px]'><><ActionIcon onClick={()=>{ 
              classPageForm.setFieldValue('className', element.name)
              classPageForm.setFieldValue('isOpen', true)}}><IconAppWindow size={30} /></ActionIcon><ActionIcon onClick={()=>{
              formClassDetail.setFieldValue('modalClassDetail', true)
              formClassDetail.setFieldValue('nameClass', element.name)
            }}><IconPencil size={30} /></ActionIcon> <ActionIcon onClick={()=>deleteClass({name: element.name})}><IconTrash size={30}/></ActionIcon></></td>
            </tr>
          )));
    }
  
  }, [elements, form.values.locationFilter, form.values.searchFilter])
  
  const smBreakpoint = useMediaQuery('(max-width: 48em)')
  return (
    <>
        {isFetched ? (
            <Table striped horizontalSpacing={smBreakpoint ? 0 : 60} highlightOnHover withBorder>
            <thead>
              <tr>
                <th>Sınıf Adı</th>
                <th>Şube</th>
                <th>Kayıtlı Öğrenci Sayısı</th>
                <th>Düzenle / Sil</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        ) : (
            <Loader />
        )}
        <ClassDetailModal formClassDetail={formClassDetail}/>
        <EgitimTab {...classPageForm}/>
    </>
  );
}

const ClassDetailModal = ({formClassDetail}:{formClassDetail:UseFormReturnType<{
  nameClass: string;
  modalClassDetail: boolean;
  location: "ATAKUM" | "PERA"
}, (values: {
  nameClass: string;
  modalClassDetail: boolean;
  location: "ATAKUM" | "PERA"
}) => {
  nameClass: string;
  modalClassDetail: boolean;
  location: "ATAKUM" | "PERA"
}>}) => {
  const {data, isFetched} = api.class.getClassByName.useQuery({name: formClassDetail.values.nameClass})
  const [className, setClassName] = useState("")
  const form = useForm({
    initialValues: {
      studentSearch: "",
      studentAddInClass: false
    }
  })
  useEffect(() => {
    if(data){
      formClassDetail.setFieldValue('nameClass', data.name)
      formClassDetail.setFieldValue('location', data.location)
      setClassName(data.name)
    }
  
  }, [data])
  const router = useRouter()
  
  return (
    <>
    <Modal size="50%" title="Sınıf Detayı" opened={formClassDetail.values.modalClassDetail} onClose={()=>formClassDetail.setFieldValue('modalClassDetail', false)}>
      <>
      {isFetched ? (
        <>
        <div className='flex w-full justify-between items-end'>
        <div className='md:w-1/3 w-1/2'>
            <TextInput value={formClassDetail.values.nameClass} />
        </div>
        <div className='md:w-1/6 w-1/2'>
            <Select zIndex={100} dropdownPosition='bottom' data={[
                {
                    value: 'ATAKUM', label: 'Atakum'
                },
                {
                    value: 'PERA', label: 'Pera'
                }
            ]} placeholder='Şube seçiniz' {...formClassDetail.getInputProps('location')}/>
        </div>
    </div>
    <div className='mt-12 flex flex-row w-full items-center justify-between'>
        <div className='w-1/2'>
          <TextInput icon={<IconSearch size={16}/>} {...form.getInputProps('studentSearch')}/>
        </div>
        <div className='flex flex-row gap-3 items-center'>
          <ActionIcon onClick={()=>router.push(`/protected/admin/class/${className}`)}>
            <IconAppWindow size={20} />
          </ActionIcon>
        <ActionIcon onClick={()=>{
          formClassDetail.setFieldValue('modalClassDetail', false)
          form.setFieldValue('studentAddInClass', true)
        }} variant='filled' color='cyan'>
          <IconPlus size={20} />
        </ActionIcon>
        </div>
    </div>
    <div className='mt-6'>
      
      {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data ? (<StudentsInClassDetail form={form} userInfo={data.user}/>) : (<Loader />)}
    </div>
    </>
      ) : (
        <Loader />
      )}
      </>
    </Modal>
    <StudentAddInClass className={formClassDetail.values.nameClass} form={form} formClassDetail={formClassDetail}/>
    </>
  )
}

const StudentAddInClass = ({form, formClassDetail, className
}:{form:UseFormReturnType<{
  studentSearch: string;
  studentAddInClass: boolean;
}, (values: {
  studentSearch: string;
  studentAddInClass: boolean;
}) => {
  studentSearch: string;
  studentAddInClass: boolean;
}>, formClassDetail: UseFormReturnType<{
  nameClass: string;
  modalClassDetail: boolean;
  location: "ATAKUM" | "PERA"
}, (values: {
  nameClass: string;
  modalClassDetail: boolean;
  location: "ATAKUM" | "PERA"
}) => {
  nameClass: string;
  modalClassDetail: boolean;
  location: "ATAKUM" | "PERA"
}>, className: string}) => {
  const {data: getStudentsExcludeClass} = api.user.getStudentsExcludeClass.useQuery()
  
  const formSearch = useForm({
    initialValues: {
      search: ""
    }
  })
  const context = api.useContext()
  const {mutate: addStudentInClass} = api.class.addStudentInClass.useMutation({
    onSuccess: ()=>{
      context.user.invalidate()
      context.class.invalidate()
    }
  })
  const [selected, setSelected] = useState<User[]>([])
  return (
    <Modal size="50%" title="Sınıfa Öğrenci Ekle" opened={form.values.studentAddInClass} onClose={()=>{
      form.setFieldValue('studentAddInClass', false)
      formClassDetail.setFieldValue('modalClassDetail', true)
    }}>
      <div className='md:w-1/3 w-1/2'>
        <TextInput icon={<IconSearch size={16}/>} {...formSearch.getInputProps('search')} />
      </div>
      <div className='mt-12'>
        {getStudentsExcludeClass ? (<StudentsAddToClassTable selected={selected} setSelected={setSelected} getStudentsExcludeClass={getStudentsExcludeClass} formSearch={formSearch}/>) : (<Loader />)}
      </div>
      <div className='mt-6'>
        <Button onClick={()=>{
          selected.forEach((val)=>{
            if(selected.length !== 0){
              addStudentInClass({name: className, userNo: val.userNo})
            }
            form.setFieldValue('studentAddInClass', false)
            formClassDetail.setFieldValue('modalClassDetail', true)
          })
          setSelected([])
        }}>Ekle</Button>
      </div>
    </Modal>
  )
}