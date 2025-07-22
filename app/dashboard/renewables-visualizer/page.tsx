
import RenewablesViz from "@/app/components/Renewables-Visualizer/RenewablesVisualizer"
import { ApiResponse } from "@/app/components/Renewables-Visualizer/DataType"
import { PhotoConfigProvider } from "@/app/context/PhotoConfigContext"
import { InstallationPrmsProvider } from "@/app/context/InstallationParamsContext"
import { ResProvider } from "@/app/context/ResContext"

export default async function RenewablesVizWrapper() {
    return (
        <PhotoConfigProvider>
            <InstallationPrmsProvider>
                <ResProvider>
                    <RenewablesViz></RenewablesViz>
                </ResProvider>
            </InstallationPrmsProvider>
        </PhotoConfigProvider>
    )
}