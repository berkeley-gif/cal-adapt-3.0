'use client'
import * as React from 'react'
import Image from 'next/image'

import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Accordion, {
    AccordionSlots,
    accordionClasses,
} from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails, {
    accordionDetailsClasses,
} from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Fade from '@mui/material/Fade';

import '@/app/styles/home/footer.scss'

import gifLogo from '@/public/img/logos/gif.svg'
import eagleRockLogo from '@/public/img/logos/eagle-rock.svg'
import BerkeleyLabLogo from '@/public/img/logos/berkeley-lab.jpg'
import cecLogo from '@/public/img/logos/cec.svg'

function Footer() {
    const [expanded, setExpanded] = React.useState(false);

    const handleExpansion = () => {
        setExpanded((prevExpanded) => !prevExpanded);
    };
    return (
        <div className="footer">
            <div className="footer__left">
                <Typography variant="body1">Cal-Adapt was developed by Eagle Rock Analytics and the Geospatial Innovation Facility at the University of California, Berkeley, with support from the Lawrence Berkeley National Lab. The California Energy Commission provided funding and advisory oversight.</Typography>
                <div className="logos">
                    <Image width={165} src={gifLogo} alt="Geospatial Innovation Facility Logo" />
                    <Image width={165} src={eagleRockLogo} alt="Eagle Rock Analytics Logo" />
                    <Image width={100} src={BerkeleyLabLogo} alt="Berkeley Lab Logo" />
                    <Image width={100} src={cecLogo} alt="California Energy Commision Logo" />
                </div>
            </div>
            <div className="footer__right">
                <Accordion
                    elevation={0}
                    expanded={expanded}
                    onChange={handleExpansion}
                    slots={{ transition: Fade as AccordionSlots['transition'] }}
                    slotProps={{ transition: { timeout: 500 } }}
                    sx={[{
                        backgroundColor: 'transparent',
                        color: '#fff',
                        boxShadow: 'none',
                        flex: 'start',
                        '&::before': {
                            display: 'none', // remove the default divider line
                        },
                        [`& .${accordionClasses.root}`]: {
                            backgroundColor: 'transparent',
                        },
                        [`& .MuiAccordionSummary-root`]: {
                            backgroundColor: 'transparent',
                        },
                        [`& .MuiAccordionDetails-root`]: {
                            backgroundColor: 'transparent',
                        },
                    },
                    expanded
                        ? {
                            [`& .${accordionClasses.region}`]: {
                                height: 'auto',
                            },
                            [`& .${accordionDetailsClasses.root}`]: {
                                display: 'block',
                            },
                        }
                        : {
                            [`& .${accordionClasses.region}`]: {
                                height: 0,
                            },
                            [`& .${accordionDetailsClasses.root}`]: {
                                display: 'none',
                            },
                        },
                    ]}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon sx={{ color: 'white', fontSize: '1.5rem' }} />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                        sx={{
                            justifyContent: 'left',
                            minHeight: '25px',
                            paddingLeft: 0,
                            paddingRight: 0,
                            '&.Mui-expanded': {
                                minHeight: '25px',
                                height: '25px',
                            },
                            '& .MuiAccordionSummary-content': {
                                margin: 0,
                                width: 'auto', // <-- prevents stretching!
                                flexGrow: 0,    // <-- keeps it tight to content
                                alignItems: 'right',
                            },
                            '& .MuiAccordionSummary-expandIconWrapper': {
                                color: 'white',
                                marginLeft: '4px', // optional fine-tuning
                            },
                        }}
                    >
                        <Typography component="span" variant="caption" sx={{ fontSize: '16px' }}>Our Tools</Typography>

                    </AccordionSummary>
                    <AccordionDetails>
                        <ul style={{ fontSize: '14px' }}>
                            <li >Data Explorer</li>
                            <li>Renewables Visualizer</li>
                            <li>Data Download Tool</li>
                            <li>Analytics Engine</li>
                        </ul>
                    </AccordionDetails>
                </Accordion>
                <Typography variant="caption" sx={{ fontSize: '16px' }}>Legacy Cal-Adapt</Typography>
                <Typography variant="caption" sx={{ fontSize: '16px' }}>Climate Guidance</Typography>
                <Typography variant="caption" sx={{ fontSize: '16px' }}>Contact Us</Typography>
            </div>
        </div>
    )
}

export default Footer