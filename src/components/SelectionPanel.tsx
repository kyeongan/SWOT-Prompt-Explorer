import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Product, BusinessObjective, Segment } from '@/types';
import { PRODUCTS, BUSINESS_OBJECTIVES, SEGMENTS } from '@/lib/constants';

interface SelectionPanelProps {
  selectedProduct: Product | null;
  selectedObjective: BusinessObjective | null;
  selectedSegments: Segment[];
  onProductChange: (product: Product) => void;
  onObjectiveChange: (objective: BusinessObjective) => void;
  onSegmentToggle: (segment: Segment) => void;
  onClearSelections: () => void;
  disabled?: boolean;
}

export function SelectionPanel({
  selectedProduct,
  selectedObjective,
  selectedSegments,
  onProductChange,
  onObjectiveChange,
  onSegmentToggle,
  onClearSelections,
  disabled = false
}: SelectionPanelProps) {
  const isSegmentSelected = (segment: Segment) => 
    selectedSegments.some(s => s.id === segment.id);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Analysis Configuration</CardTitle>
        <CardDescription>
          Select your product, objective, and target segments to generate SWOT insights.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Product Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Product</label>
          <Select
            value={selectedProduct?.id || ''}
            onValueChange={(value) => {
              const product = PRODUCTS.find(p => p.id === value);
              if (product) onProductChange(product);
            }}
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose a product..." />
            </SelectTrigger>
            <SelectContent>
              {PRODUCTS.map((product) => (
                <SelectItem key={product.id} value={product.id}>
                  <div className="flex flex-col">
                    <span className="font-medium">{product.name}</span>
                    <span className="text-xs text-muted-foreground">{product.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Business Objective Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Business Objective</label>
          <Select
            value={selectedObjective?.id || ''}
            onValueChange={(value) => {
              const objective = BUSINESS_OBJECTIVES.find(o => o.id === value);
              if (objective) onObjectiveChange(objective);
            }}
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose an objective..." />
            </SelectTrigger>
            <SelectContent>
              {BUSINESS_OBJECTIVES.map((objective) => (
                <SelectItem key={objective.id} value={objective.id}>
                  <div className="flex flex-col">
                    <span className="font-medium">{objective.name}</span>
                    <span className="text-xs text-muted-foreground">{objective.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Segment Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Target Segments (select multiple)</label>
          <div className="grid gap-2">
            {SEGMENTS.map((segment) => (
              <button
                key={segment.id}
                onClick={() => onSegmentToggle(segment)}
                disabled={disabled}
                className={`p-3 text-left border rounded-lg transition-colors ${
                  isSegmentSelected(segment)
                    ? 'border-primary bg-primary/5 hover:bg-primary/10'
                    : 'border-border hover:border-primary/50'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{segment.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">{segment.description}</div>
                  </div>
                  {isSegmentSelected(segment) && (
                    <Badge variant="secondary" className="ml-2">Selected</Badge>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Summary */}
        {(selectedProduct || selectedObjective || selectedSegments.length > 0) && (
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium">Current Selection</h4>
              <Button variant="outline" size="sm" onClick={onClearSelections} disabled={disabled}>
                Clear All
              </Button>
            </div>
            <div className="space-y-2 text-sm">
              {selectedProduct && (
                <div><span className="text-muted-foreground">Product:</span> {selectedProduct.name}</div>
              )}
              {selectedObjective && (
                <div><span className="text-muted-foreground">Objective:</span> {selectedObjective.name}</div>
              )}
              {selectedSegments.length > 0 && (
                <div>
                  <span className="text-muted-foreground">Segments:</span>{' '}
                  {selectedSegments.map(s => s.name).join(', ')}
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
