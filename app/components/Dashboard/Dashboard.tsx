'use client'

import Image from 'next/image'
import packageIcon from '@/public/img/icons/package.svg'
import sidebarBg from '@/public/img/photos/ocean-thumbnail.png'
import logo from '@/public/img/logos/cal-adapt-data-download.png'

import { useState, useEffect, Dispatch, SetStateAction, useRef } from "react"

import Alert from '@mui/material/Alert';
import Autocomplete from '@mui/material/Autocomplete';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import CloseIcon from '@mui/icons-material/Close';
import CssBaseline from '@mui/material/CssBaseline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Drawer from '@mui/material/Drawer';
import { FabPropsVariantOverrides, FormControl } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import StartIcon from '@mui/icons-material/Start';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import UndoOutlinedIcon from '@mui/icons-material/UndoOutlined';


import SidePanel from './SidePanel'
import PackageForm from './PackageForm'
import './../../styles/components/dashboard.scss'

import { stringToArray, arrayToCommaSeparatedString } from "@/app/utils/utilFn"

const DRAWER_WIDTH = 212;
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

type varUrl = {
    name: string,
    href: string
}

type modelVarUrls = {
    model: string,
    vars: varUrl[]
}

interface apiParamStrs {
    countyQueryStr: string,
    modelQueryStr: string
}

function createOrStatement(parameterName: string, values: string[]): string {
    if (values.length === 0) {
        throw new Error('Values array must not be empty');
    }

    const orStatements = values.map(value => `${parameterName}='${value}'`);
    const fullOrStatement = orStatements.join(' or ');

    return `(${fullOrStatement})`;
}

export default function Dashboard({ data, packagesData }) {
    const [dataResponse, setDataResponse] = useState<modelVarUrls[]>([])

    const [apiParams, setApiParams] = useState<apiParamStrs>({
        countyQueryStr: '',
        modelQueryStr: ''
    })
    const [apiParamsChanged, setApiParamsChanged] = useState<boolean>(false)
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return
        }
        // Check if API parameters have changed
        setApiParamsChanged(true)
        setDataResponse([]) // Clear previous data

    }, [apiParams]);


    const onFormDataSubmit = async () => {


        const apiUrl = 'https://r0e5qa3kxj.execute-api.us-west-2.amazonaws.com/search';
        const queryParams = new URLSearchParams({
            limit: '10',
            filter: "collection='loca2-mon-county' AND cmip6:experiment_id='ssp370' AND " + apiParams?.countyQueryStr + " AND " + apiParams?.modelQueryStr,
            filter_lang: 'cql2-text',
        });

        const fullUrl = `${apiUrl}?${queryParams.toString()}`;
        if (apiParamsChanged) {
            try {

                const res = await fetch(fullUrl)
                const data = await res.json()

                console.log(data)

                const apiResponseData: modelVarUrls[] = []

                for (const modelIdx in data.features) {
                    const assets = data.features[modelIdx].assets

                    const varsInModel: modelVarUrls = {
                        model: '',
                        vars: []
                    }

                    for (const asset in assets) {
                        const varInVars: varUrl = {
                            name: '',
                            href: ''
                        }

                        varInVars.name = asset
                        varInVars.href = assets[asset].href
                        varsInModel.vars.push(varInVars)
                    }

                    varsInModel.model = data.features[modelIdx].id
                    apiResponseData.push(varsInModel)
                }

                setDataResponse(apiResponseData)
            } catch (err) {
                console.log(err)
            }
            setApiParamsChanged(false)
        }
    }

    type SetValue<T> = Dispatch<SetStateAction<T>>;

    const isFirstRender = useRef(true)
    const [isSidePanelOpen, setSidePanelOpen] = useState<boolean>(false)
    const [overwriteDialogOpen, openOverwriteDialog] = useState<boolean>(false)
    const [availableVars, setAvailableVars] = useState<any>([])
    const [tentativePackage, setTentativePackage] = useState<number>(0)
    const [sidebarState, setSidebarState] = useState<string>('')
    const [isError, setIsError] = useState(false);

    function resetStateToSettings(): void {
        setSidebarState('settings')
    }

    // Code for climate variables / indicators
    const varsList: string[] = (data.summaries['cmip6:variable_id']).map((obj) => obj)
    const [selectedVars, setSelectedVars] = useState<any>([])
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return
        }
        const selectedVarsStr = arrayToCommaSeparatedString(selectedVars)
        setPackageSettings({
            ...localPackageSettings,
            vars: selectedVarsStr
        })
    }, [selectedVars])
    // End of code for climate variables / indicators

    // Code for counties
    const countiesList: string[] = (data.summaries['countyname']).map((obj) => obj)

    const [selectedCounties, setSelectedCounties] = useState<any>([])
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return
        }

        if (selectedCounties.length > 0) {
            const updatedApiParam: apiParamStrs = {
                ...apiParams,
                countyQueryStr: createOrStatement('countyname', selectedCounties)
            }

            setApiParams(updatedApiParam)


            const selectedCountiesStr = arrayToCommaSeparatedString(selectedCounties)
            setPackageSettings({
                ...localPackageSettings,
                boundaries: selectedCountiesStr
            })
        }
    }, [selectedCounties])

    // End of code for climate variables / indicators

    // Variables that are stored in local state
    function useLocalStorageState<T>(
        key: string,
        initialValue: T
    ): [T, SetValue<T>] {

        // Get initial value from local storage or use the provided initial value
        const storedValue = typeof window !== 'undefined' ? localStorage.getItem(key) : null
        const initial = storedValue ? JSON.parse(storedValue) : initialValue

        // Set up state to manage the value
        const [value, setValue] = useState<T>(initial);

        // Update local storage when the state changes
        useEffect(() => {
            localStorage.setItem(key, JSON.stringify(value));
        }, [key, value]);

        return [value, setValue];
    }

    const [selectedPackage, setSelectedPackage] = useLocalStorageState<number>('selectedPackage', 0)
    const [localPackageSettings, setPackageSettings] = useLocalStorageState('package', {
        dataset: '',
        scenarios: '',
        models: '',
        vars: '',
        boundaryType: '',
        boundaries: '',
        frequency: '',
        dataFormat: '',
        rangeStart: '',
        rangeEnd: '',
        units: ''
    })
    const [isPackageStored, setIsPkgStored] = useLocalStorageState<boolean>('isPackageStored', false)

    // Configurations for Models Select field dropdown
    const MenuProps = {
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
    };

    const modelsList: string[] = (data.summaries['cmip6:source_id']).map((obj) => obj)

    const [modelsSelected, setModelsSelected] = useState<any>([])
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return
        }

        if (modelsSelected.length > 0) {
            const updatedApiParam: apiParamStrs = {
                ...apiParams,
                modelQueryStr: createOrStatement('cmip6:source_id', modelsSelected)
            }

            setApiParams(updatedApiParam)


            const selectedModelsStr = arrayToCommaSeparatedString(modelsSelected)

            setPackageSettings({
                ...localPackageSettings,
                models: selectedModelsStr
            })
        }
    }, [modelsSelected])


    // End of configurations for Models Select field dropdown

    function handlePackageSave() {
        setPackageSettings({
            dataset: packagesData[selectedPackage].dataset,
            scenarios: packagesData[selectedPackage].scenarios,
            models: packagesData[selectedPackage].models,
            vars: packagesData[selectedPackage].vars,
            boundaryType: packagesData[selectedPackage].boundaryType,
            boundaries: '',
            frequency: packagesData[selectedPackage].frequency,
            dataFormat: packagesData[selectedPackage].dataFormat,
            rangeStart: packagesData[selectedPackage].rangeStart,
            rangeEnd: packagesData[selectedPackage].rangeEnd,
            units: packagesData[selectedPackage].units
        })

        setSelectedVars(stringToArray(packagesData[selectedPackage].vars))
        setModelsSelected(stringToArray(packagesData[selectedPackage].models))
        setSelectedCounties([])
        setIsPkgStored(true)
        toggleDrawer(true)
    }

    function selectPackageToSave(id: number) {
        setTentativePackage(id)

        if (isPackageStored) {
            openOverwriteDialog(true)
        } else {
            setSelectedPackage(tentativePackage)
            handlePackageSave()
        }
    }

    function handleOverwriteDialog(overwrite: boolean) {
        if (overwrite) {
            // package should be overwritten
            openOverwriteDialog(false)
            setSelectedPackage(tentativePackage)
            handlePackageSave()
        } else {
            openOverwriteDialog(false)
            setTentativePackage(0)
        }
    }

    function handleClear() {
        if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.clear()
            setIsPkgStored(false)
        }
    }

    function toggleDrawer(open: boolean) {
        setSidePanelOpen(open);
    }

    // useEffect for component
    useEffect(() => {
        setAvailableVars(stringToArray(packagesData[0].vars))
        setSelectedVars(stringToArray(localPackageSettings.vars))
        setModelsSelected(localPackageSettings.models.length > 0 ? stringToArray(localPackageSettings.models) : [])
        setSelectedCounties(localPackageSettings.boundaries ? stringToArray(localPackageSettings.boundaries) : [])
        setSidebarState('settings')
    }, [])

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{ width: `calc(100% - ${DRAWER_WIDTH}px)`, ml: `${DRAWER_WIDTH}px`, backgroundColor: `#fffff`, boxShadow: `none`, borderBottom: `1px solid #e8e8e8` }}
            >
                <Toolbar className="toolbar-main" sx={{ justifyContent: `space-between` }}>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link underline="hover" color="inherit" href="/">
                            Dashboard
                        </Link>
                        <Typography color="text.primary">Getting Started</Typography>
                    </Breadcrumbs>
                    <IconButton onClick={() => toggleDrawer(true)}>
                        <Image
                            src={packageIcon}
                            alt="Package icon that you can click on to see your current data package"
                        />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Drawer
                sx={{
                    width: DRAWER_WIDTH,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: DRAWER_WIDTH,
                        boxSizing: 'border-box',
                        backgroundImage: `url(${sidebarBg.src})`,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        border: "none",
                    },
                }}
                variant="permanent"
                anchor="left"
            >
                <Toolbar>
                    <Image
                        src={logo}
                        alt="Cal Adapt logo"
                        className="cal-adapt-logo"
                    />
                </Toolbar>


                <List sx={{
                    '& .MuiListItemIcon-root': {
                        color: '#000',
                    },
                    // selected and (selected + hover) states
                    '&& .Mui-selected, && .Mui-selected:hover': {
                        bgcolor: 'rgba(247, 249, 251, 0.9)'
                    },
                    // hover states
                    '& .MuiListItemButton-root:hover': {
                        bgcolor: 'rgba(247, 249, 251, 0.6)',
                        borderRadius: '12px'
                    },
                }}>
                    {['Getting Started'].map((text, index) => (
                        <ListItem key={text} disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    <StartIcon />
                                </ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            <Box
                component="main"
                sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, pt: "200px" }}
            >
                <Toolbar />

                <div className="alerts">
                    <Alert variant="link-purple">Looking for the full LOCA2 scientific data, including 15 GCM’s and 10 climate variables?
                        <div className="cta">
                            <Button variant="contained">Click Here for the How-To-Guide</Button>
                        </div>
                    </Alert>
                    <Alert variant="link-grey">The Cal-Adapt data download tool is a beta tool. Feedback or questions are always welcome.
                        <div className="cta">
                            <Button variant="contained">Contact Us</Button>
                        </div>
                    </Alert>
                </div>

                <Alert sx={{ mb: "26px" }} variant="filled" severity="info">The size of data packages might be very large. In that case, you will be asked for an email address to notify you when your package is ready for download. </Alert>

                {/** Packages container */}
                <div className="container container--full">
                    <Typography variant="h5">
                        Data Packages
                    </Typography>
                    <Typography variant="body1">
                        Select a data package preset from the options listed below
                    </Typography>
                    <div className="grid">
                        <div className="package container container--package">
                            <Typography className="package__name" variant="h6">
                                {packagesData[0].name}
                            </Typography>
                            <ul className="package__settings">
                                <li><Typography variant="body2">Boundary Type:</Typography> {packagesData[0].boundaryType}</li>
                                <li><Typography variant="body2">Dataset:</Typography> {packagesData[0].dataset}</li>
                                <li><Typography variant="body2">Range:</Typography> {packagesData[0].rangeStart} - {packagesData[0].rangeEnd}</li>
                                <li><Typography variant="body2">Frequency:</Typography> {packagesData[0].frequency}</li>
                                <li><Typography variant="body2">Data Format:</Typography> {packagesData[0].dataFormat}</li>
                                <li><Typography variant="body2">Units:</Typography> {packagesData[0].units}</li>
                            </ul>
                            <Button onClick={() => selectPackageToSave(0)} variant="contained">Customize and download</Button>
                        </div>
                    </div>
                </div>

                {/** Confirm package overwrite dialog */}
                <Dialog
                    open={overwriteDialogOpen}
                    onClose={() => handleOverwriteDialog(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {"Confirm package overwrite"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            If you proceed, the current package data that is saved will be overwritten by the package that you're selecting
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => handleOverwriteDialog(false)}>Cancel</Button>
                        <Button onClick={() => handleOverwriteDialog(true)} autoFocus>
                            Confirm
                        </Button>
                    </DialogActions>
                </Dialog>

                {/** Sidepanel */}
                <SidePanel
                    anchor="right"
                    variant="temporary"
                    open={isSidePanelOpen}
                    onClose={() => toggleDrawer(false)}
                >
                    <IconButton onClick={() => toggleDrawer(false)}>
                        <CloseIcon />
                    </IconButton>

                    {isPackageStored &&
                        <IconButton onClick={() => handleClear()}>
                            <DeleteOutlineIcon />
                        </IconButton>
                    }

                    {sidebarState == 'download' &&
                        <IconButton onClick={() => (resetStateToSettings())}>
                            <UndoOutlinedIcon />
                        </IconButton>
                    }


                    {isPackageStored &&
                        <PackageForm localPackageSettings={localPackageSettings} sidebarState={sidebarState} setSidebarState={setSidebarState} setPackageSettings={setPackageSettings} modelsSelected={modelsSelected} setModelsSelected={setModelsSelected} modelsList={modelsList} selectedVars={selectedVars} setSelectedVars={setSelectedVars} varsList={varsList} selectedCounties={selectedCounties} setSelectedCounties={setSelectedCounties} countiesList={countiesList} onFormDataSubmit={onFormDataSubmit} dataResponse={dataResponse} handleClear={handleClear}></PackageForm>
                    }

                    {!isPackageStored &&
                        <Typography variant="h5">
                            No package available...
                        </Typography>
                    }
                </SidePanel>
            </Box>
        </Box>
    );
}