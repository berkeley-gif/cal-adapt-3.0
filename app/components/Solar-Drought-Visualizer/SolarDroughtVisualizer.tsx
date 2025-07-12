'use client'

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'

import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import Accordion, { AccordionSlots } from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Fade from '@mui/material/Fade'
import CloseIcon from '@mui/icons-material/Close'
import EditLocationOutlinedIcon from '@mui/icons-material/EditLocationOutlined'
import Alert from '@mui/material/Alert'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { FormControl } from '@mui/material'
import ListItemText from '@mui/material/ListItemText'
import MenuItem from '@mui/material/MenuItem'

declare module '@mui/material/Alert' {
    interface AlertPropsVariantOverrides {
        purple: true;
        grey: true;
    }
}
import Button from '@mui/material/Button'
import Grid from '@mui/material/Unstable_Grid2'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import SidePanel from '@/app/components/Dashboard/RightSidepanel'
import { useSidepanel } from '@/app/context/SidepanelContext'
import { usePhotoConfig } from '@/app/context/PhotoConfigContext'
import { useRes } from '@/app/context/ResContext'

import { useDidMountEffect } from "@/app/utils/hooks"

import MapboxMap from '@/app/components/Solar-Drought-Visualizer/MapboxMap'
import Heatmap from '@/app/components/Solar-Drought-Visualizer/Heatmap/Heatmap'
import VizPrmsForm from './VisualizationParamsForm'
import { ApiResponse } from './DataType'
import '@/app/styles/dashboard/solar-drought-visualizer.scss'
import LoadingSpinner from '../Global/LoadingSpinner'

const MAP_HEIGHT = 550
const HEATMAP_HEIGHT = 500
const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8

type Location = [number, number]
type apiParams = {
    point: Location | null,
    configQueryStr: string,
}
type LocationStatus = 'none' | 'data' | 'no-data'

interface QueriedData {
    data: number[][]
}

const MenuProps: any = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
    anchorOrigin: {
        vertical: "bottom",
        horizontal: "center"
    },
    transformOrigin: {
        vertical: "top",
        horizontal: "center"
    },
    variant: "menu"
}

export default function SolarDroughtViz() {
    // Context
    const { open, toggleOpen } = useSidepanel()
    const { resSelected, resList } = useRes()
    const { photoConfigSelected, photoConfigList } = usePhotoConfig()

    // Derived state
    const derivedConfigStr = useMemo(() => {
        return photoConfigSelected === 'Utility Configuration' ? 'srdu' : 'srdd'
    }, [photoConfigSelected])

    // Parameters state
    const [apiParams, setApiParams] = useState<apiParams>({ point: null, configQueryStr: 'srdu' })
    const [isColorRev, setIsColorRev] = useState<boolean>(false)


    const BASE_URL = 'https://2fxwkf3nc6.execute-api.us-west-2.amazonaws.com' as const

    // If you would want to change the default GWL, check the desired index in globalWarmingLevelsList
    const DEF_GWL = 1

    const [gwlSelected, setGwlSelected] = useState<number>(0)
    const [globalWarmingLevelsList, setGlobalWarmingLevelsList] = useState<string[]>([])

    // TO DO : FIGURE OUT THE RIGHT URL FOR THIS
    async function fetchGWL() {
        const params = {
            url: 's3://cadcat/tmp/era/wrf/cae/mm4mean/ssp370/gwl/srdd/d03',
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

    // Map & location state
    const mapRef = useRef<any>(null)
    const [locationStatus, setLocationStatus] = useState<LocationStatus>('none')
    const [mapMarker, setMapMarker] = useState<[number, number] | null>(null)

    // Heatmap state
    const heatmapContainerRef = useCallback((node: HTMLDivElement | null) => {
        if (node !== null) {
            setHeatmapContainer(node)
        }
    }, [])
    const [heatmapContainer, setHeatmapContainer] = useState<HTMLDivElement | null>(null)
    const [heatmapWidth, setHeatmapWidth] = useState(0)
    const [queriedData, setQueriedData] = useState<QueriedData | null>(null)
    const [isPointValid, setIsPointValid] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [useAltColor, setUseAltColor] = useState(false)
    const [reverseColorMap, setReverseColorMap] = useState(false)

    // UI state
    const [accordionExpanded, setAccordionExpanded] = useState(true)

    // TEMP: for color ramp options
    const [currentColorMap, setCurrentColorMap] = useState<string>('PuBuGn')

    // Handlers
    const handleAccordionChange = () => {
        if (apiParams.point !== null) {
            setAccordionExpanded(!accordionExpanded)
        }
    }

    // API PARAMS
    const prevApiParams = useRef<apiParams>(apiParams)

    const onFormDataSubmit = useCallback(async () => {
        if (!apiParams.point || locationStatus !== 'data') {
            return
        }

        setIsLoading(true)

        const [long, lat] = apiParams.point
        //const s3Url = `s3://cadcat/tmp/era/wrf/cae/mm4mean/ssp370/mon/${apiParams.configQueryStr}/d03`
        const s3Url = `s3://cadcat/tmp/era/wrf/cae/mm4mean/ssp370/gwl/${apiParams.configQueryStr}/d03`
        const apiUrl = `https://2fxwkf3nc6.execute-api.us-west-2.amazonaws.com/point/${long},${lat}`
        const queryParams = new URLSearchParams({
            url: s3Url,
            variable: apiParams.configQueryStr
        })
        const fullUrl = `${apiUrl}?${queryParams.toString()}`

        try {
            const res = await fetch(fullUrl)
            if (!res.ok) {
                console.error('Failed with status:', res.status)
                setQueriedData(null)
                setIsPointValid(false)
                return
            }
            const newData = await res.json()
            if (newData) {
                setQueriedData(newData)
                setIsPointValid(true)
            } else {
                setQueriedData(null)
                setIsPointValid(false)
            }
        } catch (err) {
            console.error('Fetch error:', err)
            setQueriedData(null)
            setIsPointValid(false)
        } finally {
            setIsLoading(false)
        }
    }, [apiParams.point, apiParams.configQueryStr, locationStatus])

    useEffect(() => {
        if (JSON.stringify(prevApiParams.current) !== JSON.stringify(apiParams)) {
            onFormDataSubmit()
        }
        prevApiParams.current = apiParams
    }, [apiParams, onFormDataSubmit])

    useEffect(() => {
        if (queriedData) {
            setIsLoading(false)
            setIsPointValid(true)
        }
    }, [queriedData])

    useEffect(() => {
        if (mapRef.current) {
            mapRef.current.resize()
        }
    }, [accordionExpanded])

    useEffect(() => {
        if (!heatmapContainer) return

        const resizeObserver = new ResizeObserver(entries => {
            for (const entry of entries) {
                const newWidth = entry.contentRect.width
                setHeatmapWidth(newWidth)
            }
        })

        resizeObserver.observe(heatmapContainer)

        return () => {
            resizeObserver.disconnect()
        }
    }, [heatmapContainer])

    useEffect(() => {
        // TO DO: Figure out a way to automate this with fetchGWL
        setGlobalWarmingLevelsList(['0.8', '1.5', '2.5', '3'])
        setGwlSelected(1)
    }, [])

    const checkLocationStatus = useCallback((point: Location | null, config: string) => {
        if (!point) {
            setLocationStatus('none')
            return
        }

        if (mapRef.current) {
            const mapboxPoint = mapRef.current.project(point)
            const features = mapRef.current.queryRenderedFeatures(mapboxPoint, {
                layers: ['grid']
            })

            if (features && features.length > 0) {
                const selectedFeature = features[0]
                const maskAttribute = config === 'Utility Configuration' ? 'srdumask' : 'srddmask'
                const gridValue = selectedFeature.properties?.[maskAttribute]

                const newStatus = gridValue === 1 ? 'data' : 'no-data'
                setLocationStatus(newStatus)

                if (newStatus === 'data') {
                    onFormDataSubmit()
                } else {
                    setQueriedData(null)
                    setIsPointValid(false)
                }
            } else {
                setLocationStatus('no-data')
                setQueriedData(null)
                setIsPointValid(false)
            }
        }
    }, [mapRef, onFormDataSubmit])

    // Check location status when photoConfigSelected or point changes
    useEffect(() => {
        if (apiParams.point) {
            checkLocationStatus(apiParams.point, photoConfigSelected)
        }
    }, [photoConfigSelected, apiParams.point, checkLocationStatus])

    // Update apiParams when configStr changes (including when photoConfigSelected changes)
    useEffect(() => {
        setApiParams(prevParams => ({
            ...prevParams,
            configQueryStr: derivedConfigStr
        }))
    }, [derivedConfigStr])

    function setLocationSelected(point: Location | null) {
        if (!point) {
            setLocationStatus('none')
            updateApiParams({ point: null })
            return
        }

        // Get the grid value at this point
        if (mapRef.current) {
            const mapboxPoint = mapRef.current.project(point)
            const features = mapRef.current.queryRenderedFeatures(mapboxPoint, {
                layers: ['grid']
            })

            if (features && features.length > 0) {
                const selectedFeature = features[0]
                const maskAttribute = photoConfigSelected === 'Utility Configuration' ? 'srdumask' : 'srddmask'
                const gridValue = selectedFeature.properties?.[maskAttribute]

                // Set status based on grid value
                setLocationStatus(gridValue === 1 ? 'data' : 'no-data')
                updateApiParams({ point })

                // Collapse accordion on selection
                setAccordionExpanded(false)
            }
        }
    }

    function updateApiParams(newParams: Partial<apiParams>) {
        setApiParams(prevParams => ({
            ...prevParams,
            ...newParams
        }))
    }

    const handleColorChange = () => {
        setUseAltColor((prev) => !prev)
    }

    const handleSummaryClick = (event: React.MouseEvent) => {
        if (apiParams.point === null) {
            event.preventDefault()
            event.stopPropagation()
        }
    }

    return (
        <Box className="solar-drought-tool tool-container tool-container--padded" aria-label="Solar Drought Visualizer" role="region">

            {/* Intro section */}
            <Box className="solar-drought-tool__intro" style={{ 'maxWidth': '860px' }}>
                <Typography variant="h4" aria-label="Solar Drought Visualizer Title">Solar Drought Visualizer</Typography>
                <Typography variant="body1" aria-label="Description of the tool">This tool shows when there are likely to be significant reductions in solar energy availability in the future. To be more specific, it shows the number of solar resource drought days (less than 40% average generation) per month throughout a representative 30-year period. </Typography>
                <Typography variant="body1">
                    <a style={{ 'textDecoration': 'underline', 'display': 'inline-block' }} href="https://docs.google.com/document/d/1HRISAkRb0TafiCSCOq773iqt2TtT2A9adZqDTAShvhE/edit?usp=sharing" target="_blank" aria-label="Read more in the documentation">Read more in the documentation</a>
                </Typography>
            </Box>

            {/* Main viz content */}
            <Grid container xs={12}>
                {/* Heatmap parameters section */}
                <Grid xs={12}>
                    <Box>
                        <Box className="flex-params">
                            <Box className="flex-params__item">
                                <Typography className="option-group__title" variant="body2" aria-label="Resource of interest">Resource</Typography>
                                <Typography variant="body1" aria-label={`Selected Resource: ${resList[resSelected]}`}>{resList[resSelected]}</Typography>
                            </Box>
                            <Box className="flex-params__item">
                                <Typography className="option-group__title" variant="body2" aria-label="Global Warming Level">Global Warming Level</Typography>
                                <Typography variant="body1" aria-label={`Selected Global Warming Level: ${globalWarmingLevelsList[gwlSelected]}`}>{globalWarmingLevelsList[gwlSelected]}°</Typography>
                            </Box>
                            <Box className="flex-params__item">
                                <Typography className="option-group__title" variant="body2" aria-label="Photovoltaic Configuration">Photovoltaic Configuration</Typography>
                                <Typography variant="body1" aria-label={`Selected Photovoltaic Configuration: ${photoConfigSelected}`}>{photoConfigSelected}</Typography>
                            </Box>
                            <Box className="flex-params__item">
                                <Typography className='inline' variant="subtitle1" aria-label="Edit parameters">Edit parameters</Typography>
                                <IconButton className='inline' onClick={toggleOpen} aria-label="Open settings">
                                    <SettingsOutlinedIcon />
                                </IconButton>
                            </Box>
                        </Box>
                        {/* Global warming level information */}
                        {queriedData && !isLoading && isPointValid &&
                            <Box className="alerts" sx={{ maxWidth: '100%' }}>
                                <Alert variant="filled" severity="info" color="info" aria-label="Global models estimate information">Global models estimate that 2° global warming levels (GWL) will be reached between <strong>2037</strong> and <strong>2061</strong>
                                    <Box className="cta">
                                        <Button variant="contained" target="_blank" href="https://cal-adapt.org/blog/understanding-warming-levels" aria-label="Learn more about GWL">Learn more about GWL</Button>
                                    </Box>
                                </Alert>
                            </Box>
                        }
                    </Box>
                </Grid>
            </Grid>
            <Accordion
                expanded={accordionExpanded}
                onChange={handleAccordionChange}
                slots={{ transition: Fade as AccordionSlots['transition'] }}
                slotProps={{ transition: { timeout: 400 } }}
                sx={[
                    accordionExpanded
                        ? {
                            '& .MuiAccordion-region': {
                                height: 'auto',
                            },
                            '& .MuiAccordionDetails-root': {
                                display: 'block',
                            },
                            '&.Mui-expanded': {
                                margin: 0,
                            },
                        }
                        : {
                            '& .MuiAccordion-region': {
                                height: 0,
                            },
                            '& .MuiAccordionDetails-root': {
                                display: 'none',
                            },
                        },
                ]}
            >

                <Grid container xs={12} justifyContent="flex-end">
                    {/* Locator map instruction section */}
                    <Grid xs={12} sx={{ display: 'flex', justifyContent: accordionExpanded ? 'flex-start' : 'flex-end' }}>
                        <Box sx={{ width: accordionExpanded ? '100%' : 'auto' }}>
                            <AccordionSummary
                                onClick={handleSummaryClick}
                                expandIcon={apiParams.point !== null ? <ExpandMoreIcon className="rotated-icon" /> : null}
                                aria-controls="panel1-content"
                                id="panel1-header"
                                sx={{
                                    '& .MuiAccordionSummary-content': {
                                        marginTop: '20px',
                                        marginBottom: '20px',
                                        justifyContent: accordionExpanded ? 'flex-start' : 'flex-end',
                                    },
                                    width: '100%',
                                }}
                            >
                                <EditLocationOutlinedIcon aria-label="Edit location" />
                                <Typography
                                    className="inline"
                                    variant="h5"
                                    style={{
                                        'marginLeft': '10px',
                                    }}
                                    aria-label={locationStatus !== 'none' ? "Change your location" : "Select your location"}
                                >
                                    {locationStatus !== 'none' ? "Change your location" : "Select your location"}
                                </Typography>
                            </AccordionSummary>
                        </Box>
                    </Grid>

                    {/* Heatmap section */}
                    <Grid xs={accordionExpanded ? 0 : 8.5}
                        sx={{
                            maxWidth: '100%',
                            pr: 4,
                            marginLeft: 'auto',
                            paddingRight: 0,
                        }}
                    >
                        {locationStatus === 'no-data' && (
                            <Box sx={{ marginBottom: '30px' }}
                                style={{ display: accordionExpanded ? 'none' : 'block' }}
                            >
                                <Alert variant="grey" severity="info">
                                    You have selected a location with land use or land cover restrictions. No data will be returned.&nbsp;
                                    <span
                                        onClick={accordionExpanded ? undefined : handleAccordionChange}
                                        aria-label="Select another location"
                                    >
                                        <strong>Select another location </strong>
                                    </span>
                                    to try again
                                </Alert>
                            </Box>
                        )}
                        {locationStatus === 'data' && (
                            <Box
                                ref={heatmapContainerRef}
                                className={'solar-drought-tool__heatmap' + (isLoading ? ' loading-screen' : '')}
                                style={{ display: accordionExpanded ? 'none' : 'block' }}
                            >
                                {isLoading && (
                                    <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                        <LoadingSpinner aria-label="Loading heatmap data" />
                                    </Box>
                                )}
                                {!isLoading && isPointValid && (
                                    <Heatmap
                                        width={heatmapWidth}
                                        height={HEATMAP_HEIGHT}
                                        data={queriedData}
                                        gwlSelected={gwlSelected}
                                        useAltColor={useAltColor}
                                        aria-label="Heatmap visualization"
                                        currentColorMap={currentColorMap}
                                        isColorRev={isColorRev}
                                    />
                                )}
                            </Box>
                        )}
                    </Grid>

                    {/* Locator map section */}
                    <Grid xs={accordionExpanded ? 12 : 3.5} sx={{ alignItems: 'flex-end' }}>
                        <AccordionDetails
                            className="custom-accordion-details"
                        >
                            <Box className="solar-drought-tool__map">
                                <MapboxMap
                                    mapMarker={mapMarker}
                                    setMapMarker={setMapMarker}
                                    ref={mapRef}
                                    locationSelected={apiParams.point}
                                    setLocationSelected={setLocationSelected}
                                    height={MAP_HEIGHT}
                                    aria-label="Map for selecting location of heatmap data"
                                />
                            </Box>
                        </AccordionDetails>
                    </Grid>
                </Grid>
            </Accordion >

            {/** Sidepanel */}
            < Box className="solar-drought-tool__sidepanel" >
                <SidePanel
                    anchor="right"
                    variant="temporary"
                    open={open}
                    onClose={toggleOpen}
                    aria-label="Settings side panel"
                >
                    <Tooltip
                        TransitionComponent={Fade}
                        TransitionProps={{ timeout: 600 }}
                        title="Close the sidebar"
                    >
                        <IconButton onClick={toggleOpen} aria-label="Close settings sidebar">
                            <CloseIcon />
                        </IconButton>
                    </Tooltip>
                    <VizPrmsForm
                        onFormDataSubmit={onFormDataSubmit}
                        globalWarmingLevelsList={globalWarmingLevelsList}
                        gwlSelected={gwlSelected}
                        setGwlSelected={setGwlSelected}
                        toggleOpen={toggleOpen}
                        aria-label="Visualization parameters form"
                    >
                    </VizPrmsForm>
                </SidePanel>
            </Box >
        </Box >
    )
}