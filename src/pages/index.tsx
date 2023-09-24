/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Head from "next/head";
import Link from "next/link";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { Button, Divider, Title } from "@mantine/core";
import { HeaderBar } from "~/components/HeaderBar";
import { NextPage } from "next";
import { getSession } from "next-auth/react";
import { Role } from "@prisma/client";
import { Hero } from "~/components/landingPage/Hero";
import { HeaderMenu } from "~/components/landingPage/HeaderMenu";
import { Details } from "~/components/landingPage/Details";
import { CarouselSection } from "~/components/landingPage/CarouselSection";
import { Reviews } from "~/components/landingPage/Reviews";
import { DemoDers } from "~/components/landingPage/DemoDers";
import { ContactUs } from "~/components/landingPage/ContactUs";



const Home: NextPage = ({session}:any) => {
  return (
    <div className="flex relative flex-col min-w-[100vw] h-screen overflow-x-hidden">
     <HeaderMenu/>
     <Hero />
     <Details />
     <Title className="mt-16 mb-8 w-full flex justify-center items-center">Galeri</Title>
     <CarouselSection />
     <Title className="mt-16 mb-8 w-full flex justify-center items-center">Yorumlar</Title>
     <Reviews />
     <Title className="mt-16 mb-8 w-full flex justify-center items-center">Demo Ders</Title>
     <DemoDers />
     <Title className="mt-16 mb-8 w-full flex justify-center items-center">Bize Ulaşın</Title>
     <ContactUs />
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

