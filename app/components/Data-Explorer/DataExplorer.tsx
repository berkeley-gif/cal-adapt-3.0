'use client'

import React, { useState, useEffect } from 'react'

import MapboxMap from './Map'
import Grid from '@mui/material/Unstable_Grid2'
import MapUI from './MapUI'

import { useLeftDrawer } from '../../context/LeftDrawerContext'
import { globalWarmingLevelsList } from '@/app/lib/data-explorer/global-warming-levels'
import { metricsList } from '@/app/lib/data-explorer/metrics'

type DataExplorerProps = {
    data: any;
}

export default function DataExplorer({ data }: DataExplorerProps) {
    const { toggleLeftDrawer } = useLeftDrawer()

    const [gwlSelected, setGwlSelected] = useState<number>(0)
    const [metricSelected, setMetricSelected] = useState<number>(0)
   
    // Temp: For reverse color options switch
    const switchLabel = { inputProps: { 'aria-label': 'Switch color options' } }
    const [isColorRev, setIsColorRev] = useState<boolean>(false)

    // TEMP: for color ramp options
    const [customColorRamp, setCustomColorRamp] = useState<string>('')

    const customColorRampList: string[] = [
        'Inferno', 'BuPu', 'Viridis', 'Cividis', 'Cool', 'Plasma', 'PiYG', 'PRGn', 'BrBG', 'PuOr', 'RdGy', 'RdBu',
        'RdYlBu', 'RdYlGn'
    ]

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
                customColorRamp={customColorRamp}
                setCustomColorRamp={setCustomColorRamp}
                setMetricSelected={setMetricSelected}
                setGwlSelected={setGwlSelected}
                globalWarmingLevels={globalWarmingLevelsList}
                metrics={metricsList}
                customColorRampList={customColorRampList}
                isColorRev={isColorRev}
                setIsColorRev={setIsColorRev}
            />
            <MapboxMap
                gwlSelected={gwlSelected}
                metricSelected={metricSelected}
                customColorRamp={customColorRamp}
                globalWarmingLevels={globalWarmingLevelsList}
                metrics={metricsList}
                isColorRev={isColorRev}
            />
        </Grid>
    )
}