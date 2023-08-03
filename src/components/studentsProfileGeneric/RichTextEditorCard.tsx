/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { SetStateAction, useEffect } from 'react'
import {RichTextEditor} from '@mantine/tiptap'
import { JSONContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Youtube from '@tiptap/extension-youtube'
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import { IconBrandYoutube } from '@tabler/icons-react'
import { ActionIcon } from '@mantine/core'


export const RichTextEditorCard = ({elementNo, textEditorState, setTextEditorState}:{elementNo: string, textEditorState: JSONContent, setTextEditorState: React.Dispatch<React.SetStateAction<JSONContent>>}) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Youtube,
            Highlight,
            TextAlign,
            Youtube
        ],
        content: `<p>Deneme</p>`
    })

    const addYoutubeVideo = () => {
        const url = prompt('Enter YouTube URL')
    
        if (url && editor) {
          editor.commands.setYoutubeVideo({
            src: url,
          })
          const json = editor.getJSON()
          setTextEditorState(json)
        }
      }
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
