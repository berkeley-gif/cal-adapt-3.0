'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import HtmlTooltip from '../Global/HtmlTooltip'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { FormControl, Button } from '@mui/material'
import Popover from '@mui/material/Popover'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import ListItemText from '@mui/material/ListItemText'
import MenuItem from '@mui/material/MenuItem'
import Fade from '@mui/material/Fade'
import Fab from '@mui/material/Fab'
import QuestionMarkOutlinedIcon from '@mui/icons-material/QuestionMarkOutlined'
import Switch from '@mui/material/Switch'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';


import type { Metric } from '@/app/lib/data-explorer/metrics'
import { useLeftDrawer } from '../../context/LeftDrawerContext'
import { tooltipsList } from '@/app/lib/tooltips'
import type { ValueType } from './DataExplorer'

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

type MapUIProps = {
    metricSelected: number;
    gwlSelected: number;
    setMetricSelected: (metric: number) => void;
    setGwlSelected: (gwl: number) => void;
    globalWarmingLevels: string[];
    metrics: Metric[];

    valueType: ValueType;
    setValueType: (valueType: ValueType) => void;
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


export default function MapUI({ valueType, setValueType, metricSelected, gwlSelected, setMetricSelected, setGwlSelected, globalWarmingLevels, metrics }: MapUIProps) {
    const { open, drawerWidth } = useLeftDrawer()
    const [helpAnchorEl, setHelpAnchorEl] = React.useState<HTMLButtonElement | null>(null)
    const helpButtonRef = useRef<HTMLButtonElement | null>(null)

    const fullWidthUIItem = open ? `100%` : `calc(100% - ${drawerWidth} - 72px)`
    const handleValueTypeChange = (event: React.SyntheticEvent, newValue: ValueType) => {
        setValueType(newValue)
    }

    const router = useRouter()
    const searchParams = useSearchParams()

    const [renderKey, setRenderKey] = useState(0)

    const handleMetricChange = (event: any) => {
        console.log('handleMetricChange')
        const newMetricId = event.target.value as number
        setMetricSelected(newMetricId)

        const selectedMetric = metrics.find(m => m.id === newMetricId)
        if (selectedMetric) {
            const params = new URLSearchParams(window.location.search)
            params.set('metric', selectedMetric.slug)
            router.push(`?${params.toString()}`)
        }
    }

    const handleHelpClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setHelpAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setHelpAnchorEl(null)
    }

    const helpOpen = Boolean(helpAnchorEl);
    const id = helpOpen ? 'simple-popover' : undefined

    useEffect(() => {
        setRenderKey((prev) => prev + 1);
    }, [open])

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (helpButtonRef.current) {
                setHelpAnchorEl(helpButtonRef.current);
            }
        }, 1000); // delay in milliseconds (e.g., 1000ms = 1 second)

        return () => clearTimeout(timeout); // cleanup on unmount
    }, [])

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)

        // set metric from URL if available
        const metricSlug = params.get('metric')
        if (metricSlug) {
            const matchedMetric = metrics.find(m => m.slug === metricSlug)
            if (matchedMetric) {
                setMetricSelected(matchedMetric.id)
            } else {
                console.warn(`Unknown metric selected: ${metricSlug}`)
                setMetricSelected(metrics[0].id)
            }
        } else {
            setMetricSelected(metrics[0].id)
        }

        // GWL 
        const gwlParam = params.get('gwl')
        if (gwlParam) {
            const gwlIndex = parseInt(gwlParam, 10)
            if (!isNaN(gwlIndex)) setGwlSelected(gwlIndex)
        }

        // Value type
        const valueParam = params.get('valueType')
        if (valueParam === 'abs' || valueParam === 'del') {
            setValueType(valueParam)
        }
    }, [])

    return (
        <div className="map-ui" style={{
            width: open ? 'calc(100% - 212px)' : 'calc(100% - 72px)',
            transition: 'width 225ms cubic-bezier(0.4, 0, 0.6, 1)',
        }}>
            <Box sx={{ height: '80vh', display: 'flex', flexDirection: 'column' }}>
                <Grid container direction="column" sx={{ height: '100%' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={3}>
                            <div className='map-ui__parameter-selection'>
                                <div className="map-ui__value-type">
                                    <Box key={renderKey} sx={{
                                        width: fullWidthUIItem,
                                    }}>
                                        <Tabs className="container container--transparent" value={valueType} onChange={handleValueTypeChange} centered>
                                            <Tab value="abs" label="Absolute" />
                                            <Tab value="del" label="Delta" />
                                        </Tabs>
                                    </Box>
                                </div>
                                <div className="container container--transparent">
                                    <div className="option-group option-group--vertical">
                                        <div className="option-group__title">
                                            <Typography variant="body2">Global Warming Level</Typography>
                                            <HtmlTooltip
                                                textFragment={
                                                    <React.Fragment>
                                                        <p>{tooltipsList[0].long_text}</p>
                                                    </React.Fragment>
                                                }
                                                iconFragment={<InfoOutlinedIcon />}
                                                TransitionComponent={Fade}
                                                TransitionProps={{ timeout: 600 }}
                                                placement="right-end"
                                            />
                                        </div>

                                        <FormControl>
                                            <Select
                                                value={gwlSelected}
                                                onChange={(event: any) => {
                                                    setGwlSelected(event.target.value as number)
                                                }}
                                                MenuProps={MenuProps}
                                                sx={{ mt: '15px', width: '200px' }}
                                            >
                                                {globalWarmingLevels.map((gwl, i) => {
                                                    return (
                                                        <MenuItem key={gwl} value={i}>
                                                            <ListItemText primary={`${gwl}°`} />
                                                        </MenuItem>
                                                    )
                                                }
                                                )}
                                            </Select>
                                        </FormControl>
                                    </div>
                                </div>
                                <div className="container container--transparent">
                                    <div className="option-group option-group--vertical">
                                        <div className="option-group__title">
                                            <Typography variant="body2">Metric</Typography>
                                            <HtmlTooltip
                                                textFragment={
                                                    <React.Fragment>
                                                        <p>{tooltipsList[1].long_text}</p>
                                                    </React.Fragment>
                                                }
                                                iconFragment={<InfoOutlinedIcon />}
                                                TransitionComponent={Fade}
                                                TransitionProps={{ timeout: 600 }}
                                                placement="right-end"
                                            />
                                        </div>

                                        <FormControl>
                                            <Select
                                                value={metricSelected}
                                                onChange={handleMetricChange}
                                                MenuProps={MenuProps}
                                                sx={{ mt: '15px', width: '220px' }}
                                            >
                                                {metrics.map((metric) => (
                                                    <MenuItem key={metric.id} value={metric.id}>
                                                        <ListItemText primary={metric.title} />
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>


                                    </div>
                                </div>
                            </div>
                        </Grid>
                        <Grid item xs={9}>
                        </Grid>
                    </Grid>
                    {/* Spacer */}
                    <Grid item xs />
                    {/* Bottom Columns */}
                    <Grid container item justifyContent="center">
                        <Grid item xs={10}></Grid>
                        <Grid item xs={2}>
                            <Fab
                                className="map-ui__help-button"
                                color="secondary"
                                sx={{ float: 'right', mr: '50px' }}
                                aria-label="Help toggle"
                                size="medium"
                                onClick={handleHelpClick}
                                ref={helpButtonRef}>
                                <QuestionMarkOutlinedIcon />
                            </Fab>
                            <Popover
                                id={id}
                                className="help-popover"
                                open={helpOpen}
                                anchorEl={helpAnchorEl}
                                onClose={handleClose}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                sx={{
                                    '& .MuiPaper-root': {
                                        width: '400px', // Set width
                                        height: '500px', // Set height
                                        padding: '30px'
                                    },
                                }}
                            >
                                <Typography variant="h5">
                                    About the Data Explorer Tool
                                </Typography>
                                <Typography variant="body1">
                                    <p>Showing the absolute and change in extreme weather across heat, precipitation, and fire weather over the potential futures in California allows individuals, planners, researchers, and interested parties to examine the general shape of climate projections.
                                    </p>
                                </Typography>

                                <Typography variant="h6" style={{ marginTop: '15px' }}>Projections Type</Typography>
                                <Typography variant="body1">
                                    <p>
                                        <strong>Absolute</strong>: show the average expected value for the chosen metric and at the selected Global Warming Level (GWL).

                                    </p>
                                    <p>
                                        <strong>Delta</strong>: show the change between a 0.8° C world (roughly 2015-2020) and the selected GWL
                                    </p>
                                </Typography>

                                <Typography variant="h6" style={{ marginTop: '15px' }}>Global Warming Level</Typography>
                                <Typography variant="body1">
                                    <p>
                                        Show what different parts of California will look like when the world, as a whole, has increased average temperature compared to pre-industrial by the chosen amount.
                                    </p>
                                    <p>
                                        For additional information go to: <a href="https://cal-adapt.org/blog/understanding-warming-levels" target='_blank'><span className="underline">Understanding Climate Futures through the lens of global Warming Levels</span></a>
                                    </p>
                                </Typography>
                                <Typography variant="body1" style={{ marginTop: '15px' }}>
                                    Use the dropdown menu to select a global warming scenario (e.g., 1.5°C, 2.0°C).
                                    This will adjust the data overlays to reflect projected changes under the selected warming level.
                                    (<a href="https://climate.gov" target='_blank'><span className="underline">Climate.gov</span></a>  has more information)
                                </Typography>


                                <Typography variant="h6" sx={{ mt: '15px' }}>
                                    Metric
                                </Typography>
                                <Typography variant="body1">
                                    <p>Choose a climate metric to display on the map (e.g., extreme temperature, extreme precipitation, fire weather index)
                                        Each metric provides a unique perspective on how climate change impacts various regions.</p>
                                    (A plain language description of metrics can be found <a href='https://docs.google.com/document/d/19UB672X38z21QlEkieWEwWLwZQWU_L7wMW5zq9bo7tc/edit?usp=sharing' target='_blank'><span className="underline">here</span></a>)
                                </Typography>
                                <Typography variant="h6" sx={{ mt: '15px' }}>
                                    Interactive Map Features
                                </Typography>
                                <Typography variant="body1">
                                    <p><strong>Pan and Zoom:</strong> Click and drag to move the map, and use the scroll wheel or zoom buttons to focus on specific areas.</p>
                                    <p><strong>Region Highlighting:</strong> Click on a region to view localized climate data and projections.</p>
                                    <p><strong>Legend:</strong> The color scale on the map legend indicates the range of values for the selected metric.</p>
                                </Typography>
                            </Popover>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </div>
    )
}

