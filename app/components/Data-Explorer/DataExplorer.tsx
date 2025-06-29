'use client'

import React, { useState, useEffect } from 'react'

import MapboxMap from './Map'
import Grid from '@mui/material/Unstable_Grid2'
import MapUI from './MapUI'

import { useLeftDrawer } from '../../context/LeftDrawerContext'
//import { globalWarmingLevelsList } from '@/app/lib/data-explorer/global-warming-levels'
import { metricsList } from '@/app/lib/data-explorer/metrics'
import { globalWarmingLevelsList } from '@/app/lib/data-explorer/global-warming-levels'

export type ValueType = 'abs' | 'del'


type DataExplorerProps = {
    data: any;
}

const BASE_URL = 'https://2fxwkf3nc6.execute-api.us-west-2.amazonaws.com' as const
const DEF_GWL = 1.5

export default function DataExplorer({ data }: DataExplorerProps) {
    const { toggleLeftDrawer } = useLeftDrawer()
    const [gwlSelected, setGwlSelected] = useState<number>(0)
    const [metricSelected, setMetricSelected] = useState<number>(0)
    const [valueType, setValueType] = useState<'abs' | 'del'>('abs')
    const [globalWarmingLevelsList, setGlobalWarmingLevelsList] = useState<string[]>([])

    async function fetchGWL() {
        if (metricSelected >= 0) {
            const variableConfig = metricsList[metricSelected][valueType]
            const params = {
                url: variableConfig.mean,
                variable: variableConfig.variable,
            }

            const queryString = Object.entries(params)
                .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
                .join('&')

            const url = `${BASE_URL}/info?${queryString}`

            try {
                const response = await fetch(url)
                if (!response.ok) {
                    throw new Error(`Error: ${response.status} ${response.statusText}`)
                }
                const data = await response.json()
                const gwlData = data.dimensions.gwl.data
                if (Array.isArray(gwlData) && gwlData.length > 0) {
                    setGlobalWarmingLevelsList(gwlData)
                    const defaultGwlIndex = gwlData.indexOf(DEF_GWL)
                    setGwlSelected(defaultGwlIndex)
                }
            } catch (error) {
                console.error('Failed to fetch GWL:', error)
            }
        }
    }

    useEffect(() => {
        fetchGWL()
    }, [metricSelected, valueType])

    useEffect(() => {
        console.log('global warming list: ', globalWarmingLevelsList)
    }, [globalWarmingLevelsList])

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