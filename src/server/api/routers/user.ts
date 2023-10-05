import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  adminProcedure
} from "~/server/api/trpc";
import { prisma } from "~/server/db";
import bcrpyt from 'bcrypt'
import { generateRandomNumber } from "~/utils/generateUserNo";
import { TransactionFor } from "@prisma/client";

export const userRouter = createTRPCRouter({
  //POST - Yeni Kullanıcı kaydı
  addUser: publicProcedure.input(z.object({
    userName: z.string(),
    password: z.string(),
    name: z.string(),
    age: z.number().nullish(),
    className: z.string().nullish(),
    fJob: z.string().nullish(),
    fPhone: z.string().nullish(),
    fName: z.string().nullish(),
    mJob: z.string().nullish(),
    mPhone: z.string().nullish(),
    mName: z.string().nullish(),
    schoolClass: z.string().nullish(),
    tPhone: z.string().nullish()
  })).mutation(async ({ctx, input})=>{
    const {password, userName, name, age, className, fJob, fName, fPhone, mJob, mName, mPhone, schoolClass, tPhone}  = input
    const user = await prisma.user.findFirst({
        where: {
            userNo: userName
        }
    })

    if(user){
        throw new TRPCError({
            code: "CONFLICT",
            message: "Bu kullanıcı no sistemde kayıtlı"
        })
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    const hash = bcrpyt.hashSync(password, 10)
    const result = await ctx.prisma.user.create({
        data: {
            userNo: userName,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            password: hash,
            name: name,
            age: age,
            class: className ?{
              connect: {
                name: className ? className : undefined
              }
            }: undefined,
            fJob: fJob,
            mJob: mJob,
            mName: mName,
            mPhone: mPhone,
            fName: fName,
            fPhone: fPhone,
            role: "STUDENT",
            schoolClass: schoolClass,
            tPhone: tPhone,
        }
    })
  }),
  //GET - Kullanıcı bilgilerini çekme
  getUserInfo: publicProcedure.input(z.object({
    userNo: z.string()
  })).query(async ({input})=>{
    return await prisma.user.findUnique({
      where: {
        userNo: input.userNo
      },
      include: {
        class: true,
        transaction: true
      }
    })
  }),

  //GET - Bütün Kullanıcıların verisi
  getAllUser: adminProcedure.query(async ({})=>{
    return await prisma.user.findMany({})
  }),

  //GET - Bütün Öğrencilerin verisi
  getAllStudents: adminProcedure.query(async({})=>{
    return await prisma.user.findMany({
      where: {
        role: "STUDENT"
      },
      include: {
        class: true,
        transaction: true
      }
    })
  }),

  //GET - Herhangi bir sınıfa dahil olmayan öğrencilerin verisi
  getStudentsExcludeClass: adminProcedure.query(async()=>{
    return await prisma.user.findMany({
      where: {
        class: null,
        role: "STUDENT"
      }
    })
  }),

  //GET - User No unique mi?
  createUniqueUserNo: adminProcedure.query(async ()=>{
    const isUnique = await prisma.user.findUnique({
      where: {
        userNo: generateRandomNumber().toString()
      }
    })
    if(!isUnique){
      return generateRandomNumber().toString()
    }
    return false
  }),

  //DELETE - Kullanıcıyı silme
  deleteUser: adminProcedure.input(z.object({
    userNo: z.string()
  })).mutation(async ({input})=>{
    await prisma.user.update({
      where: {
        userNo: input.userNo
      },
      data: {
        class: {
          disconnect: true
        }
      }
    })
    await prisma.user.delete({
      where: {
        userNo: input.userNo
      },
      include: {
        transaction: true
      }
    })
  }),

  //UPDATE - Şifre Güncelleme
  updatePassword: protectedProcedure.input(z.object({
    userNo: z.string(),
    password: z.string()
  })).mutation(async ({ctx, input})=>{
    if(ctx.session.user.userNo !== input.userNo){
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: `Sadece ${input.userNo} kullanıcısı şifresini değiştirebilir.`
      })
    }
    const hash = bcrpyt.hashSync(input.password, 10)
    return await prisma.user.update({
      where: {
        userNo: input.userNo
      },
      data: {
        password: hash
      }
    })
  }),

  // Update - Öğrenci Bilgileri Güncelleme
  updateStudentInfo: protectedProcedure.input(z.object({
    name: z.string(),
    userNo: z.string(),
    className: z.string().nullish(),
    fName: z.string().nullish(),
    fPhone: z.string().nullish(),
    fJob: z.string().nullish(),
    mName: z.string().nullish(),
    mPhone: z.string().nullish(),
    mJob: z.string().nullish(),
    tPhone: z.string().nullish(),
    image: z.string().nullish()
  })).mutation(async ({ctx, input})=>{
    if(!(ctx.session.user.role === "ADMIN" || ctx.session.user.userNo === input.userNo)){
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: `${input.userNo} veya ADMIN kişisinin yetkisi gerekli`
      })
    }
    const ifClassAvailable = await prisma.user.findUnique({
      where: {
        userNo: input.userNo
      },
      select: {
        class: true
      }
    })

    if(ifClassAvailable?.class){
      await prisma.user.update({
        where: {
          userNo: input.userNo
        },
        include: {
          class: true
        },
        data: {
          fJob: input.fJob,
          fName: input.fName,
          fPhone: input.fPhone,
          mJob: input.mJob,
          mName: input.mName,
          mPhone: input.mPhone,
          name: input.name,
          tPhone: input.tPhone,
          class: {
            disconnect: true
          }
        }
      })
      await prisma.user.update({
        where: {
          userNo: input.userNo
        },
        include: {
          class: true
        },
        data: {
          class: {
            connect: {
              name: input.className ? input.className : undefined
            }
          }
        }
      })
    }
    
    await prisma.user.update({
      where: {
        userNo: input.userNo
      },
      data: {
        fJob: input.fJob,
        fName: input.fName,
        fPhone: input.fPhone,
        mJob: input.mJob,
        mName: input.mName,
        mPhone: input.mPhone,
        name: input.name,
        tPhone: input.tPhone
      }
    })

    if(input.image){
      await prisma.user.update({
        where: {
          userNo: input.userNo
        },
        data: {
          image: input.image
        }
      })
    }
  }),

  //UPDATE - Ödeme alma
  updateTransaction: adminProcedure.input(z.object({
    userNo: z.string(),
    transactionFor: z.nativeEnum(TransactionFor),
    amount: z.number()
  })).mutation(async ({input}) => {
    const userIdNullable = await prisma.user.findUnique({
      where: {
        userNo: input.userNo
      },
      select: {
        id: true
      }
    })
    const userId = userIdNullable?.id
    const transactionExist = await prisma.transaction.findUnique({
      where: {
        transactionFor_userId: {
          transactionFor: input.transactionFor,
          userId: userId!
        }
      }
    })
    if(transactionExist){
      return await prisma.transaction.update({
        where: {
          transactionFor_userId: {
            transactionFor: input.transactionFor,
            userId: userId!
          }
        },
        data: {
          amount: input.amount
        }
      })
    }
    return await prisma.user.update({
      where: {
        userNo: input.userNo
      },
      include: {
        transaction: true
      },
      data: {
        transaction: {
          create: {
            amount: input.amount,
            transactionFor: input.transactionFor
          }
        }
      }
    })
  }),

  // GET - O ayda ve bir önceki ayda kayıt olmuş öğrencilerin sayısı
  getUserCountByDate: adminProcedure.query(async ()=>{
    const now = new Date()
    const currentMonth = now.getMonth() + 1
    const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1
    const thisYear = now.getFullYear()
    const previousYear = currentMonth === 1 ? thisYear - 1 : thisYear
    const thisMonth = await prisma.user.findMany({
      where: {
        createdAt: {
          gte: new Date(thisYear, currentMonth - 1, 1),
          lt: new Date(thisYear, currentMonth, 1)
        },
        role: "STUDENT"
      },
      select: {
        userNo: true
      }
    })
    const previousMonthPrisma = await prisma.user.findMany({
      where: {
        createdAt: {
          lt: new Date(previousYear, previousMonth, 1)
        },
        role: "STUDENT"
      },
      select: {
        userNo: true
      }
    })
    return (
      {
        thisMonth: thisMonth,
        previousMonth: previousMonthPrisma
      }
    )
  }),

  //GET - Bir sınıfa bağlı olan çocuklar vs olmayanlar
  getStudentsByInAnyClass: adminProcedure.query(async ()=>{
    const inClass = await prisma.user.findMany({
      where: {
        classId: {
          not: {
            equals: null
          }
        },
        role: 'STUDENT'
      },
      select: {
        userNo: true
      }
    })
    const notInClass = await prisma.user.findMany({
      where: {
        classId: {
          equals: null
        },
        role: 'STUDENT'
      },
      select: {
        userNo: true
      }
    })

    return (
      {
        notInClass: notInClass,
        inClass: inClass
      }
    )
  })

});
