import { Loader, Table } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { useEffect, useState } from 'react';
import { api } from '~/utils/api';

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

  const {data: elements, isFetched} = api.class.getClasses.useQuery()
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