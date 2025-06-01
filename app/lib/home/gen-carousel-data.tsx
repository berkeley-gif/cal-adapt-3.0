import type { CarouselData } from "@/app/components/Home/ToolCarousel"

export const genCarouselData: CarouselData [] = [
    {
        id: 1,
        title: 'Extreme heat days',
        description: 'A great two sentence description of this tool. Here is a second sentence to add even more context',
        image: '/img/homepage-carousels/extreme-heat.png',
        imageAlt: 'A California road on a sunny day',
        link: '/dashboard/data-explorer?metric=extreme-heat'
    },
    {
        id: 2,
        title: 'Availability of renewable resources',
        description: 'Preview for renewables',
        image: '/img/homepage-carousels/renewables.png',
        imageAlt: 'Wind turbines to represent renewable data visualization',
        link: '/dashboard/solar-drought-visualizer'
    },
    {
        id: 3,
        title: 'Fire weather risk',
        description: 'Preview for fire weather risk',
        image: '/img/homepage-carousels/renewables.png',
        imageAlt: 'Wind turbines to represent renewable data visualization',
        link: '/dashboard/data-explorer?metric=fire-weather'
    },
    {
        id: 4,
        title: 'Extreme precipitation',
        description: 'Preview for extreme precipitation',
        image: '/img/homepage-carousels/renewables.png',
        imageAlt: 'Wind turbines to represent renewable data visualization',
        link: '/dashboard/data-explorer?metric=extreme-precipitation'
    },
    {
        id: 5,
        title: 'CMIP6 data packages',
        description: 'Preview for data download',
        image: '/img/homepage-carousels/renewables.png',
        imageAlt: 'Wind turbines to represent renewable data visualization',
        link: '/dashboard/data-download-tool'
    },
]