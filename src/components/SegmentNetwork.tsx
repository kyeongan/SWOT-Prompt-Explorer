'use client';

import dynamic from 'next/dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Segment, SWOTResponse } from '@/types';
import { PROMPT_TYPES } from '@/lib/constants';

// Dynamic import to avoid SSR issues with force graph
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });

interface SegmentNetworkProps {
  segments: Segment[];
  responses: SWOTResponse[];
}

interface GraphNode {
  id: string;
  name: string;
  type: 'segment' | 'insight';
  group: number;
  size: number;
  color: string;
  x?: number;
  y?: number;
}

interface GraphLink {
  source: string;
  target: string;
  value: number;
  color: string;
}

export function SegmentNetwork({ segments, responses }: SegmentNetworkProps) {

  // Generate graph data
  const getGraphData = () => {
    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];

    // Add segment nodes
    segments.forEach((segment, index) => {
      const segmentResponses = responses.filter(r => r.segmentId === segment.id);
      const completionRate = segmentResponses.length / PROMPT_TYPES.length;
      
      nodes.push({
        id: segment.id,
        name: segment.name,
        type: 'segment',
        group: 1,
        size: 20 + (completionRate * 30), // Size based on completion
        color: `hsl(${210 + index * 60}, 70%, ${50 + completionRate * 20}%)`,
      });

      // Add insight nodes for each segment
      PROMPT_TYPES.forEach((promptType, ptIndex) => {
        const response = segmentResponses.find(r => r.promptTypeId === promptType.id);
        if (response) {
          const insightId = `${segment.id}-${promptType.id}`;
          nodes.push({
            id: insightId,
            name: promptType.name,
            type: 'insight',
            group: 2,
            size: 8,
            color: `hsl(${30 + ptIndex * 40}, 60%, 60%)`,
          });

          // Link segment to insight
          links.push({
            source: segment.id,
            target: insightId,
            value: 1,
            color: 'rgba(128, 128, 128, 0.3)',
          });
        }
      });
    });

    return { nodes, links };
  };

  const graphData = getGraphData();

  if (segments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Segment Network</CardTitle>
          <CardDescription>
            Select segments to see their relationship visualization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            <p>No segments selected</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Segment Network Visualization
          <Badge variant="outline">
            {responses.length} insights generated
          </Badge>
        </CardTitle>
        <CardDescription>
          Interactive network showing segments and their generated insights. 
          Larger nodes indicate more complete analysis.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-96 border rounded-lg overflow-hidden bg-gradient-to-br from-background to-muted/20">
          <ForceGraph2D
            graphData={graphData}
            nodeLabel={(node: any) => `${node.name} (${node.type})`}
            nodeColor={(node: any) => node.color}
            nodeRelSize={1}
            nodeVal={(node: any) => node.size}
            linkColor={(link: any) => link.color}
            linkWidth={2}
            enableNodeDrag={true}
            enableZoomInteraction={true}
            enablePanInteraction={true}
            backgroundColor="transparent"
            width={undefined}
            height={384}
            cooldownTicks={100}
            onNodeClick={(node: any) => {
              if (node.type === 'segment') {
                // Could trigger segment selection
                console.log('Clicked segment:', node.name);
              }
            }}
            nodeCanvasObjectMode={() => 'after'}
            nodeCanvasObject={(node: any, ctx: any, globalScale: any) => {
              const label = node.name;
              const fontSize = 12 / globalScale;
              ctx.font = `${fontSize}px Sans-Serif`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
              ctx.fillText(label, node.x, node.y + node.size + 5);
            }}
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            Segments
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            Insights
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
