// https://jvm-docs.vercel.app/docs/markers
export interface VectormapMarker {
    name?: string,
    coords: [number, number],
    style?: VectormapMarkerStyle
}

export interface VectormapMarkerStyle {
    initial: {
        fill: '#6261cc'
    }
}
