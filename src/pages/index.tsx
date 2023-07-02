import Head from "next/head";
import Link from "next/link";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { Button } from "@mantine/core";
import { HeaderBar } from "~/components/HeaderBar";
import { NextPage } from "next";
import { getSession } from "next-auth/react";
import { Role } from "@prisma/client";

const Home: NextPage = ({session}:any) => {
  return (
    <div className="flex flex-col min-w-[100vh] min-h-screen">
      <div className="fixed top-0 left-0 right-0">
      <HeaderBar />
      </div>
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

