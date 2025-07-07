// SidePanel
// Reusable side panel component for the Cal-Adapt dashboard.
// Wraps Material UI's Drawer with consistent styling and layout for sidebar content.

// --- React imports ---
import React from 'react'

// --- Material UI imports ---
import Drawer, { DrawerProps } from '@mui/material/Drawer'

// --- Local imports ---
import '@/app/styles/dashboard/sidepanel.scss'

// --- Types and interfaces ---

// Props passed to the SidePanel component
interface SidePanelProps extends DrawerProps {
    classes?: Record<string, string>; // Optional class overrides
    children: React.ReactNode;  // Content to be rendered inside the panel
}

// --- Component function ---
const SidePanel: React.FC<SidePanelProps> = (props) => {
    return (
        <Drawer PaperProps={{
            sx: {
                backgroundColor: "#F7F9FB"
            },
            className: "sidepanel"
        }}

            {...props}>
            <div tabIndex={0}>{props.children}</div>
        </Drawer >
    )
}

export default SidePanel
