'use client';

import { useState } from 'react';
import { SelectionPanel } from '@/components/SelectionPanel';
import { ResultsPanel } from '@/components/ResultsPanel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Product, BusinessObjective, Segment, PromptType } from '@/types';
import { PROMPT_TYPES } from '@/lib/constants';
import { useSWOTAnalysis } from '@/hooks/useSWOTAnalysis';
import { Zap, Loader2, RefreshCw } from 'lucide-react';

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedObjective, setSelectedObjective] = useState<BusinessObjective | null>(null);
  const [selectedSegments, setSelectedSegments] = useState<Segment[]>([]);
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);

  const { 
    responses, 
    isGenerating, 
    generateInsight, 
    clearResponses, 
    getResponseByKeys 
  } = useSWOTAnalysis();

  const handleSegmentToggle = (segment: Segment) => {
    setSelectedSegments(prev => {
      const isSelected = prev.some(s => s.id === segment.id);
      if (isSelected) {
        return prev.filter(s => s.id !== segment.id);
      } else {
        return [...prev, segment];
      }
    });
  };

  const handleClearSelections = () => {
    setSelectedProduct(null);
    setSelectedObjective(null);
    setSelectedSegments([]);
    clearResponses();
  };

  const handleGenerateInsight = async (segment: Segment, promptType: PromptType) => {
    if (!selectedProduct || !selectedObjective) return;
    
    const prompt = promptType.prompt(segment.name, selectedProduct.name, selectedObjective.name);
    await generateInsight(selectedProduct, selectedObjective, segment, promptType.id, prompt);
  };

  const handleGenerateAllInsights = async () => {
    if (!selectedProduct || !selectedObjective || selectedSegments.length === 0) return;
    
    setIsGeneratingAll(true);
    
    try {
      for (const segment of selectedSegments) {
        for (const promptType of PROMPT_TYPES) {
          const prompt = promptType.prompt(segment.name, selectedProduct.name, selectedObjective.name);
          await generateInsight(selectedProduct, selectedObjective, segment, promptType.id, prompt);
          // Small delay to avoid overwhelming the API
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    } catch (error) {
      console.error('Error generating all insights:', error);
    } finally {
      setIsGeneratingAll(false);
    }
  };

  const canGenerate = selectedProduct && selectedObjective && selectedSegments.length > 0;
  const totalPossibleInsights = selectedSegments.length * PROMPT_TYPES.length;
  const generatedInsights = responses.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">🧪 SWOT Prompt Explorer</h1>
              <p className="text-muted-foreground mt-2">
                Generate strategic insights across customer segments with AI-powered analysis
              </p>
            </div>
            <Badge variant="secondary" className="hidden sm:flex">
              Subconscious.ai Case Study
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Selection Panel */}
          <div className="lg:col-span-4">
            <SelectionPanel
              selectedProduct={selectedProduct}
              selectedObjective={selectedObjective}
              selectedSegments={selectedSegments}
              onProductChange={setSelectedProduct}
              onObjectiveChange={setSelectedObjective}
              onSegmentToggle={handleSegmentToggle}
              onClearSelections={handleClearSelections}
              disabled={isGenerating || isGeneratingAll}
            />

            {/* Generate All Button */}
            {canGenerate && (
              <Card className="mt-6">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Bulk Generation
                  </CardTitle>
                  <CardDescription>
                    Generate all {totalPossibleInsights} insights at once
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress:</span>
                      <span className="font-medium">
                        {generatedInsights}/{totalPossibleInsights} insights
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(generatedInsights / totalPossibleInsights) * 100}%` }}
                      />
                    </div>
                    <Button
                      onClick={handleGenerateAllInsights}
                      disabled={isGenerating || isGeneratingAll}
                      className="w-full"
                    >
                      {isGeneratingAll ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Generating All Insights...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Generate All Insights
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-8">
            <ResultsPanel
              responses={responses}
              selectedSegments={selectedSegments}
              isGenerating={isGenerating}
              onGenerateInsight={handleGenerateInsight}
              getResponseByKeys={getResponseByKeys}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              Built with Next.js, TypeScript, Tailwind CSS, and OpenAI
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Powered by AI insights</span>
              <Separator orientation="vertical" className="h-4" />
              <span>Real-time analysis</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
