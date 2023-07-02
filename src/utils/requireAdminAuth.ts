/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Role } from "@prisma/client"
import { getSession } from "next-auth/react"

export const requireAdminAuth = async (context:any, cb: any)=>{

const session = await getSession(context)

if (!session || session.user.role !== Role.ADMIN){
    return {
        redirect: {
            destination: '/auth/errors',
            permanent: false
        }
    }
}

return cb()

}