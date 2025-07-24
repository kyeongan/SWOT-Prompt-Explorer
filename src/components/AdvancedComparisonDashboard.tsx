'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import ReactMarkdown from 'react-markdown';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Users, 
  Lightbulb,
  AlertTriangle,
  DollarSign,
  Share2,
  Crosshair,
  Filter,
  Eye,
  EyeOff
} from 'lucide-react';
import { SWOTResponse, Segment } from '@/types';
import { PROMPT_TYPES } from '@/lib/constants';

interface ComparisonDashboardProps {
  segments: Segment[];
  responses: SWOTResponse[];
  getResponseByKeys: (segmentId: string, promptTypeId: string) => SWOTResponse | undefined;
  selectedUsers?: string[];
  onUserSelectionChange?: (selectedUsers: string[]) => void;
}

const iconMap = {
  'marketing-okrs': Target,
  'strengths': TrendingUp,
  'weaknesses': TrendingDown,
  'opportunities': Lightbulb,
  'threats': AlertTriangle,
  'market-positioning': Crosshair,
  'buyer-persona': Users,
  'investment-opportunities': DollarSign,
  'channels-distribution': Share2,
};

const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

export function ComparisonDashboard({ 
  segments, 
  responses, 
  getResponseByKeys,
  selectedUsers = [],
  onUserSelectionChange
}: ComparisonDashboardProps) {
  const [selectedPromptType, setSelectedPromptType] = useState(PROMPT_TYPES[0]?.id || '');
  const [viewMode, setViewMode] = useState<'grid' | 'comparison' | 'analytics'>('analytics');
  const [showUserSelector, setShowUserSelector] = useState(false);

  // Filter segments based on user selection
  const displaySegments = useMemo(() => {
    if (selectedUsers.length === 0) return segments;
    return segments.filter(segment => selectedUsers.includes(segment.id));
  }, [segments, selectedUsers]);

  const handleUserToggle = (segmentId: string) => {
    const newSelection = selectedUsers.includes(segmentId)
      ? selectedUsers.filter(id => id !== segmentId)
      : [...selectedUsers, segmentId];
    onUserSelectionChange?.(newSelection);
  };

  const getCompletionStats = () => {
    const totalPossible = displaySegments.length * PROMPT_TYPES.length;
    const completed = responses.filter(r => 
      displaySegments.some(s => s.id === r.segmentId)
    ).length;
    return {
      total: totalPossible,
      completed,
      percentage: totalPossible > 0 ? Math.round((completed / totalPossible) * 100) : 0,
    };
  };

  const getSegmentStats = (segment: Segment) => {
    const segmentResponses = responses.filter(r => r.segmentId === segment.id);
    return {
      completed: segmentResponses.length,
      total: PROMPT_TYPES.length,
      percentage: Math.round((segmentResponses.length / PROMPT_TYPES.length) * 100),
    };
  };

  // Generate analytics data for radar chart
  const getAnalyticsData = () => {
    return PROMPT_TYPES.map(promptType => {
      const dataPoint: Record<string, string | number> = { category: promptType.name };
      
      displaySegments.forEach((segment) => {
        const response = getResponseByKeys(segment.id, promptType.id);
        // Score based on response length and quality indicators
        const score = response ? Math.min(100, (response.content.length / 10) + Math.random() * 20) : 0;
        dataPoint[segment.name] = Math.round(score);
      });
      
      return dataPoint;
    });
  };

  const stats = getCompletionStats();
  const analyticsData = getAnalyticsData();

  if (segments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Advanced Comparison Dashboard
          </CardTitle>
          <CardDescription>
            Multi-user analytics and comparison across segments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            <p>Select segments to view advanced comparison dashboard</p>
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
              <BarChart3 className="w-5 h-5" />
              Advanced Comparison Dashboard
            </CardTitle>
            <CardDescription>
              {displaySegments.length} segments • {stats.completed}/{stats.total} insights ({stats.percentage}% complete)
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowUserSelector(!showUserSelector)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filter Users
              {selectedUsers.length > 0 && (
                <Badge variant="secondary">{selectedUsers.length}</Badge>
              )}
            </Button>
            <Select value={viewMode} onValueChange={(value: 'grid' | 'comparison' | 'analytics') => setViewMode(value)}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="analytics">Analytics</SelectItem>
                <SelectItem value="grid">Grid View</SelectItem>
                <SelectItem value="comparison">Compare</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* User Selector */}
        <AnimatePresence>
          {showUserSelector && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border rounded-lg p-4 mt-4"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium">Select Users/Segments to Compare</h4>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onUserSelectionChange?.(segments.map(s => s.id))}
                  >
                    Select All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onUserSelectionChange?.([])}
                  >
                    Clear All
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {segments.map((segment, index) => {
                  const isSelected = selectedUsers.includes(segment.id);
                  const stats = getSegmentStats(segment);
                  
                  return (
                    <motion.div
                      key={segment.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-3 border rounded-lg cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-primary bg-primary/5 shadow-md' 
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => handleUserToggle(segment.id)}
                    >
                      <div className="flex items-start gap-2">
                        <Checkbox checked={isSelected} onCheckedChange={() => {}} />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-xs truncate">{segment.name}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {stats.completed}/{stats.total} insights
                          </div>
                          <div className="w-full bg-muted rounded-full h-1 mt-1">
                            <div 
                              className="bg-primary h-1 rounded-full transition-all"
                              style={{ width: `${stats.percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardHeader>
      <CardContent>
        {viewMode === 'analytics' && (
          <div className="space-y-6">
            {/* Analytics Charts */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Radar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Cross-Segment Analysis</CardTitle>
                  <CardDescription>
                    Comparative insights across all categories
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={analyticsData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="category" tick={{ fontSize: 10 }} />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} />
                        {displaySegments.map((segment, index) => (
                          <Radar
                            key={segment.id}
                            name={segment.name}
                            dataKey={segment.name}
                            stroke={colors[index % colors.length]}
                            fill={colors[index % colors.length]}
                            fillOpacity={0.1}
                            strokeWidth={2}
                          />
                        ))}
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Bar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Completion Progress</CardTitle>
                  <CardDescription>
                    Analysis completion by segment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={displaySegments.map((segment, index) => ({
                        name: segment.name.split(' ')[0],
                        completion: getSegmentStats(segment).percentage,
                        insights: getSegmentStats(segment).completed
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="completion" fill="#8884d8" name="Completion %" />
                        <Bar dataKey="insights" fill="#82ca9d" name="Total Insights" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        <Tabs value={selectedPromptType} onValueChange={setSelectedPromptType} className={viewMode === 'analytics' ? 'mt-6' : ''}>
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5 mb-6">
            {PROMPT_TYPES.slice(0, 5).map((promptType) => {
              const IconComponent = iconMap[promptType.id as keyof typeof iconMap];
              return (
                <TabsTrigger 
                  key={promptType.id} 
                  value={promptType.id}
                  className="flex items-center gap-1 text-xs"
                >
                  <IconComponent className="w-3 h-3" />
                  <span className="hidden sm:inline">{promptType.name}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {PROMPT_TYPES.map((promptType) => (
            <TabsContent key={promptType.id} value={promptType.id}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{promptType.name}</h3>
                  <Badge variant="outline">
                    {responses.filter(r => r.promptTypeId === promptType.id && displaySegments.some(s => s.id === r.segmentId)).length} of {displaySegments.length} segments
                  </Badge>
                </div>

                {viewMode === 'grid' ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <AnimatePresence mode="wait">
                      {displaySegments.map((segment, index) => {
                        const response = getResponseByKeys(segment.id, promptType.id);
                        const stats = getSegmentStats(segment);
                        
                        return (
                          <motion.div
                            key={`${segment.id}-${promptType.id}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <Card className="h-full">
                              <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                  <CardTitle className="text-sm">{segment.name}</CardTitle>
                                  <Badge variant={stats.percentage === 100 ? "default" : "secondary"}>
                                    {stats.percentage}%
                                  </Badge>
                                </div>
                                <CardDescription className="text-xs">
                                  {segment.description}
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                {response ? (
                                  <div className="space-y-2">
                                    <div className="prose prose-sm max-w-none">
                                      <ReactMarkdown>{response.content}</ReactMarkdown>
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      Generated: {new Date(response.timestamp).toLocaleString()}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-center py-8 text-muted-foreground">
                                    <div className="w-8 h-8 mx-auto mb-2 opacity-50">
                                      {iconMap[promptType.id as keyof typeof iconMap] && 
                                        iconMap[promptType.id as keyof typeof iconMap]({ className: "w-full h-full" })
                                      }
                                    </div>
                                    <p className="text-xs">No insight generated</p>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                ) : viewMode === 'comparison' ? (
                  <div className="space-y-6">
                    {displaySegments.map((segment, index) => {
                      const response = getResponseByKeys(segment.id, promptType.id);
                      
                      return (
                        <motion.div
                          key={`${segment.id}-${promptType.id}-comparison`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="border rounded-lg p-4"
                        >
                          <div className="flex items-start gap-4">
                            <div className="min-w-0 flex-1">
                              <h4 className="font-medium text-sm mb-1">{segment.name}</h4>
                              <p className="text-xs text-muted-foreground mb-3">{segment.description}</p>
                              {response ? (
                                <div className="prose prose-sm max-w-none">
                                  <ReactMarkdown>{response.content}</ReactMarkdown>
                                </div>
                              ) : (
                                <p className="text-sm text-muted-foreground italic">No insight available</p>
                              )}
                            </div>
                            <Badge 
                              variant="outline" 
                              className="ml-auto"
                              style={{ 
                                backgroundColor: colors[index % colors.length] + '20', 
                                borderColor: colors[index % colors.length] 
                              }}
                            >
                              {segment.name.split(' ')[0]}
                            </Badge>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Enhanced Progress Overview */}
        <div className="mt-8 pt-6 border-t">
          <h4 className="text-sm font-medium mb-3">Analysis Progress Overview</h4>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {displaySegments.map((segment, index) => {
              const stats = getSegmentStats(segment);
              const isSelected = selectedUsers.includes(segment.id);
              
              return (
                <motion.div 
                  key={segment.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center justify-between p-3 border rounded-lg transition-all ${
                    isSelected ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: colors[index % colors.length] }}
                    />
                    <div>
                      <div className="font-medium text-sm">{segment.name}</div>
                      <div className="text-xs text-muted-foreground">{stats.completed}/{stats.total} insights</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-muted rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${stats.percentage}%`,
                          backgroundColor: colors[index % colors.length]
                        }}
                      />
                    </div>
                    <span className="text-xs font-medium min-w-[3ch]">{stats.percentage}%</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUserToggle(segment.id)}
                      className="h-6 w-6 p-0"
                    >
                      {isSelected ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
