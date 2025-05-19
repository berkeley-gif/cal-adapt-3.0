'use client'

import * as React from 'react'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation'

import Typography from '@mui/material/Typography'
import Fab from '@mui/material/Fab'
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined'

import '@/app/styles/home/card.scss'
type CardProps = {
    title: string
    description: string
    cta: string
    img: string
}

export default function Card({ title, description, cta, img }: CardProps) {
    const router = useRouter()
    const [hovered, setHovered] = React.useState(false)

    const handleClick = () => {
        router.push(cta)
    }
    return (
        <div className="card" style={{
            backgroundImage: `url(${img})`,
        }}
            onClick={handleClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >

            <Typography className="card__title" style={{
                textTransform: 'uppercase',
                marginTop: '100px'
            }} variant="h3">{title}</Typography>
            <Typography className="card__description" variant="body3">{description}</Typography>
            <Fab color="primaryBlue" aria-label="go" onClick={(e) => {
                e.stopPropagation()
                handleClick()
            }}
                sx={{
                    backgroundColor: hovered ? 'primaryBlue.dark' : undefined,
                    boxShadow: hovered ? 6 : undefined,
                    transform: hovered ? 'scale(1.1)' : 'scale(1)',
                    transition: 'all 0.2s ease-in-out',
                }}
            >
                <ArrowForwardOutlinedIcon />
            </Fab>
        </div>

    )
}