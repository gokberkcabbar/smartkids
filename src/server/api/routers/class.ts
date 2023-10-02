/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
import bcrpyt from 'bcrypt'
import { Location } from "@prisma/client";
import { dbLayoutType, layoutItem, layoutParser } from "~/utils/layoutParser";
import { consecutiveCheck } from "~/utils/consecutiveCheck";
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
    }),
    
    // GET - Sınıf profil sayfası
    getClasssProfilePage: protectedProcedure.input(z.object({
        className: z.string()
    })).query(async({input})=>{
        
        const elements = await prisma.class.findUnique({
            where: {
                name: input.className
            },
            select: {
                ClassPage: {
                    select: {
                        elements: true
                    }
                }
            }
        })

        if(!elements!.ClassPage){
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Sınıf profil sayfası bulunamadı"
            })
        }

        return elements!.ClassPage.elements

        // if(elements){
        //     elements.ClassPage?.elements.
        // }

        
        // if(elements && elements.ClassPage){
        //     const parsedLayouts = elements.ClassPage.elements.filter((val)=>val !== undefined).map((val)=>{
        //         if(val.layout){
        //             const parsedLayout = layoutParser({dbLayout: JSON.parse(val.layout as string) as unknown as layoutItem, userRole: ctx.session.user.role})
        //             return parsedLayout
        //         }
        //         else{
        //             return null
        //         }
        //     }).filter((parsedLayout)=> parsedLayout !== null) as layoutItem[]
        //     return parsedLayouts
        // }
        // else{
        //     throw new TRPCError({
        //         code: 'NOT_FOUND',
        //         message: 'Herhangi bir element bulunamadı'
        //     })
        // }
    }),
    // UPDATE - Sınıf profil sayfası oluştur
    createClassProfilePage: adminProcedure.input(z.object({
        className: z.string()
    })).mutation(async ({input})=>{
        const initialLayout = {"w":4,"h":5,"x":0,"y":0,"i":"1","minW":1,"minH":1,"static":false}
        const initialContent = `<p>Deneme</p>`
        const className = await prisma.class.findUnique({
            where: {
                name: input.className
            },
            select: {
                name: true
            }
        })

        if(!className){
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: "Sınıf bulunamadı"
            })
        }

        await prisma.classPage.create({
            data: {
                class: {
                    connect: {
                        name: input.className
                    }
                },
                elements: {
                    create: {
                        layout: JSON.stringify(initialLayout),
                        content: initialContent,
                        className: input.className,
                    }
                }
            }
        })
    }),

    // UPDATE - Sınıf sayfasına yeni bir card ekle
    addCardClassProfilePage: adminProcedure.input(z.object({
        className: z.string()
    })).mutation(async ({input})=>{
        const classInfo = await prisma.class.findUnique({
            where: {
                name: input.className
            },
            include: {
                ClassPage: {
                    include: {
                        elements: true
                    }
                }
            }
        })
        if(classInfo){
            const currentLayoutIdList = classInfo.ClassPage!.elements.map((val)=>val.layoutId)
            const layoutId = consecutiveCheck(currentLayoutIdList.sort(function(a, b){return a - b}))
            const newLayout = {"w":4,"h":5,"x":(layoutId - 1) * 4,"y":0,"i":layoutId.toString(),"minW":1,"minH":1,"static":false}
            const newContent = `<p>Deneme</p>`
            return await prisma.classPage.update({
                where: {
                    classId: classInfo.id
                },
                include: {
                    elements: true
                },
                data: {
                    elements: {
                        create: {
                            layout: JSON.stringify(newLayout),
                            content: newContent,
                            className: input.className,
                            layoutId: layoutId
                        }
                    }
                }
            })
        }
        else {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Sınıf bulunamadı"
            })
        }
    }),

    // DELETE - Card elementini sil
    deleteCardClassProfilePage: adminProcedure.input(z.object({
        layoutId: z.number(),
        className: z.string()
    })).mutation(async ({input})=>{
        return await prisma.element.delete({
            where: {
                layoutId_className: {
                    layoutId: input.layoutId,
                    className: input.className
                }
            }
        })
    }),
    // UPDATE - Sayfayı update et
    updateCardClassRichText: adminProcedure.input(z.object({
        className: z.string(),
        updateContent: z.string(),
        cardId: z.string(),
        layout: z.string()
    })).mutation(async ({input})=>{
        const classInfo = await prisma.class.findUnique({
            where: {
                name: input.className
            },
            include: {
                ClassPage: {
                    include: {
                        elements: true
                    }
                }
            }
        })
        if(classInfo){
            return await prisma.classPage.update({
                where: {
                    classId: classInfo.id
                },
                include: {
                    elements: true
                },
                data: {
                    elements: {
                        update: {
                            where: {
                                layoutId_className: {
                                    className: input.className,
                                    layoutId: parseInt(input.cardId, 10)
                                },
                            },
                            data: {
                                content: input.updateContent,
                                layout: input.layout,

                            }
                        }
                    }
                }
            })
        }
    }),

    //GET- Lokasyona göre sınıf sayıları
    getAllClassesClassifiedWithLocation: adminProcedure.query(async ()=>{
        const atakumClasses = await prisma.class.findMany({
            where: {
                location: "ATAKUM"
            },
            select: {
                name: true
            }
        })
        const peraClasses = await prisma.class.findMany({
            where: {
                location: "PERA"
            },
            select: {
                name: true
            }
        })
        return (
            {
                atakumInfo: atakumClasses,
                peraInfo: peraClasses
            }
        )
    })

})