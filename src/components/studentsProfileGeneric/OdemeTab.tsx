/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { Box, Button, Loader, Menu, Modal, NumberInput, Table } from '@mantine/core'
import { TransactionFor } from '@prisma/client'
import React, { useEffect, useState } from 'react'
import { PageProps } from '~/pages/protected/student/profile/[userId]'
import { UseFormReturnType, useForm } from '@mantine/form'
import { api } from '~/utils/api'
import { notifications } from '@mantine/notifications'
import { useRouter } from 'next/router'
import { useMediaQuery } from '@mantine/hooks'
export const OdemeTab = ({props}:{props: PageProps}) => {
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

useEffect(() => {
  if(transactionForArray){
    setRows(transactionForArray.map((val)=>{
        return(
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
    )}))
  }

}, [transactionForArray])

  
  return (
    <>
    <Box sx={{ overflow: "auto" }}>
        <Box sx={{ width: "100%", display: "table", tableLayout: "fixed" }}>
            {props.currentSession.user.role === "ADMIN" ? (
                <Button onClick={()=>form.setFieldValue('newTransaction', true)} className='mt-6 mb-4' variant='default'>Ödeme Ekle</Button>
            ) : (
                null
            )}
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
    <NewTransactionModal form={form} transactionForArray={transactionForArray} userNo={props.userInfo.userNo!} />
    </>
  )
}

const NewTransactionModal = ({form, transactionForArray, userNo}:{form: UseFormReturnType<{
    transactionTo: TransactionFor;
    amount: number;
    newTransaction: boolean;
}, (values: {
    transactionTo: TransactionFor;
    amount: number;
    newTransaction: boolean;
}) => {
    transactionTo: TransactionFor;
    amount: number;
    newTransaction: boolean;
}>, transactionForArray: ("MATERYAL1" | "MATERYAL2" | "OCAK" | "SUBAT" | "MART" | "NISAN" | "MAYIS" | "HAZIRAN" | "TEMMUZ" | "AGUSTOS" | "EYLUL" | "EKIM" | "KASIM" | "ARALIK")[], userNo: string}) => {
    const [rows, setRows] = useState<React.JSX.Element[]>([])
useEffect(() => {
    
   setRows(
    transactionForArray.map((val)=>{
        console.log(rows)
        return (
            <Menu.Item onClick={()=>form.setFieldValue('transactionTo', val)} key={val}>{val}</Menu.Item>
        )
       })
   )
}, [transactionForArray])
const context = api.useContext()
const router = useRouter()
const {mutate: updateTransaction, isLoading: loadingUpdateTransaction} = api.user.updateTransaction.useMutation({
    onSuccess: ()=>{
        context.user.invalidate()
        notifications.show({
            message: 'Ödeme başarıyla eklendi',
            color:'green',
            autoClose: 1000,
            onClose: ()=>{
                form.setFieldValue('newTransaction', false)
                router.reload()
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
const smBreakpoint = useMediaQuery('(min-width: 768px)')
return (
    <Modal zIndex={200} opened={form.values.newTransaction} onClose={()=>form.setFieldValue('newTransaction', false)} size={smBreakpoint ? '50%' : "100%"}>
        <div className='flex flex-col w-full'>
        <div className='flex flex-row w-full items-center justify-between'>
            <Menu>
                <Menu.Target>
                    <Button>{form.values.transactionTo}</Button>
                </Menu.Target>
                <Menu.Dropdown>
                    {rows}
                </Menu.Dropdown>
            </Menu>
            <NumberInput {...form.getInputProps('amount')} />
        </div>
        <Button disabled={loadingUpdateTransaction} className='mt-10' onClick={()=>{
            updateTransaction({
                amount: form.values.amount,
                transactionFor: form.values.transactionTo,
                userNo: userNo
            })
        }} color='cyan'>{loadingUpdateTransaction ? <Loader /> : "Ödemeyi Oluştur"}</Button>
        </div>
    </Modal>
)
}
