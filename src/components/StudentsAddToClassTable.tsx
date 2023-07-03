import { ActionIcon, Checkbox, Loader, Table } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { User } from '@prisma/client'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { api } from '~/utils/api'

export const StudentsAddToClassTable = ({getStudentsExcludeClass, formSearch, selected, setSelected}:{getStudentsExcludeClass: User[], formSearch: UseFormReturnType<{
    search: string;
}, (values: {
    search: string;
}) => {
    search: string;
}>, selected: User[], setSelected: Dispatch<SetStateAction<User[]>>}) => {
  
  const [rows, setRows] = useState<React.JSX.Element[]>([])
  const context = api.useContext()
  useEffect(() => {
    if(getStudentsExcludeClass){
        setRows(getStudentsExcludeClass.filter((val)=>{
            if(val.name.includes(formSearch.values.search) || val.userNo.includes(formSearch.values.search)){
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
                        console.log(selected)
                    }}/>}</td>
                    <td>{element.userNo}</td>
                    <td>{element.name}</td>
                </tr>
            )
        }))
    }
  
    
  }, [getStudentsExcludeClass, formSearch.values.search, selected])
  
  return (
    <>
    {getStudentsExcludeClass ? (
        <Table horizontalSpacing={"xl"} highlightOnHover>
        <thead>
            <tr>
                <th></th>
                <th>Öğrenci No</th>
                <th>Öğrenci Adı</th>
            </tr>
        </thead>
        <tbody>{rows}</tbody>
    </Table>
    ) : (<Loader />)}
    </>
  )
}
