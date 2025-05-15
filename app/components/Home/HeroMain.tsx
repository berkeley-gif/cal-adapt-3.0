'use client'
import * as React from 'react'
import Image from 'next/image'
import { useEffect, useRef } from 'react'

import Typography from '@mui/material/Typography'

import '@/app/styles/global/hero-main.scss'
import joshuaHero from '@/public/img/homepage-hero/joshua-hero.png'
import rocks from '@/public/img/homepage-hero/rocks.png'
import mouse from '@/public/img/homepage-hero/mouse.png'

function HeroMain() {


    return (
        <div className="homepage-hero">
            <div className="layer text-container" data-speed="0.9">
                <Typography className="intro-title" variant="h2">Explore Next-Gen Climate Data</Typography>
                <Typography className="intro-p">Cal-Adapt delivers critical climate data and cutting-edge tools to empower communities, researchers, and decision-makers to take action now. As climate impacts intensify, we provide the insights needed to adapt, build resilience, and drive urgent solutions for a sustainable future.</Typography>
                <div className="scroll">
                    <Typography variant="caption">Scroll</Typography>
                    <Image src={mouse} className="mouse" alt="mouse symbol guiding the user to scroll down" />
                </div>
            </div>
            <Image src={rocks} data-speed="0.7" className="layer rocks" alt="rocks hero" />
            <Image src={joshuaHero} data-speed="0.2" className="layer joshua-hero" alt="joshua tree hero" />
        </div>
    )

}

export default HeroMain