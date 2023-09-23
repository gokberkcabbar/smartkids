import Head from "next/head";
import Link from "next/link";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { Button, Divider } from "@mantine/core";
import { HeaderBar } from "~/components/HeaderBar";
import { NextPage } from "next";
import { getSession } from "next-auth/react";
import { Role } from "@prisma/client";
import { Hero } from "~/components/landingPage/Hero";

const Home: NextPage = ({session}:any) => {
  return (
    <div className="relative flex flex-col min-w-[100vw] min-h-screen">
      
     <Hero />
    </div>
  );
}

export async function getServerSideProps(context: any){
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const session = await getSession(context)
  if(!session){
    return {
      props: {currentSession: session}
    }
  }
  if(session.user.role === Role.ADMIN){
    return {
      redirect: {
        destination: "/protected/admin",
        permanent: false
      }
    }
  }
  if(session.user.role === Role.STUDENT){
    return {
      redirect: {
        destination: "/protected/student",
        permanent: false
      }
    }
  }

}

export default Home

