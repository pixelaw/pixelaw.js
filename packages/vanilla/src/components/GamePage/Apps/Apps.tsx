import App from "@/components/GamePage/App/App.tsx"
import { usePixelawProvider } from "@pixelaw/react"
import styles from "./Apps.module.css"



const Apps: React.FC = () => {
    const { pixelawCore: {appStore}, setApp, app: selectedApp } = usePixelawProvider()

    if (!appStore) return null
    const allApps = appStore.getAll()

    return (
        <div className={styles.inner}>
            {allApps.map((app) => (
                // biome-ignore lint/a11y/useKeyWithClickEvents: TODO keyboard support later
                <div
                    key={app.name}
                    onClick={() => setApp(app)}
                    className={app === selectedApp ? styles.selected : ""}
                >
                    <App icon={app.icon} name={app.name} />
                </div>
            ))}
            {/*{hoveredCell && (*/}
            {/*    <div id={"hoveredCell"}>*/}
            {/*        x: {hoveredCell[0]}*/}
            {/*        y: {hoveredCell[1]}*/}
            {/*    </div>*/}
            {/*)}*/}
        </div>
    )
}

export default Apps
