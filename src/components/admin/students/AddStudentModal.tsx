/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { Button, Loader, Modal, NumberInput, TextInput, Title } from '@mantine/core'
import { UseFormReturnType, useForm } from '@mantine/form'
import React, { useEffect } from 'react'
import { api } from '~/utils/api'
import { generateRandomPassword } from '~/utils/generatePassword'
import { AddStudentModalClassDropDownButton } from './AddStudentModalClassDropDownButton'
import { notifications } from '@mantine/notifications'



export const AddStudentModal = ({studentsForm}:{studentsForm:UseFormReturnType<{
    isVerified: "tumu" | "kayit" | "onkayit";
    addStudentModal: boolean;
    searchFilter: string;
    filterBy: "İsim / Numara" | "Sınıf" | "Baba Mesleği" | "Anne Mesleği" | "Ödeme";
}, (values: {
    isVerified: "tumu" | "kayit" | "onkayit";
    addStudentModal: boolean;
    searchFilter: string;
    filterBy: "İsim / Numara" | "Sınıf" | "Baba Mesleği" | "Anne Mesleği" | "Ödeme";
}) => {
    isVerified: "tumu" | "kayit" | "onkayit";
    addStudentModal: boolean;
    searchFilter: string;
    filterBy: "İsim / Numara" | "Sınıf" | "Baba Mesleği" | "Anne Mesleği" | "Ödeme";
}>}) => {
  const newStudentForm = useForm<{
    name: string,
    age: number | undefined,
    userNo: string,
    className: string | undefined,
    schoolClass: string | undefined,
    fName: string | undefined,
    fJob: string | undefined,
    fPhone: string | undefined,
    mName: string | undefined,
    mJob: string | undefined,
    mPhone: string | undefined,
    tPhone: string | undefined,
    password: string
  }>({
    initialValues: {
        name: "",
        age: undefined,
        userNo: "",
        className: undefined,
        schoolClass: undefined,
        password: generateRandomPassword(),
        fJob: undefined,
        fName: undefined,
        fPhone: undefined,
        mJob: undefined,
        mName: undefined,
        mPhone: undefined,
        tPhone: undefined
    }
  })
  const {data: createUserNo} = api.user.createUniqueUserNo.useQuery(undefined, {
    refetchOnWindowFocus: false
  })
  const context = api.useContext() 
  const {mutate: addUser, isLoading: loadingAddUser} = api.user.addUser.useMutation({
    onSuccess: ()=>{
        context.user.invalidate()
        context.class.invalidate()
        notifications.show({
            message: "Öğrenci başarıyla eklendi",
            color: 'green',
            autoClose: 1000,
            onClose: ()=>{
                classForm.reset()
                newStudentForm.reset()
                studentsForm.setFieldValue('addStudentModal', false)
            }
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
  const classForm = useForm({
    initialValues: {
        classValue: "",
    }
  })  
  useEffect(() => {
    if(createUserNo){
        newStudentForm.setFieldValue('userNo', createUserNo)
    }
    if(createUserNo === false){
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        context.user.invalidate()
    }
  }, [createUserNo])

  
  return (
    <Modal size='50%' title='Öğrenci Ekle' opened={studentsForm.values.addStudentModal} onClose={()=>studentsForm.setFieldValue('addStudentModal', false)}>
        <div className='flex flex-col w-full'>
            <div className='flex flex-row justify-between items-center'>
                <TextInput disabled {...newStudentForm.getInputProps('userNo')} className='w-1/3' label="Öğrenci No" />
                <TextInput disabled value={newStudentForm.values.password} className='w-1/3' label="Şifre" />
            </div>
            <div className='flex flex-row mt-8 justify-between items-center'>
                <TextInput {...newStudentForm.getInputProps('name')} label="Öğrenci Adı ve Soyadı" withAsterisk />
                <AddStudentModalClassDropDownButton classForm={classForm}/>
            </div>
            <div className='flex justify-center mt-8 items-center'>
                <Title>Öğrenci ve Veli Ek Bilgileri</Title>
            </div>
            <div className='flex flex-col justify-center items-center'>
                <div className='w-[80%]'>
                <div className='flex flex-row justify-between items-center mt-4'>
                <NumberInput {...newStudentForm.getInputProps('age')} label="Öğrencinin Yaşı" />
                <TextInput {...newStudentForm.getInputProps('schoolClass')} label="Öğrenci kaçıncı sınıf?" />
            </div>
            <div className='flex flex-row justify-between items-center'>
                <div className='flex flex-col gap-4'>
                    <TextInput {...newStudentForm.getInputProps('mName')} label="Anne adı ve soyadı"/>
                    <TextInput {...newStudentForm.getInputProps('mPhone')} label="Anne telefon numarası"/>
                    <TextInput {...newStudentForm.getInputProps('mJob')} label="Anne mesleği"/>
                </div>
                <div className='flex flex-col gap-4'>
                    <TextInput {...newStudentForm.getInputProps('fName')} label="Baba adı ve soyadı"/>
                    <TextInput {...newStudentForm.getInputProps('fPhone')} label="Baba telefon numarası"/>
                    <TextInput {...newStudentForm.getInputProps('fJob')} label="Baba mesleği"/>
                </div>
            </div>
            <TextInput {...newStudentForm.getInputProps('tPhone')} label="Üçüncü telefon numarası" className='mt-8' />
                </div>
            </div>
            <Button disabled={newStudentForm.values.name === "" || loadingAddUser} className='mt-8' onClick={()=>{
                addUser({
                    name: newStudentForm.values.name,
                    password: newStudentForm.values.password,
                    userName: newStudentForm.values.userNo,
                    age: newStudentForm.values.age,
                    className: classForm.values.classValue,
                    fJob: newStudentForm.values.fJob,
                    fName: newStudentForm.values.fName,
                    fPhone: newStudentForm.values.fPhone,
                    mJob: newStudentForm.values.mJob,
                    mName: newStudentForm.values.mName,
                    mPhone: newStudentForm.values.mPhone,
                    schoolClass: newStudentForm.values.schoolClass,
                    tPhone: newStudentForm.values.tPhone,
                })
            }}>{loadingAddUser ? <Loader /> : "Kaydet"}</Button>
        </div>
    </Modal>
  )
}
