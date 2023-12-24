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
  const context = api.useContext()
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

  const [changeTransactionStatus, setChangeTransactionStatus] = useState("")
  const amountChange = useForm({
    initialValues: {
        amount: 0,
        month: "MATERYAL1",
        userNo: ""
    }
  })

  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
       if (event.key === 'Escape') {
         event.preventDefault();
         setChangeTransactionStatus("");
         amountChange.reset()
       }
     };
  
     document.addEventListener('keydown', keyDownHandler);
  
    return () => {
      document.removeEventListener('keydown', keyDownHandler);
    }
  }, [])

  const {mutate: updateTransaction, isLoading: loadingUpdateTransaction} = api.user.updateTransaction.useMutation({
    onSuccess: ()=>{
        context.user.invalidate()
        amountChange.reset()
        setChangeTransactionStatus("")
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


  useEffect(() => {
    const handleEnter = (event: KeyboardEvent) => {
      if(changeTransactionStatus !== "" && amountChange.values.userNo.length !== 0 && event.key === 'Enter'){
          event.preventDefault()
          const userNo = amountChange.values.userNo
          const transactionFor = amountChange.values.month as TransactionFor
          const amount = amountChange.values.amount
          updateTransaction({
              amount: amount,
              transactionFor: transactionFor,
              userNo: userNo
          })

      }
    }
    document.addEventListener('keydown', handleEnter)
  
    return () => {
      document.removeEventListener('keydown', handleEnter)
    }
  }, [changeTransactionStatus, amountChange.values])


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
                                    if(element.name.toLocaleLowerCase('tr').includes(form.values.studentNameSearch.toLocaleLowerCase('tr'))){
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
                    {transactionForArray.map((transactionFor)=>{
                        return(
                            <td style={{zIndex: 1000}} key={transactionFor}>
                                {props.currentSession?.user.role === "ADMIN" ? (
                                    val.transaction.map((userTransaction)=>userTransaction.transactionFor).includes(transactionFor) ? val.transaction.map((userTransaction)=>{
                                        if (userTransaction.transactionFor === transactionFor){
                                            
                                            if (userTransaction.transactionFor === changeTransactionStatus && amountChange.values.userNo === val.userNo){
                                                return (
                                                    <NumberInput key={userTransaction.id} {...amountChange.getInputProps('amount')} />
                                                ) 
                                            }
                                            else {
                                                return (
                                                    <Button key={userTransaction.id} style={{width: '100%'}} variant='subtle' onClick={()=>{
                                                        amountChange.setFieldValue('month', userTransaction.transactionFor)
                                                        amountChange.setFieldValue('amount', userTransaction.amount ? userTransaction.amount : 0)
                                                        amountChange.setFieldValue('userNo', val.userNo)
                                                        setChangeTransactionStatus(userTransaction.transactionFor)
                                                    }}>{userTransaction.amount ? userTransaction.amount.toString() + " ₺" : null}</Button>
                                                )
                                            }
                                        }
                                        else {
                                            <Button style={{width: '100%'}} key={userTransaction.id} variant='subtle' onClick={()=>{
                                                amountChange.setFieldValue('month', transactionFor)
                                                amountChange.setFieldValue('amount', 0)
                                                amountChange.setFieldValue('userNo', val.userNo)
                                                setChangeTransactionStatus(userTransaction.transactionFor)
                                            }}>{null}</Button>
                                        }
                                    }) : (
                                        <>
                                        {
                                            (changeTransactionStatus === transactionFor && amountChange.values.userNo === val.userNo) ? <NumberInput {...amountChange.getInputProps('amount')} /> : (
                                                <Button style={{width: '100%'}} key={transactionFor} variant='default' onClick={()=>{
                                                amountChange.setFieldValue('month', transactionFor)
                                                amountChange.setFieldValue('amount', 0)
                                                amountChange.setFieldValue('userNo', val.userNo)
                                                setChangeTransactionStatus(transactionFor)
                                        }}>{null}</Button>
                                            )
                                        }
                                        </>
                                        
                                    )
                                ) : (
                                        <td key={transactionFor}>
                                            {val.transaction.map((userTransaction)=>{
                                                if (userTransaction.transactionFor === transactionFor){
                                                    if (userTransaction.amount){
                                                        return userTransaction.amount.toString() + " ₺"
                                                    }
                                                    return "0 ₺"
                                                }
                                                return null
                                            })}
                                        </td>
                                    
                                )}
                            </td>
                        )
                    })}
                </tr>
            )
        }))
    }


  }, [getAllStudents, form.values.studentNameSelected,form.values.studentNoSelected, changeTransactionStatus, amountChange.values.userNo])
  console.log(amountChange.values)
  return (
    <AppShell
    header={<HeaderBar />}
    className='flex w-screen h-screen'
    >
        <div className='flex flex-col w-full h-full'>
            <div className='flex w-full h-full overflow-auto'>
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