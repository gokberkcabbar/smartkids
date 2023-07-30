/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from 'react'
import {Responsive, WidthProvider} from 'react-grid-layout'
import { classProfilePageType } from './EgitimTab'
import {useMediaQuery} from '@mantine/hooks'
import { useState, useEffect } from 'react'
import { dbLayoutType } from '~/utils/layoutParser'
import ReactGridLayout from 'react-grid-layout'
import { ActionIcon, Button, Card, Text } from '@mantine/core'
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { IconPencil, IconTrash } from '@tabler/icons-react'
const ResponsiveGridLayout = WidthProvider(Responsive)
export const EgitimGrid = ({classProfilePage}: {classProfilePage: classProfilePageType}) => {
  const [elementLayouts, setElementLayouts] = useState<dbLayoutType[]>([])
  const [layoutChange, setLayoutChange] = useState<ReactGridLayout.Layout[]>([])
  const [fetched, setFetched] = useState(false)

  useEffect(() => {
    if(classProfilePage){
            const filteredProfilePage = classProfilePage.filter((val)=>val !== undefined) as dbLayoutType[]
            if(filteredProfilePage.length > 0){
                setElementLayouts(filteredProfilePage)
                setFetched(true)
            }
        }
  }, [classProfilePage])
  console.log(layoutChange)
  return (
    <>
        {fetched ? (
            <ResponsiveGridLayout onLayoutChange={(e)=>setLayoutChange(e)} layouts={elementLayouts[0]!.layouts} rowHeight={30} breakpoints={{lg: 1184, md: 1024, sm: 768}}>
            {elementLayouts[0]!.layouts.lg?.map((val)=>{
                return (
                    <div key={val.i} className='flex flex-col w-full h-full'>
                        <Card className='relative flex flex-col w-full h-full'>
                            <div className='bg-slate-200/10 z-30 px-8 absolute top-0 left-0 right-0 h-[30px] flex flex-row justify-between items-center'>
                                <ActionIcon>
                                    <IconPencil size={20} />
                                </ActionIcon>
                                <div className='flex flex-row gap-3 items-center'>
                                    <Text size={15}>ID: </Text>
                                    <Text size={15}>{val.i}</Text>
                                </div>
                                <ActionIcon>
                                    <IconTrash size={20} />
                                </ActionIcon>
                            </div>
                        </Card>
                    </div>
                )
            })}
        </ResponsiveGridLayout>
        ) : (
            null
        )}
    </>
  )
}
