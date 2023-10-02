/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-floating-promises */
import React, { ChangeEvent, useEffect, useState } from 'react'
import { PageProps } from '~/pages/protected/student/profile/[userId]'
import { useRouter } from 'next/router'
import { Avatar, Badge, Button, Divider, Grid, Loader, Menu, Modal, PasswordInput, TextInput } from '@mantine/core'
import { UseFormReturnType, useForm } from '@mantine/form'
import { api } from '~/utils/api'
import {notifications} from '@mantine/notifications'

export const ProfileTab = ({props}: {props: PageProps}) => {
  const router = useRouter()
  const parsedURL = router.query
  const context = api.useContext()
  const {data: classes} = api.class.getClasses.useQuery(undefined, {
    refetchOnWindowFocus: false
  })
  const {mutate: updateStudentInfo, isLoading: loadingUpdateStudentInfo} = api.user.updateStudentInfo.useMutation({
    onSuccess: ()=>{
        context.user.invalidate()
        context.class.invalidate()
        notifications.show({
            message: "Kullanıcı bilgileri güncellendi",
            color: 'green',
            autoClose: 2000,
            onClose: ()=>{
                router.reload()
            }
        })
    },
    onError: (error) => {
        const errorMessage = error.message
        notifications.show({
            color: 'red',
            message: errorMessage,
            autoClose: 2000,
        })
    }
  })
  const [atakumClasses, setAtakumClasses] = useState<React.JSX.Element[]>([])
  const [peraClasses, setPeraClasses] = useState<React.JSX.Element[]>([])
  const [openPasswordModal, setOpenPasswordModal] = useState<boolean>(false)
  const [hoverImage, setHoverImage] = useState<boolean>(false)
  const form = useForm({
    initialValues: {
        name: props.userInfo.name,
        userNo: props.userInfo.userNo!,
        class: props.userInfo.classInfo,
        fName: props.userInfo.fName,
        fPhone: props.userInfo.fPhone,
        mName: props.userInfo.mName,
        mPhone: props.userInfo.mPhone,
        tPhone: props.userInfo.tPhone,
        fJob: props.userInfo.fJob,
        mJob: props.userInfo.mJob,
        image: props.userInfo.image
    }
  })
  useEffect(() => {
    if(classes){
        setAtakumClasses(classes.filter((val)=>{
            if(val.location === "ATAKUM"){
                return val
            }
        }).map((val)=>{
            return (
                <Menu.Item onClick={()=>form.setFieldValue('class', val.name)} key={val.name}>
                    {val.name}
                </Menu.Item>
            )
        }))
    

    setPeraClasses(classes.filter((val)=>{
        if(val.location === "PERA"){
            return val
        }
    }).map((val)=>{
        return (
            <Menu.Item onClick={()=>form.setFieldValue('class', val.name)} key={val.name}>
                {val.name}
            </Menu.Item>
        )
    }))
}
  
   }   , [classes])

   const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = event.target.files?.[0];
  
    if (file) {
      const reader = new FileReader();
  
      reader.onloadend = (e: ProgressEvent<FileReader>) => {
        const base64Data = e.target?.result as string;
        form.setFieldValue('image', base64Data);
      };
  
      if (file.type && file.type.includes('image')) {
        reader.readAsDataURL(file);
      } else if (file instanceof Blob) {
        // Handle capturing image from camera or photo library on mobile
        const fileReader = new FileReader();
        fileReader.onloadend = (e: ProgressEvent<FileReader>) => {
          const base64Data = e.target?.result as string;
          form.setFieldValue('image', base64Data);
        };
        fileReader.readAsDataURL(file);
      }
    }
  };
  console.log(router.query)
  return (
    <>
        <div className='flex flex-col w-full h-full items-center'>
            <div className='flex flex-col w-full h-full [@media(min-width:768px)]:w-[50%] items-center'>

            <div className='flex [@media(min-width:768px)]:flex-row flex-col w-full justify-between items-center'>
                <div className='relative w-1/2 flex justify-center items-center [@media(min-width:768px)]:w-3/4'>
                <div className='relative hidden [@media(min-width:768px)]:block'>
                    <Avatar onMouseEnter={()=>setHoverImage(true)} radius={300} size={300} src={form.values.image || "https://static.thenounproject.com/png/1211233-200.png"} />   
                    <Button radius={300} onClick={()=>{
                        const fileInput = document.createElement('input');
                        fileInput.type = 'file';
                        fileInput.accept = 'image/*';
                        fileInput.addEventListener('change', handleImageUpload as unknown as EventListener);
                        fileInput.click();
                    }} onMouseLeave={()=>setHoverImage(false)} className={`absolute h-full top-0 left-0 right-0 bg-slate-500/10 z-30 bottom-0 ${hoverImage ? "block hover:bg-slate-500/10" : "hidden"}`}>+</Button>    
                </div>
                <div className='relative block [@media(min-width:768px)]:hidden'>
                    <Avatar onMouseEnter={()=>setHoverImage(true)} radius={150} size={150} src={form.values.image || "https://static.thenounproject.com/png/1211233-200.png"} />   
                    <Button radius={150} onClick={()=>{
                        const fileInput = document.createElement('input');
                        fileInput.type = 'file';
                        fileInput.accept = 'image/*';
                        fileInput.addEventListener('change', handleImageUpload as unknown as EventListener);
                        fileInput.click();
                    }} onMouseLeave={()=>setHoverImage(false)} className={`absolute h-full top-0 left-0 right-0 bg-slate-500/10 z-30 bottom-0 ${hoverImage ? "block hover:bg-slate-500/10" : "hidden"}`}>+</Button>    
                </div>
                </div>
                <div className='flex flex-col gap-4'>
                    <TextInput {...form.getInputProps('name')} label="Ad Soyad" />
                    <TextInput value={form.values.userNo} label="Öğrenci No" disabled/>
                    {parsedURL.userId === props.currentSession.user.userNo ? (
                        <Button onClick={()=>setOpenPasswordModal(true)} variant='default'>Şifre Güncelle</Button>
                    ) : (
                        null
                    )}
                </div>
            </div>
            <Grid className='mt-10'>
                <Grid.Col span={6} sm={4} className='flex flex-col items-start mt-6 justify-center'>
                    {props.currentSession.user.role === "ADMIN" ? (
                        <Menu>
                        <Menu.Target>
                            <Button variant='default'>{form.values.class}</Button>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Label>Atakum</Menu.Label>
                            {atakumClasses}
                            <Divider/>
                            <Menu.Label>Pera</Menu.Label>
                            {peraClasses}
                        </Menu.Dropdown>
                    </Menu>
                    ) : (
                        <Button variant='default' disabled>{form.values.class}</Button>
                    )}
                </Grid.Col>
                <Grid.Col span={6} sm={4}>
                    <TextInput {...form.getInputProps('fName')} label="Baba Adı Soyadı"/>
                </Grid.Col>
                <Grid.Col span={6} sm={4}>
                    <TextInput {...form.getInputProps('fPhone')} label="Baba Telefon No"/>
                </Grid.Col>
                <Grid.Col span={6} sm={4}>
                    <TextInput {...form.getInputProps('mName')} label="Anne Adı Soyadı"/>
                </Grid.Col>
                <Grid.Col span={6} sm={4}>
                    <TextInput {...form.getInputProps('mPhone')} label="Anne Telefon No"/>
                </Grid.Col>
                <Grid.Col span={6} sm={4}>
                    <TextInput {...form.getInputProps('tPhone')} label="Üçüncü Telefon No"/>
                </Grid.Col>
                {props.currentSession.user.role === "ADMIN" ? (
                    <>
                <Grid.Col span={6}>
                    <TextInput {...form.getInputProps('fJob')} label="Baba Mesleği"/>
                </Grid.Col>
                <Grid.Col span={6}>
                    <TextInput {...form.getInputProps('mJob')} label="Anne Mesleği"/>
                </Grid.Col>
                </>
                ) : (
                    null
                )}
                <Grid.Col span={6}>
                    <Button onClick={()=>{
                        updateStudentInfo({
                            name: form.values.name,
                            className: form.values.class,
                            userNo: form.values.userNo,
                            fJob: form.values.fJob,
                            mJob: form.values.mJob,
                            fName: form.values.fName,
                            fPhone: form.values.fPhone,
                            image: form.isDirty('image') ? form.values.image : undefined,
                            mName: form.values.mName,
                            mPhone: form.values.mPhone,
                            tPhone: form.values.tPhone
                        })
                    }} disabled={!form.isDirty() || loadingUpdateStudentInfo}>{loadingUpdateStudentInfo ? <Loader /> : "Bilgileri Güncelle"}</Button>
                </Grid.Col>
            </Grid>
            </div>
        </div>
        <PasswordUpdateModal userNo={props.userInfo.userNo} openPasswordModal={openPasswordModal} setOpenPasswordModal={setOpenPasswordModal} />
    </>

  )
}


const PasswordUpdateModal = ({userNo, openPasswordModal, setOpenPasswordModal}:{userNo:string | undefined, openPasswordModal: boolean, setOpenPasswordModal: React.Dispatch<React.SetStateAction<boolean>>}) => {
    const passwordForm = useForm({
        initialValues: {
            password: ""
        }
    })
    const specialCharacters = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', ',', '.', '?', '"', ':', '{', '}', '|', '<', '>', '/'];
    const context = api.useContext()
    const {mutate: updatePassword} = api.user.updatePassword.useMutation({
        onSuccess: ()=>{
            context.user.invalidate()
            setOpenPasswordModal(false)
        }
    })
    return (
        <Modal size="30%" opened={openPasswordModal} onClose={()=>{
            setOpenPasswordModal(false),
            passwordForm.reset()
        }}>
            <PasswordInput {...passwordForm.getInputProps('password')} label="Şifre" description="Şifreniz en az 6 haneli olmalı." error={specialCharacters.some((char) => passwordForm.values.password.includes(char)) ? "Özel karakter kullanmayınız" : false} />
            <Button onClick={()=>updatePassword({
                password: passwordForm.values.password,
                userNo: userNo!
            })} className='mt-4' disabled={specialCharacters.some((char) => passwordForm.values.password.includes(char))} variant='light' color='cyan'>Şifreyi Güncelle</Button>
        </Modal>
    )
}