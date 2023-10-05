/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React, { useEffect, useState } from 'react';
import { createStyles, Header, Container, Group, Burger, rem, Box, Drawer, ScrollArea, Divider, UnstyledButton, Center, Collapse, Button, Loader, ThemeIcon, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { MantineLogo } from '@mantine/ds';
import { ModeStorage } from '../ModeStorage';
import { IconChevronDown } from '@tabler/icons-react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Logo } from '../Logo';

const links = [
  { link: 'hero', label: 'Ana Sayfa' },
  { link: 'galery', label: 'Galeri' },
  { link: 'comments', label: 'Yorumlar' },
  { link: 'demo', label: 'Demo Ders' },
  { link: 'contact', label: 'Bize Ulaşın' },
];


const useStyles = createStyles((theme) => ({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
  },

  links: {
    [theme.fn.smallerThan('xs')]: {
      display: 'none',
    },
  },

  burger: {
    [theme.fn.largerThan('xs')]: {
      display: 'none',
    },
  },

  hiddenDesktop: {
    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  link: {
    display: 'block',
    lineHeight: 1,
    padding: `${rem(8)} ${rem(12)}`,
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    },
  },

  linkActive: {
    '&, &:hover': {
      backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
      color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
    },
  },

  subLink: {
    width: '100%',
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    borderRadius: theme.radius.md,

    '&:hover' : {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0]
    },

    '&:active': theme.activeStyles,
  },
}));



export const HeaderMenu = () => {
  const [opened, { toggle }] = useDisclosure(false);
  const [active, setActive] = useState(links[0]!.link);
  const { classes, cx, theme} = useStyles();
  const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
  const router = useRouter()
  const session = useSession()
  const [top, setTop] = useState<number | undefined>(0)

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) =>{
    e.preventDefault()
    const targetId = e.currentTarget.href.replace(/.*\#/, "");
    console.log(targetId)
    const element = document.getElementById(targetId)
    element?.scrollIntoView({behavior: 'smooth', block: 'center'})
  }
  
  const scrollContactUs = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const targetId = "contact"
    const element = document.getElementById(targetId)
    element?.scrollIntoView({behavior: 'smooth', block: 'center'})
  }

  const linkler = links.map((item) => (
    <UnstyledButton className={classes.subLink} key={item.label}>
      <Group noWrap align="flex-start">
        <div>
        <Link
          key={item.label}
          href={`#${item.link}`}
          onClick={(e)=>{
            toggle()
            handleScroll(e)
          }}
          className={cx(classes.link)}
        >
          {item.label}
        </Link>
        </div>
      </Group>
    </UnstyledButton>
  ));
  const items = links.map((link) => (
    <Link
      key={link.label}
      href={`#${link.link}`}
      onClick={(e)=>{
        setActive(link.link)
        handleScroll(e)
      }}
      className={cx(classes.link)}
    >
      {link.label}
    </Link>
  ));

  return (
    <>
    <Header height={60} mb={120} className='fixed top-0 left-0 right-0'>
      <Container className={classes.header}>
          <div className='relative hover:cursor-pointer mt-[-60px] md:mt-[-65px]'>
            <Logo />
          </div>
        <Group spacing={5} className={classes.links}>
          {items}
        </Group>
        <ModeStorage />
        <Burger opened={opened} onClick={toggle} className={classes.burger} size="sm" />
      </Container>
    </Header>

    <Drawer
        opened={opened}
        onClose={toggle}
        size="100%"
        padding="md"
        className={classes.hiddenDesktop}
        zIndex={1000000}
      >
        <ScrollArea h={`calc(100vh - ${rem(60)})`} mx="-md">
          <Divider my="sm" color={theme.colorScheme === 'dark' ? 'dark.5' : 'gray.1'} />

          {linkler}
          <Divider my="sm" color={theme.colorScheme === 'dark' ? 'dark.5' : 'gray.1'} />

          <Group position="center" grow pb="xl" px="md">
          {session.status === "authenticated" ? (
            <>
            <ModeStorage />
            <Button onClick={()=>signOut({callbackUrl: "/"})} variant="default">Sign Out</Button>
            </>
          ) : (
            session.status === "loading" ? (<Loader />) : (
              <>
              <ModeStorage />
              <Button onClick={(e)=>{
                toggle()
                scrollContactUs(e)
              }} variant="default">Bize Ulaşın</Button>
              <Button onClick={()=>router.push('/auth/sign')}>Giriş Yap</Button>
              </>
            )
          )}
          </Group>
        </ScrollArea>
      </Drawer>


      </>
  );
}