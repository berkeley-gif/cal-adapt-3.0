
import SolarDroughtViz from "@/app/components/Solar-Drought-Visualizer/SolarDroughtVisualizer"
import { ApiResponse } from "@/app/components/Solar-Drought-Visualizer/DataType"
import { PhotoConfigProvider } from "@/app/context/PhotoConfigContext"
import { InstallationPrmsProvider } from "@/app/context/InstallationParamsContext"
import { ResProvider } from "@/app/context/ResContext"

export default async function SolarDroughtVizWrapper() {
    return (
        <PhotoConfigProvider>
            <InstallationPrmsProvider>
                <ResProvider>
                    <SolarDroughtViz></SolarDroughtViz>
                </ResProvider>
            </InstallationPrmsProvider>
        </PhotoConfigProvider>
    )
}