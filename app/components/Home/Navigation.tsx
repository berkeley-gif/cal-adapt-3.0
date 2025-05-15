'use client'
import * as React from 'react'
import { useState, useEffect, useRef } from 'react'

import Image from 'next/image'

import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuIcon from '@mui/icons-material/Menu'
import Container from '@mui/material/Container'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import MenuItem from '@mui/material/MenuItem'
import AdbIcon from '@mui/icons-material/Adb'
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard'

import logo from '@/public/img/logos/cal-adapt-data-download.png'

const leftMenuItems = [
    {
        label: 'Tools',
        icon: <SpaceDashboardIcon sx={{ mr: 1 }} />
    },
    { label: 'Data' }
]

const rightMenuItems = [
    { label: 'Guidance' },
    { label: 'Legacy Cal-Adapt' }
]

function Navigation() {
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null)

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget)
    }
    const handleCloseNavMenu = () => {
        setAnchorElNav(null)
    }

    return (
        <AppBar style={{ position: 'absolute', zIndex: 3, top: 0}} position="static" color="transparent" elevation={0}>
            <Container maxWidth={false} disableGutters>
                <Toolbar disableGutters sx={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    // Desktop: center the three boxes, with a 32px gap between each
                    justifyContent: { xs: 'center', md: 'center' },
                    gap: { md: 16 },       // md: 4 * 8px = 32px gap
                    height: 64
                }}>
                    <Box sx={{
                        display: { xs: 'flex', md: 'none' },
                        position: 'absolute',
                        left: 16,
                        top: '50%',
                        transform: 'translateY(-50%)'
                    }}>
                        <IconButton
                            size="large"
                            aria-label="mobile menu"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            disableScrollLock
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{ display: { xs: 'block', md: 'none' } }}
                        >
                            {[...leftMenuItems, ...rightMenuItems].map((item) => (
                                <MenuItem key={item.label} onClick={handleCloseNavMenu}>
                                    <Typography variant="overline" sx={{ textAlign: 'center' }}>{item.label}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>

                    {/* Left menu items */}
                    <Box sx={{
                        display: {
                            xs: 'none', md: 'flex'
                        },
                        gap: 2,
                        alignItems: 'center'
                    }}>
                        {leftMenuItems.map(({ label, icon }) => (
                            <Button onClick={handleCloseNavMenu} key={label} sx={{ color: 'white', display: 'flex', alignItems: 'center' }}>
                                {icon}
                                <Typography variant="overline">
                                    {label}
                                </Typography>

                            </Button>
                        ))}
                    </Box>

                    {/* Center logo */}
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                    }}>
                        <Image src={logo} alt="Cal Adapt California state logo" style={{ height: '40px' }} />
                    </Box>

                    {/* Right menu items */}
                    <Box sx={{
                        display: { xs: 'none', md: 'flex' },
                        alignItems: 'center',
                        gap: 2
                    }}>
                        {rightMenuItems.map(({ label }) => (
                            <Button key={label} sx={{ color: 'white', display: 'flex', alignItems: 'center' }}>
                                <Typography variant="overline">
                                    {label}
                                </Typography>
                            </Button>
                        ))}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    )
}

export default Navigation