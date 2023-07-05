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
  //GET - Kullanıcı bilgilerini session'dan çekme
  getUserInfo: protectedProcedure.query(({ctx})=>{
    return ctx.session.user
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
        class: null
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
  })

});
