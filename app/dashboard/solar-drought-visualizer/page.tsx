
import SolarDroughtViz from "@/app/components/Solar-Drought-Visualizer/SolarDroughtVisualizer"
import { ApiResponse } from "@/app/components/Solar-Drought-Visualizer/DataType"
import { PhotoConfigProvider } from "@/app/context/PhotoConfigContext"
import { ResProvider } from "@/app/context/ResContext"

export default async function SolarDroughtVizWrapper() {
    return (
        <PhotoConfigProvider>
            <ResProvider>
                <SolarDroughtViz></SolarDroughtViz>
            </ResProvider>
        </PhotoConfigProvider>
    )
}