import * as d3 from "d3";
import React, { useRef, useEffect, useState } from "react";
import { Button } from "react-bootstrap";

function SynchronisedGraph({ width, height, data, xRange, yRange }) {
  const svgRef = useRef();

  useEffect(() => {
    d3.selectAll("svg > *").remove();
    if (width) {
      drawGraph();
    }
  }, [width, height, data]);

  const drawGraph = () => {
    const svg = d3.select(svgRef.current);
    const xValues = data.map((d) => d.x);
    const yValues = data.map((d) => d.y);
    const [minXValue, maxXValue] = xRange || [
      Math.min(...xValues),
      Math.max(...xValues),
    ];
    const [minYValue, maxYValue] = yRange || [
      Math.min(...yValues),
      Math.max(...yValues),
    ];
    const numCols = xValues.length;
    const colWidth = width / xValues.length;
    const chartWidth = colWidth * numCols;
    const halfColWidth = colWidth * 0.5;
    const scaleX = d3
      .scaleLinear()
      .domain([minXValue, maxXValue])
      .range([halfColWidth, chartWidth - halfColWidth]);
    const scaleY = d3
      .scaleLinear()
      .domain([Math.floor(minYValue), Math.ceil(maxYValue)])
      .range([height, 0]);

    // Draw graph container
    svg
      .attr("class", "graph-container")
      .attr("width", chartWidth)
      .attr("height", height);

    // Draw axis grid
    const xAxisGrid = d3
      .axisBottom(scaleX)
      .tickSize(-height)
      .tickFormat("")
      .ticks(maxXValue - minXValue);
    const yAxisGrid = d3
      .axisLeft(scaleY)
      .tickSize(-chartWidth)
      .tickFormat("")
      .ticks((maxYValue - minYValue) * 5);
    svg
      .append("g")
      .attr("class", "x axis-grid")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxisGrid);
    svg.append("g").attr("class", "y axis-grid").call(yAxisGrid);

    // Draw graph line
    const line = d3
      .line()
      .x((d) => scaleX(d.x))
      .y((d) => scaleY(d.y));
    svg.append("path").datum(data).attr("d", line).attr("class", "graph-line");
  };

  return (
    <div className="Graph synchronised-graph">
      <svg ref={svgRef}></svg>
    </div>
  );
}

function TableColumn({
  width,
  onChangeColumn,
  onClick,
  columnIndex,
  values,
  isActive,
}) {
  const columnStyle = { flex: `0 1 ${width}px` };
  return (
    <div
      style={columnStyle}
      className={`table-column ${isActive ? "active" : ""}`}
      onMouseEnter={() => onChangeColumn({ activeColumn: columnIndex })}
      onMouseLeave={() => onChangeColumn({ activeColumn: -1 })}
      onClick={onClick}
      key={`table-col-${columnIndex}`}
    >
      {values.map((val, idx) => (
        <div className="table-block" key={`table-block-${columnIndex}-${idx}`}>
          <span>{val}</span>
        </div>
      ))}
    </div>
  );
}

function SynchronisedTable({
  data,
  width,
  activeColumn,
  onChangeColumn,
  onClickColumn,
  hideHeadingColumn,
}) {
  return (
    !!data &&
    data.length > 0 && (
      <div className="Table">
        {!hideHeadingColumn && (
          <div
            className="table-row-heading"
            style={{ width: `${width / data.length}px` }}
          >
            <div className="table-block table-block-head"></div>
            {data[0].map((d, idx) => (
              <div className="table-block" key={`table-block-heading-${idx}`}>
                <span>{d.name}</span>
              </div>
            ))}
          </div>
        )}
        {data.map((d, i) => (
          <TableColumn
            columnIndex={i}
            isActive={activeColumn == i}
            onChangeColumn={onChangeColumn}
            onClick={onClickColumn}
            columnWidth={width / data.length}
            values={d.map((x) => x.value)}
          />
        ))}
      </div>
    )
  );
}

const ChartOverlay = ({
  data,
  onChangeColumn,
  activeColumn,
  onClickColumn,
}) => {
  return (
    <div className="chart-overlay">
      <div className="column-container">
        {data.map((_d, i) => (
          <div
            className={`column ${activeColumn == i ? "active" : ""}`}
            onMouseEnter={() => onChangeColumn({ activeColumn: i })}
            onMouseLeave={() => onChangeColumn({ activeColumn: -1 })}
            onClick={onClickColumn}
          />
        ))}
      </div>
    </div>
  );
};

export function SynchronisedGraphTable({
  onClickColumn,
  data,
  xRange,
  yRange,
  hideTableHeading,
}) {
  const MIN_COL_WIDTH = 50;
  const chartWrapperRef = useRef();
  const [startIndex, setStartIndex] = useState(0);
  const [visibleData, setVisibleData] = useState([]);
  const [chartSize, setChartSize] = useState({ width: 0, height: 0 });
  const [activeColumn, setActiveColumn] = useState(-1);

  useEffect(() => {
    onResize();
    window.addEventListener("resize", () => onResize());
  }, [data]);

  const onChangeColumn = ({ activeColumn }) => {
    setActiveColumn(activeColumn);
  };

  const onResize = () => {
    if (!!chartWrapperRef.current) {
      const { width, height } = chartWrapperRef.current.getBoundingClientRect();
      setChartSize({ width, height });
      const maxNumCols = Math.floor(width / MIN_COL_WIDTH);
      const numColsVisible = Math.min(maxNumCols, data.length);
      setVisibleData(data.slice(startIndex, startIndex + numColsVisible));
    }
  };

  const onNavigate = (direction) => {
    setStartIndex(startIndex + direction);
  };

  return (
    !!data &&
    data.length > 0 && (
      <div className="synchronised-graph-table">
        <div className="navigation-container">
          <Button variant="primary" onClick={() => onNavigate(-1)}>
            ⇐ Left
          </Button>
          <Button variant="primary" onClick={() => onNavigate(1)}>
            More ⇒
          </Button>
        </div>
        <div className="chart-container" ref={chartWrapperRef}>
          <SynchronisedGraph
            width={chartSize.width}
            height={chartSize.height}
            data={visibleData.map((d) => d.graph)}
            xRange={xRange}
            yRange={yRange}
          />
          <ChartOverlay
            width={chartSize.width}
            height={chartSize.height}
            data={visibleData}
            activeColumn={activeColumn}
            onChangeColumn={onChangeColumn}
            onClickColumn={onClickColumn}
          />
        </div>
        <SynchronisedTable
          rowLabelKey="x"
          data={visibleData.map((d) => d.table)}
          width={chartSize.width}
          activeColumn={activeColumn}
          onChangeColumn={onChangeColumn}
          onClickColumn={onClickColumn}
          hideHeadingColumn={hideTableHeading}
        />
      </div>
    )
  );
}
