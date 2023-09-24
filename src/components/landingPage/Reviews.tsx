import { Blockquote, Card, Container, Grid, Title } from "@mantine/core";
import React from "react";
import { motion } from "framer-motion";
export const Reviews = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 100 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{duration: 0.6}} className="flex w-full">
      <Container id="comments" size='lg'>
      <Grid>
        <Grid.Col span={12} md={4}>
              <Blockquote cite="- Özlem Akdemir">
                İlker hocam kızıma ingilizce öğretmekle kalmadı. Başka bir
                kimlik başka bakış açısı geliştirdi. Kızım artık çok daha
                zgüvenli çok daha mutlu. İyi ki varsın Smartkids
              </Blockquote>
        </Grid.Col>

        <Grid.Col span={12} md={4}>
              <Blockquote className="[@media(min-width:1024px)]:mt-3" cite="- Uğur Malkoç">
              Smartkids le tanışmış olmak başımıza gelen en iyi şeylerden biri. Yiğit 6.sınıfın başında ve derdini anlatacak kadar ingilizce konusabiliyor. Teşekkürler smartkids ekibi.
              </Blockquote>
        </Grid.Col>

        <Grid.Col span={12} md={4}>
              <Blockquote className="[@media(min-width:1024px)]:mt-6" cite="- Fatma Oğuzaslan">
              Oğlumuz teacher İlker i kendine rol model belirleyerek büyüdü. Şu an gururumuz. Emeklerin için minnettarız teacher İlker
              </Blockquote>
        </Grid.Col>
      </Grid>
      </Container>
    </motion.div>
  );
};
