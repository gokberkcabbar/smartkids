/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from 'react'
import {Layouts, Responsive, WidthProvider} from 'react-grid-layout'
import { classProfilePageType } from './EgitimTab'
import {useMediaQuery} from '@mantine/hooks'
import { useState, useEffect } from 'react'
import { dbLayoutType, layoutItem } from '~/utils/layoutParser'
import ReactGridLayout from 'react-grid-layout'
import { ActionIcon, Button, Card, Text } from '@mantine/core'
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { IconPencil, IconTrash } from '@tabler/icons-react'
const ResponsiveGridLayout = WidthProvider(Responsive)
export const EgitimGrid = ({classProfilePage}: {classProfilePage: classProfilePageType}) => {
  const [elementLayouts, setElementLayouts] = useState<dbLayoutType[] | undefined[]>([])
  const [layoutChange, setLayoutChange] = useState<ReactGridLayout.Layout[]>([])
  const [layout, setLayout] = useState<dbLayoutType>()
  const [fetched, setFetched] = useState(false)

  useEffect(() => {
    if(classProfilePage){
            const layoutObject: dbLayoutType = {
                layouts: {
                    lg: classProfilePage.map((val)=>val),
                    md: classProfilePage.map((val)=>val),
                    sm: classProfilePage.map((val)=>val),
                }
            }
            setLayout(
                layoutObject
            )
            setFetched(true)
        }
  }, [classProfilePage])
  console.log(layout)
  return (
    <>
        {fetched && layout && layout.layouts.lg.length > 0 ? (
                <ResponsiveGridLayout onLayoutChange={(e)=>setLayoutChange(e)} layouts={layout.layouts} rowHeight={30} cols={{lg: 12, md: 8, sm: 4}} breakpoints={{lg: 1200, md: 800,sm: 200}}>
            {layout.layouts.lg.map((val)=>{
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
            )})}
        </ResponsiveGridLayout>

        ) : (
            null
        )}
    </>
  )
}
