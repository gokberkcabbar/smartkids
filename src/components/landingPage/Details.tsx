import { Container, Grid, Group, Text, Title } from "@mantine/core";
import Image from "next/image";
import React from "react";

export const Details = () => {
  return (
    <div className="mt-5 w-full">
      <Container>
        <Grid gutter='xl'>
          <Grid.Col className="relative h-[250px]" span={12} sm={4}>
            <Image
              src="https://res.cloudinary.com/dkqt9cxba/image/upload/v1695473248/gnoxdanri4myanhqggpa.jpg"
              fill
              className="rounded-2xl"
              style={{ objectFit: "cover" }}
              alt="TPR Image"
            />
          </Grid.Col>
          <Grid.Col span={12} sm={8}>
            <div className="flex flex-col gap-3">
              <Title>TPR Metodu - Hareket ile Öğrenmeyi Birleştirir</Title>
              <Text>
                Total Physical Response (TPR), sözlü girişime fiziksel hareket
                kullanarak dil veya kelime kavramlarını öğretme yöntemidir. Bu
                süreç, bebeklerin ilk dilini öğrenme şeklini taklit eder ve
                öğrenci inhibisyonlarını azaltır ve stresi azaltır.
              </Text>
            </div>
          </Grid.Col>

          <Grid.Col mt={30} span={12} sm={8}>
            <div className="flex flex-col gap-3">
              <Title>Başarmanın Yolu Gelişimi Takip Etmektir</Title>
              <Text>
                Total Physical Response (TPR), sözlü girişime fiziksel hareket
                kullanarak dil veya kelime kavramlarını öğretme yöntemidir. Bu
                süreç, bebeklerin ilk dilini öğrenme şeklini taklit eder ve
                öğrenci inhibisyonlarını azaltır ve stresi azaltır.
              </Text>
            </div>
          </Grid.Col>

          <Grid.Col mt={30} className="relative h-[250px]" span={12} sm={4}>
            <Image
              src="https://res.cloudinary.com/dkqt9cxba/image/upload/v1695473248/gnoxdanri4myanhqggpa.jpg"
              fill
              className="rounded-2xl"
              style={{ objectFit: "cover" }}
              alt="TPR Image"
            />
          </Grid.Col>
        </Grid>
      </Container>
    </div>
  );
};
