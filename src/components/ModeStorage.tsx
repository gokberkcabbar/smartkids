import React from 'react'
import { useLocalStorage } from '@mantine/hooks'
import { Switch, Group, useMantineColorScheme, useMantineTheme, ColorScheme } from '@mantine/core';
import { IconSun, IconMoonStars } from '@tabler/icons-react';

export const ModeStorage = () => {
// eslint-disable-next-line @typescript-eslint/unbound-method
const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const theme = useMantineTheme()

  
  return (
    <Group position="center">
      <Switch
        checked={colorScheme === 'dark'}
        onChange={() => toggleColorScheme()}
        size="lg"
        onLabel={<IconSun color={theme.white} size="1.25rem" stroke={1.5} />}
        offLabel={<IconMoonStars color={theme.colors.gray[6]} size="1.25rem" stroke={1.5} />}
      />
    </Group>
  )
}
