/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import {
  createStyles,
  Image,
  Container,
  Title,
  Button,
  Group,
  Text,
  List,
  ThemeIcon,
  rem,
} from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import React, { AnchorHTMLAttributes } from 'react';
const useStyles = createStyles((theme) => ({
  inner: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: `calc(${theme.spacing.xl} * 5)`,
    paddingBottom: `calc(${theme.spacing.xl} * 4)`,
    
  },

  content: {
    maxWidth: rem(480),
    marginRight: `calc(${theme.spacing.xl} * 3)`,

    [theme.fn.smallerThan('md')]: {
      maxWidth: '100%',
      marginRight: 0,
    },
  },

  title: {
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontSize: rem(44),
    lineHeight: 1.2,
    fontWeight: 900,

    [theme.fn.smallerThan('xs')]: {
      fontSize: rem(28),
    },
  },

  control: {
    [theme.fn.smallerThan('xs')]: {
      flex: 1,
    },
  },

  image: {
    flex: 1,

    [theme.fn.smallerThan('md')]: {
      display: 'none',
    },
  },

  highlight: {
    position: 'relative',
    backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
    borderRadius: theme.radius.sm,
    padding: `${rem(4)} ${rem(12)}`,
  },
}));

export function Hero() {
  const { classes } = useStyles();
  const router = useRouter()
  const handleScroll = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>{
    e.preventDefault()
    const element = document.getElementById("contact")
    element?.scrollIntoView({behavior: 'smooth', block: 'center'})
  }
  
  return (
    <div id='hero' className='w-full'>
      <Container>
        <div className={classes.inner}>
          <div className={classes.content}>
            <Title className={classes.title}>
              Çocuklarınız için doğru kapıyı aralayın
            </Title>
            <Text color="dimmed" mt="md">
              Yıllarca harcanan zaman, aktarılan mali kaynaklar, verilen emek sonunda İngilizce yazıp okuyabilen, konuşup anlayabilen var mı?
            </Text>

            <List
              mt={30}
              spacing="sm"
              size="sm"
              icon={
                <ThemeIcon size={20} radius="xl">
                  <IconCheck size={rem(12)} stroke={1.5} />
                </ThemeIcon>
              }
            >
              <List.Item>
                <b>TPR Metodu</b> – Ders kitaplarıyla İngilizce öğretmeye çalışmıyoruz. Eğlenerek, oyun oynayarak ve konuşarak dil öğretiyoruz
              </List.Item>
              <List.Item>
                <b>Gelişim Takibi</b> – Çocuklarınızın gelişimi, alanında uzman öğretmenlerimiz ile kontrol ediyor, eksik olduğu alanı geliştirmek üzerine çalışıyoruz
              </List.Item>
              <List.Item>
                <b>Grup Dinamiği ve Sosyal Gelişim</b> – Sadece dil gelişimi değil, çocuklarınızın sosyal gelişimini de önemsiyoruz.
              </List.Item>
            </List>

            <Group mt={30}>
              <Button onClick={()=>router.push('/auth/sign')} radius="xl" size="md" className={classes.control}>
                Giriş Yap
              </Button>
              <Button onClick={(e)=>handleScroll(e)} variant="default" radius="xl" size="md" className={classes.control}>
                  İletişime Geç
              </Button>
            </Group>
          </div>
          <Image src={"https://www.teachhub.com/wp-content/uploads/2020/09/Sept-1-How-to-Use-Total-Physical-Response-TPR-in-the-Classroom_web.jpg"} height={427} alt='TPR image' className={classes.image} />
        </div>
      </Container>
    </div>
  );
}