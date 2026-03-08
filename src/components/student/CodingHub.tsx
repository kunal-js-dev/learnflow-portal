import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ExternalLink, Play, Upload, Send, Timer, Code, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

const PLATFORMS = [
  { name: 'HackerRank', url: 'https://hackerrank.com', color: 'bg-success/10 text-success' },
  { name: 'HackerEarth', url: 'https://hackerearth.com', color: 'bg-primary/10 text-primary' },
  { name: 'LeetCode', url: 'https://leetcode.com', color: 'bg-warning/10 text-warning' },
  { name: 'CodeChef', url: 'https://codechef.com', color: 'bg-accent/10 text-accent' },
  { name: 'Coderbyte', url: 'https://coderbyte.com', color: 'bg-info/10 text-info' },
];

const LANGUAGES = [
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'c', label: 'C' },
];

const PROGRAMMIZ_URLS: Record<string, string> = {
  html: 'https://www.programiz.com/html/online-compiler/',
  css: 'https://www.programiz.com/html/online-compiler/',
  javascript: 'https://www.programiz.com/javascript/online-compiler/',
  python: 'https://www.programiz.com/python-programming/online-compiler/',
  c: 'https://www.programiz.com/c-programming/online-compiler/',
};

const DEFAULT_CODE: Record<string, string> = {
  html: '<!DOCTYPE html>\n<html>\n<head>\n  <title>Hello</title>\n</head>\n<body>\n  <h1>Hello, World!</h1>\n</body>\n</html>',
  css: 'body {\n  background: #f0f0f0;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-height: 100vh;\n}\n\nh1 {\n  color: #333;\n}',
  javascript: '// JavaScript Code\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n\nconsole.log(greet("World"));',
  python: '# Python Code\ndef greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("World"))',
  c: '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}',
};

const CodingHub = () => {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(DEFAULT_CODE['javascript']);
  const [timerStarted, setTimerStarted] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    let interval: number;
    if (timerStarted) {
      interval = window.setInterval(() => setSeconds(s => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timerStarted]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLanguageChange = (val: string) => {
    setLanguage(val);
    setCode(DEFAULT_CODE[val] || '');
  };

  const handleStartCoding = () => {
    setTimerStarted(true);
    setSeconds(0);
    toast.info('Timer started! Good luck coding.');
  };

  const handleCompile = () => {
    const url = PROGRAMMIZ_URLS[language];
    if (url) window.open(url, '_blank');
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setUploadedImage(reader.result as string);
      reader.readAsDataURL(file);
      toast.success('Screenshot uploaded!');
    }
  };

  const handleSubmit = () => {
    if (!timerStarted) {
      toast.error('Please start coding first to begin the timer.');
      return;
    }
    setTimerStarted(false);
    toast.success(`Code submitted! Time: ${formatTime(seconds)}`);
    // Mock submission
    console.log({
      language,
      code,
      timeTaken: seconds,
      image: uploadedImage,
      submittedAt: new Date().toISOString(),
    });
  };

  // Disable right-click and copy/paste in editor
  const preventActions = useCallback((e: React.SyntheticEvent) => {
    e.preventDefault();
    toast.warning('Copy/Paste is disabled in the coding editor.');
  }, []);

  const lineNumbers = code.split('\n').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-foreground">Coding Practice Hub</h2>
        <p className="text-sm text-muted-foreground mt-1">Practice coding on external platforms or use the built-in editor</p>
      </div>

      {/* External Platforms */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Coding Platforms</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {PLATFORMS.map(p => (
            <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer">
              <Card className="shadow-card hover:shadow-elevated transition-all hover:-translate-y-0.5 cursor-pointer">
                <CardContent className="p-3 flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${p.color}`}>
                    <Code className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-medium text-foreground">{p.name}</span>
                  <ExternalLink className="w-3 h-3 text-muted-foreground ml-auto" />
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </div>

      {/* Built-in Editor */}
      <Card className="shadow-elevated">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <CardTitle className="text-base">Code Editor</CardTitle>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Timer className="w-4 h-4" />
                <span className="font-mono font-semibold text-foreground">{formatTime(seconds)}</span>
              </div>
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-32 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map(l => (
                    <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!timerStarted && (
                <Button size="sm" onClick={handleStartCoding} className="gradient-primary text-primary-foreground">
                  Start Coding
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="relative rounded-lg border border-border bg-foreground/[0.02] overflow-hidden">
            {/* Line numbers */}
            <div className="absolute left-0 top-0 bottom-0 w-10 bg-muted/50 border-r border-border flex flex-col items-end pt-3 pr-2 text-xs text-muted-foreground font-mono select-none overflow-hidden">
              {Array.from({ length: lineNumbers }, (_, i) => (
                <div key={i} className="leading-5">{i + 1}</div>
              ))}
            </div>
            <textarea
              ref={editorRef}
              value={code}
              onChange={e => setCode(e.target.value)}
              onCopy={preventActions}
              onPaste={preventActions}
              onCut={preventActions}
              onContextMenu={preventActions}
              className="code-editor w-full min-h-[300px] p-3 pl-14 bg-transparent resize-y text-sm leading-5 text-foreground focus:outline-none no-select"
              spellCheck={false}
            />
          </div>

          {uploadedImage && (
            <div className="relative inline-block">
              <img src={uploadedImage} alt="Upload" className="max-h-32 rounded-lg border border-border" />
              <button
                onClick={() => setUploadedImage(null)}
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center"
              >
                ×
              </button>
            </div>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            <Button size="sm" variant="outline" onClick={handleCompile}>
              <Play className="w-4 h-4 mr-1" /> Compile
            </Button>
            <Button size="sm" variant="outline" onClick={handleImageUpload}>
              <ImageIcon className="w-4 h-4 mr-1" /> Upload Image
            </Button>
            <Button size="sm" onClick={handleSubmit} className="gradient-primary text-primary-foreground">
              <Send className="w-4 h-4 mr-1" /> Submit
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CodingHub;
