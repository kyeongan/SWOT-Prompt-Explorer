import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Target, 
  TrendingUp, 
  TrendingDown, 
  Lightbulb, 
  AlertTriangle, 
  Crosshair, 
  User, 
  DollarSign, 
  Share2,
  Loader2
} from 'lucide-react';
import { SWOTResponse, Segment, PromptType } from '@/types';
import { PROMPT_TYPES } from '@/lib/constants';

interface ResultsPanelProps {
  responses: SWOTResponse[];
  selectedSegments: Segment[];
  isGenerating: boolean;
  onGenerateInsight: (segment: Segment, promptType: PromptType) => Promise<void>;
  getResponseByKeys: (segmentId: string, promptTypeId: string) => SWOTResponse | undefined;
}

const iconMap = {
  Target,
  TrendingUp,
  TrendingDown,
  Lightbulb,
  AlertTriangle,
  Crosshair,
  User,
  DollarSign,
  Share2,
};

export function ResultsPanel({ 
  responses, 
  selectedSegments, 
  isGenerating, 
  onGenerateInsight,
  getResponseByKeys 
}: ResultsPanelProps) {
  if (selectedSegments.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>SWOT Analysis Results</CardTitle>
          <CardDescription>
            Select segments and configuration to start generating insights.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <Lightbulb className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Choose your product, objective, and segments to begin the analysis.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>SWOT Analysis Results</CardTitle>
        <CardDescription>
          Generated insights for {selectedSegments.length} segment{selectedSegments.length !== 1 ? 's' : ''}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={selectedSegments[0]?.id} className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1">
            {selectedSegments.map((segment) => (
              <TabsTrigger key={segment.id} value={segment.id} className="text-xs">
                {segment.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {selectedSegments.map((segment) => (
            <TabsContent key={segment.id} value={segment.id} className="space-y-4">
              <div className="mb-4">
                <h3 className="text-lg font-semibold">{segment.name}</h3>
                <p className="text-sm text-muted-foreground">{segment.description}</p>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {PROMPT_TYPES.map((promptType) => {
                  const response = getResponseByKeys(segment.id, promptType.id);
                  const IconComponent = iconMap[promptType.icon as keyof typeof iconMap];
                  
                  return (
                    <Card key={promptType.id} className="relative">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                          <IconComponent className="w-4 h-4" />
                          <CardTitle className="text-sm">{promptType.name}</CardTitle>
                        </div>
                        <CardDescription className="text-xs">
                          {promptType.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {response ? (
                          <div className="space-y-2">
                            <div className="text-sm whitespace-pre-wrap">
                              {response.content}
                            </div>
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="text-xs">
                                {new Date(response.timestamp).toLocaleTimeString()}
                              </Badge>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onGenerateInsight(segment, promptType)}
                                disabled={isGenerating}
                                className="text-xs"
                              >
                                {isGenerating ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  'Regenerate'
                                )}
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {isGenerating ? (
                              <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                              </div>
                            ) : (
                              <Button
                                onClick={() => onGenerateInsight(segment, promptType)}
                                disabled={isGenerating}
                                className="w-full"
                                size="sm"
                              >
                                Generate Insight
                              </Button>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
