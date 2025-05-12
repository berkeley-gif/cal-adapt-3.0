'use client'

import { Popup } from 'react-map-gl'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import Alert from '@mui/material/Alert'
import LoadingSpinner from '../Global/LoadingSpinner'

import '@/app/styles/dashboard/mapbox-map.scss'

type MapPopupProps = {
    longitude: number
    latitude: number
    value: number
    min: number | null
    max: number | null
    title: string
    isPopupLoading: boolean
    onClose: () => void
    isDataValid: boolean
}

export const MapPopup = ({ longitude, latitude, value, min, max, title, isPopupLoading, onClose, isDataValid }: MapPopupProps) => {
    return (
        <Popup
            longitude={longitude}
            latitude={latitude}
            closeButton={false}
            anchor="bottom"
            className="map-popup"
        >
            <div className="map-popup_container">
                {isPopupLoading &&
                    (<LoadingSpinner />)
                }

                {!isPopupLoading && isDataValid && (
                    <>
                        <div className="description" >
                            <Typography variant="body2">
                                {title}
                            </Typography>
                        </div>
                        <div className="close" style={{
                            position: 'absolute', float: 'right', top: '10px', right: '10px'
                        }}>
                            <IconButton size="small" onClick={onClose} aria-label="Close popup">
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </div>
                        <div className="values">
                            {(min >= 0) &&
                                <div className="value">
                                    <Typography variant="h5">
                                        {min?.toFixed(2)}
                                    </Typography>
                                    <Typography variant="body2">
                                        Min*
                                    </Typography>
                                </div>

                            }
                            <div className="value">
                                <Typography variant="h4">
                                    {value.toFixed(2)}
                                </Typography>
                                <Typography variant="body2">
                                    Mean*
                                </Typography>
                            </div>
                            {max &&
                                <div className="value">
                                    <Typography variant="h5">
                                        {max.toFixed(2)}
                                    </Typography>
                                    <Typography variant="body2">
                                        Max*
                                    </Typography>
                                </div>

                            }
                        </div>

                        <div className="title">
                            <Typography variant="caption">
                                *Value across models
                            </Typography>
                        </div>
                    </>)}

                {!isPopupLoading && !isDataValid && (
                    <Alert className="alerts alerts-100" style={{ marginBottom: '0'}} variant="filled" severity="info" color="secondaryReversed">No data is available for this location</Alert>
                )}
            </div >
        </Popup >
    )
} 