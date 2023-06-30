import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";
import bcrpyt from 'bcrypt'

export const userRouter = createTRPCRouter({
  addUser: publicProcedure.input(z.object({
    userName: z.string(),
    password: z.string(),
  })).mutation(async ({ctx, input})=>{
    const {password, userName}  = input
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
            password: hash
        }
    })
  })
});
