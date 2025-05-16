'use client'
import * as React from 'react'
import Image from 'next/image'
import { useEffect, useRef } from 'react'

import Typography from '@mui/material/Typography'

import '@/app/styles/global/hero-main.scss'
import sky from '@/public/img/homepage-hero/sky.png'
import rocks from '@/public/img/homepage-hero/rocks.png'
import mouse from '@/public/img/homepage-hero/mouse.png'

import { ParallaxBanner, ParallaxBannerLayer } from 'react-scroll-parallax'

function HeroMain() {

    return (
        <div className="homepage-hero">
            <ParallaxBanner style={{ height: '100vh' }}>
                <ParallaxBannerLayer speed={-25} expanded={false}>
                    <img src={sky.src} className="layer joshua-hero" alt="sky hero" />
                </ParallaxBannerLayer>
                <ParallaxBannerLayer expanded={false} speed={10}>
                    <div className="rocks-container">
                        <img src={rocks.src} className="layer rocks" alt="joshua tree hero" />
                    </div>
                </ParallaxBannerLayer>
                <ParallaxBannerLayer >
                    <div className="layer text">
                        <div className="intro">
                            <Typography className="intro__title" variant="h2">Explore Next-Gen Climate Data</Typography>
                            <Typography className="intro__p">Cal-Adapt delivers critical climate data and cutting-edge tools to empower communities, researchers, and decision-makers to take action now. As climate impacts intensify, we provide the insights needed to adapt, build resilience, and drive urgent solutions for a sustainable future.</Typography>
                            <div className="intro__scroll">
                                <Typography variant="caption">Scroll</Typography>
                                <Image src={mouse} className="mouse" alt="mouse symbol guiding the user to scroll down" />
                            </div>
                            <div className="secondary">
                                <Typography className="secondary__title" variant="h2">Data Driven Tools for a Resilient Future</Typography>
                            </div>
                        </div>
                    </div>

                </ParallaxBannerLayer>
            </ParallaxBanner>
        </div>
    )

}

export default HeroMain