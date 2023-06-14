import * as d3 from "d3";
import React, { useRef, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { DAILY_SITUATION_OPTIONS } from "../utils/constants";
import { transformDateStrToDateLabel } from "../utils/dateTime";

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
    if (width && height && data && data.length > 0) {
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
        .tickFormat("")
        .ticks(yDomain[1] - yDomain[0]);
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

function TableBlock({ keySegment, idx, fontSize, iconClassname, value }) {
  return (
    <div
      className="table-block"
      key={`table-block-${keySegment}-${idx}`}
      style={fontSize ? { fontSize } : {}}
    >
      <div className={iconClassname}>
        <span>{value}</span>
      </div>
    </div>
  );
}

function TableColumn({
  width,
  onChangeColumn,
  onClick,
  columnIndex,
  fontSize,
  isActive,
  data,
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
      {data.map((d, idx) => (
        <TableBlock
          keySegment={columnIndex}
          idx={idx}
          fontSize={fontSize}
          iconClassname={d.iconClassname}
          value={d.value}
        />
      ))}
    </div>
  );
}

function SynchronisedTable({
  startIndex,
  data,
  width,
  activeColumn,
  onChangeColumn,
  onClickColumn,
  headingColumnKey,
  hideHeadingColumn,
  rowHeadingWidth,
  fontSize,
}) {
  return (
    !!data &&
    data.length > 0 && (
      <div className="Table">
        {!hideHeadingColumn && (
          <div
            className="table-row-heading"
            style={{ width: `${rowHeadingWidth}px` }}
          >
            <div className="table-block table-block-head"></div>
            {data[0].map((d, idx) => (
              <TableBlock
                keySegment="heading"
                idx={idx}
                fontSize={fontSize}
                iconClassname={`${d.iconClassname} icon-heading`}
                value={d[headingColumnKey]}
              />
            ))}
          </div>
        )}
        {data.map((d, i) => {
          const colIdx = startIndex + i;
          return (
            <TableColumn
              key={colIdx}
              columnIndex={colIdx}
              isActive={activeColumn == colIdx}
              onChangeColumn={onChangeColumn}
              onClick={onClickColumn}
              columnWidth={width / data.length}
              data={d}
              fontSize={fontSize}
            />
          );
        })}
      </div>
    )
  );
}

const ChartOverlay = ({
  startIndex,
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
              key={i}
              className={`dot ${
                activeColumn == i + startIndex ? "active" : ""
              }`}
              style={{
                left: `${i * colWidth + colWidth * 0.5}px`,
                top: `${scaleY(y)}px`,
              }}
            />
          );
        })}
      </div>
      <div className="column-container">
        {data.map((_d, i) => {
          const colIdx = startIndex + i;
          return (
            <div
              key={i}
              className={`column ${activeColumn == colIdx ? "active" : ""}`}
              onMouseEnter={() => onChangeColumn({ activeColumn: colIdx })}
              onMouseLeave={() => onChangeColumn({ activeColumn: -1 })}
              onClick={onClickColumn}
            />
          );
        })}
      </div>
    </div>
  );
};

const DAYS_OF_WEEK = ["🌞", "M", "T", "W", "R", "F", "S"];

const formatDayOfWeek = (dateStr) => {
  const dayIdx = new Date(dateStr).getDay();
  return DAYS_OF_WEEK[dayIdx];
};

const getFluidData = (situation) => {
  const matchedOptions = Object.values(DAILY_SITUATION_OPTIONS).filter(
    (option) => option.name == situation
  );
  if (matchedOptions.length > 0) return matchedOptions[0].fluidData;
  return DAILY_SITUATION_OPTIONS.NONE.fluidData;
};

const transformEntryToData = ({ Temperature, Date, Time, Situation }, idx) => {
  const [_yyyy, _mm, dd] = Date.split("-");
  return {
    table1: [
      { name: "Cycle  Day", icon: "Day", value: `${idx + 1}` },
      { name: "Date 📅", icon: "📅", value: dd },
      {
        name: "Week Day 🗓️",
        icon: "🗓️",
        value: formatDayOfWeek(Date),
      },
      {
        name: "Temp Taken 🕔",
        icon: "🕔",
        value: Time ? `${Time}` : "-",
      },
    ],
    graph: {
      x: idx,
      y: Temperature ? parseFloat(Temperature) * 10 : 0,
      missingData: !Temperature,
    },
    table2: [
      { name: "Temp °C 🌡️", icon: "🌡️", value: Temperature || "-" },
      ...getFluidData(Situation),
    ],
  };
};

const calcYDomain = (entries) => {
  if (entries.length === 0) return [360, 380];
  const yValues = entries
    .filter((e) => !!e.Temperature)
    .map((e) => parseInt(e.Temperature) * 10);
  const max = Math.max.apply(null, yValues);
  const min = Math.min.apply(null, yValues);
  const calcMin = min - 2;
  const calcMax = calcMin + 15;
  return [calcMin, calcMax < max ? max + 2 : calcMax];
};

export function PeriodChart({
  entries,
  onClickColumn,
  hideTableHeading,
  compressed,
}) {
  const MIN_COL_WIDTH = compressed ? 25 : 35;
  const fontSize = compressed ? "9px" : "small";
  const TABLE_HEADING_WIDTH = compressed ? MIN_COL_WIDTH : MIN_COL_WIDTH * 3;
  const chartWrapperRef = useRef();
  const yDomain = calcYDomain(entries);
  const [startIndex, setStartIndex] = useState(0);
  const [visibleData, setVisibleData] = useState([]);
  const [chartSize, setChartSize] = useState({ width: 0, height: 0 });
  const [activeColumn, setActiveColumn] = useState(-1);

  useEffect(() => {
    onResize();
    window.addEventListener("resize", () => onResize());
  }, [entries]);

  useEffect(() => {
    const maxNumCols = Math.floor(chartSize.width / MIN_COL_WIDTH);
    const data = entries.map(transformEntryToData);
    const numColsVisible = Math.min(maxNumCols, data.length);
    setVisibleData(data.slice(startIndex, startIndex + numColsVisible));
  }, [chartSize, startIndex]);

  const onChangeColumn = ({ activeColumn }) => setActiveColumn(activeColumn);
  const onClickCol = () => onClickColumn(activeColumn);
  const onNavigate = (direction) => setStartIndex(startIndex + direction);

  const onResize = () => {
    if (!!chartWrapperRef.current) {
      const { width, height } = chartWrapperRef.current.getBoundingClientRect();
      setChartSize({ width, height });
    }
  };

  return (
    !!entries &&
    entries.length > 0 && (
      <div
        style={{ paddingLeft: `${TABLE_HEADING_WIDTH}px` }}
        className="synchronised-graph-table"
      >
        <div className="navigation-container">
          <Button
            variant="primary"
            onClick={() => onNavigate(-1)}
            disabled={visibleData.length == entries.length || startIndex == 0}
          >
            ⇐
          </Button>
          <div>
            {entries.length > 0 &&
              `${transformDateStrToDateLabel(
                entries[0].Date
              )} - ${transformDateStrToDateLabel(
                entries[entries.length - 1].Date
              )}`}
          </div>
          <Button
            variant="primary"
            onClick={() => onNavigate(1)}
            disabled={
              visibleData.length == entries.length ||
              startIndex + visibleData.length == entries.length
            }
          >
            ⇒
          </Button>
        </div>
        <SynchronisedTable
          startIndex={startIndex}
          rowLabelKey="x"
          data={visibleData.map((d) => d.table1)}
          width={chartSize.width}
          activeColumn={activeColumn}
          onChangeColumn={onChangeColumn}
          onClickColumn={onClickCol}
          headingColumnKey={compressed ? "icon" : "name"}
          hideHeadingColumn={hideTableHeading}
          rowHeadingWidth={TABLE_HEADING_WIDTH}
          fontSize={fontSize}
        />
        <div className="chart-container" ref={chartWrapperRef}>
          <SynchronisedGraph
            width={chartSize.width}
            height={chartSize.height}
            data={visibleData.filter((d) => d.graph).map((d) => d.graph)}
            yDomain={yDomain}
            showYGridlines={true}
          />
          <ChartOverlay
            yDomain={yDomain}
            startIndex={startIndex}
            width={chartSize.width}
            height={chartSize.height}
            data={visibleData.filter((d) => d.graph).map((d) => d.graph)}
            activeColumn={activeColumn}
            onChangeColumn={onChangeColumn}
            onClickColumn={onClickCol}
          />
        </div>
        <SynchronisedTable
          startIndex={startIndex}
          rowLabelKey="x"
          data={visibleData.map((d) => d.table2)}
          width={chartSize.width}
          activeColumn={activeColumn}
          onChangeColumn={onChangeColumn}
          onClickColumn={onClickCol}
          headingColumnKey={compressed ? "icon" : "name"}
          hideHeadingColumn={hideTableHeading}
          rowHeadingWidth={TABLE_HEADING_WIDTH}
          fontSize={fontSize}
        />
      </div>
    )
  );
}
