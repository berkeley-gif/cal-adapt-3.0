'use client'

import * as React from 'react'

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

    return (
        <div className="card" style={{
            backgroundImage: `url(${img})`,
        }}>

            <Typography className="card__title" style={{
                textTransform: 'uppercase',
                marginTop: '100px'
            }} variant="h3">{title}</Typography>
            <div className="card__description">{description}</div>
            <Fab color="primary" aria-label="add">
                <ArrowForwardOutlinedIcon />
            </Fab>
        </div>
    )
}