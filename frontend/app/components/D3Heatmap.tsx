import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as d3 from 'd3';
import type { ConceptNode, Student } from '../data/mockData';

interface D3HeatmapProps {
  concepts: ConceptNode[];
  students: Student[];
  onConceptClick?: (concept: ConceptNode) => void;
}

const MIN_CELL = 24;
const MAX_CELL = 48;
const GAP = 2;
const LABEL_WIDTH = 110;
const HEADER_HEIGHT = 30;
const PADDING_RIGHT = 10;
const PADDING_BOTTOM = 10;

function readinessColor(r: number): string {
  if (r >= 0.7) return 'rgba(255, 203, 5, 0.85)';
  if (r >= 0.5) return 'rgba(86, 180, 233, 0.85)';
  return 'rgba(213, 94, 0, 0.85)';
}

export const D3Heatmap: React.FC<D3HeatmapProps> = ({
  concepts,
  students,
  onConceptClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  const measure = useCallback(() => {
    if (!containerRef.current) return;
    setContainerWidth(containerRef.current.clientWidth);
    setContainerHeight(containerRef.current.clientHeight);
  }, []);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [measure]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || containerWidth === 0 || containerHeight === 0) return;

    d3.select(container).select('svg').remove();
    d3.select(container).selectAll('.heatmap-tooltip').remove();

    const displayStudents = students.slice(0, 30);
    const displayConcepts = concepts.slice(0, 20);

    if (displayStudents.length === 0 || displayConcepts.length === 0) return;

    const availW = containerWidth - LABEL_WIDTH - PADDING_RIGHT;
    const availH = containerHeight - HEADER_HEIGHT - PADDING_BOTTOM;

    const fitCellW = Math.floor(availW / displayStudents.length) - GAP;
    const fitCellH = Math.floor(availH / displayConcepts.length) - GAP;

    const cellSize = Math.max(MIN_CELL, Math.min(MAX_CELL, fitCellW, fitCellH));

    const width = LABEL_WIDTH + PADDING_RIGHT + displayStudents.length * (cellSize + GAP);
    const height = HEADER_HEIGHT + PADDING_BOTTOM + displayConcepts.length * (cellSize + GAP);

    const svg = d3
      .select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    const tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'heatmap-tooltip')
      .style('position', 'fixed')
      .style('pointer-events', 'none')
      .style('background', '#00274C')
      .style('color', '#fff')
      .style('padding', '8px 12px')
      .style('border-radius', '8px')
      .style('font-size', '12px')
      .style('font-family', 'system-ui, -apple-system, sans-serif')
      .style('opacity', 0)
      .style('z-index', '60')
      .style('white-space', 'nowrap');

    const positionTooltip = (event: MouseEvent) => {
      const tooltipNode = tooltip.node();
      if (!tooltipNode) return;
      const tooltipRect = tooltipNode.getBoundingClientRect();
      const offset = 14;
      const vp = 8;
      let left = event.clientX + offset;
      let top = event.clientY + offset;
      if (left + tooltipRect.width > window.innerWidth - vp) left = event.clientX - tooltipRect.width - offset;
      if (top + tooltipRect.height > window.innerHeight - vp) top = event.clientY - tooltipRect.height - offset;
      tooltip.style('left', `${Math.max(vp, left)}px`).style('top', `${Math.max(vp, top)}px`);
    };

    svg.append('g').selectAll('text').data(displayStudents).enter()
      .append('text')
      .attr('x', (_, i) => LABEL_WIDTH + i * (cellSize + GAP) + cellSize / 2)
      .attr('y', HEADER_HEIGHT - 8)
      .attr('text-anchor', 'middle')
      .attr('fill', '#5C6B7D')
      .attr('font-size', '10px')
      .attr('font-family', 'system-ui')
      .text((_, i) => `S${i + 1}`);

    svg.append('g').selectAll('text').data(displayConcepts).enter()
      .append('text')
      .attr('x', LABEL_WIDTH - 8)
      .attr('y', (_, i) => HEADER_HEIGHT + i * (cellSize + GAP) + cellSize / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'end')
      .attr('fill', '#5C6B7D')
      .attr('font-size', '12px')
      .attr('font-family', 'system-ui')
      .text((d) => d.name);

    const cellData: { concept: ConceptNode; student: Student; value: number; row: number; col: number }[] = [];
    displayConcepts.forEach((concept, row) => {
      displayStudents.forEach((student, col) => {
        cellData.push({ concept, student, value: student.conceptReadiness[concept.id] ?? 0, row, col });
      });
    });

    svg.append('g').selectAll('rect').data(cellData).enter()
      .append('rect')
      .attr('x', (d) => LABEL_WIDTH + d.col * (cellSize + GAP))
      .attr('y', (d) => HEADER_HEIGHT + d.row * (cellSize + GAP))
      .attr('width', cellSize)
      .attr('height', cellSize)
      .attr('rx', 4).attr('ry', 4)
      .attr('fill', (d) => readinessColor(d.value))
      .attr('cursor', 'pointer')
      .attr('opacity', 0)
      .on('mouseenter', function (event, d) {
        d3.select(this).transition().duration(100).attr('stroke', '#00274C').attr('stroke-width', 2);
        tooltip.html(`<strong>${d.concept.name}</strong><br/>${d.student.name}<br/>Readiness: ${Math.round(d.value * 100)}%`).transition().duration(100).style('opacity', 1);
        positionTooltip(event as MouseEvent);
      })
      .on('mousemove', (event) => positionTooltip(event as MouseEvent))
      .on('mouseleave', function () {
        d3.select(this).transition().duration(100).attr('stroke', 'none');
        tooltip.transition().duration(100).style('opacity', 0);
      })
      .on('click', (_, d) => { if (onConceptClick) onConceptClick(d.concept); })
      .transition().duration(400).delay((d) => (d.row + d.col) * 8).attr('opacity', 1);

    if (cellSize >= 28) {
      svg.append('g').selectAll('text').data(cellData).enter()
        .append('text')
        .attr('x', (d) => LABEL_WIDTH + d.col * (cellSize + GAP) + cellSize / 2)
        .attr('y', (d) => HEADER_HEIGHT + d.row * (cellSize + GAP) + cellSize / 2)
        .attr('dy', '0.35em')
        .attr('text-anchor', 'middle')
        .attr('fill', '#FFFFFF')
        .attr('font-size', '10px')
        .attr('font-weight', '500')
        .attr('font-family', 'SF Mono, Monaco, monospace')
        .attr('pointer-events', 'none')
        .attr('opacity', 0)
        .text((d) => Math.round(d.value * 100))
        .transition().duration(400).delay((d) => (d.row + d.col) * 8 + 200).attr('opacity', 1);
    }

    return () => { tooltip.remove(); };
  }, [concepts, students, onConceptClick, containerWidth, containerHeight]);

  return (
    <div ref={containerRef} className="w-full overflow-auto relative" style={{ minHeight: 300, height: '100%' }} />
  );
};
