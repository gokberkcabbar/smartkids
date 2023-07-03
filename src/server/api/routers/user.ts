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

export const userRouter = createTRPCRouter({
  //POST - Yeni Kullanıcı kaydı
  addUser: publicProcedure.input(z.object({
    userName: z.string(),
    password: z.string(),
    name: z.string()
  })).mutation(async ({ctx, input})=>{
    const {password, userName, name}  = input
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
  })
});
