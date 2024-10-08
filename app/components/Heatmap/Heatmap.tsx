'use client'

import * as d3 from 'd3'
import React, { useState, useEffect, useRef, useMemo } from 'react'

import Renderer from '@/app/components/Heatmap/Rendererer'
import MapTooltip from '@/app/components/Heatmap/MapTooltip'

import { ColorLegend } from "../Solar-Drought-Visualizer/ColorLegend"
import '@/app/styles/dashboard/heatmap.scss'

const MARGIN = { top: 10, right: 10, bottom: 30, left: 30 }

type HeatmapProps = {
    width: number;
    height: number;
    data: any;
}

export type InteractionData = {
    xLabel: string;
    yLabel: string;
    xPos: number;
    yPos: number;
    value: number;
}

export default function Heatmap({ width, height, data }: HeatmapProps) {
    // cell that is being hovered, for tooltips
    const [hoveredCell, setHoveredCell] = useState<InteractionData | null>(null)
/* 
    const flatData: number[] = data.data.flat()
    const min = d3.min(flatData)
    const max = d3.max(flatData) */

    // Flatten data and filter out undefined values
    const flatData: number[] = data.data.flat().filter((d: number | undefined): d is number => d !== undefined)
    const min = d3.min(flatData) as number | null
    const max = d3.max(flatData) as number | null

    const colorScale =
        d3.scaleSequential<string>()
            .interpolator(d3.interpolateRgbBasis(["#FD6A55", "#ffffff", "#25c6da"]))
            .domain([min ?? 0, max ?? 1]) // fallback values if min/max are null

    // modded color scale
    /*   const colorScale =
          d3.scaleSequential<string>()
              .interpolator(d3.interpolateRgbBasis(["#FD6A55", '#5EC795', "#ffffff", '#FFBB78', "#25c6da"]))
              .domain([min, max]) */

    // viridis color scale
    /*     const colorScale =
            d3.scaleSequential<string>()
                .interpolator(d3.interpolateRgbBasis(["#440154", "#482878", "#3e4989", "#31688e", "#26828e", "#1f9e89", "#35b779", "#6ece58", "#b5de2b", "#fde725"
                ]))
                .domain([min, max]) */

    // cividis color scale
    /*     const colorScale =
            d3.scaleSequential<string>()
                .interpolator(d3.interpolateRgbBasis([ "#002051", "#11366c", "#3c4d6e", "#62646f", "#7f7c75", "#9a9478", "#bbaf71", "#e2cb5c", "#fdea45"
                ]))
                .domain([min, max]) */

    return (
        <div style={{ position: 'relative' }}>
            <Renderer
                width={width}
                height={height}
                data={data}
                setHoveredCell={setHoveredCell}
                colorScale={colorScale}
            />
            <MapTooltip interactionData={hoveredCell} width={width} height={height} />
            <div className="color-legend" style={{ width: width }}>
                <ColorLegend width={400} height={100} colorScale={colorScale} min={min} max={max} />

            </div>
        </div>
    )
}

