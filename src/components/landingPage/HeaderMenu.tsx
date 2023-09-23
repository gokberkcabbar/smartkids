/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { useState } from 'react';
import { createStyles, Header, Container, Group, Burger, rem, Box, Drawer, ScrollArea, Divider, UnstyledButton, Center, Collapse, Button, Loader, ThemeIcon, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { MantineLogo } from '@mantine/ds';
import { ModeStorage } from '../ModeStorage';
import { IconChevronDown } from '@tabler/icons-react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
const links = [
  { link: '/', label: 'Ana Sayfa' },
  { link: '/galery', label: 'Galeri' },
  { link: '/comments', label: 'Yorumlar' },
  { link: '/demo', label: 'Demo Ders' },
  { link: '/contact', label: 'Bize Ulaşın' },
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
  const linkler = links.map((item) => (
    <UnstyledButton className={classes.subLink} key={item.label}>
      <Group noWrap align="flex-start">
        <div>
          <Text onClick={()=>router.push(`/protected/admin/${item.link}`)} size="sm" fw={500}>
            {item.label}
          </Text>
        </div>
      </Group>
    </UnstyledButton>
  ));
  const items = links.map((link) => (
    <a
      key={link.label}
      href={link.link}
      className={cx(classes.link, { [classes.linkActive]: active === link.link })}
      onClick={(event) => {
        event.preventDefault();
        setActive(link.link);
      }}
    >
      {link.label}
    </a>
  ));

  return (
    <>
    <Header height={60} mb={120} className='fixed top-0 left-0 right-0'>
      <Container className={classes.header}>
        <MantineLogo size={28} />
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
        title="Navigation"
        className={classes.hiddenDesktop}
        zIndex={1000000}
      >
        <ScrollArea h={`calc(100vh - ${rem(60)})`} mx="-md">
          <Divider my="sm" color={theme.colorScheme === 'dark' ? 'dark.5' : 'gray.1'} />

          <a href="#" onClick={toggle} className={classes.link}>
            Ana Sayfa
          </a>
          <a onClick={toggle} className={classes.link}>
            Galeri
          </a>
          <a onClick={toggle} className={classes.link}>
            Yorumlar
          </a>
          <a onClick={toggle} className={classes.link}>
            Demo
          </a>
          <a onClick={toggle} className={classes.link}>
            Bize Ulaşın
          </a>
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
              <Button variant="default">Bize Ulaşın</Button>
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