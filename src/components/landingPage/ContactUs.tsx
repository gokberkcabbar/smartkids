import { Container, Grid, Text, Title } from "@mantine/core";
import { IconBrandInstagram, IconBrandWhatsapp, IconBrandYoutube } from "@tabler/icons-react";
import Link from "next/link";
import React from "react";

export const ContactUs = () => {
  return (
    <Container size="lg">
      <Grid id="contact" gutter='lg'>
      <Grid.Col span={12}>
            <div className="flex [@media(min-width:768px)]:flex-row flex-col gap-2 w-full items-center justify-center">
                <div className="flex flex-row gap-2 items-center">
                    <IconBrandWhatsapp size={32} />
                    <Text fz='lg'>+90 541 644 59 06</Text>
                </div>
                <div className="flex flex-row gap-2 items-center">
                    <IconBrandInstagram size={32} />
                    <Link href='https://www.instagram.com/smartkidssamsun/'><Text fz='lg'>@smartkidssamsun</Text></Link>
                </div>
                <div className="flex flex-row gap-2 items-center">
                    <IconBrandYoutube size={32} />
                    <Link href='https://www.youtube.com/@smartkidssamsun5015'><Text fz='lg'>SmartKids Samsun</Text></Link>
                </div>
            </div>
        </Grid.Col>
        <Grid.Col span={12} md={6}>
          <div className="flex flex-col w-full gap-3">
            <div className="flex w-full items-center justify-center">
                <Text fz='xl'>Pera Sanat Akademi</Text>
            </div>
            <div className="w-full h-full" data-youtube-video>
            <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d474.72548951544246!2d36.33303054693809!3d41.28846169563593!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x408877b8767a8ef1%3A0x8bacb0823a8cafc4!2sPera%20Sanat%20Akademi!5e0!3m2!1str!2str!4v1695548490748!5m2!1str!2str"
            width="600"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
            </div>
          </div>
        </Grid.Col>

        <Grid.Col span={12} md={6}>
        <div className="flex flex-col w-full gap-3">
            <div className="flex w-full items-center justify-center">
                <Text fz='xl'>Atakum - SmartKids VIP</Text>
            </div>
            <div className="w-full h-full" data-youtube-video>
            <iframe
            src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d1294.5484610004946!2d36.30308185397186!3d41.32595460250413!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNDHCsDE5JzMzLjMiTiAzNsKwMTgnMTQuMSJF!5e0!3m2!1str!2str!4v1695548771107!5m2!1str!2str"
            width="600"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
            </div>
          </div>
        </Grid.Col>
      </Grid>
    </Container>
  );
};


