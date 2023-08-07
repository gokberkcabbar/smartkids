/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { SetStateAction, useEffect } from 'react'
import {RichTextEditor} from '@mantine/tiptap'
import { JSONContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Youtube from '@tiptap/extension-youtube'
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import { IconBrandYoutube, IconDeviceFloppy } from '@tabler/icons-react'
import { ActionIcon } from '@mantine/core'
import { api } from '~/utils/api'
import { notifications } from '@mantine/notifications'
import { layoutType } from './EgitimGrid'


export const RichTextEditorCard = ({setFetched, layout, className, elementNo, textEditorState, setTextEditorState, setEditActivate}:{setFetched: React.Dispatch<SetStateAction<boolean>>, layout: ReactGridLayout.Layout ,className: string, elementNo: string, textEditorState: string, setTextEditorState: React.Dispatch<React.SetStateAction<string>>, setEditActivate: React.Dispatch<React.SetStateAction<string>>}) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Youtube,
            Highlight,
            TextAlign.configure({types: ['heading', 'paragraph']}),
        ],
        content: ``
    })

    const addYoutubeVideo = () => {
        const url = prompt('Enter YouTube URL')
    
        if (url && editor) {
          editor.commands.setYoutubeVideo({
            src: url,
          })
          const HTML = editor.getHTML()
          setTextEditorState(HTML)
        }
      }
      console.log(textEditorState)
    const context = api.useContext()
    const {mutate: updateCard, isLoading: updateCardLoading} = api.class.updateCardClassRichText.useMutation({
      onSuccess: ()=>{
        context.class.invalidate()
        context.user.invalidate()
        notifications.show({
          message: "İşlem Başarılı",
          color: 'green',
        })
        setFetched(false)
      },
      onError: (e)=>{
        notifications.show({
          message: e.message,
          color: 'red'
        })
      }
    })
    console.log(textEditorState)
    
  return (
    <div className='flex w-full h-full'>
        <RichTextEditor editor={editor}>
        <RichTextEditor.Toolbar>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Bold />
          <RichTextEditor.Italic />
          <RichTextEditor.Underline />
          <RichTextEditor.Strikethrough />
          <RichTextEditor.ClearFormatting />
          <RichTextEditor.Highlight />
          <RichTextEditor.Code />
        </RichTextEditor.ControlsGroup>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.H1 />
          <RichTextEditor.H2 />
          <RichTextEditor.H3 />
          <RichTextEditor.H4 />
        </RichTextEditor.ControlsGroup>
        <RichTextEditor.ControlsGroup>
          <ActionIcon onClick={()=>{
            if(editor){
              const HTML = editor.getHTML()
              updateCard({
                cardId: elementNo,
                className: className,
                updateContent: HTML,
                layout: JSON.stringify(layout)
              })
              setEditActivate("")
            }
          }}>
            <IconDeviceFloppy />
          </ActionIcon>
        </RichTextEditor.ControlsGroup>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Blockquote />
          <RichTextEditor.Hr />
          <RichTextEditor.BulletList />
          <RichTextEditor.OrderedList />
          <RichTextEditor.Subscript />
          <RichTextEditor.Superscript />
        </RichTextEditor.ControlsGroup>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Link />
          <RichTextEditor.Unlink />
        </RichTextEditor.ControlsGroup>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.AlignLeft />
          <RichTextEditor.AlignCenter />
          <RichTextEditor.AlignJustify />
          <RichTextEditor.AlignRight />
        </RichTextEditor.ControlsGroup>
        <RichTextEditor.ControlsGroup>
            <ActionIcon onClick={()=>addYoutubeVideo()}>
            <IconBrandYoutube />
            </ActionIcon>
        </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>
        <RichTextEditor.Content />
    </RichTextEditor>
    </div>
  )
}
