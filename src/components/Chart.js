import * as d3 from "d3";
import React, { useRef, useEffect, useState } from "react";
import { Button } from "react-bootstrap";

const splitDataByMissingData = (data) => {
  const output = [];
  const pushIntoOutput = (item) => {
    if (item.length > 0) output.push(item);
  };
  const backtrack = (dataStreak, n) => {
    if (n == data.length) {
      pushIntoOutput(dataStreak);
      return;
    }
    if (data[n].missingData) {
      pushIntoOutput(dataStreak);
      backtrack([], n + 1);
    } else {
      dataStreak.push(data[n]);
      backtrack(dataStreak, n + 1);
    }
  };
  backtrack([], 0);
  return output;
};

function SynchronisedGraph({
  width,
  height,
  data,
  xDomian,
  yDomain,
  showXGridlines,
  showYGridlines,
}) {
  const svgRef = useRef();

  useEffect(() => {
    d3.selectAll("svg > *").remove();
    if (width) {
      drawGraph();
    }
  }, [width, height, data]);

  const drawGraph = () => {
    const svg = d3.select(svgRef.current);
    const numCols = data.length;
    const colWidth = width / data.length;
    const chartWidth = colWidth * numCols;
    const halfColWidth = colWidth * 0.5;
    const scaleX = d3
      .scaleLinear()
      .domain(xDomian || d3.extent(data, (d) => d.x))
      .range([halfColWidth, chartWidth - halfColWidth]);
    const scaleY = d3
      .scaleLinear()
      .domain(yDomain || d3.extent(data, (d) => d.y))
      .range([height, 0]);

    // Draw graph container
    svg
      .attr("class", "graph-container")
      .attr("width", chartWidth)
      .attr("height", height);

    // Draw axis grid
    if (showXGridlines) {
      const xAxisGrid = d3.axisBottom(scaleX).tickSize(-height).tickFormat("");
      svg
        .append("g")
        .attr("class", "x axis-grid")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxisGrid);
    }

    if (showYGridlines) {
      const yAxisGrid = d3
        .axisLeft(scaleY)
        .tickSize(-chartWidth)
        .tickFormat("");
      svg.append("g").attr("class", "y axis-grid").call(yAxisGrid);
    }

    // Draw graph line
    const line = d3
      .line()
      .x((d) => scaleX(d.x))
      .y((d) => scaleY(d.y));

    const splittedData = splitDataByMissingData(data);
    splittedData.forEach((d) =>
      svg.append("path").datum(d).attr("d", line).attr("class", "graph-line")
    );
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
  yDomain,
  width,
  height,
  data,
  onChangeColumn,
  activeColumn,
  onClickColumn,
}) => {
  const colWidth = width / data.length;
  const domain = yDomain || d3.extent(data, (d) => d.y);
  const range = [height, 0];
  const scaleY = d3.scaleLinear().domain(domain).range(range);

  return (
    <div className="chart-overlay">
      <div className="dots-container">
        {data.map(({ x, y }, i) => {
          return (
            <span
              className={`dot ${activeColumn == i ? "active" : ""}`}
              style={{
                left: `${i * colWidth + colWidth * 0.5}px`,
                top: `${scaleY(y)}px`,
              }}
            />
          );
        })}
      </div>
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

const DAYS_OF_WEEK = ["🌞", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const formatDateLabel = (dateStr) => {
  const dayIdx = new Date(dateStr).getDay();
  const [_yyyy, mm, dd] = dateStr.split("-");
  return `${[dd, mm].join("/")} ${DAYS_OF_WEEK[dayIdx]}`;
};

const transformEntryToData = ({ Temperature, Date, Time, Situation }, idx) => {
  return {
    table1: [
      { name: "Day", value: `Day ${idx + 1}` },
      { name: "Date", value: formatDateLabel(Date) },
      { name: "Time", value: `🕔 ${Time}` },
    ],
    graph: {
      x: idx,
      y: Temperature ? parseFloat(Temperature) * 10 : 0,
      missingData: !Temperature,
    },
    table2: [
      { name: "Temp", value: Temperature ? `${Temperature}°C` : "-" },
      { name: "Situation", value: Situation },
    ],
  };
};

export function PeriodChart({ entries, onClickColumn, hideTableHeading }) {
  const MIN_COL_WIDTH = 50;
  const chartWrapperRef = useRef();
  const yDomain = [350, 380];
  const [startIndex, setStartIndex] = useState(0);
  const [visibleData, setVisibleData] = useState([]);
  const [chartSize, setChartSize] = useState({ width: 0, height: 0 });
  const [activeColumn, setActiveColumn] = useState(-1);

  useEffect(() => {
    onResize();
    window.addEventListener("resize", () => onResize());
  }, [entries]);

  const onChangeColumn = ({ activeColumn }) => {
    setActiveColumn(activeColumn);
  };

  const onResize = () => {
    if (!!chartWrapperRef.current) {
      const { width, height } = chartWrapperRef.current.getBoundingClientRect();
      setChartSize({ width, height });
      const maxNumCols = Math.floor(width / MIN_COL_WIDTH);
      const data = entries.map(transformEntryToData);
      const numColsVisible = Math.min(maxNumCols, data.length);
      setVisibleData(data.slice(startIndex, startIndex + numColsVisible));
    }
  };

  const onNavigate = (direction) => {
    setStartIndex(startIndex + direction);
  };

  return (
    !!entries &&
    entries.length > 0 && (
      <div className="synchronised-graph-table">
        <div className="navigation-container">
          <Button
            variant="primary"
            onClick={() => onNavigate(-1)}
            disabled={visibleData.length == entries.length || startIndex == 0}
          >
            ⇐
          </Button>
          <Button
            variant="primary"
            onClick={() => onNavigate(1)}
            disabled={
              visibleData.length == entries.length ||
              startIndex == entries.length - startIndex
            }
          >
            ⇒
          </Button>
        </div>
        <SynchronisedTable
          rowLabelKey="x"
          data={visibleData.map((d) => d.table1)}
          width={chartSize.width}
          activeColumn={activeColumn}
          onChangeColumn={onChangeColumn}
          onClickColumn={onClickColumn}
          hideHeadingColumn={hideTableHeading}
        />
        <div className="chart-container" ref={chartWrapperRef}>
          <SynchronisedGraph
            width={chartSize.width}
            height={chartSize.height}
            data={visibleData.filter((d) => d.graph).map((d) => d.graph)}
            yDomain={yDomain}
          />
          <ChartOverlay
            yDomain={yDomain}
            startIndex={startIndex}
            width={chartSize.width}
            height={chartSize.height}
            data={visibleData.filter((d) => d.graph).map((d) => d.graph)}
            activeColumn={activeColumn}
            onChangeColumn={onChangeColumn}
            onClickColumn={onClickColumn}
          />
        </div>
        <SynchronisedTable
          rowLabelKey="x"
          data={visibleData.map((d) => d.table2)}
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
