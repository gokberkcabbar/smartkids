import { Box, Container } from "@mantine/core";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useMantineTheme } from "@mantine/core";

export const DemoDers = () => {
 
  const videoURL = `https://www.youtube.com/embed/iHhzill3XNk?si=KQ5PEL0HpucNSwsr`;
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const theme = useMantineTheme()

  return (
    
     <Container id="demo" size='lg'>
        <div data-youtube-video className="[@media(min-width:1024px)]:w-[800px]">
        <iframe
      title='Demo Ders'
      src={videoURL}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
        </div>
    </Container>
    
  );
};

