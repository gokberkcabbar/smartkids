import { Tabs } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { IconPhoto, IconMessageCircle, IconSettings } from '@tabler/icons-react';

export const TabButton = ({form}:{form:UseFormReturnType<{
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
  return (
    <Tabs variant="pills" defaultValue="gallery">
      <Tabs.List>
        <Tabs.Tab onClick={()=>form.setFieldValue('locationFilter', "tumu")} value="tumu">Tümü</Tabs.Tab>
        <Tabs.Tab onClick={()=>form.setFieldValue('locationFilter', "atakum")} value="atakum">Atakum</Tabs.Tab>
        <Tabs.Tab onClick={()=>form.setFieldValue('locationFilter', "pera")} value="pera">Pera</Tabs.Tab>
      </Tabs.List>
    </Tabs>
  );
}