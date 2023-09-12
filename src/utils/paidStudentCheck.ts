import { TransactionFor } from "@prisma/client";
import { prisma } from "~/server/db";

export const paidStudentCheck = async (transactionForType: TransactionFor) => {
    const odeyen = await prisma.user.findMany({
        include: {
          class: true,
          transaction: true
        },
        where: {
          role: "STUDENT",
          transaction: {
            some: {
              transactionFor: transactionForType
            }
          }
        }
      })

      const odemeyen = await prisma.user.findMany({
        include: {
          class: true,
          transaction: true
        },
        where: {
          role: "STUDENT",
          NOT: {
            transaction: {
              some: {
                transactionFor: transactionForType
              }
            }
          }
        }
      })
      
      return {
        "odeyen" : odeyen,
        "odemeyen" : odemeyen
      }

}