/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { SetStateAction, useMemo, useRef } from 'react'
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
import { RichTextEditorCard } from './RichTextEditorCard'
import { JSONContent, generateHTML, generateJSON } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Youtube from '@tiptap/extension-youtube'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import { api } from '~/utils/api'
import { notifications } from '@mantine/notifications'
import { useRouter } from 'next/router'
import { IconDragDrop2 } from '@tabler/icons-react'
import { IconDragDrop } from '@tabler/icons-react'
const ResponsiveGridLayout = WidthProvider(Responsive)




export interface layoutType {
    layouts: {
        lg: layoutItem[];
        md: layoutItem[];
        sm: layoutItem[];
    };
}



export const EgitimGrid = ({fetched, setFetched, classProfilePage, className}: {fetched: boolean, setFetched: React.Dispatch<SetStateAction<boolean>>, classProfilePage: classProfilePageType, className: string}) => {
  const [textEditorState, setTextEditorState] = useState<string>("")
  const router = useRouter()
  const [layoutChange, setLayoutChange] = useState<ReactGridLayout.Layout[]>([])
  const [layout, setLayout] = useState<layoutType>()
  const [editActivate, setEditActivate] = useState("")
  const [content, setContent] = useState<{content: string, id: string}[]>([])
  const [dragActive, setDragActive] = useState("")
  const [profilePage, setProfilePage] = useState<{
    classPageId: string;
    content: string;
    layout: {
        editMode: boolean;
        isDraggable: boolean;
        w: number;
        h: number;
        x: number;
        y: number;
        i: string;
        minW: number;
        minH: number;
        moved: boolean;
        static: boolean;
    };
    id: string;
}[]>([])
  const [refArray, setRefArray] = useState<React.RefObject<HTMLDivElement>[]>([])
  const smBreakpoint = useMediaQuery('(min-width: 200px)')
  const lgBreakpoint = useMediaQuery('(min-width: 1200px)')
  const context = api.useContext()
  const {mutate: deleteCard} = api.class.deleteCardClassProfilePage.useMutation({
    onSuccess: ()=>{
        context.class.invalidate()
        context.user.invalidate()
        notifications.show({
            message: "Kart başarıyla silindi",
            color: 'green',
            autoClose: 2000,
        })
    },
    onError: (error)=>{
        notifications.show({
            message: error.message,
            color: 'red',
            autoClose: 2000
        })
    }
  })
  useEffect(() => {
    if(classProfilePage){
            setProfilePage(classProfilePage.map((val)=>{
                const parsedLayout: layoutItem = JSON.parse(val.layout)
                console.log(val.id, parsedLayout.i, editActivate)
                return ({
                    classPageId: val.classPageId,
                    content: val.content,
                    layout: {...parsedLayout, editMode: parsedLayout.i === editActivate ? true : false, isDraggable: dragActive === parsedLayout.i ? true : false, isResizable: router.pathname !== "/protected/admin/classes" ? false : true},
                    id: val.id
                })
            }))
            setFetched(true)
            if(content.length === 0){
                const parsedContentArray = classProfilePage.map((val)=>{
                    const HTMLContent = {
                        content: val.content,
                        id: val.id
                    }
                    return HTMLContent
                })
                setContent(parsedContentArray)
            }
        }
        return () => {
            setFetched(false)
        }
  }, [classProfilePage, editActivate, dragActive])


  useEffect(() => {
    if(fetched){
        const layoutObject: layoutType = {
            layouts: {
                lg: profilePage.map((val)=>val.layout),
                md: profilePage.map((val)=>val.layout),
                sm: profilePage.map((val)=>val.layout),
            }
        }
    
        setLayout(
            layoutObject
        )

        if(!lgBreakpoint){
            setRefArray(Array.from({length: profilePage.length}, ()=>React.createRef()))
        }
        
    }
  
  }, [fetched, editActivate, profilePage, lgBreakpoint])
  console.log(router)

  useEffect(() => {
    if(!lgBreakpoint){
        setLayout({
            layouts: {
                lg: profilePage.map((val, index)=>({
                    ...val.layout,
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    h: Math.round(refArray[index]!.current!.clientHeight / 30),
                    w: 4
                })),
                md: profilePage.map((val, index)=>({
                    ...val.layout,
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    h: Math.round(refArray[index]!.current!.clientHeight / 30),
                    w: 4
                })),
                sm: profilePage.map((val, index)=>({
                    ...val.layout,
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    h: Math.round(refArray[index]!.current!.clientHeight / 30),
                    w: 4
                }))
            }
        })
    }
  
  }, [refArray])
  
  
  return (
    <>
        {fetched && layout && layout.layouts.lg.length > 0 ? (
                <ResponsiveGridLayout onLayoutChange={(e)=>setLayoutChange(e)} layouts={layout.layouts} rowHeight={30} cols={{lg: 12, md: 8, sm: 4}} breakpoints={{lg: 1200, md: 800,sm: 200}}>
            {profilePage.map((val, index)=>{
                const parsedContent = val.content
                console.log(val.layout.editMode)
                return (
                 <div key={val.layout.i} className='flex flex-col w-full h-full'>
                 <Card className='relative flex flex-col w-full h-full'>
                     <div className={`bg-slate-200/10 z-30 px-8 absolute top-0 left-0 right-0 h-[30px] flex flex-row justify-between items-center ${router.pathname !== "/protected/admin/classes" ? "hidden" : ""}`}>
                         <ActionIcon hidden={val.layout.editMode} onClick={()=>{
                            setEditActivate((prev)=>{
                                if(prev !== val.layout.i){
                                    return val.layout.i
                                }
                                else{
                                    return ""
                                }
                            })
                            setDragActive("")
                         }}>
                             <IconPencil size={20} />
                         </ActionIcon>
                         <div className='flex flex-row gap-3 items-center'>
                             <Text size={15}>ID: </Text>
                             <Text size={15}>{val.layout.i}</Text>
                         </div>
                         <ActionIcon>
                             <IconTrash onClick={()=>deleteCard({
                                className: className,
                                layoutId: parseInt(val.layout.i, 10)
                             })} size={20} />
                         </ActionIcon>
                     </div>
                     {val.layout.editMode ? (<>
                     <RichTextEditorCard dragActive={dragActive} setDragActive={setDragActive} parsedContent={parsedContent} setFetched={setFetched} layout={layoutChange.find((elm)=>elm.i === val.layout.i) || {"w":4,"h":5,"x":0,"y":0,"i":"1","minW":1,"minH":1,"static":false}} className={className} setEditActivate={setEditActivate} setTextEditorState={setTextEditorState} textEditorState={textEditorState} elementNo={val.layout.i}/>
                     <ActionIcon onClick={()=>{
                        if(dragActive !== val.layout.i){
                            setDragActive(val.layout.i)
                        }
                        else{
                            setDragActive("")
                        }
                     }}>
                        {dragActive === val.layout.i ? <IconDragDrop2 /> : <IconDragDrop />}
                     </ActionIcon>
                     </>) : (
                        <div ref={refArray[index]} dangerouslySetInnerHTML={{__html: parsedContent}}></div>
                     )}
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
