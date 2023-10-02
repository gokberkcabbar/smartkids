/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { createStyles, Group, Paper, Text, ThemeIcon, SimpleGrid, Grid, Divider, Loader, Container } from '@mantine/core';
import { IconEqual } from '@tabler/icons-react';
import { IconArrowUpRight, IconArrowDownRight } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';
import { api } from '~/utils/api';

const useStyles = createStyles((theme) => ({
  root: {
    padding: `calc(${theme.spacing.xl} * 1.5)`,
  },

  label: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },
}));

interface StatsGridIconsProps {
  data: { title: string; value: string; diff: number }[];
}


export function Stats() {
  const { classes } = useStyles();
  const {data: userMonthData, isFetched: userMonthDataFetched} = api.user.getUserCountByDate.useQuery()
  const {data: classesData, isFetched: classesDataFetched} = api.class.getAllClassesClassifiedWithLocation.useQuery()
  const {data: userByInClassData, isFetched: userByInClassDataFetched} = api.user.getStudentsByInAnyClass.useQuery()
  const [statHTML, setStatHTML] = useState<React.JSX.Element>()
  const [allStats, setAllStats] = useState<{
    studentSection: {
        title: "Öğrenci Sayısı",
        thisMonth: {
            title: "Bu ay kayıt olanlar",
            quantity: number
        },
        previousMonth: {
            title: "Önceki aylarda kayıt olanlar",
            quantity: number
        },
        diff: number
      },
    classSection: {
        title: "Sınıf Sayısı",
        pera: {
            title: "PERA",
            quantity: number
        },
        atakum: {
            title: "ATAKUM",
            quantity: number
        }
    },
    classifiedStudentSection: {
        title: "Ön Kayıt - Kayıtlı Öğrenci Sayısı",
        onKayit: {
            title: "Ön Kayıt",
            quantity: number
        },
        kayitli: {
            title: "Kayıtlı",
            quantity: number
        }
    }
  }>({
    studentSection: {
        title: "Öğrenci Sayısı",
        diff: 0,
        previousMonth: {
            title: "Önceki aylarda kayıt olanlar",
            quantity: 0
        },
        thisMonth: {
            quantity: 0,
            title: "Bu ay kayıt olanlar"
        }
    },
    classSection: {
        atakum: {
            quantity: 0,
            title: "ATAKUM"
        },
        pera: {
            quantity: 0,
            title: "PERA"
        },
        title: "Sınıf Sayısı"
    },
    classifiedStudentSection: {
        title: "Ön Kayıt - Kayıtlı Öğrenci Sayısı",
        onKayit: {
            title: "Ön Kayıt",
            quantity: 0
        },
        kayitli: {
            title: "Kayıtlı",
            quantity: 0
        }
    }
  })
  
  useEffect(() => {
    if(userMonthData && classesData && userByInClassData){
        setAllStats({
            classSection: {
                title: "Sınıf Sayısı",
                atakum: {
                    quantity: classesData.atakumInfo.length,
                    title: "ATAKUM"
                },
                pera: {
                    quantity: classesData.peraInfo.length,
                    title: "PERA"
                }
            },
            studentSection: {
                title: "Öğrenci Sayısı",
                thisMonth: {
                    quantity: userMonthData.thisMonth.length,
                    title: "Bu ay kayıt olanlar"
                },
                previousMonth: {
                    quantity: userMonthData.previousMonth.length,
                    title: "Önceki aylarda kayıt olanlar"
                },
                diff: (userMonthData.thisMonth.length) / (userMonthData.previousMonth.length + userMonthData.thisMonth.length) * 100
            },
            classifiedStudentSection: {
                title: "Ön Kayıt - Kayıtlı Öğrenci Sayısı",
                onKayit: {
                    title: "Ön Kayıt",
                    quantity: userByInClassData.notInClass.length
                },
                kayitli: {
                    title: "Kayıtlı",
                    quantity: userByInClassData.inClass.length
                }
            }
        })
    }
  }, [userMonthData, classesData, userByInClassData])
  
  useEffect(() => {
    setStatHTML(
       <Grid>
        <Grid.Col span={12} sm={4}>
            <Paper className='h-[150px]' withBorder p="md" radius="md">
        <Group position="apart">
          <div>
            <Text c="dimmed" tt="uppercase" fw={700} fz="xs" className={classes.label}>
              {allStats.studentSection.title}
            </Text>
            <Text fw={700} fz="xl">
              {allStats.studentSection.thisMonth.quantity + allStats.studentSection.previousMonth.quantity}
            </Text>
          </div>
          <ThemeIcon
            color="gray"
            variant="light"
            sx={(theme) => ({ color: allStats.studentSection.diff > 0 ? theme.colors.teal[6] : theme.colors.red[6] })}
            size={38}
            radius="md"
          >
            {allStats.studentSection.diff > 0 ? <IconArrowUpRight size='1.8rem' stroke={1.5} /> : <IconEqual size='1.8rem' stroke={1.5} />}
          </ThemeIcon>
        </Group>
        <Text c="dimmed" fz="sm" mt="md">
          <Text component="span" c={allStats.studentSection.diff > 0 ? 'teal' : 'red'} fw={700}>
            {allStats.studentSection.diff}%
          </Text>{' '}
          {allStats.studentSection.diff > 0 ? 'increase' : 'decrease'} compared to last month
        </Text>
      </Paper>
       </Grid.Col>

       <Grid.Col span={12} sm={4}>
            <Paper className='h-[150px]' withBorder p='md' radius='md'>
                <Text c="dimmed" tt="uppercase" fw={700} fz="xs" className={classes.label}>{allStats.classSection.title}</Text>
                <div className='flex flex-row items-center justify-between w-full h-full'>
                    <div className='flex flex-col gap-3'>
                        <Text size={'md'}>{allStats.classSection.atakum.title}</Text>
                        <Text fw={700} fz="md">{allStats.classSection.atakum.quantity}</Text>
                    </div>
                    <Divider orientation='vertical' />
                    <div className='flex flex-col gap-3'>
                        <Text size={'md'}>{allStats.classSection.pera.title}</Text>
                        <Text fw={700} fz="md">{allStats.classSection.pera.quantity}</Text>
                    </div>
                </div>
            </Paper>
       </Grid.Col>

       <Grid.Col span={12} sm={4}>
            <Paper className='h-[150px]' withBorder p='md' radius='md'>
                <Text c="dimmed" tt="uppercase" fw={700} fz="xs" className={classes.label}>{allStats.classifiedStudentSection.title}</Text>
                <div className='flex flex-row items-center justify-between w-full h-full'>
                    <div className='flex flex-col gap-3'>
                        <Text size={'md'}>{allStats.classifiedStudentSection.kayitli.title}</Text>
                        <Text fw={700} fz="md">{allStats.classifiedStudentSection.kayitli.quantity}</Text>
                    </div>
                    <Divider orientation='vertical' />
                    <div className='flex flex-col gap-3'>
                        <Text size={'md'}>{allStats.classifiedStudentSection.onKayit.title}</Text>
                        <Text fw={700} fz="md">{allStats.classifiedStudentSection.onKayit.quantity}</Text>
                    </div>
                </div>
            </Paper>
       </Grid.Col>
       </Grid>
    )
  }, [allStats])
  

  return (
    <div className={classes.root}>
        {statHTML ? (
            <div className='relative items-center justify-center gap-4 w-full h-full'>
                <Container>
                {statHTML}
                </Container>
            </div>
        ) : (
            <div className='flex w-full h-full items-center justify-center'>
                <Loader />
            </div>
        )}
    </div>
  );
}