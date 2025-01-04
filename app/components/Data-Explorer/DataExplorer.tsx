'use client'

import React, { useState, useEffect, useRef } from 'react'

import { globalWarmingLevelsList } from '@/app/lib/data-explorer/global-warming-levels'
import { metricsList } from '@/app/lib/data-explorer/metrics'
import Map from './Map'
import MapUI from './MapUI'

type DataExplorerProps = {
    data: any
}

export default function DataExplorer({ data }: DataExplorerProps) {
    const [gwlSelected, setGwlSelected] = useState<number>(0)
    const [metricSelected, setMetricSelected] = useState<number>(0)

    return (
        <div>
            <MapUI gwlSelected={gwlSelected} setGwlSelected={setGwlSelected} metricSelected={metricSelected} setMetricSelected={setMetricSelected}></MapUI>
            {/**<Map gwlSelected={gwlSelected} setGwlSelected={setGwlSelected} metricSelected={metricSelected} setMetricSelected={setMetricSelected} data={data}></Map>**/}
        </div>
    )
}