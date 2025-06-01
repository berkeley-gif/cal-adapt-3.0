'use client'
import * as React from 'react'
import { useEffect, useState, useRef } from 'react'

import '@/app/styles/home/tool-carousel.scss'

const data = [
    { id: 1, title: 'Extreme heat days', description: 'Preview for heat days 🔥', image: 'https://via.placeholder.com/400x200?text=Heat' },
    { id: 2, title: 'Availability of renewable resources', description: 'Preview for renewables', image: 'https://via.placeholder.com/400x200?text=Renewables' },
    { id: 3, title: 'Fire weather risk', description: 'Preview for fire weather risk', image: 'https://via.placeholder.com/400x200?text=Fire' },
    { id: 4, title: 'Extreme precipitation', description: 'Preview for extreme precipitation', image: 'https://via.placeholder.com/400x200?text=Precipitation' },
    { id: 5, title: 'CMIP6 data packages', description: 'Preview for data download', image: 'https://via.placeholder.com/400x200?text=Data download' },
]

function ToolCarousel() {
    const listRef = useRef<HTMLDivElement>(null)
    const [activeIndex, setActiveIndex] = useState(0)
    const [thumbHeight, setThumbHeight] = useState('0px')
    const [thumbTop, setThumbTop] = useState('0px')
    const trackRef = useRef<HTMLDivElement>(null)

    const scrollToItem = (index: number) => {
        const el = listRef.current?.children[index] as HTMLElement
        el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }

    const updateScrollbar = () => {
        const listEl = listRef.current;
        const trackEl = trackRef.current

        if (!listEl || !trackEl) return

        const totalItems = data.length
        const trackHeight = trackEl.clientHeight

        const thumbH = trackHeight / totalItems
        const thumbT = (activeIndex / totalItems) * trackHeight

        setThumbHeight(`${thumbH}px`)
        setThumbTop(`${thumbT}px`)
    };

    useEffect(() => {
        updateScrollbar()
    }, [activeIndex])

    return (
        <div className="explore-container">
            <div className="left-panel">
                <h2>Explore</h2>
                <div className="list-container">
                    <div className="scrollable-list" ref={listRef}>
                        {data.map((item, index) => (
                            <div
                                key={item.id}
                                className={`list-item ${index === activeIndex ? 'active' : ''}`}
                                onClick={() => {
                                    setActiveIndex(index)
                                    scrollToItem(index)
                                }}
                            >
                                {item.title}
                            </div>
                        ))}
                    </div>

                    <div className="scroll-wrapper">
                        <button
                            className="scroll-arrow"
                            onClick={() => {
                                if (activeIndex > 0) {
                                    const newIndex = activeIndex - 1
                                    setActiveIndex(newIndex)
                                    scrollToItem(newIndex)
                                }
                            }}
                        >
                            ↑
                        </button>

                        <div className="scrollbar-track" ref={trackRef}>
                            <div
                                className="scrollbar-thumb"
                                style={{ height: thumbHeight, top: thumbTop }}
                            />
                        </div>

                        <button
                            className="scroll-arrow"
                            onClick={() => {
                                if (activeIndex < data.length - 1) {
                                    const newIndex = activeIndex + 1
                                    setActiveIndex(newIndex)
                                    scrollToItem(newIndex)
                                }
                            }}
                        >
                            ↓
                        </button>
                    </div>
                </div>
            </div>

            <div className="right-panel">
                <img src={data[activeIndex].image} alt={data[activeIndex].title} />
                <div className="preview-box">
                    <h3>{data[activeIndex].title}</h3>
                    <p>{data[activeIndex].description}</p>
                    <p>Here is a second sentence to add even more context</p>
                    <div className="icon">→</div>
                </div>
            </div>
        </div>
    )
}

export default ToolCarousel
