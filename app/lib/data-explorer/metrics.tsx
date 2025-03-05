export const metricsList = [
    {
        "id": 0, 
        "title": 'Extreme Heat',
        "variable": 'TX99p',
        "description": 'Mean annual change in extreme heat days',
        "path": 's3://cadcat/tmp/era/wrf/cae/mm4mean/ssp370/yr/TX99p/d02/TX99p.zarr',
        "min_path": 's3://cadcat/tmp/era/wrf/cae/mm4min/ssp370/gwl/TX99p/d03/TX99p.zarr',
        "max_path": 's3://cadcat/tmp/era/wrf/cae/mm4max/ssp370/gwl/TX99p/d03/TX99p.zarr',
        "rescale": '-30,30',
        "colormap": 'RdBu_r',
    },
    {
        "id": 1, 
        "title": 'Extreme Precipitation',
        "variable": 'R99p',
        "description": 'Absolute change in 99th percentile 1-day accumulated precipitation',
        "path": 's3://cadcat/tmp/era/wrf/cae/mm4mean/ssp370/yr/R99p/d02/R99p.zarr',
        "min_path": 's3://cadcat/tmp/era/wrf/cae/mm4min/ssp370/gwl/R99p/d03/R99p.zarr',
        "max_path": 's3://cadcat/tmp/era/wrf/cae/mm4max/ssp370/gwl/R99p/d03/R99p.zarr',
        "rescale": '-20,20',
        "colormap": 'BrBG',
    },
    {
        "id": 2, 
        "title": 'Fire Weather',
        "variable": 'ffwige50',
        "description": 'Change in median annual number of days with (FFWI) value greater than 50',
        "path": 's3://cadcat/tmp/era/wrf/cae/mm4mean/ssp370/yr/ffwige50/d02/ffwige50.zarr',
        "rescale": '-60,60',
        "colormap": 'PuOr',
    }
]