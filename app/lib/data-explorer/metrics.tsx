import { Metric } from "@/app/components/Data-Explorer/DataExplorer";

export const metricsList: Metric [] = [
    {
        "id": 0,
        "title": 'Extreme Heat',
        "variable": 'TX99pd',
        "description": 'Mean annual change in extreme heat days',
        "short_desc": 'Mean annual change in extreme heat days',
        "path": 's3://cadcat/tmp/era/wrf/cae/mm4mean/ssp370/gwl/TX99pd/d03/TX99pd.zarr',
        "min_path": 's3://cadcat/tmp/era/wrf/cae/mm4min/ssp370/gwl/TX99pd/d03/TX99pd.zarr',
        "max_path": 's3://cadcat/tmp/era/wrf/cae/mm4max/ssp370/gwl/TX99pd/d03/TX99pd.zarr',
        "rescale": '-30,30',
        "colormap": 'RdBu_r',
    },
    {
        "id": 1,
        "title": 'Extreme Precipitation',
        "variable": 'R99pd',
        "description": 'Absolute change in 99th percentile 1-day accumulated precipitation',
        "short_desc": 'Absolute change in 99th percentile 1-day accumulated precipitation',
        "path": 's3://cadcat/tmp/era/wrf/cae/mm4mean/ssp370/gwl/R99pd/d03/R99pd.zarr',
        "min_path": 's3://cadcat/tmp/era/wrf/cae/mm4min/ssp370/gwl/R99pd/d03/R99pd.zarr',
        "max_path": 's3://cadcat/tmp/era/wrf/cae/mm4max/ssp370/gwl/R99pd/d03/R99pd.zarr',
        "rescale": '-20,20',
        "colormap": 'BrBG',
    },
    {
        "id": 2,
        "title": 'Fire Weather',
        "variable": 'ffwige50d',
        "description": 'Change in median annual number of days with (FFWI) value greater than 50',
        "short_desc": 'Change in median annual number of days with (FFWI) value greater than 50',
        "path": 's3://cadcat/tmp/era/wrf/cae/mm4mean/ssp370/gwl/ffwige50d/d03/ffwige50d.zarr',
        "min_path": 's3://cadcat/tmp/era/wrf/cae/mm4min/ssp370/gwl/ffwige50d/d03/ffwige50d.zarr',
        "max_path": 's3://cadcat/tmp/era/wrf/cae/mm4max/ssp370/gwl/ffwige50d/d03/ffwige50d.zarr',
        "rescale": '-60,60',
        "colormap": 'PuOr',
    }
]