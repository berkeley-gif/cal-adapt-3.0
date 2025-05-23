
import React, { useState, useEffect } from 'react'

import Autocomplete from '@mui/material/Autocomplete'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import ListItemText from '@mui/material/ListItemText'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { FormControl, Button } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import UndoOutlinedIcon from '@mui/icons-material/UndoOutlined'
import Tooltip from '@mui/material/Tooltip'
import Fade from '@mui/material/Fade'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import ListSubheader from '@mui/material/ListSubheader'
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined'

import { searchObject } from "@/app/utils/functions"
import { useDidMountEffect } from "@/app/utils/hooks"
import DataResultsTable from './DataResultsTable'
import HtmlTooltip from '../Global/HtmlTooltip'
import { variablesLookupTable, scenariosLookupTable, lookupValue } from '@/app/utils/lookupTables'
import LoadingSpinner from '../Global/LoadingSpinner'
import { tooltipsList } from '@/app/lib/tooltips'

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

type varUrl = {
    name: string,
    href: string
}

type modelVarUrls = {
    model: string,
    countyname: string,
    scenario: string,
    vars: varUrl[]
}

// Configurations for Models Select field dropdown
const MenuProps: any = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
    getContentAnchorEl: null,
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

interface FormFieldErrorStates {
    models: boolean;
    vars: boolean;
    counties: boolean;
    scenarios: boolean;
}

interface ChildFormProps {
    frequenciesList: string[],
    selectedFrequency: string,
    modelsList: string[],
    modelsSelected: string[],
    varsList: string[],
    selectedVars: string[],
    countiesList: string[],
    selectedCounties: string[],
    selectedScenarios: string[],
    scenariosList: string[],
    sidebarState: string,
    localPackageSettings: any,
    dataResponse: modelVarUrls[]
    isAllModelsSelected: any,
    isPackageStored: boolean,
    nextPageUrl: string,
    genUseModelsList: string[],
    downloadLinks: string[],
    isDataDaily: boolean,
    totalDataSize: number,
    setDownloadLinks: (links: string[]) => void,
    setSidebarState: ((state: string) => void),
    setPackageSettings: (localPackageSettings: string[]) => void,
    setSelectedFrequency: (localPackageSettings: string) => void,
    setSelectedVars: (selectedVars: string[]) => void,
    setModelsSelected: (selectedModels: string[]) => void,
    setSelectedCounties: (selectedCounties: string[]) => void,
    setSelectedScenarios: (selectedScenarios: string[]) => void,
    handleLocalPackageClear: () => void,
    onFormDataSubmit: () => unknown,
    createZip: (links: string[], extraFilenameStr: string) => Promise<void>,
    bytesToGBOrMB: (bytes: number) => string,
    isLoading: boolean,
    setIsLoading: (state: boolean) => void,
    isBundling: boolean,
    setIsBundling: (state: boolean) => void
}

const PackageForm: React.FC<ChildFormProps> = ({
    genUseModelsList,
    downloadLinks,
    setDownloadLinks,
    isPackageStored,
    localPackageSettings,
    selectedFrequency,
    setSelectedFrequency,
    frequenciesList,
    modelsSelected,
    setModelsSelected,
    modelsList,
    sidebarState,
    selectedVars,
    isAllModelsSelected,
    setSidebarState,
    setSelectedVars,
    varsList,
    selectedCounties,
    setSelectedCounties,
    countiesList,
    selectedScenarios,
    setSelectedScenarios,
    scenariosList,
    onFormDataSubmit,
    dataResponse,
    handleLocalPackageClear,
    createZip,
    isDataDaily,
    totalDataSize,
    bytesToGBOrMB,
    isLoading,
    setIsLoading,
    isBundling,
    setIsBundling }) => {

    const [formErrorState, setFormErrorState] = useState<FormFieldErrorStates>({
        models: false,
        vars: false,
        counties: false,
        scenarios: false
    })

    const [isError, setIsError] = useState(false)

    let isFormInvalid: boolean = false

    // MODELS

    const handleModelsChange = (event: SelectChangeEvent<string[]>) => {
        const selectedValues = event.target.value as string[]

        if (selectedValues.includes('all')) {
            if (isAllModelsSelected.current) {
                const newValuesArr: string[] = modelsSelected.filter(item => !event.target.value.includes(item))
                // If "Select All" was previously selected, deselect the option clicked and Select all
                setModelsSelected(newValuesArr)
                isAllModelsSelected.current = false;
            } else {
                // If "Select All" is selected, select all options except "Select All"
                setModelsSelected(modelsList)
                isAllModelsSelected.current = true;
            }
        } else {
            // Check if "Select All" was previously selected
            if (selectedValues.length === modelsList.length - 1 && selectedValues.includes('all')) {
                const filteredValues = selectedValues.filter(value => value !== 'all');
                setModelsSelected(filteredValues)
                isAllModelsSelected.current = false
            } else {
                // If "Select All" was not previously selected or no individual item is being deselected,
                // update the selected items
                setModelsSelected(selectedValues);
                isAllModelsSelected.current = false;
            }
        }
    }

    useDidMountEffect(() => {
        if (modelsSelected.length > 0) {
            let newFormState = formErrorState

            newFormState.models = false
            setFormErrorState(newFormState)
        }

    }, [modelsSelected])

    // VARIABLES 
    useDidMountEffect(() => {
        if (selectedVars.length > 0) {
            let newFormState = formErrorState

            newFormState.vars = false
            setFormErrorState(newFormState)
        }

    }, [selectedVars])

    // COUNTIES
    useDidMountEffect(() => {
        if (selectedCounties.length > 0) {
            let newFormState = formErrorState

            newFormState.counties = false
            setFormErrorState(newFormState)
        }

    }, [selectedCounties])

    // SCENARIOS
    useDidMountEffect(() => {
        if (selectedScenarios.length > 0) {
            let newFormState = formErrorState

            newFormState.scenarios = false
            setFormErrorState(newFormState)
        }

    }, [selectedScenarios])

    // FORM HANDLING 
    function validateFormData() {
        let newFormState = formErrorState

        if (modelsSelected.length == 0) {
            newFormState.models = true
        } else {
            newFormState.models = false
        }

        if (selectedVars.length == 0) {
            newFormState.vars = true
        } else {
            newFormState.vars = false
        }

        if (selectedCounties.length == 0) {
            newFormState.counties = true
        } else {
            newFormState.counties = false
        }

        if (selectedScenarios.length == 0) {
            newFormState.scenarios = true
        } else {
            newFormState.scenarios = false
        }

        setFormErrorState(newFormState)
        isFormInvalid = searchObject(formErrorState, true)

        if (isFormInvalid) {
            setIsError(true)
        }
    }

    const handleSubmit = () => {

        validateFormData()

        if (!isFormInvalid) {
            onFormDataSubmit()

            isFormInvalid = false
            setSidebarState('download')
            setIsError(false)

        } else {
            setIsError(true)
        }
    }

    useEffect(() => {
        if (dataResponse.length > 0) {
            setIsLoading(false)
        }
    }, [dataResponse])

    useEffect(() => {

    }, [])


    function genVarsLinks(variables: varUrl[]): string[] {
        let varsLinks: string[] = []

        for (const idx in variables) {
            varsLinks.push(variables[idx].href)
        }

        return varsLinks
    }

    return (
        <div className="package-form">
            {(sidebarState === 'download') && (
                <div className={'package-contents' + (isLoading ? ' loading-screen' : '')}>
                    <Typography className="inline" variant="h5">{isBundling ? 'Generating download bundle...' : 'Download your data'}</Typography>
                    {(dataResponse.length > 0) && !isLoading ?
                        (
                            <div>
                                <span>(estimated bundle size {bytesToGBOrMB(totalDataSize)})</span>
                                <IconButton className="inline float-right" sx={{ mt: '-8px' }} onClick={() => createZip(downloadLinks, '')}>
                                    <Tooltip
                                        TransitionComponent={Fade}
                                        TransitionProps={{ timeout: 600 }}
                                        title="Download All Results"
                                    >
                                        <DownloadOutlinedIcon />
                                    </Tooltip>
                                </IconButton>

                                {dataResponse.map((item) => (
                                    <div className="container container--white" key={item.model + '.' + item.scenario + '.' + item.countyname}>
                                        <Typography variant="h5">Model</Typography>
                                        {item.model}

                                        <div className="option-group">
                                            <Typography variant="h5">Scenario</Typography>
                                            {lookupValue(item.scenario, scenariosLookupTable)}
                                        </div>

                                        <div className="option-group">
                                            <Typography variant="h5">Boundary</Typography>
                                            {item.countyname}
                                        </div>

                                        <div className="option-group variables-group">
                                            {
                                                <IconButton className="inline float-right" sx={{ mt: '-8px' }} onClick={() => createZip(genVarsLinks(item.vars), ('variables-' + item.scenario + '-' + item.model))}>
                                                    <Tooltip
                                                        TransitionComponent={Fade}
                                                        TransitionProps={{ timeout: 600 }}
                                                        title="Download All Variables"
                                                    >
                                                        <DownloadOutlinedIcon />
                                                    </Tooltip>
                                                </IconButton>
                                            }
                                            <Typography variant="h5">Metrics</Typography>
                                            {(item.vars.length > 0) && (
                                                <DataResultsTable varsResData={item.vars} selectedVars={selectedVars}></DataResultsTable>
                                            )}
                                        </div>
                                    </div>
                                ))}



                                {isPackageStored && sidebarState == 'download' &&
                                    <div className="bottom-actions">
                                        <Tooltip
                                            TransitionComponent={Fade}
                                            TransitionProps={{ timeout: 600 }}
                                            title="Delete stored data package"
                                        >
                                            <IconButton onClick={() => handleLocalPackageClear()}>
                                                <DeleteOutlineIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip
                                            TransitionComponent={Fade}
                                            TransitionProps={{ timeout: 600 }}
                                            title="Review your package settings"
                                        >
                                            <IconButton onClick={() => (setSidebarState('settings'))}>
                                                <UndoOutlinedIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                }
                            </div>
                        ) : <LoadingSpinner />}
                </div>
            )}
            {sidebarState === 'settings' && (
                <form onSubmit={handleSubmit} noValidate>
                    <div className="package-contents">
                        <Typography variant="h5">
                            Review Your Data Package
                        </Typography>

                        <div className="container container--white">
                            <div className="option-group">
                                <div className="option-group__title">
                                    <Typography variant="body2">Dataset</Typography>
                                    <HtmlTooltip
                                        textFragment={
                                            <React.Fragment>
                                                <p>LOCA2 (Localized Constructed Analogs) hybrid-statistically downscaled CMIP6 climate projections</p>
                                            </React.Fragment>
                                        }
                                        iconFragment={<InfoOutlinedIcon />}
                                        TransitionComponent={Fade}
                                        TransitionProps={{ timeout: 600 }}
                                        placement="right-end"
                                    />
                                </div>
                                <p>{localPackageSettings.dataset}</p>
                            </div>
                        </div>

                        <div className="container container--white">
                            <div className="option-group">
                                <div className="option-group__title">
                                    <Typography variant="body2">Frequency</Typography>
                                    <HtmlTooltip
                                        textFragment={
                                            <React.Fragment>
                                                <p>The timescale of the data. All LOCA2 data is downscaled at a native daily resolution. A pre-aggregated version at a monthly resolution is also available</p>
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
                                        value={selectedFrequency}
                                        onChange={(event: any) => {
                                            setSelectedFrequency(event.target.value as string)
                                        }}
                                        MenuProps={MenuProps}
                                        sx={{ mt: '15px', width: '380px' }}

                                    >
                                        {frequenciesList.map((frequency) => (
                                            <MenuItem key={frequency} value={frequency}>
                                                <ListItemText primary={frequency} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {formErrorState.models && <div>One or more models need to be selected in order to continue</div>}
                                </FormControl>
                            </div>

                        </div>


                        <div className="container container--white">
                            <div className="option-group">
                                <div className="option-group__title">
                                    <Typography variant="body2">Scenarios</Typography>
                                    <HtmlTooltip
                                        textFragment={
                                            <React.Fragment>
                                                <p>Shared Socioeconomic Pathways <a style={{ 'textDecoration': 'underline' }} href="https://www.ipcc-data.org/guidelines/pages/gcm_guide.html" target="_blank">(GCMs)</a> from the <a style={{ 'textDecoration': 'underline' }} href="https://www.carbonbrief.org/explainer-how-shared-socioeconomic-pathways-explore-future-climate-change/" target="_blank">(SSPs)</a> describe potential pathways the world could take</p>
                                                <ul style={{ 'marginLeft': '10px', 'marginTop': '10px' }}>
                                                    <li>SSP2-4.5: a middle of the road global emissions scenario</li>
                                                    <li>SSP3-7.0: high global emissions scenario</li>
                                                    <li>SSP5-8.5: very high global emissions scenario</li>
                                                </ul>
                                            </React.Fragment>
                                        }
                                        iconFragment={<InfoOutlinedIcon />}
                                        TransitionComponent={Fade}
                                        TransitionProps={{ timeout: 600 }}
                                        placement="right-end"
                                    />
                                </div>
                                <Autocomplete
                                    multiple
                                    value={selectedScenarios}
                                    onChange={(event: any, newValue: string[]) => {
                                        setSelectedScenarios(newValue)
                                    }}
                                    id="scenarios"
                                    options={scenariosList}
                                    filterSelectedOptions
                                    renderOption={(props, option) => {
                                        return (
                                            <li {...props} key={option}>
                                                {lookupValue(option, scenariosLookupTable)}
                                            </li>
                                        )
                                    }}
                                    renderTags={(tagValue, getTagProps) => {
                                        return tagValue.map((option, index) => (
                                            <Chip {...getTagProps({ index })} key={option} label={lookupValue(option, scenariosLookupTable)} />
                                        ))
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            placeholder="Search..."
                                            error={formErrorState.scenarios}
                                            helperText={formErrorState.scenarios ? 'One or more scenarios need to be selected in order to continue' : ''}
                                        />
                                    )}
                                    sx={{ mt: '15px', width: '380px' }}

                                />
                            </div>
                        </div>

                        <div className="container container--white">
                            <div className="option-group">
                                <div className="option-group__title">
                                    <Typography variant="body2">Models</Typography>
                                    <HtmlTooltip
                                        textFragment={
                                            <React.Fragment>
                                                <p>Global Circulation Models <a style={{ 'textDecoration': 'underline' }} href="https://www.ipcc-data.org/guidelines/pages/gcm_guide.html" target="_blank">(GCMs)</a> from the <a style={{ 'textDecoration': 'underline' }} href="https://esgf-node.llnl.gov/projects/cmip6/" target="_blank">Coupled Model Intercomparison Project, Phase 6</a> represent physical processes in the atmosphere, ocean, cryosphere, and land surface.
                                                    For guidance on how to select models, please refer to the upcoming guidance page on the Analytics Engine. </p>
                                            </React.Fragment>
                                        }
                                        iconFragment={<InfoOutlinedIcon />}
                                        TransitionComponent={Fade}
                                        TransitionProps={{ timeout: 600 }}
                                        placement="right-end"
                                    />
                                </div>
                                <FormControl error={formErrorState.models}>
                                    <Select
                                        multiple
                                        value={isAllModelsSelected.current ? ['all'] : modelsSelected}
                                        onChange={handleModelsChange}
                                        renderValue={(selected) => (isAllModelsSelected.current ? 'All Available' : (selected as string[]).join(', '))}
                                        MenuProps={MenuProps}
                                        sx={{ mt: '15px', width: '380px' }}

                                    >
                                        <MenuItem value="all">
                                            <Checkbox checked={isAllModelsSelected.current} />
                                            Select All
                                        </MenuItem>
                                        <ListSubheader>General Use</ListSubheader>
                                        {genUseModelsList.map((model) => (
                                            <MenuItem key={model} value={model}>
                                                <Checkbox checked={modelsSelected.includes(model)} />
                                                <ListItemText primary={model} />
                                            </MenuItem>
                                        ))}
                                        <ListSubheader>Not General Use</ListSubheader>
                                        {modelsList.map((model) => (
                                            !genUseModelsList.includes(model) &&
                                            <MenuItem key={model} value={model}>
                                                <Checkbox checked={modelsSelected.includes(model)} />
                                                <ListItemText primary={model} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {formErrorState.models && <div>One or more models need to be selected in order to continue</div>}
                                </FormControl>
                            </div>
                        </div>

                        <div className="container container--white">
                            <div className="option-group">
                                <div className="option-group__title">
                                    <Typography variant="body2">Metric(s)</Typography>
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
                                <Autocomplete
                                    multiple
                                    value={selectedVars}
                                    onChange={(event: any, newValue: string[]) => {
                                        setSelectedVars(newValue)
                                    }}
                                    id="variables"
                                    options={varsList}
                                    filterSelectedOptions
                                    renderOption={(props, option) => {
                                        return (
                                            <li {...props} key={option}>
                                                {/*option*/}
                                                {lookupValue(option, variablesLookupTable)}
                                            </li>
                                        )
                                    }}
                                    renderTags={(tagValue, getTagProps) => {
                                        return tagValue.map((option, index) => (
                                            <Chip {...getTagProps({ index })} key={option} label={lookupValue(option, variablesLookupTable)} />
                                        ))
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            placeholder="Search..."
                                            error={formErrorState.vars}
                                            helperText={formErrorState.vars ? 'One or more variables need to be selected in order to continue' : ''}
                                        />
                                    )}
                                    sx={{ mt: '15px', width: '380px' }}

                                />
                            </div>
                        </div>

                        <div className="container container--white">
                            <div className="option-group">
                                <div className="option-group__title">
                                    <Typography variant="body2">Spatial Extent</Typography>
                                    <HtmlTooltip
                                        textFragment={
                                            <React.Fragment>
                                                <p>Data is natively represented in 3km grids. Selecting a boundary layer (e.g. county), provides data for grid cells that are intersected by the boundary file.</p>
                                            </React.Fragment>
                                        }
                                        iconFragment={<InfoOutlinedIcon />}
                                        TransitionComponent={Fade}
                                        TransitionProps={{ timeout: 600 }}
                                        placement="right-end"
                                    />
                                </div>
                            </div>

                            <div className="option-group">
                                <Typography variant="body2">Type</Typography>
                                {localPackageSettings.boundaryType}
                            </div>

                            <div>
                                <Typography variant="body2">Counties</Typography>

                                <Autocomplete
                                    multiple
                                    value={selectedCounties}
                                    onChange={(event: any, newValue: string[]) => {
                                        setSelectedCounties(newValue)
                                    }}
                                    id="counties"
                                    options={countiesList}
                                    filterSelectedOptions
                                    renderOption={(props, option) => {
                                        return (
                                            <li {...props} key={option}>
                                                {option}
                                            </li>
                                        )
                                    }}
                                    renderTags={(tagValue, getTagProps) => {
                                        return tagValue.map((option, index) => (
                                            <Chip {...getTagProps({ index })} key={option} label={option} />
                                        ))
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            placeholder="Search..."
                                            error={formErrorState.counties}
                                            helperText={formErrorState.counties ? 'One or more counties need to be selected in order to continue' : ''}
                                        />
                                    )}
                                    sx={{ mt: '15px', width: '380px' }}

                                />
                            </div>

                        </div>

                        <div className="container container--white">
                            <div className="option-group">
                                <div className="option-group__title">
                                    <Typography variant="body2">Time Frame</Typography>
                                    <HtmlTooltip
                                        textFragment={
                                            <React.Fragment>
                                                <p>Data is available over the time period 1950-2100.</p>
                                            </React.Fragment>
                                        }
                                        iconFragment={<InfoOutlinedIcon />}
                                        TransitionComponent={Fade}
                                        TransitionProps={{ timeout: 600 }}
                                        placement="right-end"
                                    />
                                </div>
                                <p>{localPackageSettings.rangeStart} - {localPackageSettings.rangeEnd}</p>
                            </div>
                        </div>

                        <div className="container container--white">
                            <div className="option-group">
                                <div className="option-group__title">
                                    <Typography variant="body2">Data Format</Typography>
                                    <HtmlTooltip
                                        textFragment={
                                            <React.Fragment>
                                                <p><a style={{ 'textDecoration': 'underline' }} href="https://www.unidata.ucar.edu/software/netcdf/" target="_blank">NetCDF (Network Common Data Form)</a> is a machine-independent data array-oriented format for scientific data.</p>
                                            </React.Fragment>
                                        }
                                        iconFragment={<InfoOutlinedIcon />}
                                        TransitionComponent={Fade}
                                        TransitionProps={{ timeout: 600 }}
                                        placement="right-end"
                                    />
                                </div>
                                <p>{localPackageSettings.dataFormat}</p>
                            </div>
                        </div>

                        <div className="cta">
                            <Button onClick={() => {
                                handleSubmit()
                            }} variant="contained" color="secondary">Download your data</Button>
                        </div>
                    </div>
                </form>
            )}
        </div>
    )
}

export default PackageForm
