'use client'

import { Popup } from 'react-map-gl'
import Typography from '@mui/material/Typography'

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

                <Typography variant="body2">
                    Min: {min?.toFixed(2)}
                </Typography>

                <Typography variant="body2">
                    Value: {value.toFixed(2)}
                </Typography>
                {max &&
                    <Typography variant="body2">
                        Max: {max.toFixed(2)}
                    </Typography>
                }
            </div>
        </Popup>
    )
} 