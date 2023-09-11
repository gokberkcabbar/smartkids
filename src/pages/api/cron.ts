import { TransactionFor } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/db";

export default async function handler(req : NextApiRequest, res : NextApiResponse) {
    
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
  type ReportJSON = {
    "MATERYAL1"?: {
      "ODEYENLER": Record<string, number>[],
      "ODEMEYENLER": Record<string, number>[]
    },
    "MATERYAL2"?: {
      "ODEYENLER": Record<string, number>[],
      "ODEMEYENLER": Record<string, number>[]
    },
    
  } & {

    [X in Exclude<TransactionFor, "MATERYAL1" | "MATERYAL2">]?: {
      "ODEYENLER": Record<string, number>[],
      "ODEMEYENLER": Record<string, number>[]
    }
  }
  let reportJson: ReportJSON = {}
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
      reportJson = {
        "MATERYAL1": {
          "ODEYENLER": [{"asdsad": 400}],
          "ODEMEYENLER": [],
        },
        "MATERYAL2": {
          "ODEYENLER": [],
          "ODEMEYENLER": [],
        },
        [month]: {
          "ODEYENLER": [],
          "ODEMEYENLER": [],
        }
      }
    }
    else if(notificationFor.includes("MATERYAL1") && !notificationFor.includes("MATERYAL2")){
      reportJson = {
        "MATERYAL1": {
          "ODEYENLER": [],
          "ODEMEYENLER": [],
        },
        [month]: {
          "ODEYENLER": [],
          "ODEMEYENLER": [],
        }
      }
    }
    else if(!notificationFor.includes("MATERYAL1") && notificationFor.includes("MATERYAL2")){
      reportJson = {
        "MATERYAL2": {
          "ODEYENLER": [],
          "ODEMEYENLER": [],
        },
        [month]: {
          "ODEYENLER": [],
          "ODEMEYENLER": [],
        }
      }
    }
    else if(!notificationFor.includes("MATERYAL1") && !notificationFor.includes("MATERYAL2")){
      reportJson = {
        [month]: {
          "ODEYENLER": [],
          "ODEMEYENLER": [],
        }
      }
    }
  }
  else{
    if(notificationFor.includes("MATERYAL1") && notificationFor.includes("MATERYAL2")){
      reportJson = {
        "MATERYAL1": {
          "ODEYENLER": [],
          "ODEMEYENLER": [],
        },
        "MATERYAL2": {
          "ODEYENLER": [],
          "ODEMEYENLER": [],
        }
      }
    }
    else if(notificationFor.includes("MATERYAL1") && !notificationFor.includes("MATERYAL2")){
      reportJson = {
        "MATERYAL1": {
          "ODEYENLER": [],
          "ODEMEYENLER": [],
        }
      }
    }
    else if(!notificationFor.includes("MATERYAL1") && notificationFor.includes("MATERYAL2")){
      reportJson = {
        "MATERYAL2": {
          "ODEYENLER": [],
          "ODEMEYENLER": [],
        }
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  
  res.status(200).json({"msg": reportJson})
  }