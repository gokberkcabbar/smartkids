/* eslint-disable @typescript-eslint/no-floating-promises */
import { ActionIcon, AppShell, Box, Button, Loader, Menu, Modal, NumberInput, Select, Table, TextInput } from '@mantine/core'
import { IconClearAll, IconSearch } from '@tabler/icons-react'
import { NextPage } from 'next'
import { Session } from 'next-auth'
import { getSession } from 'next-auth/react'
import React, { SetStateAction, useEffect, useState } from 'react'
import { HeaderBar } from '~/components/HeaderBar'
import { requireAdminAuth } from '~/utils/requireAdminAuth'
import { useForm } from '@mantine/form'
import { api } from '~/utils/api'
import { TransactionFor } from '@prisma/client'
import { useRouter } from 'next/router'
import { notifications } from '@mantine/notifications'
import { useMediaQuery } from '@mantine/hooks'
interface AccountingProps {
    currentSession: Session | null
}


const Accounting : NextPage<AccountingProps> = (props: AccountingProps) => {
  const {data: getAllStudents} = api.user.getAllStudents.useQuery(undefined, {refetchOnWindowFocus: false})
  const transactionForArray = Object.values(TransactionFor)
  const first2 = ["Ogrenci No", "Ogrenci Adı Soyadı"]
  const [first2rows, setFirst2rows] = useState<React.JSX.Element[]>([])
  const [paymentRows, setPaymentRows] = useState<React.JSX.Element[]>([])
  const [students, setStudents] = useState<React.JSX.Element[]>([])
  const [newPaymentModal, setNewPaymentModal] = useState<boolean>(false)
  const form = useForm<{
    studentNoSearch: string,
    studentNameSearch: string,
    studentNoSelected: string[],
    studentNameSelected: string[],
    payment: {
        "MATERYAL1": boolean,
        "MATERYAL2": boolean,
        "OCAK": boolean,
        "SUBAT": boolean,
        "MART": boolean,
        "NISAN": boolean,
        "MAYIS": boolean,
        "HAZIRAN": boolean,
        "TEMMUZ" : boolean,
        "AGUSTOS" :boolean,
        "EYLUL" : boolean,
        "EKIM" : boolean,
        "KASIM" : boolean,
        "ARALIK" : boolean
    }
  }>({
    initialValues: {
        studentNoSearch: "",
        studentNameSearch: "",
        studentNoSelected: [],
        studentNameSelected: [],
        payment: {
            "MATERYAL1": false,
            "MATERYAL2": false,
            "OCAK": false,
            "SUBAT": false,
            "MART": false,
            "NISAN": false,
            "MAYIS": false,
            "HAZIRAN": false,
            "TEMMUZ" : false,
            "AGUSTOS" :false,
            "EYLUL" : false,
            "EKIM" : false,
            "KASIM" : false,
            "ARALIK" : false
        }
    }
  })
  useEffect(() => {
    if(getAllStudents){
        setFirst2rows(first2.map((val)=>{
            return (
                <th key={val}>
                    <Menu>
                        <Menu.Target>
                            <Button variant={`${val === "Ogrenci No" ? form.values.studentNoSelected.length !== 0 ? 'light' : 'subtle' : form.values.studentNameSelected.length !== 0 ? 'light' : 'subtle'}`}>
                                {val}
                            </Button>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <div className='flex flex-row items-center gap-4'>
                                <TextInput {...form.getInputProps(val === "Ogrenci No" ? 'studentNoSearch' : 'studentNameSearch')} icon={<IconSearch />}/>
                                <ActionIcon onClick={()=>form.setFieldValue(val === "Ogrenci No" ? 'studentNoSelected' : 'studentNameSelected', [])}>
                                    <IconClearAll />
                                </ActionIcon>
                            </div>
                            {val === "Ogrenci No" ? (
                                getAllStudents.filter((element)=>{
                                    if(element.userNo.includes(form.values.studentNoSearch)){
                                        return element
                                    }
                                }).map((element)=>{
                                    return (
                                        <div key={element.userNo} style={{maxHeight: 100, overflowY: "auto"}}>
                                            <Menu.Item className={`${form.values.studentNoSelected.includes(element.userNo) ? "bg-green-700/50" : ""}`} onClick={()=>{
                                            const arr = [...form.values.studentNoSelected]
                                            if(form.values.studentNoSelected.includes(element.userNo)){
                                                const newArr = arr.filter((el)=>element.userNo !== el)
                                                form.setFieldValue('studentNoSelected', newArr)
                                            }
                                            else{
                                                const newArr = [...arr, element.userNo]
                                                form.setFieldValue('studentNoSelected', newArr)
                                            }
                                        }}>
                                            {element.userNo}
                                            </Menu.Item>
                                        </div>
                                    )
                                })
                            ) : (
                                getAllStudents.filter((element)=>{
                                    if(element.name.includes(form.values.studentNameSearch)){
                                        return element
                                    }
                                }).map((element)=>{
                                    return (
                                        <div key={element.name} style={{maxHeight: 100, overflowY: "auto"}}>
                                            <Menu.Item key={element.name} className={`${form.values.studentNameSelected.includes(element.name) ? "bg-green-700/50" : ""}`} onClick={()=>{
                                                const arr = [...form.values.studentNameSelected]
                                                if(form.values.studentNameSelected.includes(element.name)){
                                                    const newArr = arr.filter((el)=>element.name !== el)
                                                    form.setFieldValue('studentNameSelected', newArr)
                                                }
                                                else{
                                                    const newArr = [...arr, element.name]
                                                    form.setFieldValue('studentNameSelected', newArr)
                                                }
                                            }}>
                                                {element.name}
                                            </Menu.Item>
                                        </div>
                                    )
                                })
                            )}
                        </Menu.Dropdown>
                    </Menu>
                </th>
            )
        }))
        setPaymentRows(transactionForArray.map((val)=>{
            return (
                <th key={val}>
                    <Menu>
                        <Menu.Target>
                            <Button variant={`${form.values.payment[val] ? 'filled' : 'subtle'}`}>
                                {val}
                            </Button>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Button variant={form.values.payment[val] ? "filled" : "default"} onClick={()=>{
                                const newBoolean = {...form.values.payment, [val]: !form.values.payment[val]}
                                form.setFieldValue('payment', newBoolean)
                            }}>Ödendi</Button>
                        </Menu.Dropdown>
                    </Menu>
                </th>
            )
        }))
        setStudents(getAllStudents.filter((val)=>{
            if((form.values.studentNameSelected.length !== 0 || form.values.studentNoSelected.length !== 0) && (form.values.studentNoSelected.includes(val.userNo) || form.values.studentNameSelected.includes(val.name))){
                return val
            }
            else if(form.values.studentNameSelected.length === 0 && form.values.studentNoSelected.length === 0){
                return val
            }
        }).filter((val)=>{
            const ifMonthisNotSelected = transactionForArray.every((element)=>form.values.payment[element] === false)
            if(ifMonthisNotSelected){
                console.log(val)
                return val
            }
            else{
                if (val.transaction.some((transaction)=> transactionForArray.some((element)=>form.values.payment[element] && transaction.transactionFor === element))){
                    return val
                }
            }  
        }).map((val)=>{
            return (
                <tr key={val.userNo}>
                    <td>{val.userNo}</td>
                    <td>{val.name}</td>
                    {transactionForArray.map((element)=>{
                        return (
                            <td key={element}>
                                {val.transaction.map((val2)=>{
                                    if(val2.transactionFor === element){
                                        if(val2.amount){
                                            return val2.amount.toString() + " ₺"
                                        }
                                        return "0 ₺"
                                    }
                                    return null
                                })}
                            </td>
                        )
                    })}
                </tr>
            )
        }))
    }

    console.log(form.values.studentNoSelected)
  }, [getAllStudents, form.values.studentNameSelected,form.values.studentNoSelected])
  
  return (
    <AppShell
    header={<HeaderBar />}
    className='flex max-w-screen max-h-screen overflow-y-hidden'
    >
        <div className='flex flex-col w-full overflow-x-hidden overflow-y-hidden'>
            <Button w={200} onClick={()=>setNewPaymentModal(true)} variant='default' className='mt-6 mb-6'>Ödeme Oluştur</Button>
            <div className='flex w-full overflow-x-auto'>
            <Box sx={{overflow: 'auto'}}>
                <Box>
                <Table>
                    <thead>
                        <tr>
                            {first2rows}
                            {paymentRows}
                        </tr>
                    </thead>
                    <tbody>{students}</tbody>
                </Table>
                </Box>
            </Box>
            </div>
        </div>
        <NewPayment newPaymentModal={newPaymentModal} setNewPaymentModal={setNewPaymentModal} transactionForArray={transactionForArray} />
    </AppShell>
  )
}

export default Accounting

export async function getServerSideProps(context: any){
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const session = await getSession(context)
    return requireAdminAuth(context, ()=>{
        return {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            props: {currentSession: session}
        }
    })
}

const NewPayment = ({newPaymentModal, setNewPaymentModal, transactionForArray}:{newPaymentModal: boolean, setNewPaymentModal: React.Dispatch<SetStateAction<boolean>>, transactionForArray: ("MATERYAL1" | "MATERYAL2" | "OCAK" | "SUBAT" | "MART" | "NISAN" | "MAYIS" | "HAZIRAN" | "TEMMUZ" | "AGUSTOS" | "EYLUL" | "EKIM" | "KASIM" | "ARALIK")[]}) => {
    const context = api.useContext()
    const router = useRouter()
    const form = useForm<{
        userNo: string,
        transactionTo: TransactionFor,
        amount: number
    }>({
        initialValues: {
            userNo: "",
            transactionTo: "MATERYAL1",
            amount: 0
        }
    })
    const {data:getAllStudents} = api.user.getAllStudents.useQuery(undefined, {refetchOnWindowFocus: false})
    const {mutate: updateTransaction, isLoading: loadingUpdateTransaction} = api.user.updateTransaction.useMutation({
        onSuccess: ()=>{
            context.user.invalidate()
            notifications.show({
                message: 'Ödeme başarıyla eklendi',
                color:'green',
                autoClose: 1000,
                onClose: ()=>{
                    setNewPaymentModal(false)
                }
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
    const [rows, setRows] = useState<React.JSX.Element[]>([])
    useEffect(() => {
        setRows(
         transactionForArray.map((val)=>{
             return (
                 <Menu.Item onClick={()=>form.setFieldValue('transactionTo', val)} key={val}>{val}</Menu.Item>
             )
            })
        )
     }, [transactionForArray])
     const smBreakpoint = useMediaQuery('(min-width: 768px)')
    return (
        <Modal opened={newPaymentModal} style={{overflow: 'visible'}} onClose={()=>setNewPaymentModal(false)} size={smBreakpoint ? '50%' : "100%"}>
            <div className='flex flex-col w-full h-full'>
                <div style={{zIndex: 300}} className='w-[200px] z-[300]'>
                {getAllStudents ? (
                    <Select label='Öğrenci No' maxDropdownHeight={100} zIndex={300} dropdownPosition='bottom' {...form.getInputProps('userNo')} data={getAllStudents.map((val)=>val.userNo)}/>
                ) : (
                    <Loader />
                )}
                </div>
                <div className='flex flex-row mt-8 mb-4 w-full justify-between items-center'>
                    <Menu position='left'>
                        <Menu.Target>
                            <Button>{form.values.transactionTo}</Button>
                        </Menu.Target>
                        <Menu.Dropdown style={{zIndex: 3000, position:'absolute', overflowY: "auto", height: 100}} >
                            {rows}
                        </Menu.Dropdown>
                    </Menu>
                    <NumberInput {...form.getInputProps('amount')} />
                </div>
                <Button disabled={loadingUpdateTransaction} className='mt-10' onClick={()=>{
            updateTransaction({
                amount: form.values.amount,
                transactionFor: form.values.transactionTo,
                userNo: form.values.userNo
            })
        }} color='cyan'>{loadingUpdateTransaction ? <Loader /> : "Ödemeyi Oluştur"}</Button>
            </div>
        </Modal>
    )
}