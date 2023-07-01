/* eslint-disable @typescript-eslint/no-misused-promises */
import {
    Paper,
    createStyles,
    TextInput,
    PasswordInput,
    Checkbox,
    Button,
    Title,
    Text,
    Anchor,
    rem,
  } from '@mantine/core';
  import { useForm } from '@mantine/form';
import { signIn } from 'next-auth/react';
  const useStyles = createStyles((theme) => ({
    wrapper: {
      minHeight: rem(900),
      backgroundSize: 'cover',
      backgroundImage:
        'url(https://images.unsplash.com/photo-1484242857719-4b9144542727?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1280&q=80)',
    },
  
    form: {
      borderRight: `${rem(1)} solid ${
        theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[3]
      }`,
      minHeight: rem(900),
      maxWidth: rem(450),
      paddingTop: rem(80),
  
      [theme.fn.smallerThan('sm')]: {
        maxWidth: '100%',
      },
    },
  
    title: {
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    },
  }));
  
  export default function AuthenticationImage() {
    const { classes } = useStyles();
    const form = useForm({
        initialValues: {
            userName: "",
            password: ""
        }
    })
    return (
      <div className={classes.wrapper}>
        <Paper className={classes.form} radius={0} p={30}>
          <Title order={2} className={classes.title} ta="center" mt="md" mb={50}>
            SmartKids Kullanıcı Platformu
          </Title>
  
          <TextInput label="Kullanıcı No" placeholder="ex: 201823" size="md" {...form.getInputProps('userName')}/>
          <PasswordInput label="Şifre" mt="md" size="md" {...form.getInputProps('password')}/>
          <Button onClick={()=> signIn('credentials', {userNo: form.values.userName, password: form.values.password, callbackUrl: "/", redirect: true })} fullWidth mt="xl" size="md">
            Giriş Yap
          </Button>
  
        </Paper>
      </div>
    );
  }