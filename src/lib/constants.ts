import { Product, BusinessObjective, Segment, PromptType } from "@/types";

export const PRODUCTS: Product[] = [
  {
    id: "electric-cars",
    name: "Electric Cars",
    description: "Sustainable electric vehicle solutions",
  },
  {
    id: "coffee",
    name: "Coffee",
    description: "Premium coffee products and services",
  },
  {
    id: "fitness-app",
    name: "Fitness App",
    description: "Digital fitness and wellness platform",
  },
  {
    id: "saas-platform",
    name: "SaaS Platform",
    description: "Business automation software solution",
  },
];

export const BUSINESS_OBJECTIVES: BusinessObjective[] = [
  {
    id: "increase-awareness",
    name: "Increase Awareness",
    description: "Build brand recognition and visibility",
  },
  {
    id: "increase-consideration",
    name: "Increase Consideration",
    description: "Drive evaluation and interest",
  },
  {
    id: "increase-sales",
    name: "Increase Sales",
    description: "Convert prospects to customers",
  },
  {
    id: "improve-retention",
    name: "Improve Retention",
    description: "Enhance customer loyalty and lifetime value",
  },
];

export const SEGMENTS: Segment[] = [
  {
    id: "gen-z-creators",
    name: "Gen Z Creators",
    description: "Young content creators and influencers (18-26)",
  },
  {
    id: "urban-climate-advocates",
    name: "Urban Climate Advocates",
    description: "Environmentally conscious urban professionals",
  },
  {
    id: "cost-sensitive-smb",
    name: "Cost-Sensitive SMB Owners",
    description: "Small business owners focused on value and ROI",
  },
  {
    id: "retired-diyers",
    name: "Retired DIYers",
    description: "Active retirees who enjoy hands-on projects",
  },
  {
    id: "enterprise-it-leaders",
    name: "Enterprise IT Leaders",
    description: "Technology decision-makers in large organizations",
  },
];

export const PROMPT_TYPES: PromptType[] = [
  {
    id: "marketing-okrs",
    name: "Marketing OKRs",
    description: "Measurable marketing objectives and key results",
    icon: "Target",
    prompt: (segment, product, objective) =>
      `What are 3 measurable marketing OKRs to ${objective.toLowerCase()} for ${product} in the ${segment} segment?`,
  },
  {
    id: "strengths",
    name: "Strengths",
    description: "Product strengths that matter to this segment",
    icon: "TrendingUp",
    prompt: (segment, product, objective) =>
      `What ${product} strengths matter most to ${segment} when trying to ${objective.toLowerCase()}?`,
  },
  {
    id: "weaknesses",
    name: "Weaknesses",
    description: "Concerns and potential dislikes",
    icon: "TrendingDown",
    prompt: (segment, product, objective) =>
      `What would ${segment} be concerned about or dislike when considering ${product} to ${objective.toLowerCase()}?`,
  },
  {
    id: "opportunities",
    name: "Opportunities",
    description: "Product and brand opportunities to unlock",
    icon: "Lightbulb",
    prompt: (segment, product, objective) =>
      `What ${product} opportunities can we unlock by targeting ${segment} to ${objective.toLowerCase()}?`,
  },
  {
    id: "threats",
    name: "Threats",
    description: "Risks preventing adoption or loyalty",
    icon: "AlertTriangle",
    prompt: (segment, product, objective) =>
      `What risks might prevent ${segment} from adopting or staying loyal to ${product} when trying to ${objective.toLowerCase()}?`,
  },
  {
    id: "market-positioning",
    name: "Market Positioning",
    description: "How to position the product effectively",
    icon: "Crosshair",
    prompt: (segment, product, objective) =>
      `How should we position ${product} to resonate with ${segment} to ${objective.toLowerCase()}?`,
  },
  {
    id: "buyer-persona",
    name: "Buyer Persona",
    description: "Detailed customer persona profile",
    icon: "User",
    prompt: (segment, product, objective) =>
      `Write a sample persona for a typical ${segment} customer interested in ${product} to ${objective.toLowerCase()}.`,
  },
  {
    id: "investment-opportunities",
    name: "Investment Opportunities",
    description: "Strategic value from growth perspective",
    icon: "DollarSign",
    prompt: (segment, product, objective) =>
      `Why is ${segment} strategically valuable from a growth/investment perspective for ${product} when trying to ${objective.toLowerCase()}?`,
  },
  {
    id: "channels-distribution",
    name: "Channels & Distribution",
    description: "How to reach and activate the segment",
    icon: "Share2",
    prompt: (segment, product, objective) =>
      `How should we reach and activate ${segment} for ${product} to ${objective.toLowerCase()}?`,
  },
];
