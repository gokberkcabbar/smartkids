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
    getNotificationSettings: adminProcedure.input(z.object({
        id: z.string()
    })).query(async({input})=>{
        const notification = await prisma.notificationSetting.findUnique({
            where: {
                id: input.id
            }
        })

        if(!notification){
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Bildirim ayarı bulunamadı"
            })
        }

        return notification
    }),
    //POST - Notification Profili oluştur
    createNotificationSettings: adminProcedure.input(z.object({
        id: z.string(),
    })).mutation(async({input})=>{
        return prisma.notificationSetting.create({
            data: {
                id: input.id,
            }
        })
    }),

    //UPDATE - Notification Profili update et

    updateNotificationSettings: adminProcedure.input(z.object({
        id: z.string(),
        notificationFor: z.nativeEnum(NotificationFor),
        notifiedParentDate: z.string(),
        reportingEmail: z.string(),
        isEnabled: z.boolean(),
        isNotificationForEnabled: z.object({
            MATERYAL1: z.boolean(),
            MATERYAL2: z.boolean(),
            AYLAR: z.boolean()
        })
    })).mutation(async({input})=>{
        const isNotificationForExist = await prisma.notificationForSetting.findUnique({
            where: {
                notificateFor_notificationSettingId: {
                    notificateFor: input.notificationFor,
                    notificationSettingId: input.id
                }
            }
        })
        if(isNotificationForExist){
            return await prisma.notificationSetting.update({
                where: {
                    id: input.id
                },
                include: {
                    notificationFor: true
                },
                data: {
                    isEnabled: input.isEnabled,
                    reportingEmail: input.reportingEmail,
                    notifiedParentDate: input.notifiedParentDate,
                    notificationFor: {
                        update: {
                            where: {
                                notificateFor_notificationSettingId: {
                                    notificateFor: input.notificationFor,
                                    notificationSettingId: input.id
                                }
                            },
                            data: {
                                enabled: input.isNotificationForEnabled[`${input.notificationFor}`]
                            }
                        }   
                    }
                }
            })
        }
        
        return await prisma.notificationSetting.update({
            where: {
                id: input.id
            },
            include: {
                notificationFor: true
            },
            data: {
                isEnabled: input.isEnabled,
                reportingEmail: input.reportingEmail,
                notifiedParentDate: input.notifiedParentDate,
                notificationFor: {
                    create: {
                        enabled: input.isNotificationForEnabled[`${input.notificationFor}`],
                        notificateFor: input.notificationFor
                    }
                }
            }
        })
    })
})