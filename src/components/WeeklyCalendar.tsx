import React from 'react'
import { useMantineTheme } from '@mantine/core'
import { useEffect, useState } from 'react'
import { calendarSettingType } from '~/pages/protected/admin'

export const WeeklyCalendar = ({activeDay, setActiveDay, calendarSetting, setCalendarSetting}:{calendarSetting: calendarSettingType[], setCalendarSetting: React.Dispatch<React.SetStateAction<calendarSettingType[]>>, activeDay: number, setActiveDay: React.Dispatch<React.SetStateAction<number>>}) => {
  const {colorScheme} = useMantineTheme()
  const calculateDays = () => {
    // Get the current date
    const currentDate = new Date();

    // Get the current day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const currentDayOfWeek = currentDate.getDay();

    // Calculate the start date of the current week (assuming Sunday as the first day of the week)
    const startDate = new Date(currentDate);
    startDate.setDate(currentDate.getDate() - currentDayOfWeek);

    // Calculate the end date of the current week (6 days after the start date)
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    // Initialize an array to store the days of the week
    const daysOfWeek = [];

    // Loop to populate the days of the week
    for (let i = 0; i < 7; i++) {
    const day = new Date(startDate);
    day.setDate(startDate.getDate() + i);
    daysOfWeek.push(day);
    }
    return daysOfWeek
    }
    const [takvim, setTakvim] = useState<React.JSX.Element[]>([])
    const day = new Date()
    const [selectedDay, setselectedDay] = useState<Date>(new Date())
    console.log(selectedDay)
  useEffect(() => {

        const days = calculateDays()
        setTakvim(days.map((val)=>{
            console.log(val.getDay())
            if(val.getDate() === day.getDate()){
                return (
                    <div onClick={()=>{
                        setselectedDay(val)
                        setActiveDay(val.getDay())
                    }} key={val.getDate()} className={`flex group ${selectedDay.getDate() === val.getDate() ? "bg-blue-600 shadow-lg" : "hover:bg-blue-500 hover:bg-opacity-75 hover:shadow-lg"} rounded-lg mx-1 cursor-pointer justify-center relative w-16`}>
                        <span className="flex h-3 w-3 absolute -top-1 -right-1">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-400"></span>
                        </span>
                        {calendarSetting[0] ? calendarSetting[0][val.getDay()] ? (
                            <span className="flex h-3 w-3 absolute -bottom-1 -right-1">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                            </span>
                        ) : (
                            null
                        ): (
                            null
                        )}
                        <div className="flex items-center px-4 py-4">
                            <div className="text-center">
                                <p className={`${selectedDay.getDate() === val.getDate() ? "text-gray-100" : ""} text-sm`}> {val.toLocaleDateString('tr-TR', {weekday: 'short'})} </p>
                                <p className={`${selectedDay.getDate() === val.getDate() ? "text-gray-100" : ""} mt-3 font-bold`}> {val.getDate()}</p>
                            </div>
                        </div>
                    </div>
                )
            }
            else{
                return (
                    <div key={val.getDate()} className={`flex group rounded-lg mx-1 ${selectedDay.getDate() === val.getDate() ? "bg-blue-600 shadow-lg" : "hover:bg-blue-500 hover:bg-opacity-75 hover:shadow-lg"} transition-all duration-150 cursor-pointer justify-center relative w-16`}>
                        <div onClick={()=>{
                        setselectedDay(val)
                        setActiveDay(val.getDay())
                    }} className="flex items-center md:px-4 md:py-4">
                        {calendarSetting[0] ? calendarSetting[0][val.getDay()] ? (
                            <span className="flex h-3 w-3 absolute -bottom-1 -right-1">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                            </span>
                        ) : (
                            null
                        ): (
                            null
                        )}
                            <div className="text-center">
                                <p className={`${colorScheme === "dark" ? "text-sm transition-all duration-150" : " mt-3 group-hover:font-bold transition-all	duration-150"} ${selectedDay.getDate() === val.getDate() ? "text-gray-100" : ""}`}> {val.toLocaleDateString('tr-TR', {weekday: 'short'})} </p>
                                <p className={`${colorScheme === "dark" ? "text-sm transition-all duration-150" : " mt-3 group-hover:font-bold transition-all	duration-150"} ${selectedDay.getDate() === val.getDate() ? "text-gray-100" : ""}`}> {val.getDate()} </p>
                            </div>
                        </div>
                    </div>
                )
            }
        }))

  
  }, [selectedDay, calendarSetting[0]])
  
  return (


    <div className="w-[75%] md:w-full">
        {colorScheme === "dark" ? (
            <div  className="flex shadow-md justify-start md:justify-center rounded-lg mx-auto py-4 px-2 md:mx-12 mb-8">
                {takvim}
            </div>
        ) : (
            <div  className="flex bg-white shadow-md justify-start md:justify-center rounded-lg mx-auto py-4 px-2 md:mx-12 mb-8">
                {takvim}
            </div>
        )}


    </div>
  )
}
