/* eslint-disable @typescript-eslint/no-unsafe-member-access */

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
import { UploadApiResponse } from "cloudinary";

export const tasksRouter = createTRPCRouter({
    //GET - Sınıfa ait task'ları çek
    getTask: adminProcedure.input(z.object({
        className: z.string()
    })).query(async ({input})=>{
        const classId = await prisma.class.findUnique({
            where: {
                name: input.className
            },
            select: {
                id: true
            }
        })

        if(!classId){
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Sınıf bulunamadı"
            })
        }

        return await prisma.task.findMany({
            where: {
                classId: classId.id
            },
            include: {
                class: true,
            }
        })
    }),

    //GET - Öğrencinin no'sundan Task'i çek
    getTaskByUserNo: protectedProcedure.input(z.object({
        userNo: z.string()
    })).query(async ({input})=>{
        const getUserInfo = await prisma.user.findUnique({
            where: {
                userNo: input.userNo
            },
            include: {
                class: true
            }
        })
        if(!getUserInfo?.class?.id){
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Herhangi bir sınıfa kayıtlı değil"
            })
        }
        return await prisma.task.findMany({
            where: {
                class: {
                    id: getUserInfo?.class?.id
                }
            }
        })
    }),


    //POST - Yeni bir Task oluştur
    createTask: adminProcedure.input(z.object({
        deadline: z.string(),
        fileLink: z.string(),
        className: z.string(),
        taskName: z.string()
    })).mutation(async ({input, ctx})=>{
        const fileLink = await ctx.cloudinary.uploader.upload(input.fileLink)
        return await prisma.task.create({
            data: {
                deadline: input.deadline,
                fileLink: fileLink.url,
                class: {
                    connect: {
                        name: input.className
                    }
                },
                name: input.taskName,
            }
        })
    }),

    //UPDATE - Task'ı Update et
    updateTask: adminProcedure.input(z.object({
        fileLink: z.string(),
        deadline: z.string(),
        name: z.string(),
        updatedFileLink: z.string().nullish(),
        className: z.string()
    })).mutation(async ({ctx, input})=>{
        let fileLinkk: UploadApiResponse | undefined
        
        if(input.updatedFileLink){
            fileLinkk = await ctx.cloudinary.uploader.upload(input.fileLink)
        }
        const getClassNameData = await prisma.task.findUnique({
            where: {
                fileLink: input.fileLink
            },
            select: {
                class: {
                    select: {
                        name: true
                    }
                }
            }
        })

        if(getClassNameData?.class?.name === input.className){
            return await prisma.task.update({
                where: {
                    fileLink: input.fileLink
                },
                data: {
                    deadline: input.deadline,
                    name: input.name,
                    fileLink: input.updatedFileLink ? fileLinkk!.url : input.fileLink,
                }
            })
        }
        else{
            await prisma.task.update({
                where: {
                    fileLink: input.fileLink
                },
                data: {
                    deadline: input.deadline,
                    name: input.name,
                    fileLink: input.updatedFileLink ? fileLinkk!.url : input.fileLink,
                    class: {
                        disconnect: true
                    } 
                }
            })

            await prisma.task.update({
                where: {
                    fileLink: input.fileLink
                },
                data: {
                    class: {
                        connect: {
                            name: input.className
                        }
                    }
                }
            })

            return {
                "msg" : "Update succcessful"
            }
        }
    }),

    // DELETE - Task'ı sil
    deleteTask: adminProcedure.input(z.object({
        fileLink: z.string()
    })).mutation(async ({ctx, input})=>{

       await ctx.cloudinary.uploader.destroy(input.fileLink)
        return await prisma.task.delete({
            where: {
                fileLink: input.fileLink
            }
        })
    })
})