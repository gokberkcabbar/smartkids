import { Box, Container } from "@mantine/core";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useMantineTheme } from "@mantine/core";
import { motion } from "framer-motion";
export const DemoDers = () => {
 
  const videoURL = `https://www.youtube.com/embed/QYYR8qzJHN0?si=_aZ7vyMblNaeT8g_`;
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const theme = useMantineTheme()

  return (
    
     <Container id="demo" size='lg'>
        <motion.div initial={{ opacity: 0, y: 100 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{duration: 0.6}} data-youtube-video className="[@media(min-width:1024px)]:w-[800px]">
        <iframe
      title='Demo Ders'
      src={videoURL}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
        </motion.div >
    </Container>
    
  );
};

