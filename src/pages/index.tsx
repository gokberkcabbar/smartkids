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
import { motion } from "framer-motion";


const Home: NextPage = ({session}:any) => {
  const MotionTitle = motion(Title)
  return (
    <div className="flex relative flex-col min-w-[100vw] h-screen overflow-x-hidden">
     <HeaderMenu/>
     <Hero />
     <Details />
     <MotionTitle initial={{ opacity: 0, y: 100 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{duration: 0.6}} className="mt-16 mb-8 w-full flex justify-center items-center">Galeri</MotionTitle>
     <CarouselSection />
     <MotionTitle initial={{ opacity: 0, y: 100 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{duration: 0.6}} className="mt-16 mb-8 w-full flex justify-center items-center">Yorumlar</MotionTitle>
     <Reviews />
     <MotionTitle initial={{ opacity: 0, y: 100 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{duration: 0.6}} className="mt-16 mb-8 w-full flex justify-center items-center">Demo Ders</MotionTitle>
     <DemoDers />
     <MotionTitle initial={{ opacity: 0, y: 100 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{duration: 0.6}} className="mt-16 mb-8 w-full flex justify-center items-center">Bize Ulaşın</MotionTitle>
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
        destination: `/protected/student/profile/${session.user.userNo}`,
        permanent: false
      }
    }
  }

}

export default Home

