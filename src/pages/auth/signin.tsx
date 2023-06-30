/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { useState } from 'react';
import { TextInput, PasswordInput, Tooltip, Center, Text, Button } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { UseFormReturnType, useForm } from '@mantine/form';
import { api } from '~/utils/api';
import { signIn } from 'next-auth/react';
import { useSession } from 'next-auth/react';

function TooltipIcon({form}:{form:UseFormReturnType<{
  userName: string;
  password: string;
}, (values: {
  userName: string;
  password: string;
}) => {
  userName: string;
  password: string;
}>}) {
  const rightSection = (
    <Tooltip
      label="6 haneli No"
      position="top-end"
      withArrow
      transitionProps={{ transition: 'pop-bottom-right' }}
    >
      <Text color="dimmed" sx={{ cursor: 'help' }}>
        <Center>
          <IconInfoCircle size="1.1rem" stroke={1.5} />
        </Center>
      </Text>
    </Tooltip>
  );

  return (
    <TextInput
      rightSection={rightSection}
      label="Kullanıcı No"
      placeholder="ex: 280371"
      withAsterisk
      {...form.getInputProps('userName')}
    />
  );
}

function TooltipFocus({form}:{form:UseFormReturnType<{
  userName: string;
  password: string;
}, (values: {
  userName: string;
  password: string;
}) => {
  userName: string;
  password: string;
}>}) {
  const [opened, setOpened] = useState(false);
  const [value, setValue] = useState('');
  const valid = value.trim().length >= 6;
  return (
    <Tooltip
      label={valid ? 'All good!' : 'Password must include at least 6 characters'}
      position="bottom-start"
      withArrow
      opened={opened}
      color={valid ? 'teal' : undefined}
    >
      <PasswordInput
        label="Tooltip shown onFocus"
        required
        placeholder="Your password"
        onFocus={() => setOpened(true)}
        onBlur={() => setOpened(false)}
        mt="md"
        {...form.getInputProps('password')}
      />
    </Tooltip>
  );
}

export default function InputTooltip() {
  const form = useForm({
    initialValues: {
      userName: "",
      password: "",
    }
  })
  const {mutate:addUser} = api.user.addUser.useMutation({})
  const session = useSession()
  console.log(session)
  return (
    <div className='flex flex-col h-screen w-screen justify-center items-center'>
      <div className='flex flex-col h-auto p-8 rounded-xl w-[500px] border border-solid'>
      <TooltipIcon form={form}/>
      <TooltipFocus form={form}/>
      <Button onClick={()=>{
        console.log(form.values.password, form.values.userName)
        signIn('credentials', {userNo: form.values.userName, password: form.values.password, callbackUrl: "/" })
      }} className='mt-[20px]'>SUBMIT</Button>
      </div>
    </div>
  );
}