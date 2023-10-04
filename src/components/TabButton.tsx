import { Tabs } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { IconPhoto, IconMessageCircle, IconSettings } from '@tabler/icons-react';

export const TabButton = ({form}:{form:UseFormReturnType<{
  searchFilter: string;
    addClassModal: boolean;
    nameClass: string;
    location: "ATAKUM" | "PERA"
    locationFilter: string;
    regularDay: string,
    regularHour: string,
    regularMinute: number,
    startingMonth: Date | null,
    endingMonth: Date | null,
}, (values: {
  searchFilter: string;
    addClassModal: boolean;
    nameClass: string;
    location: "ATAKUM" | "PERA"
    locationFilter: string;
    regularDay: string,
    regularHour: string,
    regularMinute: number,
    startingMonth: Date | null,
    endingMonth: Date | null,
}) => {
  searchFilter: string;
    addClassModal: boolean;
    nameClass: string;
    location: "ATAKUM" | "PERA"
    locationFilter: string;
    regularDay: string,
    regularHour: string,
    regularMinute: number,
    startingMonth: Date | null,
    endingMonth: Date | null,
}>}) => {
  return (
    <Tabs variant="pills" defaultValue="tumu">
      <Tabs.List>
        <Tabs.Tab onClick={()=>form.setFieldValue('locationFilter', "tumu")} value="tumu">Tümü</Tabs.Tab>
        <Tabs.Tab onClick={()=>form.setFieldValue('locationFilter', "atakum")} value="atakum">Atakum</Tabs.Tab>
        <Tabs.Tab onClick={()=>form.setFieldValue('locationFilter', "pera")} value="pera">Pera</Tabs.Tab>
      </Tabs.List>
    </Tabs>
  );
}