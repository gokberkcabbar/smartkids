import { useRef, useState } from 'react';
import { Text, Group, Button, createStyles, rem, Grid } from '@mantine/core';
import { Dropzone, MIME_TYPES } from '@mantine/dropzone';
import { IconCloudUpload, IconX, IconDownload } from '@tabler/icons-react';
import { FileWithPath } from '@mantine/dropzone';
import Link from 'next/link';
const useStyles = createStyles((theme) => ({
  wrapper: {
    position: 'relative',
    marginBottom: rem(30),
  },

  dropzone: {
    borderWidth: rem(1),
    paddingBottom: rem(50),
  },

  icon: {
    color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[4],
  },

  control: {
    position: 'absolute',
    width: rem(250),
    left: `calc(50% - ${rem(125)})`,
    bottom: rem(-20),
  },
}));

export function DropZone({files, setFiles}:{files: FileWithPath | null, setFiles: React.Dispatch<React.SetStateAction<FileWithPath | null>>}) {
  const { classes, theme } = useStyles();
  const openRef = useRef<() => void>(null);
  
  console.log(files)
  return (
    <>
    <div className={classes.wrapper}>
      <Dropzone
        openRef={openRef}
        onDrop={(files) => setFiles(files[0]!)}
        multiple= {false}
        className={classes.dropzone}
        radius="md"
        accept={[MIME_TYPES.pdf, MIME_TYPES.jpeg, MIME_TYPES.docx, MIME_TYPES.doc, MIME_TYPES.ppt, MIME_TYPES.pptx, MIME_TYPES.xls, MIME_TYPES.xlsx, MIME_TYPES.png]}
        maxSize={30 * 1024 ** 2}
        useFsAccessApi={false}
      >
        <div style={{ pointerEvents: 'none' }}>
          <Group position="center">
            <Dropzone.Accept>
              <IconDownload
                size={rem(50)}
                color={theme.colors[theme.primaryColor]![6]}
                stroke={1.5}
              />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX size={rem(50)} color={theme.colors.red[6]} stroke={1.5} />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconCloudUpload
                size={rem(50)}
                color={theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black}
                stroke={1.5}
              />
            </Dropzone.Idle>
          </Group>

          <Text ta="center" fw={700} fz="lg" mt="xl">
            <Dropzone.Accept>Dosyaları buraya bırak</Dropzone.Accept>
            <Dropzone.Reject>30MB Sınır değeri aşıldı</Dropzone.Reject>
            <Dropzone.Idle>Ödev Dosyası</Dropzone.Idle>
          </Text>
          <Text ta="center" fz="sm" mt="xs" c="dimmed">
            Yüklenebilen dosya formatları: pdf, jpeg, docx, doc, ppt, pptx, xls, xlsx, png
          </Text>
        </div>
      </Dropzone>

      <Button className={classes.control} size="md" radius="xl" onClick={() => openRef.current?.()}>
        Dosyaları Seç
      </Button>
    </div>
    <div className='mt-4 w-full'>
        <Text>{files?.name}</Text>
    </div>
    </>
  );
}