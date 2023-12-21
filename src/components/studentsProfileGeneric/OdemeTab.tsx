/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { Box, Button, Loader, Menu, Modal, NumberInput, Select, Table } from '@mantine/core'
import { TransactionFor } from '@prisma/client'
import React, { SetStateAction, useEffect, useState } from 'react'
import { PageProps } from '~/pages/protected/student/profile/[userId]'
import { UseFormReturnType, useForm } from '@mantine/form'
import { api } from '~/utils/api'
import { notifications } from '@mantine/notifications'
import { useRouter } from 'next/router'
import { useMediaQuery } from '@mantine/hooks'
export const OdemeTab = ({props, refetchNeeded, setRefetchNeeded}:{refetchNeeded: boolean, setRefetchNeeded: React.Dispatch<SetStateAction<boolean>>, props: PageProps}) => {
const [rows, setRows] = useState<React.JSX.Element[]>([])
const transactionForArray = Object.values(TransactionFor)
const form = useForm<{
    transactionTo: TransactionFor,
    amount: number,
    newTransaction: boolean
}>({
    initialValues: {
        transactionTo: "MATERYAL1",
        amount: 0,
        newTransaction: false
    }
})

const [changeTransactionStatus, setChangeTransactionStatus] = useState("")
const amountChange = useForm({
    initialValues: {
        amount: 0,
        month: "MATERYAL1"
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

const context = api.useContext()
const router = useRouter()

const {mutate: updateTransaction, isLoading: loadingUpdateTransaction} = api.user.updateTransaction.useMutation({
    onSuccess: ()=>{
        setRefetchNeeded(true)
        notifications.show({
            message: 'Ödeme başarıyla eklendi',
            color:'green',
            autoClose: 1000,
            onClose: ()=>{
                form.setFieldValue('newTransaction', false)
                
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
  const handleEnter = async (event: KeyboardEvent) => {
    if(changeTransactionStatus !== "" && props.userInfo.userNo && event.key === 'Enter'){
        event.preventDefault()
        await context.user.getUserInfo.invalidate()
        setRefetchNeeded(false)
        const userNo = props.userInfo.userNo
        const transactionFor = amountChange.values.month as TransactionFor
        const amount = amountChange.values.amount
        updateTransaction({
            amount: amount,
            transactionFor: transactionFor,
            userNo: userNo
        })
        amountChange.reset()
        setChangeTransactionStatus("")
    }
  }
  document.addEventListener('keydown', handleEnter)

  return () => {
    document.removeEventListener('keydown', handleEnter)
  }
}, [changeTransactionStatus, amountChange.values])




useEffect(() => {
  if(transactionForArray){
    setRows(transactionForArray.map((val)=>{
        
        return(
        <td style={{zIndex: 1000}} key={val}>
            {props.currentSession.user.role === "ADMIN" ? (
                props.userInfo.transactionInfo?.map((val3)=>val3.transactionFor).includes(val) ? props.userInfo.transactionInfo.map((val2)=>{
                    if (val2.transactionFor === val){
                        
                        if (val2.transactionFor === changeTransactionStatus){
                            return (
                                <NumberInput key={val2.id} {...amountChange.getInputProps('amount')} />
                            ) 
                        }
                        else {
                            return (
                                <Button key={val2.id} style={{width: '100%'}} variant='subtle' onClick={()=>{
                                    amountChange.setFieldValue('month', val2.transactionFor)
                                    amountChange.setFieldValue('amount', val2.amount ? val2.amount : 0)
                                    setChangeTransactionStatus(val2.transactionFor)
                                }}>{val2.amount ? val2.amount.toString() + " ₺" : null}</Button>
                            )
                        }
                    }
                    else {
                        <Button style={{width: '100%'}} key={val2.id} variant='subtle' onClick={()=>{
                            amountChange.setFieldValue('month', val)
                            amountChange.setFieldValue('amount', 0)
                            setChangeTransactionStatus(val2.transactionFor)
                        }}>{null}</Button>
                    }
                }) : (
                    <>
                    {
                        changeTransactionStatus === val ? <NumberInput {...amountChange.getInputProps('amount')} /> : (
                            <Button style={{width: '100%'}} key={val} variant='default' onClick={()=>{
                            amountChange.setFieldValue('month', val)
                            amountChange.setFieldValue('amount', 0)
                            setChangeTransactionStatus(val)
                    }}>{null}</Button>
                        )
                    }
                    </>
                    
                )
            ) : (
                    <td key={val}>
                        {props.userInfo.transactionInfo?.map((val2)=>{
                            if (val2.transactionFor === val){
                                if (val2.amount){
                                    return val2.amount.toString() + " ₺"
                                }
                                return "0 ₺"
                            }
                            return null
                        })}
                    </td>
                
            )}
        </td>
    )}))
  }

}, [transactionForArray, JSON.stringify(props.userInfo.transactionInfo)])

  
  return (
    <>
    <Box sx={{ overflow: "auto" }}>
        <Box sx={{ width: "100%", display: "table", tableLayout: "fixed" }}>
            <Table striped horizontalSpacing={16} highlightOnHover withBorder>
            <thead>
                <tr>
                    <th>Öğrenci No</th>
                    <th>Öğrenci Adı Soyadı</th>
                    <th>Materyal 1</th>
                    <th>Materyal 2</th>
                    <th>Ocak</th>
                    <th>Şubat</th>
                    <th>Mart</th>
                    <th>Nisan</th>
                    <th>Mayıs</th>
                    <th>Haziran</th>
                    <th>Temmuz</th>
                    <th>Ağustos</th>
                    <th>Eylül</th>
                    <th>Ekim</th>
                    <th>Kasım</th>
                    <th>Aralık</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{props.userInfo.userNo}</td>
                    <td>{props.userInfo.name}</td>
                    {rows}
                </tr>
            </tbody>
            </Table>
        </Box>
    </Box>

    </>
  )
}
