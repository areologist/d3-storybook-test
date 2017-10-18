import * as React from 'react';
import { select, Selection } from 'd3-selection';
import { scaleTime, scaleLinear } from 'd3-scale';
import { min, max, extent } from 'd3-array';
import { area, Area } from 'd3-shape';
import { axisBottom, axisLeft, AxisScale } from 'd3-axis';

interface DailyCashflow {
  confirmed: number;
  unconfirmed: number;
  date: Date;
}

interface AreaChartProps {
  data: Array<DailyCashflow>;
  width: number;
  height: number;
}

interface ViewPort {
  width: number;
  height: number;
  root?: Selection<SVGElement, {}, null, undefined>;
}

const margin = {top: 70, right: 70, bottom: 70, left: 70};

export default class AreaChart extends React.Component<AreaChartProps, {}> {
  viewport: ViewPort;
  scaleX: Function;
  scaleY: Function;
  ref: SVGSVGElement;
  areas: Area<DailyCashflow>[];

  constructor(props: AreaChartProps) {
    super(props);
    const { width, height } = props;
    this.viewport = {
      width: width - margin.left - margin.right,
      height: height - margin.top - margin.bottom
    };
    this.scaleX = buildScaleX(props.data || [], this.viewport.width);
    this.scaleY = buildScaleY(props.data || [], this.viewport.height);
    this.areas = [];
  }

  componentDidMount() {
    this.viewport.root = select(this.ref)
      .append<SVGElement>('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    this.setupChart();
  }

  componentDidUpdate() {
    // this.updateChart();
  }

  render() {
    return (
      <div className="chart-container">
        <svg
          ref={(ref: SVGSVGElement) => this.ref = ref}
          width={this.props.width}
          height={this.props.height}
        />
      </div>
    );
  }

  setupChart() {
    if (!this.viewport.root) {
      return;
    }

    this.areas[0] = confirmedArea(this.scaleX, this.scaleY);
    this.areas[1] = unconfirmedArea(this.scaleX, this.scaleY);
    const yMin = min(this.props.data, d => d.confirmed) as number;
    this.areas.forEach(a => a.y0(this.scaleY(yMin * 0.75)));

    const paths = this.viewport.root
      .append<SVGElement>('g');

    paths.append<SVGPathElement>('path')
      .datum(this.props.data)
      .attr('fill', '#6699cc')
      .attr('opacity', 0.5)
      .attr('d', this.areas[1]);

    paths.append<SVGPathElement>('path')
      .datum(this.props.data)
      .attr('fill', '#6699cc')
      .attr('d', this.areas[0]);

    // create axes
    const xAxis = axisBottom(this.scaleX as AxisScale<{}>)
      .ticks(7);

    this.viewport.root
      .append('g')
      .attr('transform', `translate(0, ${this.viewport.height})`)
      .call(xAxis);

    const yAxis = axisLeft(this.scaleY as AxisScale<{}>)
      .ticks(5);

    this.viewport.root
      .append('g')
      .call(yAxis);
  }
}

// Helper functions (temp)

function buildScaleX(data: Array<DailyCashflow>, width: number): Function {
  return scaleTime()
    .domain(extent(data, d => d.date) as [Date, Date])
    .range([0, width]);
}

function buildScaleY(data: Array<DailyCashflow>, height: number): Function {
  const yMin: number = (min<DailyCashflow, number>(data, (d: DailyCashflow) =>
    d.confirmed) as number) * 0.75;
  const yMax: number = max<DailyCashflow, number>(data, (d: DailyCashflow) =>
    Math.max(d.confirmed, d.unconfirmed)) as number;

  return scaleLinear()
    .domain([yMin, yMax])
    .range([height, 0]);
}

function confirmedArea(xScale: Function, yScale: Function): Area<DailyCashflow> {
  return area<DailyCashflow>()
    .x((d: DailyCashflow): number => xScale(d.date))
    .y1((d: DailyCashflow): number => yScale(d.confirmed));
}

function unconfirmedArea(xScale: Function, yScale: Function): Area<DailyCashflow> {
  return area<DailyCashflow>()
    .x((d: DailyCashflow): number => xScale(d.date))
    .y1((d: DailyCashflow): number => yScale(d.unconfirmed));
}
