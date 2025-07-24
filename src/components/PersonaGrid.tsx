'use client';

import { useState, useMemo } from 'react';
import { Responsive, WidthProvider, Layout } from 'react-grid-layout';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import ReactMarkdown from 'react-markdown';
import { 
  User, 
  Users, 
  Grip, 
  Lock, 
  Unlock,
  RefreshCw
} from 'lucide-react';
import { Segment, SWOTResponse } from '@/types';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface PersonaGridProps {
  segments: Segment[];
  responses: SWOTResponse[];
  getResponseByKeys: (segmentId: string, promptTypeId: string) => SWOTResponse | undefined;
  onRegeneratePersona?: (segment: Segment) => void;
}

interface PersonaData {
  segment: Segment;
  persona: SWOTResponse | undefined;
  stats: {
    totalInsights: number;
    completionRate: number;
  };
}

export function PersonaGrid({ segments, responses, getResponseByKeys, onRegeneratePersona }: PersonaGridProps) {
  const [isEditable, setIsEditable] = useState(true);
  const [layouts, setLayouts] = useState<{ [key: string]: Layout[] }>({});

  // Generate persona data for each segment
  const personaData: PersonaData[] = useMemo(() => {
    return segments.map(segment => {
      const segmentResponses = responses.filter(r => r.segmentId === segment.id);
      const persona = getResponseByKeys(segment.id, 'buyer-persona');
      
      return {
        segment,
        persona,
        stats: {
          totalInsights: segmentResponses.length,
          completionRate: Math.round((segmentResponses.length / 9) * 100), // 9 total prompt types
        }
      };
    });
  }, [segments, responses, getResponseByKeys]);

  // Generate layout for grid
  const generateLayout = () => {
    return personaData.map((data, index) => ({
      i: data.segment.id,
      x: (index % 3) * 4,
      y: Math.floor(index / 3) * 6,
      w: 4,
      h: 6,
      minW: 3,
      minH: 4,
    }));
  };

  const defaultLayout = generateLayout();

  const onLayoutChange = (layout: Layout[], layouts: { [key: string]: Layout[] }) => {
    setLayouts(layouts);
  };

  if (segments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Persona Grid
          </CardTitle>
          <CardDescription>
            Interactive grid of customer personas across segments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            <p>Generate personas to see the interactive grid</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Interactive Persona Grid
            </CardTitle>
            <CardDescription>
              Drag and resize persona cards • {personaData.filter(p => p.persona).length} of {segments.length} personas generated
            </CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Lock className="w-4 h-4" />
              <Switch
                checked={isEditable}
                onCheckedChange={setIsEditable}
              />
              <Unlock className="w-4 h-4" />
            </div>
            <Badge variant="outline" className="flex items-center gap-1">
              <Grip className="w-3 h-3" />
              Draggable
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="min-h-[600px]">
          <ResponsiveGridLayout
            className="layout"
            layouts={layouts}
            onLayoutChange={onLayoutChange}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            rowHeight={60}
            isDraggable={isEditable}
            isResizable={isEditable}
            margin={[16, 16]}
            containerPadding={[0, 0]}
            useCSSTransforms={true}
          >
            {personaData.map((data, index) => (
              <div key={data.segment.id}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="h-full"
                >
                  <Card className="h-full flex flex-col">
                    <CardHeader className="pb-3 flex-shrink-0">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <User className="w-4 h-4" />
                          {data.segment.name}
                        </CardTitle>
                        <div className="flex items-center gap-1">
                          <Badge 
                            variant={data.stats.completionRate === 100 ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {data.stats.completionRate}%
                          </Badge>
                          {onRegeneratePersona && data.persona && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => onRegeneratePersona(data.segment)}
                              className="h-6 w-6 p-0"
                            >
                              <RefreshCw className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                      <CardDescription className="text-xs line-clamp-2">
                        {data.segment.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-hidden">
                      {data.persona ? (
                        <div className="h-full overflow-y-auto">
                          <div className="prose prose-xs max-w-none">
                            <ReactMarkdown 
                              components={{
                                p: ({ children }) => <p className="text-xs mb-2 leading-relaxed">{children}</p>,
                                ul: ({ children }) => <ul className="text-xs mb-2 pl-3">{children}</ul>,
                                li: ({ children }) => <li className="mb-1">{children}</li>,
                                strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                              }}
                            >
                              {data.persona.content}
                            </ReactMarkdown>
                          </div>
                          <div className="mt-3 pt-2 border-t text-xs text-muted-foreground">
                            <div className="flex items-center justify-between">
                              <span>{data.stats.totalInsights} insights</span>
                              <span>{new Date(data.persona.timestamp).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground">
                          <User className="w-8 h-8 mb-2 opacity-50" />
                          <p className="text-xs">No persona generated</p>
                          <p className="text-xs mt-1">Generate buyer persona insights</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            ))}
          </ResponsiveGridLayout>
        </div>

        {/* Grid Stats */}
        <div className="mt-6 pt-4 border-t">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{segments.length}</div>
              <div className="text-xs text-muted-foreground">Total Segments</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{personaData.filter(p => p.persona).length}</div>
              <div className="text-xs text-muted-foreground">Personas Generated</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{responses.length}</div>
              <div className="text-xs text-muted-foreground">Total Insights</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {Math.round(personaData.reduce((acc, p) => acc + p.stats.completionRate, 0) / personaData.length || 0)}%
              </div>
              <div className="text-xs text-muted-foreground">Avg Completion</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Add required CSS for react-grid-layout
export const gridLayoutStyles = `
.react-grid-item {
  transition: all 200ms ease;
  transition-property: left, top;
}

.react-grid-item.cssTransforms {
  transition-property: transform;
}

.react-grid-item > .react-resizable-handle {
  position: absolute;
  width: 20px;
  height: 20px;
  bottom: 0;
  right: 0;
  background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNiIgaGVpZ2h0PSI2IiB2aWV3Qm94PSIwIDAgNiA2IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxnIGZpbGw9IiM0NDRCNTQ4IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Im0wIDZoNnYtNmgtNnoiLz48L2c+PC9zdmc+');
  background-position: bottom right;
  padding: 0 3px 3px 0;
  background-repeat: no-repeat;
  background-origin: content-box;
  box-sizing: border-box;
  cursor: se-resize;
  opacity: 0.3;
  transition: opacity 0.2s;
}

.react-grid-item:hover > .react-resizable-handle {
  opacity: 0.6;
}

.react-grid-item.react-grid-placeholder {
  background: rgba(0, 0, 0, 0.1);
  opacity: 0.2;
  transition-duration: 100ms;
  z-index: 2;
  user-select: none;
  border-radius: 8px;
}
`;
