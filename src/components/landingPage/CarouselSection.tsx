import React, { useRef } from 'react'
import { Carousel } from '@mantine/carousel'
import { Container } from '@mantine/core'
import Image from 'next/image'
import Autoplay from 'embla-carousel-autoplay'
import { motion } from 'framer-motion'
export const CarouselSection = () => {
  const autoplay = useRef(Autoplay({delay: 2000}))
  return (
    <motion.div initial={{ opacity: 0, y: 100 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{duration: 0.6}} id='galery' className='w-full [@media(min-width:768px)]:h-[400px] h-[250px]'>
        <Container>
            <Carousel mx='auto' withIndicators withControls={false} loop align='center' breakpoints={[
                {
                    minWidth: 'md',
                    slideSize: '50%'
                },
                {
                    minWidth: 'lg',
                    slideSize: '33.3333%'
                },
                {
                    maxWidth: 'md',
                    slideSize: '100%'
                }
            ]}
                slideGap='md'
                plugins={[autoplay.current]}
                onMouseEnter={autoplay.current.stop}
                onMouseLeave={autoplay.current.reset}
                >
                <Carousel.Slide>
                    <div className='relative w-full [@media(min-width:768px)]:h-[400px] h-[250px]'>
                        <Image className='rounded-2xl' src='https://res.cloudinary.com/dkqt9cxba/image/upload/v1695505926/taexrlkcyhh6bb55buqy.png' alt='Carousel 1' style={{objectFit: 'cover'}} fill />
                    </div>
                </Carousel.Slide>
                <Carousel.Slide>
                    <div className='relative w-full [@media(min-width:768px)]:h-[400px] h-[250px]'>
                        <Image className='rounded-2xl' src='https://res.cloudinary.com/dkqt9cxba/image/upload/v1695536715/gbbmpidqcevprkufuxmw.png' alt='Carousel 2' style={{objectFit: 'cover'}} fill />
                    </div>
                </Carousel.Slide>
                <Carousel.Slide>
                    <div className='relative w-full [@media(min-width:768px)]:h-[400px] h-[250px]'>
                        <Image className='rounded-2xl' src='https://res.cloudinary.com/dkqt9cxba/image/upload/v1695536736/edq8pugxcd9zos6vcosh.png' alt='Carousel 3' style={{objectFit: 'cover'}} fill />
                    </div>
                </Carousel.Slide>
                <Carousel.Slide>
                    <div className='relative w-full [@media(min-width:768px)]:h-[400px] h-[250px]'>
                        <Image className='rounded-2xl' src='https://res.cloudinary.com/dkqt9cxba/image/upload/v1695536757/lp8f7gegu9vfpyrgyfrf.png' alt='Carousel 4' style={{objectFit: 'cover'}} fill />
                    </div>
                </Carousel.Slide>
                <Carousel.Slide>
                    <div className='relative w-full [@media(min-width:768px)]:h-[400px] h-[250px]'>
                        <Image className='rounded-2xl' src='https://res.cloudinary.com/dkqt9cxba/image/upload/v1695536774/srtypnyanmb2ts5ovbto.png' alt='Carousel 5' style={{objectFit: 'cover'}} fill />
                    </div>
                </Carousel.Slide>
            </Carousel>
        </Container>
    </motion.div>
  )
}
