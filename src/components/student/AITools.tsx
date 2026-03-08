import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink, Bot, Brain, Image, Music, Video, FileText, Code, Sparkles, MessageSquare, Palette, Globe, Mic, PenTool, Layers, Zap } from 'lucide-react';

const AI_TOOLS = [
  { name: 'ChatGPT', url: 'https://chat.openai.com', icon: MessageSquare, color: 'bg-success/10 text-success' },
  { name: 'Google Gemini', url: 'https://gemini.google.com', icon: Sparkles, color: 'bg-primary/10 text-primary' },
  { name: 'Claude AI', url: 'https://claude.ai', icon: Brain, color: 'bg-warning/10 text-warning' },
  { name: 'Midjourney', url: 'https://midjourney.com', icon: Image, color: 'bg-accent/10 text-accent' },
  { name: 'DALL-E', url: 'https://openai.com/dall-e-3', icon: Palette, color: 'bg-destructive/10 text-destructive' },
  { name: 'Copilot', url: 'https://copilot.microsoft.com', icon: Code, color: 'bg-info/10 text-info' },
  { name: 'Perplexity', url: 'https://perplexity.ai', icon: Globe, color: 'bg-primary/10 text-primary' },
  { name: 'ElevenLabs', url: 'https://elevenlabs.io', icon: Mic, color: 'bg-success/10 text-success' },
  { name: 'Runway ML', url: 'https://runwayml.com', icon: Video, color: 'bg-warning/10 text-warning' },
  { name: 'Canva AI', url: 'https://canva.com', icon: PenTool, color: 'bg-accent/10 text-accent' },
  { name: 'Notion AI', url: 'https://notion.so', icon: FileText, color: 'bg-muted text-foreground' },
  { name: 'Gamma', url: 'https://gamma.app', icon: Layers, color: 'bg-info/10 text-info' },
  { name: 'Suno AI', url: 'https://suno.ai', icon: Music, color: 'bg-destructive/10 text-destructive' },
  { name: 'Jasper AI', url: 'https://jasper.ai', icon: Zap, color: 'bg-warning/10 text-warning' },
  { name: 'Hugging Face', url: 'https://huggingface.co', icon: Bot, color: 'bg-success/10 text-success' },
  { name: 'Stable Diffusion', url: 'https://stability.ai', icon: Sparkles, color: 'bg-primary/10 text-primary' },
];

const AITools = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-foreground">AI Tools Dashboard</h2>
        <p className="text-sm text-muted-foreground mt-1">Explore AI-powered productivity tools</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {AI_TOOLS.map(tool => (
          <a
            key={tool.name}
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group"
          >
            <Card className="shadow-card hover:shadow-elevated transition-all group-hover:-translate-y-0.5 h-full">
              <CardContent className="p-4 flex flex-col items-center text-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tool.color} transition-transform group-hover:scale-110`}>
                  <tool.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{tool.name}</p>
                  <div className="flex items-center justify-center gap-1 mt-1 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink className="w-3 h-3" /> Open
                  </div>
                </div>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
};

export default AITools;
