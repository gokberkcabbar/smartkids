/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { ActionIcon, Checkbox, Loader, Table } from '@mantine/core'
import { UseFormReturnType } from '@mantine/form';
import { User } from '@prisma/client';
import { IconTrash, IconUserCircle } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import { api } from '~/utils/api';
import { notifications } from '@mantine/notifications';

export const StudentsInClassDetail = ({form, userInfo}:{form:UseFormReturnType<{
    studentSearch: string;
    studentAddInClass: boolean;
}, (values: {
    studentSearch: string;
    studentAddInClass: boolean;
}) => {
    studentSearch: string;
    studentAddInClass: boolean;
}>, userInfo: User[]}) => {
  const [selected, setSelected] = useState<User[]>([])
  const [rows, setRows] = useState<React.JSX.Element[]>([])
  const router = useRouter()
  const context = api.useContext()
  const {mutate:deleteStudentFromClass, isLoading: loadingDeleteStudentFromClass}  = api.class.deleteStudentFromClass.useMutation({
    onSuccess: ()=>{
        context.class.invalidate()
        context.user.invalidate()
        notifications.show({
            message: "Öğrenci başarıyla silindi",
            color: 'green',
            autoClose: 2000,
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
  useEffect(() => {
    if(userInfo){
        setRows(userInfo.filter((val)=>{
            if(val.name.includes(form.values.studentSearch) || val.userNo.includes(form.values.studentSearch)){
                return val
            }
        }).map((element)=>{
            return (
                <tr key={element.userNo}>
                    <td>{<Checkbox onClick={(e)=>{
                        const isChecked = e.currentTarget.checked
                        if(isChecked){
                            const selectedUpdate = [...selected, element]
                            setSelected(selectedUpdate)
                        }
                        if(!isChecked){
                            const filteredSelected = [...selected].filter((val)=>JSON.stringify(val) !== JSON.stringify(element))
                            setSelected(filteredSelected)
                        }
                    }}/>}</td>
                    <td>{element.userNo}</td>
                    <td>{element.name}</td>
                    <td className='flex flex-row gap-4 items-center mt-[-1px]'>
                        <ActionIcon onClick={()=>router.push(`/protected/student/profile/${element.userNo}`)}>
                            <IconUserCircle size={20} />
                        </ActionIcon>
                        <ActionIcon disabled={loadingDeleteStudentFromClass} onClick={()=>deleteStudentFromClass({userNo: element.userNo})}>
                            {loadingDeleteStudentFromClass ? <Loader /> : <IconTrash size={20} />}
                        </ActionIcon>
                    </td>
                </tr>
            )
        }))
    }
  
    
  }, [userInfo, form.values.studentSearch, selected])
  
  return (
    <>
    {userInfo ? (
        <Table horizontalSpacing={"xl"} highlightOnHover>
        <thead>
            <tr>
                <th>
                    <ActionIcon onClick={()=>{
                        selected.forEach((val)=>{
                            if(selected.length !== 0){
                                deleteStudentFromClass({userNo: val.userNo})
                            }
                        })
                        setSelected([])
                    }} variant='filled' color='red'>
                        <IconTrash size={24}/>
                    </ActionIcon>
                </th>
                <th>Öğrenci No</th>
                <th>Öğrenci Adı</th>
                <th>Profil / Sil</th>
            </tr>
        </thead>
        <tbody>{rows}</tbody>
    </Table>
    ) : (<Loader />)}
    </>
  )
}
