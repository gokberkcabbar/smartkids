import { Container, Grid, Text, Title } from "@mantine/core";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
export const Details = () => {
  const MotionImage = motion(Image)
  return (
    <div className="mt-5 w-full">
      <Container>
        <Grid gutter='xl'>
          <Grid.Col className="relative h-[250px]" span={12} sm={4}>
            <MotionImage initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{duration: 0.6}}
              src="https://res.cloudinary.com/dkqt9cxba/image/upload/v1695473248/gnoxdanri4myanhqggpa.jpg"
              fill
              className="rounded-2xl"
              style={{ objectFit: "cover" }}
              alt="TPR Image"
            />
          </Grid.Col>
          <Grid.Col span={12} sm={8}>
            <motion.div initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{duration: 0.6}} className="flex flex-col gap-3">
              <Title>TPR Metodu - Hareket ile Öğrenmeyi Birleştirir</Title>
              <Text>
                Total Physical Response (TPR), sözlü girişime fiziksel hareket
                kullanarak dil veya kelime kavramlarını öğretme yöntemidir. Bu
                süreç, bebeklerin ilk dilini öğrenme şeklini taklit eder ve
                öğrenci inhibisyonlarını azaltır ve stresi azaltır.
              </Text>
            </motion.div>
          </Grid.Col>


          <Grid.Col mt={30} className="[@media(min-width:768px)]:block hidden" span={12} sm={8}>
            <motion.div initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{duration: 0.6}} className="flex flex-col gap-3">
              <Title>Başarmanın Yolu Gelişimi Takip Etmektir</Title>
              <Text>
              Öğrencilerimiz, seviyesine uygun sınıflara yerleştirilir. Öğrencinin dil gelişimini; okuma, yazma, konuşma ve dinleme olarak takip eder,
                velilerimiz ile paylaşırız. 
              </Text>
            </motion.div>
          </Grid.Col>

          <Grid.Col mt={30} className="[@media(min-width:768px)]:block hidden relative h-[250px]" span={12} sm={4}>
            <MotionImage initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{duration: 0.6}}
              src="https://res.cloudinary.com/dkqt9cxba/image/upload/v1695482730/t1kcdn33kphhl5qsssjc.jpg"
              fill
              className="rounded-2xl"
              style={{ objectFit: "cover" }}
              alt="TPR Image"
            />
          </Grid.Col>

          <Grid.Col mt={30} className="[@media(min-width:768px)]:hidden block relative h-[250px]" span={12} sm={4}>
            <MotionImage initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{duration: 0.6}}
              src="https://res.cloudinary.com/dkqt9cxba/image/upload/v1695482730/t1kcdn33kphhl5qsssjc.jpg"
              fill
              className="rounded-2xl"
              style={{ objectFit: "cover" }}
              alt="TPR Image"
            />
          </Grid.Col>
          
          <Grid.Col mt={30} className="[@media(min-width:768px)]:hidden block" span={12} sm={8}>
            <motion.div initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{duration: 0.6}} className="flex flex-col gap-3">
              <Title>Başarmanın Yolu Gelişimi Takip Etmektir</Title>
              <Text>
                Öğrencilerimiz, seviyesine uygun sınıflara yerleştirilir. Öğrencinin dil gelişimini; okuma, yazma, konuşma ve dinleme olarak takip eder,
                velilerimiz ile paylaşırız. 
              </Text>
            </motion.div>
          </Grid.Col>

          <Grid.Col className="relative h-[250px]" mt={30} span={12} sm={4}>
            <MotionImage initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{duration: 0.6}}
              src="https://res.cloudinary.com/dkqt9cxba/image/upload/v1695482806/t2wftryz2bx19wkbsos6.jpg"
              fill
              className="rounded-2xl"
              style={{ objectFit: "cover" }}
              alt="TPR Image"
            />
          </Grid.Col>
          <Grid.Col mt={30} span={12} sm={8}>
            <motion.div initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{duration: 0.6}} className="flex flex-col gap-3">
              <Title>İletişim, Genç Yaşta Edinilen Bir Yetenektir</Title>
              <Text>
                Öğrencilerimize seviyelerine uygun sınıflarda eğitim veriyoruz. Eğitim süresi boyunca, akranları ile takım çalışması gerektiren 
                çalışmalar yaptırarak iletişim, oyun kurma ve takım bilinci gibi çok önemli iletişim becerilerinin gelişimini sağlıyoruz.
              </Text>
            </motion.div>
          </Grid.Col>
        </Grid>
      </Container>
    </div>
  );
};
