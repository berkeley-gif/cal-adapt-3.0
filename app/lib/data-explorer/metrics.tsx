export type Metric = {
    id: number
    title: string
    abs: {
        mean: string
        min_path?: string
        max_path?: string
        description: string
        short_desc: string
        variable: string
        rescale: string
        colormap: string
    }
    del: {
        mean: string
        min_path?: string
        max_path?: string
        description: string
        short_desc: string
        variable: string
        rescale: string
        colormap: string
    }

}

export const metricsList: Metric[] = [
    {
        "id": 0,
        "title": 'Extreme Heat',
        "abs": {
            "mean": 's3://cadcat/tmp/era/wrf/cae/mm4mean/ssp370/gwl/TX99p/d03/TX99p.zarr',
            "min_path": 's3://cadcat/tmp/era/wrf/cae/mm4min/ssp370/gwl/TX99p/d03/TX99p.zarr',
            "max_path": 's3://cadcat/tmp/era/wrf/cae/mm4max/ssp370/gwl/TX99p/d03/TX99p.zarr',
            "description": 'Mean absolute value of extreme heat days',
            "short_desc": 'Mean absolute value of extreme heat days',
            "variable": 'TX99p',
            "rescale": '0,50',
            "colormap": 'Reds',
        },
        "del": {
            "mean": 's3://cadcat/tmp/era/wrf/cae/mm4mean/ssp370/gwl/TX99pd/d03/TX99pd.zarr',
            "min_path": 's3://cadcat/tmp/era/wrf/cae/mm4min/ssp370/gwl/TX99pd/d03/TX99pd.zarr',
            "max_path": 's3://cadcat/tmp/era/wrf/cae/mm4max/ssp370/gwl/TX99pd/d03/TX99pd.zarr',
            "description": 'Mean annual change in extreme heat days',
            "short_desc": 'Mean annual change in extreme heat days',
            "variable": 'TX99pd',
            "rescale": '-30,30',
            "colormap": 'RdBu_r',
        },
    },
    {
        "id": 1,
        "title": 'Extreme Precipitation',
        "abs": {
            "mean": 's3://cadcat/tmp/era/wrf/cae/mm4mean/ssp370/gwl/R99p/d03/R99p.zarr',
            "min_path": 's3://cadcat/tmp/era/wrf/cae/mm4min/ssp370/gwl/R99p/d03/R99p.zarr',
            "max_path": 's3://cadcat/tmp/era/wrf/cae/mm4max/ssp370/gwl/R99p/d03/R99p.zarr',
            "description": 'Absolute 99th percentile 1-day accumulated precipitation',
            "short_desc": 'Absolute 99th percentile 1-day accumulated precipitation',
            "variable": 'R99p',
            "rescale": '0,170',
            "colormap": 'Blues',
        },
        "del": {
            "mean": 's3://cadcat/tmp/era/wrf/cae/mm4mean/ssp370/gwl/R99pd/d03/R99pd.zarr',
            "min_path": 's3://cadcat/tmp/era/wrf/cae/mm4min/ssp370/gwl/R99pd/d03/R99pd.zarr',
            "max_path": 's3://cadcat/tmp/era/wrf/cae/mm4max/ssp370/gwl/R99pd/d03/R99pd.zarr',
            "description": 'Absolute change in 99th percentile 1-day accumulated precipitation',
            "short_desc": 'Absolute change in 99th percentile 1-day accumulated precipitation',
            "variable": 'R99pd',
            "rescale": '-20,20',
            "colormap": 'BrBG',
        },
    },
    {
        "id": 2,
        "title": 'Fire Weather',
        "abs": {
            "mean": 's3://cadcat/tmp/era/wrf/cae/mm4mean/ssp370/gwl/ffwige50/d03/ffwige50.zarr',
            "min_path": 's3://cadcat/tmp/era/wrf/cae/mm4min/ssp370/gwl/ffwige50/d03/ffwige50.zarr',
            "max_path": 's3://cadcat/tmp/era/wrf/cae/mm4max/ssp370/gwl/ffwige50/d03/ffwige50.zarr',
            "description": 'Absolute median annual number of days with (FFWI) value greater than 50',
            "short_desc": 'Absolute median annual number of days with (FFWI) value greater than 50',
            "variable": 'ffwige50',
            "rescale": '0,3650',
            "colormap": 'gist_heat',
        },
        "del": {
            "mean": 's3://cadcat/tmp/era/wrf/cae/mm4mean/ssp370/gwl/ffwige50/d03/ffwige50.zarr',
            "min_path": 's3://cadcat/tmp/era/wrf/cae/mm4min/ssp370/gwl/ffwige50d/d03/ffwige50d.zarr',
            "max_path": 's3://cadcat/tmp/era/wrf/cae/mm4max/ssp370/gwl/ffwige50d/d03/ffwige50d.zarr',
            "description": 'Change in median annual number of days with (FFWI) value greater than 50',
            "short_desc": 'Change in median annual number of days with (FFWI) value greater than 50',
            "variable": 'ffwige50',
            "rescale": '-60,60',
            "colormap": 'PuOr',
        },
        
    }
]