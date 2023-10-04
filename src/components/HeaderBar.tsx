/* eslint-disable @typescript-eslint/no-misused-promises */
import {
  createStyles,
  Header,
  HoverCard,
  Group,
  Button,
  UnstyledButton,
  Text,
  SimpleGrid,
  ThemeIcon,
  Anchor,
  Divider,
  Center,
  Box,
  Burger,
  Drawer,
  Collapse,
  ScrollArea,
  rem,
  Loader
} from '@mantine/core';
import { MantineLogo } from '@mantine/ds';
import { useDisclosure } from '@mantine/hooks';
import {
  IconNotification,
  IconCode,
  IconBook,
  IconChartPie3,
  IconFingerprint,
  IconCoin,
  IconChevronDown,
  IconUser,
  IconSchool,
  IconCurrencyLira,
  IconBellRinging,
} from '@tabler/icons-react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { api } from '~/utils/api';
import { ModeStorage } from './ModeStorage';
import { useMediaQuery } from '@mantine/hooks';
const useStyles = createStyles((theme) => ({
  

  dropdownFooter: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
    margin: `calc(${theme.spacing.md} * -1)`,
    marginTop: theme.spacing.sm,
    padding: `${theme.spacing.md} calc(${theme.spacing.md} * 2)`,
    paddingBottom: theme.spacing.xl,
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1]
    }`,
  },

  hiddenMobile: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  hiddenDesktop: {
    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  link: {
    display: "flex",
    alignItems: "center",
    height: "100%",
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    textDecoration: "none",
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontWeight: 500,
    fontSize: theme.fontSizes.sm,

    [theme.fn.smallerThan('sm')]: {
      height: rem(42),
      display: 'flex',
      alignItems: 'center',
      width: '100%'
    },
    '&:hover':{
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0]
    }
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

const mockdata = [
  {
    icon: IconUser,
    title: 'Öğrenci Listesi',
    description: 'Tüm şubelerdeki kayıtlı öğrencileri listele',
    link: "students"
  },
  {
    icon: IconSchool,
    title: 'Sınıf Yönetimi',
    description: 'Tüm şubelerdeki sınıfları listele ve yönet',
    link: "classes"
  },
  {
    icon: IconCurrencyLira,
    title: 'Ödeme Takibi',
    description: 'Ödemeleri sisteme gir ve takip et',
    link: "accounting"
  },
  {
    icon: IconBellRinging,
    title: 'Bildirim Ayarları',
    description: 'Bildirimleri ayarla ve gözden kaçırma',
    link: "notifications"
  },
];



export function HeaderBar() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
  const { classes, theme } = useStyles();
  const session = useSession()
  const router = useRouter()
  const smBreakpoint = useMediaQuery('(min-width: 768px)')
  const links = mockdata.map((item) => (
    <UnstyledButton className={classes.subLink} key={item.title}>
      <Group noWrap align="flex-start">
        <ThemeIcon size={34} variant="default" radius="md">
          <item.icon size={rem(22)} color={theme.fn.primaryColor()} />
        </ThemeIcon>
        <div>
          <Text onClick={()=>router.push(`/protected/admin/${item.link}`)} size="sm" fw={500}>
            {item.title}
          </Text>
          <Text size="xs" color="dimmed">
            {item.description}
          </Text>
        </div>
      </Group>
    </UnstyledButton>
  ));

  return (
    <Box>
      <Header height={60} px="md">
        <Group position="apart" sx={{ height: '100%' }}>
          <MantineLogo size={30} />

          <Group sx={{ height: '100%' }} spacing={0} className={classes.hiddenMobile}>
            {session.data ? session.data.user.role === "ADMIN" ? (
              <a onClick={()=>router.push("/")} className={classes.link}>
                Ana Sayfa
              </a>
            ) : (
              null
            ) : (
              null
            )}
            {session.data ? (
              session.data.user.role === "ADMIN" ? (
                <HoverCard width={600} position="bottom" radius="md" shadow="md" withinPortal>
              <HoverCard.Target>
                <a href="#" className={classes.link}>
                  <Center inline>
                    <Box component="span" mr={5}>
                      Yönetim Paneli
                    </Box>
                    <IconChevronDown size={16} color={theme.fn.primaryColor()} />
                  </Center>
                </a>
              </HoverCard.Target>

              <HoverCard.Dropdown sx={{ overflow: 'hidden' }}>
                <Group position="apart" px="md">
                  <Text fw={500}>Özellikler</Text>
                </Group>

                <Divider
                  my="sm"
                  mx="-md"
                  color={theme.colorScheme === 'dark' ? 'dark.5' : 'gray.1'}
                />

                <SimpleGrid cols={2} spacing={0}>
                  {links}
                </SimpleGrid>

                
              </HoverCard.Dropdown>
            </HoverCard>
              ) : (
                <a onClick={()=>router.push(`/protected/student/profile/${session.data.user.userNo}`)} className={classes.link}>
                  Profil
                </a>
              )
            ) : (
              <Loader />
            )}
          </Group>

          {session.status === "authenticated" ? (
            <Group className={classes.hiddenMobile}>
            <ModeStorage />
            <Button onClick={()=>signOut({callbackUrl: "/"})} variant="default">Sign Out</Button>
          </Group>
          ) : (
            session.status === "loading" ? (<Loader />) : (
              <Group className={classes.hiddenMobile}>
              <ModeStorage />
              <Button variant="default">Bize Ulaşın</Button>
              <Button onClick={()=>router.push('/auth/sign')}>Giriş Yap</Button>
          </Group>
            )
          )}

          {
            session.data?.user.role === "ADMIN" ? (
              <Burger opened={drawerOpened} onClick={toggleDrawer} className={classes.hiddenDesktop} />
            ) : session.data?.user.role === "STUDENT" && !smBreakpoint ? (
              <Group>
                <ModeStorage />
                <Button onClick={()=>signOut({callbackUrl: "/"})} variant="default">Sign Out</Button>
              </Group>
            ) : (
              null
            )
          }
        </Group>
      </Header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Navigation"
        className={classes.hiddenDesktop}
        zIndex={1000000}
      >
        <ScrollArea h={`calc(100vh - ${rem(60)})`} mx="-md">
          <Divider my="sm" color={theme.colorScheme === 'dark' ? 'dark.5' : 'gray.1'} />

          <a href="#" className={classes.link}>
            Home
          </a>
          <UnstyledButton className={classes.link} onClick={toggleLinks}>
            <Center inline>
              <Box component="span" mr={5}>
                Features
              </Box>
              <IconChevronDown size={16} color={theme.fn.primaryColor()} />
            </Center>
          </UnstyledButton>
          <Collapse in={linksOpened}>{links}</Collapse>
          <a href="#" className={classes.link}>
            Learn
          </a>
          <a href="#" className={classes.link}>
            Academy
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
    </Box>
  );
}