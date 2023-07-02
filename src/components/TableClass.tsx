import { ActionIcon, Loader, Modal, Table } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { useEffect, useState } from 'react';
import { api } from '~/utils/api';
import { useForm } from '@mantine/form';
import { Location } from '@prisma/client';
import { IconPencil, IconTrash } from '@tabler/icons-react';

export const TableClass = ({form}:{form:UseFormReturnType<{
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
  const formClassDetail = useForm({
    initialValues: {
      nameClass: "",
      modalClassDetail: false
    }
  })
  const context = api.useContext()
  const {data: elements, isFetched} = api.class.getClasses.useQuery()
  const {mutate: deleteClass} = api.class.deleteClass.useMutation({
    onSuccess: ()=>{
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      context.class.invalidate()
    }
  })
  const [rows, setRows] = useState<React.JSX.Element[]>([])
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
              formClassDetail.setFieldValue('modalClassDetail', true)
              formClassDetail.setFieldValue('nameClass', element.name)
            }}><IconPencil size={30} /></ActionIcon> <ActionIcon onClick={()=>deleteClass({name: element.name})}><IconTrash size={30}/></ActionIcon></></td>
            </tr>
          )));
    }
  
  }, [elements, form.values.locationFilter, form.values.searchFilter])
  

  return (
    <>
        {isFetched ? (
            <Table striped horizontalSpacing={60} highlightOnHover withBorder>
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
    </>
  );
}

const ClassDetailModal = ({formClassDetail}:{formClassDetail:UseFormReturnType<{
  nameClass: string;
  modalClassDetail: boolean;
}, (values: {
  nameClass: string;
  modalClassDetail: boolean;
}) => {
  nameClass: string;
  modalClassDetail: boolean;
}>}) => {
  const {data, isFetched} = api.class.getClassByName.useQuery({name: formClassDetail.values.nameClass})
  console.log(data?.user)
  return (
    <Modal opened={formClassDetail.values.modalClassDetail} onClose={()=>formClassDetail.setFieldValue('modalClassDetail', false)}>
      <div>{data?.name}</div>
    </Modal>
  )
}