'use client'
import * as React from 'react'
import Image from 'next/image'


import { useState, useEffect, useRef } from 'react'


import '@/app/styles/global/hero-main.scss'
import joshuaHero from '@/public/img/homepage-hero/joshua-hero.png'
import rocks from '@/public/img/homepage-hero/rocks.png'

function HeroMain() {

    return (
        <div className="homepage-hero">
            <Image src={rocks} className="layer rocks" alt="rocks hero" />
            <Image src={joshuaHero} className="layer joshua-hero" alt="joshua tree hero" />        
        </div>
    )

}

export default HeroMain