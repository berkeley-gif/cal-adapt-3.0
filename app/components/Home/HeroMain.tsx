'use client'
import * as React from 'react'
import Image from 'next/image'
import { useEffect, useRef, useCallback } from 'react'
import { isMobile } from 'react-device-detect'

import Typography from '@mui/material/Typography'

import '@/app/styles/home/hero-main.scss'
import sky from '@/public/img/homepage-hero/sky.png'
import rocks from '@/public/img/homepage-hero/rocks.png'
import mouse from '@/public/img/homepage-hero/mouse.png'

import { ParallaxBanner, ParallaxBannerLayer } from 'react-scroll-parallax'

function HeroMain() {
    const introTextRef = useRef<HTMLDivElement | null>(null)
    const secTextRef = useRef<HTMLDivElement | null>(null)

    const handleScroll = useCallback((e: Event): void => {
        const introNode = introTextRef.current
        if (!introNode) return

        const secNode = secTextRef.current
        if (!secNode) return

        const scrollY = window.scrollY
        console.log(scrollY)

        if (scrollY > 119.5) {
            introNode.classList.add('hidden')
            secNode.classList.add('visible')
        } else {
            introNode.classList.remove('hidden')
            secNode.classList.remove('visible')
        }
    }, [])


    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true })

        return () => window.removeEventListener('scroll', handleScroll)
    }, [handleScroll])
    return (
        <div className="homepage-hero">
            <ParallaxBanner style={{ height: '100vh' }}>
                <ParallaxBannerLayer speed={isMobile ? 20 : -10} >
                    <img src={sky.src} className="layer joshua-hero" alt="sky hero" />
                </ParallaxBannerLayer>
                <ParallaxBannerLayer expanded={false} speed={isMobile ? 7 : 30}>
                    <div className="rocks-container">
                        <img src={rocks.src} className="layer rocks" alt="joshua tree hero" />
                    </div>
                </ParallaxBannerLayer>
                <ParallaxBannerLayer >
                    <div className="layer text">
                        <div ref={introTextRef} className="intro">
                            <Typography className="intro__title" variant="h2">Explore <nobr>Next-Gen</nobr> Climate Data</Typography>
                            <Typography className="intro__p">Cal-Adapt delivers critical climate data and cutting-edge tools to empower communities, researchers, and decision-makers to take action now. As climate impacts intensify, we provide the insights needed to adapt, build resilience, and drive urgent solutions for a sustainable future.</Typography>
                            <div className="intro__scroll">
                                <Typography variant="caption">Scroll</Typography>
                                <Image src={mouse} className="mouse" alt="mouse symbol guiding the user to scroll down" />
                            </div>
                        </div>
                        <div ref={secTextRef} className="secondary hidden">
                            <Typography className="secondary__title" variant="h2">Data Driven Tools for a Resilient Future</Typography>
                        </div>
                    </div>

                </ParallaxBannerLayer>
            </ParallaxBanner>
        </div>
    )

}

export default HeroMain