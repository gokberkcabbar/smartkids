/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-floating-promises */
import {
  ActionIcon,
  Button,
  Card,
  Grid,
  Group,
  Loader,
  Modal,
  NumberInput,
  Select,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import React, { SetStateAction, useEffect, useState } from "react";
import { api } from "~/utils/api";
import { useForm } from "@mantine/form";
import { Location, User } from "@prisma/client";
import {
  IconChecklist,
  IconDeviceFloppy,
  IconDownload,
  IconPencil,
  IconPlus,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";
import { StudentsInClassDetail } from "./StudentsInClassDetail";
import { StudentsAddToClassTable } from "./StudentsAddToClassTable";
import { notifications } from "@mantine/notifications";
import { IconAppWindow } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { EgitimTab } from "./studentsProfileGeneric/EgitimTab";
import { useMediaQuery } from "@mantine/hooks";
import Link from "next/link";
import { DateInput } from "@mantine/dates";
import { DropZone } from "./DropZone";
import { FileWithPath } from "@mantine/dropzone";
import { readFileSync } from "fs";

export type classPageFormTypes = UseFormReturnType<
  {
    className: string;
    isOpen: boolean;
  },
  (values: { className: string; isOpen: boolean }) => {
    className: string;
    isOpen: boolean;
  }
>;
export const TableClass = ({
  form,
}: {
  form: UseFormReturnType<
    {
      searchFilter: string;
    addClassModal: boolean;
    nameClass: string;
    location: "ATAKUM" | "PERA"
    locationFilter: string;
    regularDay: string[],
    regularHour: string,
    regularMinute: number,
    startingMonth: Date | null,
    endingMonth: Date | null,
    },
    (values: {
      searchFilter: string;
    addClassModal: boolean;
    nameClass: string;
    location: "ATAKUM" | "PERA"
    locationFilter: string;
    regularDay: string[],
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
    regularDay: string[],
    regularHour: string,
    regularMinute: number,
    startingMonth: Date | null,
    endingMonth: Date | null,
    }
  >;
}) => {
  const formClassDetail = useForm<{
    nameClass: string;
    modalClassDetail: boolean;
    location: "ATAKUM" | "PERA";
  }>({
    initialValues: {
      location: "ATAKUM",
      modalClassDetail: false,
      nameClass: "",
    },
  });
  const context = api.useContext();
  const { data: elements, isFetched } = api.class.getClasses.useQuery();
  const { mutate: deleteClass } = api.class.deleteClass.useMutation({
    onSuccess: () => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      context.class.invalidate();
      notifications.show({
        message: "Sınıf başarıyla silindi",
        color: "green",
        autoClose: 2000,
      });
    },
    onError: (error) => {
      notifications.show({
        message: error.message,
        color: "red",
        autoClose: 2000,
      });
    },
  });
  const [rows, setRows] = useState<React.JSX.Element[]>([]);
  const odevForm = useForm<{
    className: string,
    isOpen: boolean,
    searchOdev: string,
    isNewTaskOpen: boolean,
    taskName: string,
    deadLineDate: Date,
    editMode: boolean
  }>({
    initialValues: {
      className: "",
      isOpen: false,
      searchOdev: "",
      isNewTaskOpen: false,
      taskName: "",
      deadLineDate: new Date(),
      editMode: false
    }
  })
  const classPageForm = useForm<{
    className: string;
    isOpen: boolean;
  }>({
    initialValues: {
      className: "",
      isOpen: false,
    },
  });
  useEffect(() => {
    if (elements) {
      setRows(
        elements
          .filter((val) => {
            if (form.values.locationFilter === "tumu") {
              return val;
            }
            if (
              form.values.locationFilter === "atakum" &&
              val.location === "ATAKUM"
            ) {
              return val;
            }
            if (
              form.values.locationFilter === "pera" &&
              val.location === "PERA"
            ) {
              return val;
            }
          })
          .filter((val) => {
            if (val.name.toLocaleLowerCase('tr').includes(form.values.searchFilter.toLocaleLowerCase('tr'))) {
              return val;
            }
          })
          .map((element) => (
            <tr key={element.name}>
              <td>{element.name}</td>
              <td>{element.location}</td>
              <td>{element.user.length}</td>
              <td className="mt-[-1px] flex flex-row items-center gap-4">
                <>
                  <ActionIcon onClick={()=>{
                    odevForm.setFieldValue('className', element.name)
                    odevForm.setFieldValue('isOpen', true)
                  }}>
                    <IconChecklist size={30} />
                  </ActionIcon>
                  <ActionIcon
                    onClick={() => {
                      classPageForm.setFieldValue("className", element.name);
                      classPageForm.setFieldValue("isOpen", true);
                    }}
                  >
                    <IconAppWindow size={30} />
                  </ActionIcon>
                  <ActionIcon
                    onClick={() => {
                      formClassDetail.setFieldValue("modalClassDetail", true);
                      formClassDetail.setFieldValue("nameClass", element.name);
                    }}
                  >
                    <IconPencil size={30} />
                  </ActionIcon>{" "}
                  <ActionIcon
                    onClick={() => deleteClass({ name: element.name })}
                  >
                    <IconTrash size={30} />
                  </ActionIcon>
                </>
              </td>
            </tr>
          ))
      );
    }
  }, [elements, form.values.locationFilter, form.values.searchFilter]);

  const smBreakpoint = useMediaQuery("(max-width: 48em)");
  return (
    <>
      {isFetched ? (
        <Table
          striped
          horizontalSpacing={60}
          highlightOnHover
          withBorder
        >
          <thead>
            <tr>
              <th>Sınıf Adı</th>
              <th>Şube</th>
              <th>Kayıtlı Öğrenci Sayısı</th>
              <th>Ödevler / Sınıf Sayfası / Düzenle / Sil</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      ) : (
        <Loader />
      )}
      <ClassDetailModal formClassDetail={formClassDetail} />
      <EgitimTab {...classPageForm} />
      <OdevModal odevForm={odevForm}/>
    </>
  );
};

const ClassDetailModal = ({
  formClassDetail,
}: {
  formClassDetail: UseFormReturnType<
    {
      nameClass: string;
      modalClassDetail: boolean;
      location: "ATAKUM" | "PERA";
    },
    (values: {
      nameClass: string;
      modalClassDetail: boolean;
      location: "ATAKUM" | "PERA";
    }) => {
      nameClass: string;
      modalClassDetail: boolean;
      location: "ATAKUM" | "PERA";
    }
  >;
}) => {
  const [className, setClassName] = useState<string | undefined>(undefined);
  const { data, isFetched } = api.class.getClassByName.useQuery({
    name: className ? className : formClassDetail.values.nameClass,
  });
  const form = useForm({
    initialValues: {
      studentSearch: "",
      studentAddInClass: false,
    },
  });
  useEffect(() => {
    if (data) {
      formClassDetail.setFieldValue("nameClass", data.name);
      formClassDetail.setFieldValue("location", data.location);
      setClassName(data.name);
    }
  }, [data]);
  useEffect(() => {
    if(className){
      formClassDetail.resetDirty()
    }
  
  }, [className])
  
  const router = useRouter();
  const smBreakpoint = useMediaQuery('(min-width: 768px)')
  const context = api.useContext()
  const {mutate: updateClassNameAndLocation, isLoading: updateClassNameAndLocationLoading} = api.class.updateClassNameAndLocation.useMutation({
    onSuccess: ()=>{
      context.class.invalidate()
      notifications.show({
        message: "Sınıf bilgileri başarıyla birleştirildi",
        color: "green",
        autoClose: 2000,
        onClose: ()=>{
          formClassDetail.setFieldValue("modalClassDetail", false)
          formClassDetail.reset()
          setClassName(undefined)
        }
      })
    },
    onError: (e)=>{
      notifications.show({
        message: e.message,
        color: "red",
        autoClose: 2000
      })
    }
  })
  console.log(formClassDetail.values.nameClass)
  return (
    <>
      <Modal
        size={smBreakpoint ? "50%" : "100%"}
        title="Sınıf Detayı"
        opened={formClassDetail.values.modalClassDetail}
        onClose={() => {
          formClassDetail.setFieldValue("modalClassDetail", false)
          formClassDetail.reset()
          setClassName(undefined)
        }}
      >
        <>
          {isFetched ? (
            <>
              <div className="flex w-full items-end justify-between">
                <div className="w-1/2 md:w-1/3">
                  <TextInput {...formClassDetail.getInputProps('nameClass')} />
                </div>
                <div className="w-1/2 md:w-1/6">
                  <Select

                    dropdownPosition="bottom"
                    data={[
                      {
                        value: "ATAKUM",
                        label: "Atakum",
                      },
                      {
                        value: "PERA",
                        label: "Pera",
                      },
                    ]}
                    {...formClassDetail.getInputProps("location")}
                  />
                </div>
              </div>
              <div className="mt-12 flex w-full flex-row items-center justify-between">
                <div className="w-1/2">
                  <TextInput
                    icon={<IconSearch size={16} />}
                    {...form.getInputProps("studentSearch")}
                  />
                </div>
                <div className="flex flex-row items-center gap-3">
                  <ActionIcon onClick={()=>{
                    updateClassNameAndLocation({
                      className: formClassDetail.values.nameClass,
                      currentClassName: className as string,
                      location: formClassDetail.values.location
                    })
                  }} className={`${formClassDetail.isDirty() ? "" : "hidden"}`}>
                    {updateClassNameAndLocationLoading ? <Loader /> : <IconDeviceFloppy size={20} />}
                  </ActionIcon>
                  <ActionIcon
                    onClick={() =>
                      router.push(`/protected/admin/class/${className as string}`)
                    }
                  >
                    <IconAppWindow size={20} />
                  </ActionIcon>
                  <ActionIcon
                    onClick={() => {
                      formClassDetail.setFieldValue("modalClassDetail", false);
                      form.setFieldValue("studentAddInClass", true);
                    }}
                    variant="filled"
                    color="cyan"
                  >
                    <IconPlus size={20} />
                  </ActionIcon>
                </div>
              </div>
              <div className="mt-6">
                {
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                  data ? (
                    <StudentsInClassDetail form={form} userInfo={data.user} />
                  ) : (
                    <Loader />
                  )
                }
              </div>
            </>
          ) : (
            <Loader />
          )}
        </>
      </Modal>
      <StudentAddInClass
        className={formClassDetail.values.nameClass}
        form={form}
        formClassDetail={formClassDetail}
      />
    </>
  );
};

const StudentAddInClass = ({
  form,
  formClassDetail,
  className,
}: {
  form: UseFormReturnType<
    {
      studentSearch: string;
      studentAddInClass: boolean;
    },
    (values: { studentSearch: string; studentAddInClass: boolean }) => {
      studentSearch: string;
      studentAddInClass: boolean;
    }
  >;
  formClassDetail: UseFormReturnType<
    {
      nameClass: string;
      modalClassDetail: boolean;
      location: "ATAKUM" | "PERA";
    },
    (values: {
      nameClass: string;
      modalClassDetail: boolean;
      location: "ATAKUM" | "PERA";
    }) => {
      nameClass: string;
      modalClassDetail: boolean;
      location: "ATAKUM" | "PERA";
    }
  >;
  className: string;
}) => {
  const { data: getStudentsExcludeClass } =
    api.user.getStudentsExcludeClass.useQuery();

  const formSearch = useForm({
    initialValues: {
      search: "",
    },
  });
  const context = api.useContext();
  const { mutate: addStudentInClass } = api.class.addStudentInClass.useMutation(
    {
      onSuccess: () => {
        context.user.invalidate();
        context.class.invalidate();
      },
    }
  );
  const smBreakpoint = useMediaQuery('(min-width: 768px)')
  const [selected, setSelected] = useState<User[]>([]);
  return (
    <Modal
      size={smBreakpoint ? "50%" : "100%"}
      title="Sınıfa Öğrenci Ekle"
      opened={form.values.studentAddInClass}
      onClose={() => {
        form.setFieldValue("studentAddInClass", false);
        formClassDetail.setFieldValue("modalClassDetail", true);
      }}
    >
      <div className="w-1/2 md:w-1/3">
        <TextInput
          icon={<IconSearch size={16} />}
          {...formSearch.getInputProps("search")}
        />
      </div>
      <div className="mt-12">
        {getStudentsExcludeClass ? (
          <StudentsAddToClassTable
            selected={selected}
            setSelected={setSelected}
            getStudentsExcludeClass={getStudentsExcludeClass}
            formSearch={formSearch}
          />
        ) : (
          <Loader />
        )}
      </div>
      <div className="mt-6">
        <Button
          onClick={() => {
            selected.forEach((val) => {
              if (selected.length !== 0) {
                addStudentInClass({ name: className, userNo: val.userNo });
              }
              form.setFieldValue("studentAddInClass", false);
              formClassDetail.setFieldValue("modalClassDetail", true);
            });
            setSelected([]);
          }}
        >
          Ekle
        </Button>
      </div>
    </Modal>
  );
};

const OdevModal = ({odevForm}:{odevForm: UseFormReturnType<{
  className: string;
  isOpen: boolean;
  searchOdev: string;
  isNewTaskOpen: boolean;
  taskName: string;
  deadLineDate: Date,
  editMode: boolean
}, (values: {
  className: string;
  isOpen: boolean;
  searchOdev: string;
  isNewTaskOpen: boolean;
  taskName: string;
  deadLineDate: Date,
  editMode: boolean
}) => {
  className: string;
  isOpen: boolean;
  searchOdev: string;
  isNewTaskOpen: boolean;
  taskName: string;
  deadLineDate: Date,
  editMode: boolean
}>}) => {
  const {data: getTask, isFetched: getTaskFetched} = api.task.getTask.useQuery({className: odevForm.values.className})
  const context = api.useContext()
  const {mutate: deleteTask, isLoading: deleteTaskLoading} = api.task.deleteTask.useMutation({
    onSuccess: ()=>{
      context.task.invalidate()
      notifications.show({
          message: "Ödev başarıyla silindi",
          color: 'green',
          autoClose: 2000,
      })
  },
  onError: (e)=>{
    notifications.show({
      message: e.message,
      color: 'red',
      autoClose: 2000
    })
  }
  })
  const [taskCards, setTaskCards] = useState<React.JSX.Element[]>([])
  
  useEffect(() => {
    if(getTask){
      const now = new Date()
      setTaskCards(
        getTask.filter((val)=>val.name.includes(odevForm.values.searchOdev)).map((val)=>(
          <Grid.Col key={val.fileLink} span={12} md={6}>
            <Card radius={15} p='md' >
            <div className="flex flex-col gap-3 w-full h-full">
              <div className="flex flex-col gap-3  w-full [@media(min-width:1024px)]:hidden">
                <Text fz='xl'>Ödev Adı: <Text fz='lg'>{val.name}</Text></Text>
                <Text fz='xl'>Sınıf Adı: <Text fz='lg'>{val.class?.name}</Text></Text>
              </div>
                <div className="flex flex-row justify-between items-center [@media(max-width:1024px)]:hidden">
                <Text fz='xl'>Ödev Adı: <Text fz='lg'>{val.name}</Text></Text>
                <Text fz='xl'>Sınıf Adı: <Text fz='lg'>{val.class?.name}</Text></Text>
                </div>
                <div className="flex flex-col gap-3  w-full [@media(min-width:1024px)]:hidden">
                  <Text>Ödev Oluşturma Tarihi: <Text color="blue">{val.createdAt.toLocaleDateString('tr-TR')}</Text></Text>
                  <Text>Son Teslim Tarihi: <Text color={val.deadline >= now ? "red" : "cyan"}>{val.deadline.toLocaleDateString('tr-TR')}</Text></Text>
                </div>
                <div className="flex flex-row justify-between items-center [@media(max-width:1024px)]:hidden">
                <Text>Ödev Oluşturma Tarihi: <Text color="blue">{val.createdAt.toLocaleDateString('tr-TR')}</Text></Text>
                <Text>Son Teslim Tarihi: <Text color={val.deadline >= now ? "red" : "cyan"}>{val.deadline.toLocaleDateString('tr-TR')}</Text></Text>
                </div>
                <div className="flex flex-row w-full justify-between items-center">
                  <ActionIcon onClick={()=>deleteTask({
                    fileLink: val.fileLink
                  })} variant="filled" color="red">
                    <IconTrash size={30} />
                  </ActionIcon>

                  <ActionIcon component={Link} download={val.fileLink} href={val.fileLink} variant="light">
                    <IconDownload size={30}/>
                  </ActionIcon>
                </div>
            </div>
          </Card>
          </Grid.Col>
        ))
      )
    }
  }, [getTask, odevForm.values.searchOdev])
  const smBreakpoint = useMediaQuery('(min-width: 768px)')
  return (
    <>
    <Modal opened={odevForm.values.isOpen} onClose={()=>odevForm.setFieldValue('isOpen', false)} size={smBreakpoint ? "xl" : "100%"} title="Ödev Ekle">
      <div className="flex flex-col w-full h-full">
        <div className="flex flex-row justify-between items-center p-2">
          <Text fz='lg'>Ödevler</Text>
          <div className="flex flex-row gap-2 items-center">
            <TextInput {...odevForm.getInputProps('searchOdev')} icon={<IconSearch size={16} />}/>
            <Button onClick={()=>{
              odevForm.setFieldValue('isOpen', false)
              odevForm.setFieldValue('isNewTaskOpen', true)
            }} radius={15} className="bg-green-800/60 hover:bg-green-800/20">+</Button>
          </div>
        </div>
        <div className="mt-3 w-full h-full">
          {getTaskFetched ? (
            <Grid>
              {taskCards}
            </Grid>
          ) : (
            <div className="flex w-full h-full items-center justify-center">
              <Loader />
            </div>
          )}
        </div>
      </div>
    </Modal>
    <NewTaskModal odevForm={odevForm}/>
    </>
  )

}

const NewTaskModal = ({odevForm}:{odevForm: UseFormReturnType<{
  className: string;
  isOpen: boolean;
  searchOdev: string;
  isNewTaskOpen: boolean;
  taskName: string;
  deadLineDate: Date,
  editMode: boolean
}, (values: {
  className: string;
  isOpen: boolean;
  searchOdev: string;
  isNewTaskOpen: boolean;
  taskName: string;
  deadLineDate: Date,
  editMode: boolean
}) => {
  className: string;
  isOpen: boolean;
  searchOdev: string;
  isNewTaskOpen: boolean;
  taskName: string;
  deadLineDate: Date,
  editMode: boolean
}>}) => {
  const [selectableClasses, setSelectableClasses] = useState<string[]>([])
  const {data: getClasses} = api.class.getClasses.useQuery()
  const context = api.useContext()
  const [loadingTask, setLoadingTask] = useState(false)
  const {mutate: createTask, isLoading: createTaskLoading} = api.task.createTask.useMutation({
    onSuccess: () => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      context.task.invalidate();
      notifications.show({
        message: "Ödev başarıyla oluşturuldu",
        color: "green",
        autoClose: 2000,
        onClose: ()=>{
          odevForm.setFieldValue('isNewTaskOpen', false)
          odevForm.setFieldValue('isOpen', true)
          setLoadingTask(false)
        }
      });
    },
    onError: (error) => {
      console.log(error.message)
      notifications.show({
        message: error.message,
        color: "red",
        autoClose: 2000,
        onClose: ()=>{
          setLoadingTask(false)
        }
      });
    },
  })

  const [fileDatas, setFileDatas] = useState<{
    fileData: FileWithPath,
    fileURL: string
  }>(null as unknown as {fileData: FileWithPath, fileURL: string})
  useEffect(() => {
    if(getClasses){
      setSelectableClasses(getClasses.map((val)=>(
        val.name
      )))
    }
  }, [getClasses])
  const smBreakpoint = useMediaQuery('(min-width: 768px)')
  return (
    <Modal opened={odevForm.values.isNewTaskOpen} onClose={()=>{
      odevForm.setFieldValue('isOpen', true)
      odevForm.setFieldValue('isNewTaskOpen', false)
    }} size={smBreakpoint ? "xl" : "100%"} p='md'>
      <div className="flex gap-3 flex-col w-full h-full">
        <div className="flex-row w-full justify-between items-center [@media(min-width:1024px)]:flex hidden">
          <TextInput {...odevForm.getInputProps('taskName')} label="Ödev Adı" />
          <Select label="Sınıf" data={selectableClasses} {...odevForm.getInputProps('className')}/>
        </div>
        <div className="flex flex-col w-full [@media(min-width:1024px)]:hidden">
          <TextInput {...odevForm.getInputProps('taskName')} label="Ödev Adı" />
          <Select label="Sınıf" data={selectableClasses} {...odevForm.getInputProps('className')}/>
        </div>
        <DateInput label="Son Teslim Tarihi" {...odevForm.getInputProps('deadLineDate')} valueFormat="DD MM YYYY"/>
        <DropZone fileDatas={fileDatas} setFileDatas={setFileDatas} />
        <Group position='right'>
        <Button onClick={async ()=>{
            setLoadingTask(true)
            const formData = new FormData()
            formData.append('file', fileDatas.fileData)
            try {
              setLoadingTask(true)
              const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
              });
              if(response.ok){
                const data = await response.json()
                const filePath = data.urlCloud as string
                createTask({
                  className: odevForm.values.className,
                  deadline: odevForm.values.deadLineDate.toISOString(),
                  fileLink: filePath,
                  taskName: odevForm.values.taskName
                })
            }
          }
            catch (error) {
             
            }
        }} disabled={odevForm.values.taskName.length === 0 || odevForm.values.className.length === 0 || fileDatas ? false : true}>{createTaskLoading || loadingTask ? <Loader /> : "Onayla"}</Button>
        </Group>
      </div>
    </Modal>
  )
}