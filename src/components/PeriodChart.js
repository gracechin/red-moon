import * as d3 from "d3";
import React, { useRef, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import {
  ALL_ENTRY_INPUT_FIELDS,
  START_TEMP_RISE_FIELD,
  LUTEAL_PHASE_DATA_BASE,
} from "../utils/constants";
import { transformDateStrToDateLabel } from "../utils/dateTime";

function SynchronisedGraph({
  width,
  height,
  data,
  xDomian,
  yDomain,
  showXGridlines,
  showYGridlines,
  horizontalLines,
}) {
  const svgRef = useRef();
  useEffect(() => {
    d3.selectAll("svg > *").remove();
    if (width && height && data && data.length > 0) {
      drawGraph();
    }
  }, [width, height, data]);

  const usedXDomain = xDomian || d3.extent(data, (d) => d.x);

  const drawGraph = () => {
    const svg = d3.select(svgRef.current);
    const numCols = data.length;
    const colWidth = width / data.length;
    const chartWidth = colWidth * numCols;
    const halfColWidth = colWidth * 0.5;
    const scaleX = d3
      .scaleLinear()
      .domain(usedXDomain)
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

    const filteredData = data.filter((d) => !d.missingData);
    svg
      .append("path")
      .datum(filteredData)
      .attr("d", line)
      .attr("class", "graph-line");

    // Draw horizontalLines
    horizontalLines.forEach(({ y }) => {
      svg
        .append("path")
        .datum([
          { x: usedXDomain[0] - 1, y },
          { x: usedXDomain[1] + 1, y },
        ])
        .attr("d", line)
        .attr("class", "graph-line");
    });
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
  style,
  className,
  iconClassname,
  onChangeColumn,
  onClick,
  columnIndex,
  fontSize,
  isActive,
  data,
  valueKey,
}) {
  const setActiveCol = () => onChangeColumn({ activeColumn: columnIndex });
  const removeActiveCol = () => onChangeColumn({ activeColumn: -1 });
  const noReaction = () => {};
  return (
    <div
      style={style || {}}
      className={className || `table-column ${isActive ? "active" : ""}`}
      onMouseEnter={onChangeColumn ? setActiveCol : noReaction}
      onMouseLeave={onChangeColumn ? removeActiveCol : noReaction}
      onClick={onClick || noReaction}
      key={`table-col-${columnIndex}`}
    >
      {data.map((d, idx) => (
        <TableBlock
          keySegment={columnIndex}
          idx={idx}
          fontSize={fontSize}
          iconClassname={`icon-base ${d.iconClassname || ""} ${
            iconClassname || ""
          }`}
          value={d[valueKey]}
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
  rowHeadingWidth,
  fontSize,
}) {
  return (
    !!data &&
    data.length > 0 && (
      <div className="Table">
        <TableColumn
          key={headingColumnKey}
          columnIndex="heading"
          data={data[0]}
          valueKey="name"
          className="table-row-heading"
          iconClassname="icon-heading"
          style={{ width: `${rowHeadingWidth}px` }}
          fontSize={fontSize}
        />
        <TableColumn
          key={headingColumnKey}
          columnIndex="heading-icon"
          data={data[0]}
          valueKey="icon"
          className="table-row-heading table-row-heading-icon"
          iconClassname="icon-heading"
          style={{ width: `${rowHeadingWidth}px` }}
          fontSize={fontSize}
        />
        {data.map((d, i) => {
          const colIdx = startIndex + i;
          return (
            <TableColumn
              isHeading={false}
              key={colIdx}
              columnIndex={colIdx}
              isActive={activeColumn == colIdx}
              onChangeColumn={onChangeColumn}
              onClick={() => onClickColumn(colIdx)}
              data={d}
              fontSize={fontSize}
              valueKey="value"
              style={{ flex: `0 1 ${width / data.length}px` }}
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
        {data.map(({ _x, y, missingData }, i) => {
          return (
            <span
              key={i}
              className={`dot ${
                activeColumn == i + startIndex ? "active" : ""
              }`}
              style={
                missingData
                  ? { display: "none" }
                  : {
                      left: `${i * colWidth + colWidth * 0.5}px`,
                      top: `${scaleY(y)}px`,
                    }
              }
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
              onClick={() => onClickColumn(colIdx)}
            />
          );
        })}
      </div>
    </div>
  );
};

const DAYS_OF_WEEK = ["🌞", "M", "T", "W", "R", "F", "S"];
const TIME_CELL_DATA_BASE = { name: "Temp Taken", icon: "🕔" };
const TEMP_CELL_DATA_BASE = { name: "Temp °C", icon: "🌡️" };

const getMatchedFieldByName = (name) => {
  const matchedFields = ALL_ENTRY_INPUT_FIELDS.filter((f) => f.name === name);
  if (matchedFields.length == 0) throw `Cannot find fieldname - ${name}`;
  return matchedFields[0];
};

const genEmptyCell = (field) => ({
  ...field,
  value: "-",
  iconClassname: "icon",
});

const getOptionCellData = (field, value) => {
  const matchedOptions = field.options.filter((opt) => opt.name === value);
  if (matchedOptions.length == 0) throw `Cannot find option - ${value}`;
  const option = matchedOptions[0];
  return [
    ...(option.value || []),
    option.icon === "-"
      ? genEmptyCell(field)
      : { name: field.name, icon: field.icon, value: option.icon },
  ];
};

const getSwitchCellData = (field, value) => {
  if (value === "on") return [{ ...field, value: field.icon }];
  return [genEmptyCell(field)];
};

const getTextCellData = (field, value) => {
  if (value && value.length > 0) {
    const len = value.length;
    return [{ ...field, value: len > 5 ? value.slice(0, 3) + ".." : value }];
  }
  return [genEmptyCell(field)];
};

const getDateCellData = (dateStr) => {
  const [_yyyy, _mm, dd] = dateStr.split("-");
  const dayIdx = new Date(dateStr).getDay();
  const dow = DAYS_OF_WEEK[dayIdx];
  return [
    { name: "Date", icon: "📅", value: dd },
    { name: "Week Day", icon: "🗓️", value: dow },
  ];
};

const getCellDataForField = (field, value) => {
  if (!value) return [genEmptyCell(field)];
  const f = getMatchedFieldByName(field.name);
  if (f.options) return getOptionCellData(f, value);
  if (f.fieldType === "Switch") return getSwitchCellData(f, value);
  if (f.fieldType === "Text") return getTextCellData(f, value);
  return [genEmptyCell(field)];
};

const transformEntryToCellData = (e, idx, fieldsConfig, noTempRise) => {
  const { Temperature, Date, Time } = e;
  const lutealPhaseDay = e[LUTEAL_PHASE_DATA_BASE.name];
  return {
    table1: [
      { name: "Cycle  Day", icon: "📅", value: `${idx + 1}` },
      ...getDateCellData(Date),
      Time
        ? { ...TIME_CELL_DATA_BASE, value: Time }
        : genEmptyCell(TIME_CELL_DATA_BASE),
      ...(noTempRise
        ? []
        : [
            lutealPhaseDay
              ? { ...LUTEAL_PHASE_DATA_BASE, value: lutealPhaseDay }
              : genEmptyCell(LUTEAL_PHASE_DATA_BASE),
          ]),
    ],
    graph: {
      x: idx,
      y: Temperature ? parseFloat(Temperature) * 10 : 0,
      missingData: !Temperature,
    },
    table2: [
      Temperature
        ? { ...TEMP_CELL_DATA_BASE, value: Temperature }
        : genEmptyCell(TEMP_CELL_DATA_BASE),
      ...fieldsConfig.map((f) => getCellDataForField(f, e[f.name])).flat(),
    ],
  };
};

const addLutealPhaseData = (entries) => {
  var lutealPhaseStartIdx;
  for (let i = 0; i < entries.length; i++) {
    if (entries[i][START_TEMP_RISE_FIELD.name]) lutealPhaseStartIdx = i;
    if (!lutealPhaseStartIdx) continue;
    entries[i][LUTEAL_PHASE_DATA_BASE.name] = i - lutealPhaseStartIdx + 1;
  }
  return entries;
};
const transformEntriesToCellData = (entries, inputFieldsConfig) => {
  const noTempRise = entries.every((e) => !e[START_TEMP_RISE_FIELD.name]);
  return (noTempRise ? entries : addLutealPhaseData(entries)).map((e, idx) =>
    transformEntryToCellData(e, idx, inputFieldsConfig, noTempRise)
  );
};

const calcYDomain = (entries) => {
  if (entries.length === 0) return [360, 380];
  const yValues = entries
    .filter((e) => !!e.Temperature)
    .map((e) => parseFloat(e.Temperature) * 10);
  const max = Math.max.apply(null, yValues);
  const min = Math.min.apply(null, yValues);
  const calcMin = min - 2;
  const calcMax = calcMin + 15;
  return [calcMin, calcMax < max ? max + 2 : calcMax];
};

export function PeriodChart({
  entries,
  onClickColumn,
  inputFieldsConfig,
  coverline,
  showDescription,
  description,
}) {
  const MIN_COL_WIDTH = 28;
  const fontSize = "small";
  const TABLE_HEADING_WIDTH = 100;
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
    const data = transformEntriesToCellData(entries, inputFieldsConfig);
    const numColsVisible = Math.min(maxNumCols, data.length);
    setVisibleData(data.slice(startIndex, startIndex + numColsVisible));
  }, [chartSize, startIndex]);

  const onChangeColumn = ({ activeColumn }) => setActiveColumn(activeColumn);
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
        {showDescription && <div>{description}</div>}
        <SynchronisedTable
          startIndex={startIndex}
          rowLabelKey="x"
          data={visibleData.map((d) => d.table1)}
          width={chartSize.width}
          activeColumn={activeColumn}
          onChangeColumn={onChangeColumn}
          onClickColumn={onClickColumn}
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
            horizontalLines={coverline ? [{ y: coverline * 10 }] : []}
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
          startIndex={startIndex}
          rowLabelKey="x"
          data={visibleData.map((d) => d.table2)}
          width={chartSize.width}
          activeColumn={activeColumn}
          onChangeColumn={onChangeColumn}
          onClickColumn={onClickColumn}
          rowHeadingWidth={TABLE_HEADING_WIDTH}
          fontSize={fontSize}
        />
      </div>
    )
  );
}
