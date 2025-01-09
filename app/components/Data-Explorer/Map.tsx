'use client'

import 'mapbox-gl/dist/mapbox-gl.css'
import React, { useState, useEffect, useRef, useMemo, forwardRef, useImperativeHandle, useCallback } from 'react'
import { Marker, Map, Layer, Source, MapMouseEvent, NavigationControl, MapRef, ScaleControl, Popup } from 'react-map-gl'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Unstable_Grid2'
import { MapLegend } from './MapLegend'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import LoadingSpinner from '../Global/LoadingSpinner'

type MapProps = {
    metricSelected: number;
    gwlSelected: number;
    data: any;
    setMetricSelected: (metric: number) => void,
    setGwlSelected: (gwl: number) => void,
}

const VARIABLES = {
    'TX99p': {
        title: 'Maximum air temperature days exceeding 99th percentile',
        path: 's3://cadcat/tmp/era/wrf/cae/mm4mean/ssp370/yr/TX99p/d02/TX99p.zarr',
        rescale: '1.18,35.19'
    },
    'R99p': {
        title: 'Absolute change in 99th percentile precipitation',
        path: 's3://cadcat/tmp/era/wrf/cae/mm4mean/ssp370/yr/R99p/d02/R99p.zarr',
        rescale: '0,50'  // Rescale values?
    },
    'ffwige50': {
        title: 'Number of days with FFWI greater than 50',
        path: 's3://cadcat/tmp/era/wrf/cae/mm4mean/ssp370/yr/ffwige50/d02/ffwige50.zarr',
        rescale: '0,30'  // Rescale values?
    }
} as const;

type VariableKey = keyof typeof VARIABLES;

const COLORMAPS = ["magma", "viridis", "inferno", "plasma", "cividis"] as const;

const GWL_VALUES = ["1.5", "2.0", "2.5", "3.0"] as const;

const MapboxMap = forwardRef<MapRef | null, MapProps>(
    ({ metricSelected, gwlSelected, data, setMetricSelected, setGwlSelected }, ref) => {
        const mapRef = useRef<MapRef | null>(null)
        const [mapLoaded, setMapLoaded] = useState(false)
        const [tileJson, setTileJson] = useState(null)
        const [mounted, setMounted] = useState(false)
        const [colormap, setColormap] = useState<typeof COLORMAPS[number]>("magma")
        const [selectedVariable, setSelectedVariable] = useState<VariableKey>("TX99p")
        const [selectedGwl, setSelectedGwl] = useState<typeof GWL_VALUES[number]>("3.0")
        const [hoverInfo, setHoverInfo] = useState<{
            longitude: number;
            latitude: number;
            value: number | null;
        } | null>(null);

        const initialViewState = {
            longitude: -120,
            latitude: 37.4,
            zoom: 5
        }

        // Forward the internal ref to the parent using useImperativeHandle
        useImperativeHandle(ref, () => mapRef.current as MapRef)

        const handleMapLoad = (e: any) => {
            const map = e.target;
            mapRef.current = map;
            setMapLoaded(true);
        }

        const handleHover = async (event: MapMouseEvent) => {
            console.log('Hover event triggered');
            const { lngLat: { lng, lat } } = event;
            
            if (!mapRef.current) {
                console.log('No map ref');
                return;
            }

            try {
                const response = await fetch(
                    `https://2fxwkf3nc6.execute-api.us-west-2.amazonaws.com/point/${lng},${lat}?` + 
                    `url=${encodeURIComponent(VARIABLES[selectedVariable].path)}&` +
                    `variable=${selectedVariable}`
                );
                
                if (response.ok) {
                    const data = await response.json();
                    console.log('Point data:', data);
                    
                    // Get the value from the data array based on the selected GWL
                    const gwlIndex = GWL_VALUES.indexOf(selectedGwl);
                    const value = data.data[gwlIndex];
                    
                    // Only set hover info if we have a valid value
                    if (value !== undefined && value !== null) {
                        setHoverInfo({
                            longitude: lng,
                            latitude: lat,
                            value: value
                        });
                    } else {
                        setHoverInfo(null);
                    }
                }
            } catch (error) {
                console.error('Error fetching point data:', error);
                setHoverInfo(null);
            }
        };

        useEffect(() => {
            const fetchTileJson = async () => {
                // Base URL for the API
                const baseUrl = 'https://2fxwkf3nc6.execute-api.us-west-2.amazonaws.com/WebMercatorQuad/tilejson.json';
                
                // Construct query parameters
                const params = {
                    url: VARIABLES[selectedVariable].path,
                    variable: selectedVariable,
                    datetime: selectedGwl,
                    rescale: VARIABLES[selectedVariable].rescale,
                    colormap_name: colormap
                };

                // Convert params to query string
                const queryString = Object.entries(params)
                    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
                    .join('&');

                const url = `${baseUrl}?${queryString}`;

                try {
                    const response = await fetch(url);
                    if (!response.ok) {
                        throw new Error(`Error: ${response.status} ${response.statusText}`);
                    }
                    const data = await response.json();
                    setTileJson(data);
                } catch (error) {
                    console.error('Failed to fetch TileJSON:', error);
                    console.error('Full URL:', url);
                }
            };

            fetchTileJson();
        }, [metricSelected, selectedGwl, colormap, selectedVariable]);

        // Handle hydration mismatch
        useEffect(() => {
            setMounted(true)
        }, [])

        // Skip rendering select components until after hydration
        if (!mounted) {
            return null
        }

        return (
            <Grid container sx={{ height: '100%', flexDirection: "column", flexWrap: "nowrap", flexGrow: 1 }}>
                <Box>
                    {/* <p>{metricSelected}</p>
                    <p>{gwlSelected}</p> */}
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id="variable-select-label">Variable</InputLabel>
                        <Select
                            labelId="variable-select-label"
                            value={selectedVariable}
                            label="Variable"
                            onChange={(e) => setSelectedVariable(e.target.value as VariableKey)}
                        >
                            {Object.entries(VARIABLES).map(([key, value]) => (
                                <MenuItem key={key} value={key}>
                                    {value.title}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id="gwl-select-label">GWL</InputLabel>
                        <Select
                            labelId="gwl-select-label"
                            value={selectedGwl}
                            label="GWL"
                            onChange={(e) => setSelectedGwl(e.target.value as typeof GWL_VALUES[number])}
                        >
                            {GWL_VALUES.map((gwl) => (
                                <MenuItem key={gwl} value={gwl}>
                                    {gwl}°C
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id="colormap-select-label">Colormap</InputLabel>
                        <Select
                            labelId="colormap-select-label"
                            value={colormap}
                            label="Colormap"
                            onChange={(e) => setColormap(e.target.value as typeof COLORMAPS[number])}
                        >
                            {COLORMAPS.map((cm) => (
                                <MenuItem key={cm} value={cm}>
                                    {cm.charAt(0).toUpperCase() + cm.slice(1)}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                <Box sx={{ height: '100%', flexDirection: "column", flexWrap: "nowrap", flexGrow: 1, position: "relative" }} id="map">
                    {!tileJson ? (
                        <LoadingSpinner />
                    ) : (
                        <Map
                            ref={mapRef}
                            onLoad={handleMapLoad}
                            onMouseMove={handleHover}
                            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
                            initialViewState={initialViewState}
                            mapStyle="mapbox://styles/mapbox/streets-v9"
                            scrollZoom={false}
                            minZoom={3.5}
                            style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
                        >
                            <NavigationControl position="bottom-left" />
                            <ScaleControl position="bottom-right" maxWidth={100} unit="metric" />
                            <Source 
                                id="raster-source"
                                type="raster"
                                tiles={tileJson.tiles}
                                tileSize={256}
                            >
                                <Layer
                                    id="tile-layer"
                                    type="raster"
                                    paint={{ 'raster-opacity': 0.8 }}
                                />
                            </Source>
                            <MapLegend 
                                colormap={colormap}
                                min={parseFloat(VARIABLES[selectedVariable].rescale.split(',')[0])}
                                max={parseFloat(VARIABLES[selectedVariable].rescale.split(',')[1])}
                                title={VARIABLES[selectedVariable].title}
                            />
                            {hoverInfo && (
                                <Popup
                                    longitude={hoverInfo.longitude}
                                    latitude={hoverInfo.latitude}
                                    closeButton={false}
                                    className="county-info-popup"
                                >
                                    Value: {hoverInfo.value?.toFixed(2)}
                                </Popup>
                            )}
                        </Map>
                    )}
                </Box>
            </Grid>
        )
    }
)

MapboxMap.displayName = 'MapboxMap'

export default MapboxMap


