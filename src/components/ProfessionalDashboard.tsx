'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
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
  Area,
  AreaChart,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { Segment, SWOTResponse } from '@/types';
import { PROMPT_TYPES } from '@/lib/constants';
import { 
  TrendingUp, 
  BarChart3, 
  PieChart as PieChartIcon,
  Activity,
  Target,
  Zap,
  Eye,
  Download,
  Share2
} from 'lucide-react';

const CHART_COLORS = {
  primary: ['#8B5CF6', '#A855F7', '#C084FC', '#DDD6FE'],
  success: ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0'],
  warning: ['#F59E0B', '#FBBF24', '#FCD34D', '#FEF3C7'],
  danger: ['#EF4444', '#F87171', '#FCA5A5', '#FECACA'],
  info: ['#3B82F6', '#60A5FA', '#93C5FD', '#DBEAFE'],
  gradient: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe']
};

export function ProfessionalDashboard({ 
  segments, 
  responses
}: {
  segments: Segment[];
  responses: SWOTResponse[];
}) {
  const [viewMode, setViewMode] = useState<'overview' | 'detailed' | 'comparison'>('overview');
  const [animationSpeed, setAnimationSpeed] = useState([1000]);
  const [showAnimations, setShowAnimations] = useState(true);

  // Enhanced data processing
  const dashboardData = useMemo(() => {
    const segmentStats = segments.map(segment => {
      const segmentResponses = responses.filter(r => r.segmentId === segment.id);
      const strengthsCount = segmentResponses.filter(r => r.promptTypeId === 'strengths').length;
      const weaknessesCount = segmentResponses.filter(r => r.promptTypeId === 'weaknesses').length;
      const opportunitiesCount = segmentResponses.filter(r => r.promptTypeId === 'opportunities').length;
      const threatsCount = segmentResponses.filter(r => r.promptTypeId === 'threats').length;
      
      // Calculate sentiment scores (mock for demo)
      const avgLength = segmentResponses.reduce((acc, r) => acc + r.content.length, 0) / (segmentResponses.length || 1);
      const completeness = (segmentResponses.length / 4) * 100;
      const engagement = Math.min(100, avgLength / 5);
      
      return {
        name: segment.name,
        segment: segment,
        strengths: strengthsCount,
        weaknesses: weaknessesCount,
        opportunities: opportunitiesCount,
        threats: threatsCount,
        total: segmentResponses.length,
        completeness,
        engagement,
        avgLength,
        score: (strengthsCount + opportunitiesCount) - (weaknessesCount + threatsCount) + 50
      };
    });

    const promptTypeStats = PROMPT_TYPES.map(promptType => {
      const typeResponses = responses.filter(r => r.promptTypeId === promptType.id);
      return {
        name: promptType.name,
        id: promptType.id,
        count: typeResponses.length,
        avgLength: typeResponses.reduce((acc, r) => acc + r.content.length, 0) / (typeResponses.length || 1),
        color: '#8B5CF6' // Default color since PromptType doesn't have color property
      };
    });

    return { segmentStats, promptTypeStats };
  }, [segments, responses]);

  const chartVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: animationSpeed[0] / 1000,
        ease: [0.4, 0.0, 0.2, 1] as [number, number, number, number]
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4"
      >
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Analytics Dashboard
          </h2>
          <p className="text-muted-foreground">
            Advanced insights and performance metrics for your SWOT analysis
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Animations</label>
            <Switch 
              checked={showAnimations} 
              onCheckedChange={setShowAnimations}
            />
          </div>
          
          <Separator orientation="vertical" className="h-6" />
          
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </motion.div>

      {/* View Mode Tabs */}
      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'overview' | 'detailed' | 'comparison')} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="detailed" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Detailed
          </TabsTrigger>
          <TabsTrigger value="comparison" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Comparison
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Total Insights', value: responses.length, icon: Zap, color: 'text-purple-600' },
              { title: 'Segments Analyzed', value: segments.length, icon: Target, color: 'text-blue-600' },
              { title: 'Avg Completeness', value: `${Math.round(dashboardData.segmentStats.reduce((acc, s) => acc + s.completeness, 0) / (dashboardData.segmentStats.length || 1))}%`, icon: TrendingUp, color: 'text-green-600' },
              { title: 'Engagement Score', value: `${Math.round(dashboardData.segmentStats.reduce((acc, s) => acc + s.engagement, 0) / (dashboardData.segmentStats.length || 1))}%`, icon: Activity, color: 'text-orange-600' }
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                variants={chartVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.1 }}
              >
                <Card className="relative overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                      </div>
                      <div className={`p-2 rounded-lg bg-muted/50 ${stat.color}`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                    </div>
                  </CardContent>
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500" />
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Main Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Segment Performance Radar */}
            <motion.div variants={chartVariants} initial="hidden" animate="visible">
              <Card className="relative overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-purple-600" />
                    Segment Performance Matrix
                  </CardTitle>
                  <CardDescription>
                    Multi-dimensional analysis of segment strengths and opportunities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={dashboardData.segmentStats}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis 
                        dataKey="name" 
                        tick={{ fontSize: 14, fontWeight: '500' }}
                        className="text-sm font-medium"
                      />
                      <PolarRadiusAxis 
                        angle={30} 
                        domain={[0, 100]} 
                        tick={false}
                      />
                      <Radar
                        name="Completeness"
                        dataKey="completeness"
                        stroke="#8B5CF6"
                        fill="#8B5CF6"
                        fillOpacity={0.2}
                        strokeWidth={2}
                        animationBegin={0}
                        animationDuration={showAnimations ? animationSpeed[0] : 0}
                      />
                      <Radar
                        name="Engagement"
                        dataKey="engagement"
                        stroke="#3B82F6"
                        fill="#3B82F6"
                        fillOpacity={0.2}
                        strokeWidth={2}
                        animationBegin={showAnimations ? 200 : 0}
                        animationDuration={showAnimations ? animationSpeed[0] : 0}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend 
                        wrapperStyle={{ fontSize: '12px', fontWeight: '500' }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            {/* SWOT Distribution Pie */}
            <motion.div variants={chartVariants} initial="hidden" animate="visible">
              <Card className="relative overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="w-5 h-5 text-blue-600" />
                    SWOT Analysis Distribution
                  </CardTitle>
                  <CardDescription>
                    Breakdown of insights across different analysis types
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={dashboardData.promptTypeStats}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={2}
                        dataKey="count"
                        animationBegin={0}
                        animationDuration={showAnimations ? animationSpeed[0] : 0}
                      >
                        {dashboardData.promptTypeStats.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={CHART_COLORS.gradient[index % CHART_COLORS.gradient.length]} 
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend 
                        wrapperStyle={{ fontSize: '12px', fontWeight: '500' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        {/* Detailed Tab */}
        <TabsContent value="detailed" className="space-y-6">
          {/* Segment Deep Dive */}
          <motion.div variants={chartVariants} initial="hidden" animate="visible">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                  Segment Analysis Deep Dive
                </CardTitle>
                <CardDescription>
                  Comprehensive breakdown of insights by segment and category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart
                    data={dashboardData.segmentStats}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 14, fontWeight: '500' }}
                      className="text-sm font-medium"
                    />
                    <YAxis 
                      tick={{ fontSize: 14, fontWeight: '500' }}
                      className="text-sm font-medium" 
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend 
                      wrapperStyle={{ fontSize: '12px', fontWeight: '500' }}
                    />
                    <Bar 
                      dataKey="strengths" 
                      stackId="a" 
                      fill="#10B981" 
                      name="Strengths"
                      animationDuration={showAnimations ? animationSpeed[0] : 0}
                    />
                    <Bar 
                      dataKey="opportunities" 
                      stackId="a" 
                      fill="#3B82F6" 
                      name="Opportunities"
                      animationDuration={showAnimations ? animationSpeed[0] : 0}
                    />
                    <Bar 
                      dataKey="weaknesses" 
                      stackId="a" 
                      fill="#F59E0B" 
                      name="Weaknesses"
                      animationDuration={showAnimations ? animationSpeed[0] : 0}
                    />
                    <Bar 
                      dataKey="threats" 
                      stackId="a" 
                      fill="#EF4444" 
                      name="Threats"
                      animationDuration={showAnimations ? animationSpeed[0] : 0}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Engagement Trends */}
          <motion.div variants={chartVariants} initial="hidden" animate="visible">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  Engagement & Quality Metrics
                </CardTitle>
                <CardDescription>
                  Analysis quality and engagement scores across segments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={dashboardData.segmentStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 14, fontWeight: '500' }}
                      className="text-sm font-medium"
                    />
                    <YAxis 
                      tick={{ fontSize: 14, fontWeight: '500' }}
                      className="text-sm font-medium"
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="engagement"
                      stroke="#8B5CF6"
                      fill="url(#colorEngagement)"
                      animationDuration={showAnimations ? animationSpeed[0] : 0}
                    />
                    <Area
                      type="monotone"
                      dataKey="completeness"
                      stroke="#3B82F6"
                      fill="url(#colorCompleteness)"
                      animationDuration={showAnimations ? animationSpeed[0] : 0}
                    />
                    <defs>
                      <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorCompleteness" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Comparison Tab */}
        <TabsContent value="comparison" className="space-y-6">
          <motion.div variants={chartVariants} initial="hidden" animate="visible">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-orange-600" />
                  Comparative Analysis
                </CardTitle>
                <CardDescription>
                  Side-by-side comparison of segment performance and insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {dashboardData.segmentStats.map((segment, index) => (
                    <motion.div
                      key={segment.name}
                      initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 border rounded-lg bg-gradient-to-br from-background to-muted/20"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-lg">{segment.name}</h3>
                        <Badge 
                          variant={segment.score > 50 ? "default" : "secondary"}
                          className="bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                        >
                          Score: {Math.round(segment.score)}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        {[
                          { label: 'Strengths', value: segment.strengths, color: '#10B981' },
                          { label: 'Opportunities', value: segment.opportunities, color: '#3B82F6' },
                          { label: 'Weaknesses', value: segment.weaknesses, color: '#F59E0B' },
                          { label: 'Threats', value: segment.threats, color: '#EF4444' }
                        ].map((item) => (
                          <div key={item.label} className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">{item.label}</span>
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-16 h-2 rounded-full bg-muted overflow-hidden"
                              >
                                <motion.div
                                  className="h-full rounded-full"
                                  style={{ backgroundColor: item.color }}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${(item.value / 4) * 100}%` }}
                                  transition={{ 
                                    duration: showAnimations ? animationSpeed[0] / 1000 : 0,
                                    delay: index * 0.1 
                                  }}
                                />
                              </div>
                              <span className="text-sm font-medium w-6">{item.value}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Animation Controls */}
      {showAnimations && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-4 p-4 border rounded-lg bg-muted/20"
        >
          <span className="text-sm font-medium">Animation Speed:</span>
          <Slider
            value={animationSpeed}
            onValueChange={setAnimationSpeed}
            max={2000}
            min={200}
            step={100}
            className="flex-1 max-w-32"
          />
          <span className="text-xs text-muted-foreground">
            {animationSpeed[0]}ms
          </span>
        </motion.div>
      )}
    </div>
  );
}
