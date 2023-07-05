import { Button, Menu } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { api } from '~/utils/api'
import { UseFormReturnType } from '@mantine/form'
export const AddStudentModalClassDropDownButton = ({classForm}:{classForm:UseFormReturnType<{
    classValue: string;
}, (values: {
    classValue: string;
}) => {
    classValue: string;
}>}) => {
  
  const {data: getClasses} = api.class.getClasses.useQuery()
  const [classAtakum, setclassAtakum] = useState<React.JSX.Element[]>([])
  const [classPera, setClassPera] = useState<React.JSX.Element[]>([])
  useEffect(() => {
    if(getClasses){
        setclassAtakum(getClasses.filter((val)=>val.location === "ATAKUM").map((val)=>{
            return (
                <Menu.Item key={val.name} onClick={()=>classForm.setFieldValue('classValue', val.name)}>{val.name}</Menu.Item>
            )
        }))
        setClassPera(getClasses.filter((val)=>val.location === "PERA").map((val)=>{
            return (
                <Menu.Item key={val.name} onClick={()=>classForm.setFieldValue('classValue', val.name)}>{val.name}</Menu.Item>
            )
        }))
    }
    
    
  }, [getClasses])
  
  return (
    <Menu>
        <Menu.Target>
            <Button variant='light' value={classForm.values.classValue} color='indigo'>{classForm.values.classValue === "" ? "Şube Seç" : classForm.values.classValue}</Button>
        </Menu.Target>
        <Menu.Dropdown>
            <Menu.Label>Atakum</Menu.Label>
            <Menu.Divider />
            {classAtakum}
            <Menu.Divider />
            <Menu.Label>Pera</Menu.Label>
            <Menu.Divider />
            {classPera}
        </Menu.Dropdown>
    </Menu>
  )
}
