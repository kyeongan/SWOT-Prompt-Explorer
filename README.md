# 🧪 SWOT Prompt Explorer

A live web application for generating strategic SWOT analysis insights across different customer segments using AI-powered prompts.

**🔗 Live Demo:** https://swop-blond.vercel.app/

## Features

- **Product & Objective Selection**: Choose from predefined products and business objectives
- **Segment-Based Analysis**: Target multiple customer segments simultaneously
- **AI-Powered Insights**: Generate comprehensive SWOT analysis using OpenAI's GPT models
- **Clean Interface**: Modern, responsive UI built with Next.js and shadcn/ui
- **Real-time Results**: Live generation and display of strategic insights
- **Bulk Generation**: Generate all insights at once for efficient analysis

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **AI Integration**: OpenAI API
- **Icons**: Lucide React

## Getting Started

1. **Clone and install dependencies**:

   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env.local` file and add your OpenAI API key:

   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

3. **Run the development server**:

   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

1. **Select Configuration**:

   - Choose a product (Electric Cars, Coffee, Fitness App, etc.)
   - Select a business objective (Increase Awareness, Sales, etc.)
   - Pick target segments (Gen Z Creators, Urban Climate Advocates, etc.)

2. **Generate Insights**:

   - Click individual insight types for specific analysis
   - Use "Generate All Insights" for comprehensive SWOT analysis
   - View real-time progress and results

3. **Explore Results**:
   - Browse insights across different segments using tabs
   - Compare findings between segments
   - Regenerate specific insights as needed

## Prompt Types

The application generates insights for 9 key areas:

- **Marketing OKRs**: Measurable objectives and key results
- **Strengths**: Product advantages for each segment
- **Weaknesses**: Potential concerns and dislikes
- **Opportunities**: Growth and brand opportunities
- **Threats**: Adoption risks and loyalty challenges
- **Market Positioning**: Segment-specific positioning strategies
- **Buyer Personas**: Detailed customer profiles
- **Investment Opportunities**: Strategic growth value
- **Channels & Distribution**: Activation and reach strategies

## Project Structure

```
src/
├── app/
│   ├── api/generate/       # OpenAI API integration
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx           # Main application
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── SelectionPanel.tsx # Product/segment selection
│   └── ResultsPanel.tsx   # Results display
├── hooks/
│   └── useSWOTAnalysis.ts # Analysis state management
├── lib/
│   ├── constants.ts       # App data and prompts
│   ├── openai.ts         # OpenAI service
│   └── utils.ts          # Utility functions
└── types/
    └── index.ts          # TypeScript definitions
```

## Environment Variables

| Variable              | Description                      | Required |
| --------------------- | -------------------------------- | -------- |
| `OPENAI_API_KEY`      | Your OpenAI API key              | Yes      |
| `NEXT_PUBLIC_APP_URL` | Application URL (for production) | No       |

## Deployment

This app is deployed live on Vercel: https://swop-blond.vercel.app/

For your own deployment, recommended platforms:

- **Vercel**: `npm run build && vercel --prod`
- **Netlify**: `npm run build && netlify deploy --prod`
- **Railway**: Connect your GitHub repository

Make sure to set your environment variables in your deployment platform.

## Built for Subconscious.ai Case Study

This application demonstrates:

- Clean, professional UI design
- Real-time AI integration
- Strategic business analysis capabilities
- Modern web development practices
- Responsive, mobile-friendly design

---

_Powered by OpenAI • Built with Next.js, TypeScript & Tailwind CSS_
