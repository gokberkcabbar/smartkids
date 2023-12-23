import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { ColorScheme, ColorSchemeProvider, MantineProvider } from "@mantine/core";
import { useHotkeys, useLocalStorage } from "@mantine/hooks";
import {Notifications} from '@mantine/notifications'
import Head from "next/head";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'mantine-color-scheme',
    defaultValue: 'dark',
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  useHotkeys([['mod+J', () => toggleColorScheme()]]);

  return (
    <SessionProvider session={session}>
      <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider withGlobalStyles withNormalizeCSS theme={{colorScheme}}>
      <Notifications />
      <Head>
        <title>Smart Kids Samsun</title>
        <meta name="description" content="Çocuk ingilizce dil gelişiminin doğru adresi. TPR metodu ile ezberleme, öğren. Alanında uzman kadromuz ile yıllarca kurslara gidip öğrenememeye son!"/>
        <meta name="keywords" content="smart kids, ingilizce, ingilizce kursu, samsun ingilizce kursu, çocuk dil kursu, İlker Alan, smart kids samsun, samsun smart kids"/>
      </Head>
      <Component {...pageProps} />
      </MantineProvider>
      </ColorSchemeProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
