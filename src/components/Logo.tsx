import React from 'react'
import localFont from 'next/font/local'
import { MantineColor, Text } from '@mantine/core'

const lf = localFont({src: '../components/Fonts/Comical Cartoon.ttf'})
export const Logo = () => {
  const arrayOne = Array.from("Smart")
  const arrayTwo = Array.from("Kids")
  const stringOne: {
    char: string,
    color: "#FFB402" | "pink" | "#CAD536",
    margin: "mt-[6px]" | "m-0"
  }[] = arrayOne.map((val, index)=>{
    let color: "#FFB402" | "pink" | "#CAD536" = "#FFB402"
    let margin: "mt-[6px]" | "m-0" = "m-0"
    const char: string = val
    if(index % 2 !== 0){
        margin = "mt-[6px]"
    }
    else{
        margin = "m-0"
    }
    if(index === 0 || index === 4){
        color = "#FFB402"
    }
    else if(index === 1 || index === 3){
        color = "pink"
    }
    else if(index === 2){
        color = "#CAD536"
    }
    return (
        {
            char: char,
            color: color,
            margin: margin
        }
    )
  })
  
  const stringTwo: {
    char: string,
    color: "#FFB402" | "pink" | "#CAD536",
    margin: "mt-[6px]" | "m-0"
  }[] = arrayTwo.map((val, index)=>{
    let color: "#FFB402" | "pink" | "#CAD536" = "#FFB402"
    let margin: "mt-[6px]" | "m-0" = "m-0"
    const char: string = val
    if(index === 1){
        margin = "mt-[6px]"
    }
    else{
        margin = "m-0"
    }
    if(index === 0 || index === 3){
        color = "#CAD536"
    }
    else if(index === 1){
        color = "pink"
    }
    else if(index === 2){
        color = "#FFB402"
    }
    return (
        {
            char: char,
            color: color,
            margin: margin
        }
    )
  }) 
  return (
    <div className='absolute flex flex-col gap-1 items-center justify-center'>
        <div className='flex flex-row m-0 mt-[4px]'>
            {stringOne.map((val, index)=>(
                <Text key={index} color={val.color} className={`m-0 text-xs md:text-sm ${val.margin}`} style={lf.style}>
                    {val.char}
                </Text>
            ))}
        </div>
        <div className='flex flex-row m-0'>
            {stringTwo.map((val, index)=>(
                <Text key={index} color={val.color} className={`m-0 text-xs md:text-sm ${val.margin}`} style={lf.style}>
                    {val.char}
                </Text>
            ))}
        </div>

    </div>
  )
}
