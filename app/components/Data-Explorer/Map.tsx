'use client'

import 'mapbox-gl/dist/mapbox-gl.css'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
import '@/app/styles/dashboard/data-explorer.scss'
import '@/app/styles/dashboard/mapbox-map.scss'

import React, {
    useState,
    useEffect,
    useRef,
    forwardRef,
    useImperativeHandle
} from 'react'
import {
    Map,
    MapRef,
    Layer,
    Source,
    MapMouseEvent,
    NavigationControl,
    ScaleControl,
    LngLatBoundsLike,
    ErrorEvent
} from 'react-map-gl'
import { throttle } from 'lodash'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Unstable_Grid2'
import Fab from '@mui/material/Fab'
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined'

import type { Metric } from '@/app/lib/data-explorer/metrics'
import { MapLegend } from './MapLegend'
import { MapPopup } from './MapPopup'
import LoadingSpinner from '../Global/LoadingSpinner'
import GeocoderControl from '../Solar-Drought-Visualizer/geocoder-control'
import type { ValueType } from './DataExplorer'

// Constants 
const INITIAL_VIEW_STATE = {
    longitude: -120,
    latitude: 37.4,
    zoom: 5
} as const

const MAP_BOUNDS: LngLatBoundsLike = [
    [-140, 20], // Southwest coordinates [lng, lat]
    [-100, 50]  // Northeast coordinates [lng, lat]
]

const THROTTLE_DELAY = 100 as const
const BASE_URL = 'https://2fxwkf3nc6.execute-api.us-west-2.amazonaws.com' as const
const RASTER_TILE_LAYER_OPACITY = 0.8 as const


// Types 
type MapProps = {
    metricSelected: number
    gwlSelected: number
    globalWarmingLevels: { id: number; value: string }[]
    metrics: Metric[]
    valueType: ValueType
}

type TileJson = {
    tiles: string[]
    tileSize?: number
}

type GeocoderResult = {
    center?: [number, number]
    geometry?: {
        type: string
        coordinates: [number, number]
    }
}

// Throttled function to fetch point data
const throttledFetchPoint = throttle(async (
    lng: number,
    lat: number,
    min_path: string,
    max_path: string,
    path: string,
    variable: string,
    gwl: string,
    globalWarmingLevels: { id: number; value: string }[],
    callback: (values: { min: number | null, max: number | null, value: number | null }) => void
) => {
    const results: {
        min: number | null; max: number | null; value: number | null
    } = {
        min: null,
        max: null,
        value: null
    }

    const gwlIndex = globalWarmingLevels.findIndex(level => level.value === gwl)

    // Retrieve value at point
    try {
        const fetchData = async (url: string) => {
            console.log(`Fetching for lng: ${lng}, lat: ${lat}`)
            const res = await fetch(url)
            if (!res.ok) throw new Error(res.statusText)
            return res.json()
        }

        const valueRes = await fetchData(`${BASE_URL}/point/${lng},${lat}?url=${encodeURIComponent(path)}&variable=${variable}&_t=${Date.now()}`)
        results.value = valueRes.data[gwlIndex]

        console.log('valueRes', valueRes)

        if (min_path) {
            const minRes = await fetchData(`${BASE_URL}/point/${lng},${lat}?url=${encodeURIComponent(min_path)}&variable=${variable}`)
            results.min = minRes.data[gwlIndex]
        }
        if (max_path) {
            const maxRes = await fetchData(`${BASE_URL}/point/${lng},${lat}?url=${encodeURIComponent(max_path)}&variable=${variable}`)
            results.max = maxRes.data[gwlIndex]
            console.log('maxRes', maxRes)
        }

    } catch (err) {
        console.error('Error fetching point data:', err)
    }

    callback(results)

}, THROTTLE_DELAY, {
    leading: true,  // Execute on the leading edge (immediate first call)
    trailing: true  // Execute on the trailing edge (final call)
})

const MapboxMap = forwardRef<MapRef | undefined, MapProps>(
    ({ metricSelected, gwlSelected, globalWarmingLevels, metrics, valueType }, ref) => {
        // Refs
        const mapRef = useRef<MapRef | null>(null)
        const mapContainerRef = useRef<HTMLDivElement | null>(null) // Reference to the map container

        // Forward the internal ref to the parent
        useImperativeHandle(ref, () => mapRef.current || undefined)

        // State
        const [mounted, setMounted] = useState(false)
        const [mapLoaded, setMapLoaded] = useState(false)
        const [tileJson, setTileJson] = useState<TileJson | null>(null)
        const [hoverInfo, setHoverInfo] = useState<{
            longitude: number
            latitude: number
            min: number | null
            max: number | null
            value: number | null
        } | null>(null)
        const [showPopup, setShowPopup] = useState(false)
        const [infoFabPos, setInfoFabPos] = useState<{ x: number; y: number } | null>(null)
        const popupRef = useRef<HTMLDivElement | null>(null)
        const fabRef = useRef<HTMLButtonElement | null>(null)
        const [isHoveringPopup, setIsHoveringPopup] = useState(false)

        // Derived state variables 
        const currentVariableData: Metric = metrics[metricSelected]
        const paths = currentVariableData[`${valueType}`] as { colormap: string, mean: string; min_path?: string; max_path?: string; description: string; short_desc: string; variable: string, rescale: string }

        if (!currentVariableData) {
            console.error('Invalid metric selected:', metricSelected)
        }

        const currentVariable = paths.variable

        const currentGwl = globalWarmingLevels[gwlSelected]?.value || globalWarmingLevels[0].value

        const isLoading = !mounted || !tileJson

        // Fetch tiles function
        const fetchTileJson = async () => {
            let colormap = paths.colormap.toLowerCase()
            const params = {
                url: paths.mean,
                variable: currentVariable,
                datetime: currentGwl,
                rescale: paths.rescale,
                colormap_name: colormap,
            }


            const queryString = Object.entries(params)
                .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
                .join('&')

            const url = `${BASE_URL}/WebMercatorQuad/tilejson.json?${queryString}`


            // debug: log the request url
            // console.log('fetchTileJson called with params', params)
            // console.log('Fetching TileJSON with url:', url)

            try {
                const response = await fetch(url)
                if (!response.ok) {
                    throw new Error(`Error: ${response.status} ${response.statusText}`)
                }
                const data = await response.json()
                setTileJson(data)
            } catch (error) {
                console.error('Failed to fetch TileJSON:', error)
                console.error('Full URL:', url)
            }
        }

        // Effects
        useEffect(() => {
            setMounted(true)
        }, [])


        useEffect(() => {
            console.log('parameters set')
            /*             if (initialLoadRef.current) {
                            initialLoadRef.current = false
                            return // Skip the first execution
                        } */
            console.log('about to enter fetch function')
            fetchTileJson()
        }, [metricSelected, gwlSelected, currentVariable, currentVariableData, currentGwl])

        useEffect(() => {
            if (mapRef.current) {
                console.log('maprefcurrent')
                const map = mapRef.current.getMap()

                const handleMapboxError = (e: any) => {
                    const error = e.error

                    // Suppress specific tile errors
                    if (error && error.status === 404 && error.url?.includes('WebMercatorQuad')) {
                        return
                    }

                    // Optionally, suppress all errors related to tiles
                    if (error && error.message?.includes('tile')) {
                        return
                    }

                    console.error('Map error:', error)
                }

                map.on('error', handleMapboxError)

                // Cleanup the event listener on component unmount
                return () => {
                    map.off('error', handleMapboxError)
                }
            }
        }, [mapRef])

        useEffect(() => {
            const map = mapRef.current
            if (!map) return

            map.getCanvas().style.cursor = isHoveringPopup ? 'pointer' : 'default'
        }, [infoFabPos])

        useEffect(() => {
            if (!isHoveringPopup && showPopup) {
                const timeout = setTimeout(() => {
                    setShowPopup(false)
                }, 200)
                return () => clearTimeout(timeout)
            }
        }, [isHoveringPopup, showPopup])

        useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                const target = event.target as Node
                if (
                    popupRef.current &&
                    !popupRef.current.contains(target) &&
                    fabRef.current &&
                    !fabRef.current.contains(target)
                ) {
                    setShowPopup(false)
                }
            }

            if (showPopup) {
                document.addEventListener('mousedown', handleClickOutside)
            } else {
                document.removeEventListener('mousedown', handleClickOutside)
            }

            return () => {
                document.removeEventListener('mousedown', handleClickOutside)
            }
        }, [showPopup])

        // Map functions 
        const handleHover = (event: MapMouseEvent) => {
            if (!mapLoaded || !mapRef.current) {
                console.log('map not loaded')
                return
            }

            const { lngLat: { lng, lat }, point } = event

            setHoverInfo({
                longitude: lng,
                latitude: lat,
                min: null,
                max: null,
                value: null
            })

            setInfoFabPos({ x: point.x, y: point.y })
        }

        const handleFabClick = () => {
            if (!hoverInfo) return

            const { longitude, latitude } = hoverInfo

            throttledFetchPoint(
                longitude,
                latitude,
                paths.min_path || '',
                paths.max_path || '',
                paths.mean,
                currentVariable,
                currentGwl,
                globalWarmingLevels,
                ({ min, max, value }) => {
                    if (value !== null) {
                        setHoverInfo({
                            longitude,
                            latitude,
                            min,
                            max,
                            value
                        })
                        setShowPopup(true)
                    } else {
                        setHoverInfo(null)
                        setInfoFabPos(null)
                    }
                }
            )
        }


        // Cleanup throttledFetchPoint
        useEffect(() => {
            return () => {
                throttledFetchPoint.cancel()
            }
        }, [])

        const handleMapError = (e: ErrorEvent) => {
            const error = e.error as { status?: number; url?: string }
            if (error.status === 404 && error.url?.includes('WebMercatorQuad')) {
                return
            }
            console.error('Map error:', error)
        }

        const handleMapLoad = (e: { target: import('mapbox-gl').Map }) => {
            if (!e.target) return
            mapRef.current = e.target as unknown as MapRef
            setMapLoaded(true)

            e.target.getCanvas().style.cursor = 'pointer'

            const mapContainer = document.getElementById('map')

            if (mapContainer) {
                const resizeObserver = new ResizeObserver(() => {
                    if (mapRef.current) {
                        mapRef.current.resize() // Resize the map when the container changes
                    }
                })
                resizeObserver.observe(mapContainer)
            }
        }

        // Loading spinner
        if (!mounted) {
            return (
                <Grid container sx={{ height: '100%', flexDirection: "column", flexWrap: "nowrap", flexGrow: 1 }}>
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)'
                    }}>
                        <LoadingSpinner />
                    </Box>
                </Grid>
            )
        }

        return (
            <Grid container sx={{ height: '100%', flexDirection: "column", flexWrap: "nowrap", flexGrow: 1, position: 'relative' }}>
                <Box sx={{ height: '100%', position: 'relative' }} id="map" aria-label="Interactive map showing climate data" ref={mapContainerRef} >
                    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                        {isLoading && (
                            <Box sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                zIndex: 9999
                            }} aria-live="polite">
                                <LoadingSpinner />
                            </Box>
                        )}
                        <Map
                            ref={mapRef}
                            onLoad={handleMapLoad}
                            onMouseMove={handleHover}
                            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
                            initialViewState={INITIAL_VIEW_STATE}
                            mapStyle="mapbox://styles/mapbox/light-v11"
                            scrollZoom={false}
                            minZoom={3.5}
                            maxBounds={MAP_BOUNDS}
                            style={{ width: '100%', height: "100%" }}
                            onError={handleMapError}
                            aria-label="Map"
                        >

                            {mapLoaded && tileJson && (
                                <Source
                                    id="raster-source"
                                    type="raster"
                                    tiles={tileJson.tiles}
                                    tileSize={tileJson.tileSize || 256}
                                >
                                    <Layer
                                        id="tile-layer"
                                        type="raster"
                                        paint={{ 'raster-opacity': RASTER_TILE_LAYER_OPACITY }}
                                    />
                                </Source>
                            )}
                            <GeocoderControl
                                mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''}
                                zoom={13}
                                position="top-right"
                                collapsed={true}
                                clearOnBlur={true}
                                onResult={(e: { result: GeocoderResult }) => {
                                    const { result } = e
                                    const location = result && (
                                        result.center ||
                                        (result.geometry?.type === 'Point' && result.geometry.coordinates)
                                    )
                                    if (location && mapRef.current) {
                                        mapRef.current.flyTo({
                                            center: location,
                                            zoom: 10
                                        })
                                    }
                                }}
                                aria-label="Search location"
                            />
                            <NavigationControl position="top-right" aria-label="Navigation controls" />
                            <ScaleControl position="bottom-right" maxWidth={100} unit="metric" aria-label="Scale control" />
                            {infoFabPos && hoverInfo && (
                                <Fab
                                    onClick={handleFabClick}
                                    onMouseEnter={() => setIsHoveringPopup(true)}
                                    onMouseLeave={() => {
                                        setIsHoveringPopup(false)
                                        setTimeout(() => {
                                            setShowPopup(false)
                                        }, 200)
                                    }}
                                    ref={fabRef}
                                    color="secondaryOnWhite"
                                    size="small"
                                    sx={{
                                        position: 'absolute',
                                        left: infoFabPos.x,
                                        top: infoFabPos.y,
                                        transform: 'translate(-50%, -50%)',
                                        zIndex: 10
                                    }}
                                    aria-label="Show more info"
                                >
                                   <MoreHorizOutlinedIcon />
                                </Fab>
                            )}
                            {showPopup && hoverInfo && (
                                <div
                                    ref={popupRef}
                                    onMouseEnter={() => setIsHoveringPopup(true)}
                                    onMouseLeave={() => {
                                        setIsHoveringPopup(false)
                                        setTimeout(() => {
                                            setShowPopup(false)
                                        }, 200) // give user time to move between FAB and popup
                                    }}>
                                    <MapPopup
                                        longitude={hoverInfo.longitude}
                                        latitude={hoverInfo.latitude}
                                        min={hoverInfo.min}
                                        max={hoverInfo.max}
                                        value={hoverInfo.value || 0}
                                        title={paths.short_desc}
                                        aria-label={`Popup at longitude ${hoverInfo.longitude} and latitude ${hoverInfo.latitude}`}
                                    />
                                </div>
                            )}
                        </Map>
                        <div style={{
                            position: 'absolute',
                            bottom: 40,
                            left: 40,
                            zIndex: 2
                        }}>
                            <MapLegend
                                colormap={paths.colormap}
                                min={parseFloat(paths.rescale.split(',')[0])}
                                max={parseFloat(paths.rescale.split(',')[1])}
                                title={paths.description}
                                aria-label="Map legend"
                            />
                        </div>
                    </div>
                </Box>
            </Grid>
        )
    }
)

MapboxMap.displayName = 'MapboxMap'

export default MapboxMap