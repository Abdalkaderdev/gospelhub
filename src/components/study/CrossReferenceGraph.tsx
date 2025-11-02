import React, { memo, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import * as d3 from 'd3-selection';
import { forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide } from 'd3-force';
import { useTheme } from '../../contexts/ThemeContext';

interface CrossReference {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  connections: string[];
  strength: number;
}

interface CrossReferenceGraphProps {
  references: CrossReference[];
  centerReference: string;
  onReferenceClick?: (reference: CrossReference) => void;
  width?: number;
  height?: number;
}

interface GraphNode extends CrossReference {
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  strength: number;
}

export const CrossReferenceGraph = memo<CrossReferenceGraphProps>(({
  references,
  centerReference,
  onReferenceClick,
  width = 600,
  height = 400
}) => {
  const { currentTheme } = useTheme();
  const svgRef = useRef<SVGSVGElement>(null);
  const simulationRef = useRef<any>(null);

  const { nodes, links } = useMemo(() => {
    const nodeMap = new Map<string, GraphNode>();
    const linkArray: GraphLink[] = [];

    // Create nodes
    references.forEach(ref => {
      nodeMap.set(ref.id, { ...ref });
    });

    // Create links
    references.forEach(ref => {
      ref.connections.forEach(connectionId => {
        if (nodeMap.has(connectionId)) {
          linkArray.push({
            source: ref.id,
            target: connectionId,
            strength: ref.strength
          });
        }
      });
    });

    return {
      nodes: Array.from(nodeMap.values()),
      links: linkArray
    };
  }, [references]);

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Create simulation
    const simulation = forceSimulation(nodes)
      .force('link', forceLink(links).id((d: any) => d.id).strength(d => (d as GraphLink).strength * 0.1))
      .force('charge', forceManyBody().strength(-300))
      .force('center', forceCenter(width / 2, height / 2))
      .force('collision', forceCollide().radius(30));

    simulationRef.current = simulation;

    // Create container group
    const container = svg.append('g');

    // Add zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.5, 3])
      .on('zoom', (event) => {
        container.attr('transform', event.transform);
      });

    svg.call(zoom as any);

    // Create links
    const link = container
      .selectAll('.link')
      .data(links)
      .enter()
      .append('line')
      .attr('class', 'link')
      .attr('stroke', currentTheme.colors.border)
      .attr('stroke-width', (d: GraphLink) => Math.sqrt(d.strength) * 2)
      .attr('stroke-opacity', 0.6);

    // Create nodes
    const node = container
      .selectAll('.node')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .style('cursor', 'pointer');

    // Add circles to nodes
    node
      .append('circle')
      .attr('r', (d: GraphNode) => d.id === centerReference ? 20 : 15)
      .attr('fill', (d: GraphNode) => d.id === centerReference ? currentTheme.colors.primary : currentTheme.colors.accent)
      .attr('stroke', currentTheme.colors.surface)
      .attr('stroke-width', 2);

    // Add labels to nodes
    node
      .append('text')
      .text((d: GraphNode) => `${d.book} ${d.chapter}:${d.verse}`)
      .attr('text-anchor', 'middle')
      .attr('dy', -25)
      .attr('font-size', '10px')
      .attr('fill', currentTheme.colors.text)
      .attr('font-weight', (d: GraphNode) => d.id === centerReference ? 'bold' : 'normal');

    // Add click handlers
    node.on('click', (event, d: GraphNode) => {
      event.stopPropagation();
      onReferenceClick?.(d);
    });

    // Add hover effects
    node
      .on('mouseover', function(event, d: GraphNode) {
        d3.select(this)
          .select('circle')
          .transition()
          .duration(200)
          .attr('r', (d.id === centerReference ? 20 : 15) * 1.2);
        
        // Highlight connected links
        link
          .attr('stroke-opacity', (l: GraphLink) => {
            return (l.source as GraphNode).id === d.id || (l.target as GraphNode).id === d.id ? 1 : 0.2;
          });
      })
      .on('mouseout', function(event, d: GraphNode) {
        d3.select(this)
          .select('circle')
          .transition()
          .duration(200)
          .attr('r', d.id === centerReference ? 20 : 15);
        
        // Reset link opacity
        link.attr('stroke-opacity', 0.6);
      });

    // Add drag behavior
    const drag = d3.drag<SVGGElement, GraphNode>()
      .on('start', (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    node.call(drag);

    // Update positions on simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: GraphLink) => (d.source as GraphNode).x!)
        .attr('y1', (d: GraphLink) => (d.source as GraphNode).y!)
        .attr('x2', (d: GraphLink) => (d.target as GraphNode).x!)
        .attr('y2', (d: GraphLink) => (d.target as GraphNode).y!);

      node.attr('transform', (d: GraphNode) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [nodes, links, centerReference, currentTheme, width, height, onReferenceClick]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="border rounded-xl overflow-hidden"
      style={{
        borderColor: currentTheme.colors.border,
        backgroundColor: currentTheme.colors.surface
      }}
    >
      <div className="p-4 border-b" style={{ borderColor: currentTheme.colors.border }}>
        <h3 className="text-lg font-semibold" style={{ color: currentTheme.colors.text }}>
          Cross Reference Network
        </h3>
        <p className="text-sm mt-1" style={{ color: currentTheme.colors.textSecondary }}>
          Drag nodes to explore connections • Click to navigate
        </p>
      </div>
      
      <div className="relative">
        <svg
          ref={svgRef}
          width={width}
          height={height}
          style={{ backgroundColor: currentTheme.colors.background }}
        />
        
        {/* Legend */}
        <div className="absolute top-4 right-4 p-3 rounded-lg" 
          style={{ backgroundColor: currentTheme.colors.surface + 'E6' }}>
          <div className="flex items-center gap-2 mb-2">
            <div 
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: currentTheme.colors.primary }}
            />
            <span className="text-xs" style={{ color: currentTheme.colors.text }}>
              Current Verse
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: currentTheme.colors.accent }}
            />
            <span className="text-xs" style={{ color: currentTheme.colors.text }}>
              Related Verses
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

CrossReferenceGraph.displayName = 'CrossReferenceGraph';