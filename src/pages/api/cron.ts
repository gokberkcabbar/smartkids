/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { TransactionFor } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/db";
import { paidStudentCheck } from "~/utils/paidStudentCheck";
import nodemailer from 'nodemailer'

export default async function handler(req : NextApiRequest, res : NextApiResponse) {
    
  const forwarded = req.headers['x-forwarded-for'];

  const ip = typeof forwarded === 'string' ? forwarded.split(/, /)[0] : req.socket.remoteAddress;
  //Notification ayarlarını çekme
  const notificationSettings = await prisma.notificationSetting.findMany({
      include: {
        notificationFor: true
      }
    })
    
  if(notificationSettings.length === 0){
    res.status(404).json({"message": "Not Found"})
  }

  const reportingEmail = notificationSettings[0]!.reportingEmail
  const notificationFor = notificationSettings[0]!.notificationFor.map((val)=>val.notificateFor)
  const notificationId = notificationSettings[0]!.id

  if(notificationFor.length === 0){
    res.status(404).json({"message": "No settings found"})
  }
  let materyal1Mail = ""
  let materyal2Mail = ""
  let ayMail = ""
  const getAllStudents = await prisma.user.findMany({
    where: {
      role: "STUDENT"
    },
    include: {
      class: true,
      transaction: true
    }
  })

  const currentDate = new Date()
  const currentMonth = currentDate.getMonth() + 1
  type odemeRapor = {
    "İsim Soyisim" : string,
    "Öğrenci No" : string,
    "Ödeme Miktarı" : number | undefined,
    "Anne Adı" : string | null,
    "Anne Tel No" : string | null,
    "Baba Adı" : string | null,
    "Baba Tel No" : string | null,
  }
  type ReportJSON = {
    "MATERYAL1"?: {
      "ODEYENLER": odemeRapor[],
      "ODEMEYENLER": odemeRapor[]
    },
    "MATERYAL2"?: {
      "ODEYENLER": odemeRapor[],
      "ODEMEYENLER": odemeRapor[]
    },
    
  } & {

    [X in Exclude<TransactionFor, "MATERYAL1" | "MATERYAL2">]?: {
      "ODEYENLER": odemeRapor[],
      "ODEMEYENLER": odemeRapor[]
    }
  }
  if(notificationFor.includes("AYLAR")){
    const indexAYLAR = notificationFor.indexOf("AYLAR")
    const month: Exclude<TransactionFor, "MATERYAL1" | "MATERYAL2"> = {
      1: "OCAK",
      2: "SUBAT",
      3: "MART",
      4: "NISAN",
      5: "MAYIS",
      6: "HAZIRAN",
      7: "TEMMUZ",
      8: "AGUSTOS",
      9: "EYLUL",
      10: "EKIM",
      11: "KASIM",
      12: "ARALIK"
    }[currentMonth] as Exclude<TransactionFor, "MATERYAL1" | "MATERYAL2">
    const notificationForChanged: string[] = [...notificationFor]
    notificationForChanged[indexAYLAR] = month
    if(notificationFor.includes("MATERYAL1") && notificationFor.includes("MATERYAL2")){
      const materyal1Odeyen = await paidStudentCheck("MATERYAL1")
      const materyal2Odeyen = await paidStudentCheck("MATERYAL2")
      const ayOdeyen = await paidStudentCheck(month)

      materyal1Mail = materyal1Odeyen.odemeyen.map((val)=>{
        return (
          `
          <tr style="height:21px">
          <td style="border-right:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
          <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:center">${val.userNo}</td>
          <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:center">${val.name}</td>
          <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:center">${val.mName || ""}</td>
          <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:center">${val.fName || ""}</td>
          <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:center">${val.mPhone || ""}</td>
          <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:center">${val.fPhone || ""}</td>
          <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        </tr>
          `
        )
      }).join('')
      materyal2Mail = materyal2Odeyen.odemeyen.map((val)=>{
        return (
          `
          <tr style="height:21px">
          <td style="border-right:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
          <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:center">${val.userNo}</td>
          <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:center">${val.name}</td>
          <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:center">${val.mName || ""}</td>
          <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:center">${val.fName || ""}</td>
          <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:center">${val.mPhone || ""}</td>
          <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:center">${val.fPhone || ""}</td>
          <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        </tr>
          `
        )
      }).join('')
      ayMail = ayOdeyen.odemeyen.map((val)=>{
        return (
          `
          <tr style="height:21px">
          <td style="border-right:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
          <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:center">${val.userNo}</td>
          <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:center">${val.name}</td>
          <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:center">${val.mName || ""}</td>
          <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:center">${val.fName || ""}</td>
          <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:center">${val.mPhone || ""}</td>
          <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:center">${val.fPhone || ""}</td>
          <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        </tr>
          `
        )
      }).join('')
    }
    else if(notificationFor.includes("MATERYAL1") && !notificationFor.includes("MATERYAL2")){
      const materyal1Odeyen = await paidStudentCheck("MATERYAL1")
      const ayOdeyen = await paidStudentCheck(month)
    
      materyal1Mail = materyal1Odeyen.odemeyen.map((val)=>{
        return (
          `
          <tr style="height:21px">
          <td style="border-right:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
          <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:center">${val.userNo}</td>
          <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:center">${val.name}</td>
          <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:center">${val.mName || ""}</td>
          <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:center">${val.fName || ""}</td>
          <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:center">${val.mPhone || ""}</td>
          <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:center">${val.fPhone || ""}</td>
          <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        </tr>
          `
        )
      }).join('')
      
      ayMail = ayOdeyen.odemeyen.map((val)=>{
        return (
          `
          <tr style="height:21px">
          <td style="border-right:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
          <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:center">${val.userNo}</td>
          <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:center">${val.name}</td>
          <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:center">${val.mName || ""}</td>
          <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:center">${val.fName || ""}</td>
          <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:center">${val.mPhone || ""}</td>
          <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:center">${val.fPhone || ""}</td>
          <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        </tr>
          `
        )
      }).join('')
      
    }
    else if(!notificationFor.includes("MATERYAL1") && notificationFor.includes("MATERYAL2")){

      const materyal2Odeyen = await paidStudentCheck("MATERYAL2")
      const ayOdeyen = await paidStudentCheck(month)

      materyal2Mail = materyal2Odeyen.odemeyen.map((val)=>{
        return (
          `
          <tr style="height:21px">
          <td style="border-right:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
          <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:center">${val.userNo}</td>
          <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:center">${val.name}</td>
          <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:center">${val.mName || ""}</td>
          <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:center">${val.fName || ""}</td>
          <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:center">${val.mPhone || ""}</td>
          <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:center">${val.fPhone || ""}</td>
          <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        </tr>
          `
        )
      }).join('')
      ayMail = ayOdeyen.odemeyen.map((val)=>{
        return (
          `
          <tr style="height:21px">
          <td style="border-right:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
          <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:center">${val.userNo}</td>
          <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:center">${val.name}</td>
          <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:center">${val.mName || ""}</td>
          <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:center">${val.fName || ""}</td>
          <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:center">${val.mPhone || ""}</td>
          <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:center">${val.fPhone || ""}</td>
          <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        </tr>
          `
        )
      }).join('')

    }
    else if(!notificationFor.includes("MATERYAL1") && !notificationFor.includes("MATERYAL2")){

      const ayOdeyen = await paidStudentCheck(month)

      ayMail = ayOdeyen.odemeyen.map((val)=>{
        return (
          `
          <tr style="height:21px">
          <td style="border-right:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
          <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:center">${val.userNo}</td>
          <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:center">${val.name}</td>
          <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:center">${val.mName || ""}</td>
          <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:center">${val.fName || ""}</td>
          <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:center">${val.mPhone || ""}</td>
          <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:center">${val.fPhone || ""}</td>
          <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        </tr>
          `
        )
      }).join('')
      
    }
  }
  else{
    if(notificationFor.includes("MATERYAL1") && notificationFor.includes("MATERYAL2")){
      const materyal1Odeyen = await paidStudentCheck("MATERYAL1")
      const materyal2Odeyen = await paidStudentCheck("MATERYAL2")

      materyal1Mail = materyal1Odeyen.odemeyen.map((val)=>{
        return (
          `
          <tr style="height:21px">
          <td style="border-right:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
          <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:center">${val.userNo}</td>
          <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:center">${val.name}</td>
          <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:center">${val.mName || ""}</td>
          <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:center">${val.fName || ""}</td>
          <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:center">${val.mPhone || ""}</td>
          <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:center">${val.fPhone || ""}</td>
          <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        </tr>
          `
        )
      }).join('')
      materyal2Mail = materyal2Odeyen.odemeyen.map((val)=>{
        return (
          `
          <tr style="height:21px">
          <td style="border-right:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
          <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:center">${val.userNo}</td>
          <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:center">${val.name}</td>
          <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:center">${val.mName || ""}</td>
          <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:center">${val.fName || ""}</td>
          <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:center">${val.mPhone || ""}</td>
          <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:center">${val.fPhone || ""}</td>
          <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        </tr>
          `
        )
      }).join('')


    }
    else if(notificationFor.includes("MATERYAL1") && !notificationFor.includes("MATERYAL2")){
      const materyal1Odeyen = await paidStudentCheck("MATERYAL1")
      materyal1Mail = materyal1Odeyen.odemeyen.map((val)=>{
        return (
          `
          <tr style="height:21px">
          <td style="border-right:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
          <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:center">${val.userNo}</td>
          <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:center">${val.name}</td>
          <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:center">${val.mName || ""}</td>
          <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:center">${val.fName || ""}</td>
          <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:center">${val.mPhone || ""}</td>
          <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:center">${val.fPhone || ""}</td>
          <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        </tr>
          `
        )
      }).join('')
    }
    else if(!notificationFor.includes("MATERYAL1") && notificationFor.includes("MATERYAL2")){
      const materyal2Odeyen = await paidStudentCheck("MATERYAL2")

      materyal2Mail = materyal2Odeyen.odemeyen.map((val)=>{
        return (
          `
          <tr style="height:21px">
          <td style="border-right:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
          <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:center">${val.userNo}</td>
          <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:center">${val.name}</td>
          <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:center">${val.mName || ""}</td>
          <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:center">${val.fName || ""}</td>
          <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:center">${val.mPhone || ""}</td>
          <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:center">${val.fPhone || ""}</td>
          <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        </tr>
          `
        )
      }).join('')
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  
  //Mail atma kısmısı
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.NEXT_PUBLIC_MAIL_PROVIDER,
      pass: process.env.NEXT_PUBLIC_MAIL_PROVIDER_PASSWORD,
    },
  })

  const mailOptions = {
    from: "sonergokberkcabbar@gmail.com",
    to: reportingEmail,
    subject: "Smartkids Aylık Rapor",
    html: `
    <html>
    <div dir="ltr">
  <table cellspacing="0" cellpadding="0" dir="ltr" style="table-layout:fixed;font-size:10pt;font-family:Arial;width:0px">
    <colgroup>
      <col width="100">
      <col width="100">
      <col width="100">
      <col width="100">
      <col width="100">
      <col width="100">
      <col width="100">
      <col width="100">
    </colgroup>
    <tbody>
      <tr style="height:21px">
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
      </tr>
      <tr style="height:21px">
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
      </tr>
      <tr style="height:21px">
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="width:202px;height:189px;overflow:hidden;padding:2px 3px;vertical-align:bottom" rowspan="9" colspan="2">
          <div style="max-height:189px">
            <img src="https://res.cloudinary.com/dkqt9cxba/image/upload/v1696522850/s4uycqyxiw8r0frtirpr.jpg" alt="image.png" width="188" height="189">
          </div>
        </td>
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
      </tr>
      <tr style="height:21px">
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
      </tr>
      <tr style="height:21px">
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
      </tr>
      <tr style="height:21px">
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="border-right:1px solid transparent;overflow:visible;padding:2px 0px;vertical-align:bottom;font-size:20pt;font-weight:bold">
          <div style="overflow:hidden;width:297px">
            <div style="float:left">SmartKids Aylık Rapor</div>
          </div>
        </td>
        <td style="border-right:1px solid transparent;overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
      </tr>
      <tr style="height:21px">
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
      </tr>
      <tr style="height:21px">
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="border-right:1px solid transparent;overflow:visible;padding:2px 0px;vertical-align:bottom">
          <div style="overflow:hidden;width:196px">
            <div style="float:left">Bildirim ID: ${notificationId}</div>
          </div>
        </td>
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
      </tr>
      <tr style="height:21px">
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="border-right:1px solid transparent;overflow:visible;padding:2px 0px;vertical-align:bottom">
          <div style="overflow:hidden;width:196px">
            <div style="float:left">Rapor Tarihi: ${currentDate.toLocaleDateString('tr-TR')}</div>
          </div>
        </td>
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
      </tr>
      <tr style="height:21px">
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
      </tr>
      <tr style="height:21px">
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
      </tr>
      <tr style="height:21px">
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
      </tr>
      ${notificationFor.includes('MATERYAL1') ? `<tr style="height:21px">
      <td style="border-right:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
      <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;font-weight:bold;text-align:center" rowspan="1" colspan="6">MATERYAL 1 ÖDEMEYENLER</td>
      <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
    </tr>
    <tr style="height:21px">
      <td style="border-right:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
      <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;font-weight:bold;text-align:center">Öğrenci No</td>
      <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;font-weight:bold;text-align:center">Öğrenci Adı</td>
      <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;font-weight:bold;text-align:center">Anne Adı</td>
      <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;font-weight:bold;text-align:center">Baba Adı</td>
      <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;font-weight:bold;text-align:center">Anne Tel No</td>
      <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;font-weight:bold;text-align:center">Baba Tel No</td>
      <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
    </tr>
    
    ${materyal1Mail}` : ""}
    <tr style="height:21px">
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
      </tr>
      ${notificationFor.includes('MATERYAL2') ? `<tr style="height:21px">
      <td style="border-right:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
      <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;font-weight:bold;text-align:center" rowspan="1" colspan="6">MATERYAL 2 ÖDEMEYENLER</td>
      <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
    </tr>
    <tr style="height:21px">
      <td style="border-right:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
      <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;font-weight:bold;text-align:center">Öğrenci No</td>
      <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;font-weight:bold;text-align:center">Öğrenci Adı</td>
      <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;font-weight:bold;text-align:center">Anne Adı</td>
      <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;font-weight:bold;text-align:center">Baba Adı</td>
      <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;font-weight:bold;text-align:center">Anne Tel No</td>
      <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;font-weight:bold;text-align:center">Baba Tel No</td>
      <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
    </tr>
    ${materyal2Mail}` : ""}
      <tr style="height:21px">
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
      </tr>
      ${notificationFor.includes('AYLAR') ? `<tr style="height:21px">
      <td style="border-right:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
      <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;font-weight:bold;text-align:center" rowspan="1" colspan="6">AYLIK ÖDEMEYENLER</td>
      <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
    </tr>
    <tr style="height:21px">
      <td style="border-right:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
      <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;font-weight:bold;text-align:center">Öğrenci No</td>
      <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;font-weight:bold;text-align:center">Öğrenci Adı</td>
      <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;font-weight:bold;text-align:center">Anne Adı</td>
      <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;font-weight:bold;text-align:center">Baba Adı</td>
      <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;font-weight:bold;text-align:center">Anne Tel No</td>
      <td style="border-right:1px solid rgb(0,0,0);border-bottom:1px solid rgb(0,0,0);overflow:hidden;padding:2px 3px;vertical-align:bottom;font-weight:bold;text-align:center">Baba Tel No</td>
      <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
    </tr>
    ${ayMail}` : ""}
      <tr style="height:21px">
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
        <td style="overflow:hidden;padding:2px 3px;vertical-align:bottom"></td>
      </tr>
    </tbody>
  </table>
  <div>
    ${ip}
  </div>
</div>
    
    
    </html>`
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  transporter.sendMail(mailOptions, (error, info)=>{
    if(error){
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      res.status(500).json({"msg": error.message})
    }
    else{
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      res.status(200).json({"msg": info.response})
    }
  })
  }