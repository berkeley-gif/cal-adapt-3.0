'use client'

import { Popup } from 'react-map-gl'
import Typography from '@mui/material/Typography'
import '@/app/styles/dashboard/mapbox-map.scss'

type MapPopupProps = {
    longitude: number
    latitude: number
    value: number
    min: number | null
    max: number | null
}

export const MapPopup = ({ longitude, latitude, value, min, max }: MapPopupProps) => {
    return (
        <Popup
            longitude={longitude}
            latitude={latitude}
            closeButton={false}
            anchor="bottom"
            className="map-popup"
        >
            <div className="map-popup_container">
                <div className="description">
                    <Typography variant="body2">
                        Annual change in extreme heat days
                    </Typography>
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

            </div>
        </Popup>
    )
} 