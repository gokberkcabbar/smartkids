/* eslint-disable @typescript-eslint/no-misused-promises */
import { ActionIcon, Loader, Table } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { IconLogin, IconTrash } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { api } from '~/utils/api'

export const TableStudent = ({studentsForm}:{studentsForm:UseFormReturnType<{
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
    const context = api.useContext()
    const {data: getAllStudents, isFetched} = api.user.getAllStudents.useQuery()
    const {mutate: addUser} = api.user.addUser.useMutation({
        onSuccess: ()=>{
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            context.user.invalidate()
        }
    })
    const {mutate: deleteUser} = api.user.deleteUser.useMutation({
        onSuccess: ()=>{
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            context.user.invalidate()
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            context.class.invalidate()
        }
    })
    const [rows, setRows] = useState<React.JSX.Element[]>([])
    const router = useRouter()
    useEffect(() => {
      if(getAllStudents){
          setRows(getAllStudents.filter((val)=>{
            if(studentsForm.values.isVerified === "tumu"){
              return val
            }
            if(studentsForm.values.isVerified === "kayit" && val.classId){
              return val
            }
            if(studentsForm.values.isVerified === "onkayit" && !val.classId){
              return val
            }
          }).filter((val)=>{
             if(studentsForm.values.filterBy === "İsim / Numara" && val.name.includes(studentsForm.values.searchFilter)){
                return val
             }
             else if(studentsForm.values.filterBy === "Sınıf" && val.class?.name.includes(studentsForm.values.searchFilter)){
                return val
             
             }   
              

             else if(studentsForm.values.filterBy === "Anne Mesleği" && val.mJob?.includes(studentsForm.values.searchFilter)){
                return val
             }
             else if(studentsForm.values.filterBy === "Baba Mesleği" && val.fJob?.includes(studentsForm.values.searchFilter)){
                return val
             }
        
          }).map((element) => {
            return (
              <tr key={element.name}>
                <td className='flex flex-row gap-x-4 justify-center items-center mt-[-1px]'><><ActionIcon onClick={()=>router.push(`/protected/student/profile/${element.userNo}`)}><IconLogin size={30} /></ActionIcon> <ActionIcon onClick={()=>deleteUser({userNo: element.userNo})}><IconTrash size={30}/></ActionIcon></></td>
                <td>{element.userNo}</td>
                <td>{element.name}</td>
                <td>{element.class?.name || "Ön Kayıt"}</td>
                <td>{element.age}</td>
                <td>{element.transaction[-1]?.paid ? element.transaction[-1]?.transactionFor : element.transaction[-1]?.paid}</td>
                <td>{element.schoolClass}</td>
                <td>{element.fName}</td>
                <td>{element.fJob}</td>
                <td>{element.fPhone}</td>
                <td>{element.mName}</td>
                <td>{element.mJob}</td>
                <td>{element.mPhone}</td>
                <td>{element.tPhone}</td>
              </tr>
            )}));
            
      }
      console.log(rows)
    }, [getAllStudents, studentsForm.values])
    
  
    return (
      <>
          {isFetched ? (
              <Table striped horizontalSpacing={16} highlightOnHover withBorder>
              <thead>
                <tr>
                  <th>Profil / Sil</th>
                  <th>Öğrenci No</th>
                  <th>Öğrenci Adı Soyadı</th>
                  <th>Sınıf</th>
                  <th>Yaş</th>
                  <th>En son yapılan Ödeme</th>
                  <th>Kaçıncı Sınıf</th>
                  <th>Baba Adı</th>
                  <th>Baba Mesleği</th>
                  <th>Baba Tel No.</th>
                  <th>Anne Adı</th>
                  <th>Anne Mesleği</th>
                  <th>Anne Tel No.</th>
                  <th>3. Tel No.</th>
                </tr>
              </thead>
              <tbody>{rows}</tbody>
            </Table>
          ) : (
              <Loader />
          )}
      </>
    );
  }