import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { JSONContent } from "@tiptap/react";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  adminProcedure
} from "~/server/api/trpc";
import { prisma } from "~/server/db";
import { NotificationFor } from "@prisma/client";

export const notificationRouter = createTRPCRouter({
    //GET - Notification Ayarları
    getNotificationSettings: adminProcedure.query(async()=>{
        return await prisma.notificationSetting.findMany({
            include: {
                notificationFor: true
            }
        })
    }),
    //POST - Notification Profili oluştur
    createNotificationSettings: adminProcedure.input(z.object({
        id: z.string(),
        email: z.string(),
        notificatingFor: z.array(
            z.union([
                z.literal("MATERYAL1"),
                z.literal("MATERYAL2"),
                z.literal("AYLAR")
            ])
        )
    })).mutation(async({input})=>{
        await prisma.notificationSetting.create({
            data: {
                id: input.id,
                reportingEmail: input.email,
            }
        })

        const elements = await prisma.notificationSetting.findUnique({
            where: {
                id: input.id
            }
        })

        if(elements){
            for(const val of input.notificatingFor){
                await prisma.notificationForSetting.create({
                    data: {
                        NotificationSetting: {
                            connect: {
                                id: elements.id
                            }
                        },
                        notificateFor: val,
                        enabled: true,
                    }
                })
            }
        }

        
    }),

    //UPDATE - Notification Profili update et
    updateNotificationSettings: adminProcedure.input(z.object({
        id: z.string(),
        email: z.string().optional(),
        notificatingFor: z.array(
            z.union([
                z.literal("MATERYAL1"),
                z.literal("MATERYAL2"),
                z.literal("AYLAR")
            ])
        ).optional()
    })).mutation(async({input})=>{
        const element = await prisma.notificationSetting.findUnique({
            where: {
                id: input.id
            },
            include: {
                notificationFor: true
            }
        })
        if(element && input.notificatingFor){
            await prisma.notificationForSetting.deleteMany()
            await prisma.notificationSetting.update({
                where: {
                    id: input.id
                },
                include: {
                    notificationFor: true
                },
                data: {
                    reportingEmail: input.email || element.reportingEmail,
                }
            })

            for(const elements of input.notificatingFor){
                await prisma.notificationForSetting.create({
                    data: {
                        NotificationSetting: {
                            connect: {
                                id: input.id
                            }
                        },
                        enabled: true,
                        notificateFor: elements
                    }
                })
            }
        }
        else{
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Bildirim bulunamadı"
            })
        }
    }),

    // DELETE - Notification'ı sil
    deleteNotificationSettings: adminProcedure.input(z.object({
        id: z.string()
    })).mutation(async ({input})=>{
        return await prisma.notificationSetting.delete({
            where: {
                id: input.id
            }
        })
    })
    
})