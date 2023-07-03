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
import { Location } from "@prisma/client";

export const classRouter = createTRPCRouter({
    // POST - Yeni Sınıf oluştur
    addClass: adminProcedure.input(z.object({
        name: z.string(),
        location: z.nativeEnum(Location)
    })).mutation(async ({input})=>{
        const checkIfClassExist = await prisma.class.findUnique({
            where: {
                name: input.name
            }
        })
        if(checkIfClassExist){
            throw new TRPCError({
                code: "CONFLICT",
                message: "Varolan sınıf ismi"
            })
        }

        return await prisma.class.create({
            data: {
                location: input.location,
                name: input.name,
            }
        })
    }),

    // PUT - Sınıfa öğrenci ekle
    addStudentInClass: adminProcedure.input(z.object({
        userNo: z.string(),
        name: z.string()
    })).mutation(async ({input})=> {
        const getClassId = await prisma.class.findUnique({
            where: {
                name: input.name
            }
        })
        if(!getClassId){
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Class not found"
            })
        }

        const classId = getClassId.id
        return await prisma.user.update({
            where: {
                userNo: input.userNo
            },
            data: {
                class: {
                    connect: {
                        id: classId
                    }
                }
            }
        })
    }),
    // GET - Bir sınıfın özellikleri
    getClassByName: adminProcedure.input(z.object({
        name: z.string()
    })).query(async ({input})=> {
        return await prisma.class.findUnique({
            where: {
                name: input.name
            },
            include: {
                user: true
            }
        })
    }),

    // GET - Tüm sınıfları listele
    getClasses: adminProcedure.query(async ({})=>{
        return await prisma.class.findMany({
            include: {
                user: true
            }
        })
    }),
    
    // DELETE - Sınıfı sil
    deleteClass: adminProcedure.input(z.object({
        name: z.string()
    })).mutation(async ({input})=>{
        const checkIfClassExist = await prisma.class.findUnique({
            where: {
                name: input.name
            }
        })
        if(!checkIfClassExist){
            throw new TRPCError({
                code: "CONFLICT",
                message: "Sınıf bulunamadı"
            })
        }
        return await prisma.class.delete({
            where: {
                name: input.name
            }
        }) 
    }),

    // DELETE - Sınıftan Öğrenciyi sil
    deleteStudentFromClass: adminProcedure.input(z.object({
        userNo: z.string()
    })).mutation(async ({input})=> {
        return await prisma.user.update({
            where: {
                userNo: input.userNo
            },
            data: {
                class: {
                    disconnect: true
                }
            }
        })
    })
})