// DataResultsTable
// Displays a filtered table of variables matching the user's selection.
// Each row shows the human-readable variable name and a download button for that variable.

// --- React imports ---
import React, { useState, useEffect } from 'react'

// --- Material UI imports ---
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { Button } from '@mui/material'

// --- Local imports ---
import { searchObject, handleDownload } from '@/app/utils/functions'
import { variablesLookupTable, lookupValue } from '@/app/utils/lookupTables'

// --- Types and interfaces ---
// Props passed to the DataResultsTable component
interface Variable {
    name: string
    href: string
    [key: string]: any // if needed
}

interface DataResultsProps {
    varsResData: Variable[] // Array of variable objects from the API
    selectedVars: string[] // List of variable names selected by the user
}

// --- Component function ---
const DataResultsTable: React.FC<DataResultsProps> = ({ varsResData, selectedVars }) => {
    const filteredVars = varsResData.filter(variable =>
        searchObject(selectedVars, variable.name)
    )

    return (
        <TableContainer sx={{ mt: '15px', p: '20px', backgroundColor: '#f7f9fb', borderRadius: '7px', boxShadow: 'none' }} component={Paper}>
            <Table aria-label="Data Results table">
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell align="right">Single variable</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredVars.map(variable => (
                        <TableRow
                            key={variable.name}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {lookupValue(variable.name, variablesLookupTable)}
                            </TableCell>
                            <TableCell align="right">
                                <Button variant="contained" color="primary" onClick={() => { handleDownload(variable.href) }}>
                                    Download
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default DataResultsTable