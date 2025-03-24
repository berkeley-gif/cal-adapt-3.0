'use client'

import React, { useState, useEffect } from 'react'

import MapboxMap from './Map'
import Grid from '@mui/material/Unstable_Grid2'
import MapUI from './MapUI'

import { useLeftDrawer } from '../../context/LeftDrawerContext'
import { globalWarmingLevelsList } from '@/app/lib/data-explorer/global-warming-levels'
import { metricsList } from '@/app/lib/data-explorer/metrics'

export type ValueType = 'abs' | 'del'

type DataExplorerProps = {
    data: any;
}

export type Metric = {
    id: number
    title: string
    variable: string
    description: string
    short_desc: string
    abs: {
        mean: string
        min_path?: string
        max_path?: string
        description: string
        short_desc: string
        variable: string
    }
    del: {
        mean: string
        min_path?: string
        max_path?: string
        description: string
        short_desc: string
        variable: string
    }
    rescale: string
    colormap: string
}

export default function DataExplorer({ data }: DataExplorerProps) {
    const { toggleLeftDrawer } = useLeftDrawer()

    const [gwlSelected, setGwlSelected] = useState<number>(0)
    const [metricSelected, setMetricSelected] = useState<number>(0)
    const [valueType, setValueType] = useState<'abs' | 'del'>('abs')

    // Temp: For reverse color options switch
    const switchLabel = { inputProps: { 'aria-label': 'Switch color options' } }

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            toggleLeftDrawer()
        }, 100)

        return () => clearTimeout(timeoutId)
    }, [])

    return (
        <Grid container sx={{ height: '100%', flexDirection: "column", flexWrap: "nowrap", flexGrow: 1 }}>
            <MapUI
                metricSelected={metricSelected}
                gwlSelected={gwlSelected}
                setMetricSelected={setMetricSelected}
                setGwlSelected={setGwlSelected}
                globalWarmingLevels={globalWarmingLevelsList}
                metrics={metricsList}
                valueType={valueType}
                setValueType={setValueType}
            />
            <MapboxMap
                gwlSelected={gwlSelected}
                metricSelected={metricSelected}
                globalWarmingLevels={globalWarmingLevelsList}
                metrics={metricsList}
                valueType={valueType}
            />
        </Grid>
    )
}