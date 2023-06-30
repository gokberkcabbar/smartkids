import Head from "next/head";
import Link from "next/link";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { Button } from "@mantine/core";
import { HeaderBar } from "~/components/HeaderBar";

export default function Home() {
  const session = useSession()
  console.log(session)
  return (
    <HeaderBar />
  );
}

