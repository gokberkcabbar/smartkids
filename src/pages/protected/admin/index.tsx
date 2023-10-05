import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { Location, Role } from "@prisma/client";
import { requireAdminAuth } from "~/utils/requireAdminAuth";
import { HeaderBar } from "~/components/HeaderBar";
import {
  AppShell,
  Card,
  Container,
  Divider,
  Grid,
  Indicator,
  Loader,
  Text,
} from "@mantine/core";
import { api } from "~/utils/api";
import { Stats } from "~/components/admin/Stats";
import { Calendar } from "@mantine/dates";
import { useRef } from "react";
import { WeeklyCalendar } from "~/components/WeeklyCalendar";

export type calendarSettingType = {
  [day : number] : {
    className: string,
    hour: number,
    location: Location
  }[]
}

const AdminPage: NextPage = ({ session }: any) => {
  const [infoCard, setInfoCard] = useState(false);
  const [calendarSetting, setCalendarSetting] = useState<calendarSettingType[]>([])
  const [activeDay, setActiveDay] = useState<number>(new Date().getDay())
  const now = new Date()
  const {data: allAvailableClass, isFetched: allAvailableClassFetched} = api.class.getSmartKidsCalendar.useQuery()
  const thisYear = now.getFullYear()
  const thisMonth = now.getMonth()
  console.log(allAvailableClass)
  useEffect(() => {
    if(allAvailableClassFetched && allAvailableClass){
      const newCalendarSetting: calendarSettingType = {};

  allAvailableClass.forEach((classData) => {
    const { regularDay } = classData
    const {regularHour, name, location} = classData.class
    
    // Check if the regularDay already exists in the calendarSetting
    if (!newCalendarSetting[regularDay]) {
      newCalendarSetting[regularDay] = [];
    }

    // Add the class to the calendarSetting for the regularDay
    newCalendarSetting[regularDay]!.push({
      className: name,
      hour: regularHour,
      location: location
    });
  });
  setCalendarSetting([newCalendarSetting]);
    }
  }, [allAvailableClassFetched])

  const threeDigitTimeConverter = (timeNumber: number) => {
    const hours = Math.floor(timeNumber / 100); // Extract the hours (7 in this case)
    const minutes = timeNumber % 100; // Extract the minutes (30 in this case)

    // Convert hours and minutes to strings and pad them with leading zeros if needed
    const hoursString = hours.toString().padStart(2, '0');
    const minutesString = minutes.toString().padStart(2, '0');

    // Combine hours and minutes with a colon
    const timeString = `${hoursString}:${minutesString}`;
    return timeString
  }
  
  return (
    <AppShell
      header={<HeaderBar />}
      p={"lg"}
      className="max-h-screen w-screen overflow-x-hidden"
    >
      <div className="flex mx-[-18px] w-full flex-col">
        <Stats />
        <div className="h-full w-full flex justify-center">
          <Container>
            <div className="w-full flex flex-col items-center gap-3">
            <WeeklyCalendar calendarSetting={calendarSetting} setCalendarSetting={setCalendarSetting} activeDay={activeDay} setActiveDay={setActiveDay}/>
  
              <div className="flex flex-col w-full justify-between p-3 gap-3 items-center">
                {calendarSetting[0] ? calendarSetting[0][activeDay] ? (
                  calendarSetting[0][activeDay]?.map((val)=>(
                    <Card className="w-[350px] md:w-full" radius={20} p='lg' key={val.className}>
                      <div className="flex flex-row border-b-2 w-full justify-between items-center">
                      <div className="flex flex-col gap-3">
                        <Text fz='md' weight={300}>{val.className}</Text>
                        <Text fz='sm' weight={500}>{threeDigitTimeConverter(val.hour)}</Text>
                      </div>
                      <Text fz='md'>{val.location}</Text>
                      
                    </div>
                    </Card>
                  ))
                ) : (
                  null
                ) : (
                  <Loader />
                )}
              </div>

            </div>
              

          </Container>
        </div>
      </div>
    </AppShell>
  );
};

export async function getServerSideProps(context: any) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const session = await getSession(context);
  return requireAdminAuth(context, () => {
    return {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      props: { currentSession: session },
    };
  });
}

export default AdminPage;
