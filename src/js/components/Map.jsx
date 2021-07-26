import React, { useEffect, useRef } from 'react'
import { select, geoPath, geoMercator, scaleLog, geoCentroid, extent } from 'd3';

const Map = ({ randomNumber, mapData }) => {
    const map = useRef();

    useEffect(() => {
        const area = geoPath().area(mapData.features[randomNumber])

        const log = scaleLog().domain(
            extent(mapData.features, feature => geoPath().area(feature))
        ).range([1080, 50])

        const scale = innerWidth <= 740 ? log(area) : log(area) * innerWidth / 1200;

        const projection = geoMercator()
            // .scale(1080)
            .scale(scale)
            .center(geoCentroid(mapData.features[randomNumber]))
            .translate([innerWidth / 2, innerHeight / 2]);

        const pathGenerator = geoPath().projection(projection);

        const countryPath = select(map.current)
            .selectAll('path')
            .data(mapData.features)

        countryPath.join("path")
            .attr("fill", (d, i) => i == randomNumber ? "#2E8CB2" : "#BAD0DC")
            .attr("stroke", (d, i) => i == randomNumber ? "white" : "#BAD0DC")
            .attr("stroke-width", (d, i) => i == randomNumber ? 2 : 1)
            .attr("d", pathGenerator);
    }, [randomNumber])

    return (
        <g ref={map} />
    )
}

export default Map;
