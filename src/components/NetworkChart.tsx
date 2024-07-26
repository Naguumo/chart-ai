import * as d3 from 'd3';
import { useEffect, useRef } from 'react';
import type { NetData, NetLink, NetNode } from '../netTypes';

type ChartNode = d3.SimulationNodeDatum & NetNode;
type ChartLink = d3.SimulationLinkDatum<ChartNode> & NetLink;

const createSimulation = (
  data: NetData,
  element: SVGSVGElement,
  width: number,
  height: number
): { cleanup: () => void } => {
  // The force simulation mutates links and nodes,
  // create a copy so that re-evaluating this cell produces the same result.
  const links: Array<ChartLink> = data.links
    .filter((v) => v.value > 0)
    .map((d, index) => ({
      ...d,
      index,
      source: d.sourceId,
      target: d.targetId,
    }));
  const nodes: Array<ChartNode> = data.nodes.map((d, index) => ({
    ...d,
    index,
  }));

  // Specify the color scales
  const colorScaleNodes = d3.scaleLinear([0, 5], d3.schemeSet1);
  const colorScaleLinks = d3.scaleLinear([0, 100], d3.schemeDark2);

  // Draw a line for each link
  const drawnLinks = d3
    .select<SVGGElement, ChartLink>(element)
    .append('g')
    .attr('stroke-opacity', 0.6)
    .selectAll()
    .data(links)
    .join('line')
    .attr('stroke', (d) => {
      if (!d || !d.value) return '#999';
      return colorScaleLinks(d.value);
    })
    .attr('stroke-width', (d) => Math.sqrt(d.value));

  // Draw a circle for each node
  const drawnNodes = d3
    .select<SVGGElement, ChartNode>(element)
    .append('g')
    .attr('stroke', '#fff')
    .attr('stroke-width', 1.5)
    .selectAll<SVGCircleElement, ChartNode>('circle')
    .data(nodes)
    .join('circle')
    .attr('r', 5)
    .attr('fill', (d) => colorScaleNodes(d.layer ?? 0));
  drawnNodes.append('title').text((d) => d.id);
  drawnNodes.call(
    d3
      .drag<SVGCircleElement, ChartNode>()
      .on('start', (e, d) => {
        if (!e.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (e, d) => {
        d.fx = e.x;
        d.fy = e.y;
      })
      .on('end', (e, d) => {
        if (!e.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      })
  );

  const handleSimulationTick = () => {
    drawnLinks
      .attr('x1', (d) =>
        typeof d.source === 'object' && !!d.source.x ? d.source.x : null
      )
      .attr('y1', (d) =>
        typeof d.source === 'object' && !!d.source.y ? d.source.y : null
      )
      .attr('x2', (d) =>
        typeof d.target === 'object' && !!d.target.x ? d.target.x : null
      )
      .attr('y2', (d) =>
        typeof d.target === 'object' && !!d.target.y ? d.target.y : null
      );

    drawnNodes.attr('cx', (d) => d.x ?? null).attr('cy', (d) => d.y ?? null);
  };

  // Create a simulation with several forces.
  const simulation = d3
    .forceSimulation<ChartNode>(nodes)
    .force(
      'link',
      d3.forceLink<ChartNode, ChartLink>(links).id((d) => d.id)
    )
    .force('charge', d3.forceManyBody())
    .force('center', d3.forceCenter(width / 2, height / 2))
    .on('tick', handleSimulationTick);

  return {
    cleanup: () => {
      drawnLinks.remove();
      drawnNodes.remove();
      simulation.stop();
    },
  };
};

export const NetworkChart = ({ data }: { data: NetData }) => {
  const ref = useRef<SVGSVGElement>(null);
  const width = 500;
  const height = 300;

  useEffect(() => {
    if (!ref.current) return;
    const sim = createSimulation(data, ref.current, width, height);

    return () => {
      sim.cleanup();
    };
  }, [data]);

  return (
    <svg
      ref={ref}
      width="100%"
      height="45svh"
      viewBox={`0 0 ${width} ${height}`}
      style={{ border: '1px solid black' }}
    />
  );
};
