import { Tabs } from '@mantine/core'
import { UseFormReturnType } from '@mantine/form';
import React from 'react'

export const TabButtonStudent = ({studentsForm}:{studentsForm:UseFormReturnType<{
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
  return (
    <Tabs variant="pills" defaultValue="tumu">
      <Tabs.List>
        <Tabs.Tab onClick={()=>studentsForm.setFieldValue('isVerified', "tumu")} value="tumu">Tümü</Tabs.Tab>
        <Tabs.Tab onClick={()=>studentsForm.setFieldValue('isVerified', "kayit")} value="kayitli">Kayıtlı</Tabs.Tab>
        <Tabs.Tab onClick={()=>studentsForm.setFieldValue('isVerified', "onkayit")} value="onkayit">Ön Kayıt</Tabs.Tab>
      </Tabs.List>
    </Tabs>
  )
}
