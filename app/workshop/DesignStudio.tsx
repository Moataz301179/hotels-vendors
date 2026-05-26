'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Monitor, Upload, ImagePlus, Palette, Edit3, MessageSquare, 
  Sparkles, X, ChevronDown, Type, Layout, MousePointer,
  Send, Eye, Code, Smartphone, Tablet, MonitorPlay
} from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────

interface DesignAsset {
  id: string;
  name: string;
  type: 'image' | 'logo' | 'icon' | 'font';
  url: string;
  uploadedAt: string;
}

interface DesignComment {
  id: string;
  targetSelector: string;
  text: string;
  author: 'user' | 'ai';
  timestamp: string;
  resolved: boolean;
}

interface ColorTheme {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  muted: string;
}

interface PreviewDevice {
  name: string;
  width: number;
  height: number;
  icon: React.ReactNode;
}

interface ClickedElement {
  tag: string;
  selector: string;
  text: string;
  className: string;
}

// ─── Preset Themes ─────────────────────────────────────────────────

const PRESET_THEMES: ColorTheme[] = [
  {
    name: 'HotelsVendors Blue',
    primary: '#0284c7',
    secondary: '#0ea5e9',
    accent: '#f59e0b',
    background: '#f8fafc',
    surface: '#ffffff',
    text: '#0f172a',
    muted: '#64748b',
  },
  {
    name: 'Executive Dark',
    primary: '#1a1a2e',
    secondary: '#16213e',
    accent: '#c4a882',
    background: '#faf8f5',
    surface: '#ffffff',
    text: '#1a1a2e',
    muted: '#9ca3af',
  },
  {
    name: 'Sage Organic',
    primary: '#8b9a7d',
    secondary: '#a8b89a',
    accent: '#d4a574',
    background: '#f5f3f0',
    surface: '#ffffff',
    text: '#2d2d2d',
    muted: '#8a8a8a',
  },
  {
    name: 'Coral Energy',
    primary: '#e85d4c',
    secondary: '#f07060',
    accent: '#a3e635',
    background: '#fef2f2',
    surface: '#ffffff',
    text: '#1f1f1f',
    muted: '#78716c',
  },
];

const DEVICES: PreviewDevice[] = [
  { name: 'Mobile', width: 375, height: 812, icon: <Smartphone size={16} /> },
  { name: 'Tablet', width: 768, height: 1024, icon: <Tablet size={16} /> },
  { name: 'Desktop', width: 1280, height: 800, icon: <MonitorPlay size={16} /> },
];

// ─── Main Component ────────────────────────────────────────────────

export default function DesignStudio() {
  // ── State ──────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<'preview' | 'assets' | 'comments' | 'code'>('preview');
  const [selectedDevice, setSelectedDevice] = useState<PreviewDevice>(DEVICES[2]);
  const [currentTheme, setCurrentTheme] = useState<ColorTheme>(PRESET_THEMES[0]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedElement, setSelectedElement] = useState<ClickedElement | null>(null);
  const [editText, setEditText] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showAssetUpload, setShowAssetUpload] = useState(false);
  const [assets, setAssets] = useState<DesignAsset[]>([]);
  const [comments, setComments] = useState<DesignComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{role: 'user'|'ai', text: string}>>([]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('/sketches/001-command-center/index.html');
  const [showDeviceDropdown, setShowDeviceDropdown] = useState(false);
  const [customColors, setCustomColors] = useState<Partial<ColorTheme>>({});
  const [appliedCss, setAppliedCss] = useState<string>('');
  const [iframeLoaded, setIframeLoaded] = useState(false);
  
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // ── Effects ────────────────────────────────────────────────────
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isAiTyping]);

  // Inject theme CSS variables into iframe
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe?.contentDocument) return;
    
    const theme = { ...currentTheme, ...customColors };
    const style = iframe.contentDocument.createElement('style');
    style.id = 'design-studio-theme';
    style.textContent = `
      :root {
        --hv-primary: ${theme.primary};
        --hv-secondary: ${theme.secondary};
        --hv-accent: ${theme.accent};
        --hv-bg: ${theme.background};
        --hv-surface: ${theme.surface};
        --hv-text: ${theme.text};
        --hv-muted: ${theme.muted};
      }
    `;
    
    const existing = iframe.contentDocument.getElementById('design-studio-theme');
    if (existing) existing.remove();
    iframe.contentDocument.head.appendChild(style);
  }, [currentTheme, customColors]);

  // Inject edit-mode click listener into iframe
  const injectClickHandler = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe?.contentDocument || !isEditMode) return;

    const doc = iframe.contentDocument;

    // Clean up old
    const oldScript = doc.getElementById('design-studio-click-handler');
    if (oldScript) oldScript.remove();
    const oldStyle = doc.getElementById('design-studio-highlight-style');
    if (oldStyle) oldStyle.remove();

    // Inject highlight style
    const style = doc.createElement('style');
    style.id = 'design-studio-highlight-style';
    style.textContent = '.ds-highlight { outline: 3px solid #a3e635 !important; outline-offset: 3px !important; cursor: pointer !important; }';
    doc.head.appendChild(style);

    // Inject script
    const script = doc.createElement('script');
    script.id = 'design-studio-click-handler';
    script.textContent = `
      (function() {
        if (window.__dsClickHandler) {
          document.removeEventListener('click', window.__dsClickHandler, true);
        }
        window.__dsClickHandler = function(e) {
          if (e.target.closest('#design-studio-ui')) return;
          e.preventDefault();
          e.stopPropagation();
          const el = e.target.closest ? e.target.closest('[class], [id]') : e.target;
          if (!el) return;
          
          // Build a robust selector
          let selector = el.tagName.toLowerCase();
          if (el.id) {
            selector += '#' + el.id;
          } else if (el.className && typeof el.className === 'string') {
            const classes = el.className.split(' ').filter(c => c && !c.startsWith('ds-'));
            if (classes.length) {
              // Use first 3 classes for stability
              selector += '.' + classes.slice(0, 3).join('.');
            }
          }
          
          // Highlight
          document.querySelectorAll('.ds-highlight').forEach(h => h.classList.remove('ds-highlight'));
          el.classList.add('ds-highlight');
          
          // Notify parent
          window.parent.postMessage({
            type: 'DS_ELEMENT_CLICKED',
            tag: el.tagName,
            selector: selector,
            text: (el.textContent || '').trim().slice(0, 500),
            className: el.className || ''
          }, '*');
        };
        document.addEventListener('click', window.__dsClickHandler, true);
      })();
    `;
    doc.head.appendChild(script);
  }, [isEditMode]);

  useEffect(() => {
    if (iframeLoaded && isEditMode) {
      injectClickHandler();
    }
    if (!isEditMode) {
      const iframe = iframeRef.current;
      if (iframe?.contentDocument) {
        const doc = iframe.contentDocument;
        const script = doc.getElementById('design-studio-click-handler');
        if (script) script.remove();
        const style = doc.getElementById('design-studio-highlight-style');
        if (style) style.remove();
        doc.querySelectorAll('.ds-highlight').forEach((h: any) => h.classList.remove('ds-highlight'));
      }
    }
  }, [isEditMode, iframeLoaded, injectClickHandler, previewUrl]);

  // Listen for messages from iframe
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'DS_ELEMENT_CLICKED') {
        setSelectedElement({
          tag: e.data.tag,
          selector: e.data.selector,
          text: e.data.text,
          className: e.data.className,
        });
        setEditText(e.data.text);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  // ── Handlers ───────────────────────────────────────────────────
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    for (const file of Array.from(files)) {
      try {
        const dataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        
        const res = await fetch('/api/v1/design/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ file: dataUrl, name: file.name, type: file.type }),
        });
        
        if (!res.ok) {
          console.error('Upload failed for', file.name, await res.text());
          continue;
        }
        
        const uploaded = await res.json();
        const newAsset: DesignAsset = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: file.type.startsWith('image/') ? 'image' : 'icon',
          url: uploaded.url,
          uploadedAt: new Date().toISOString(),
        };
        setAssets(prev => [...prev, newAsset]);
      } catch (err) {
        console.error('Upload error:', err);
      }
    }
    setShowAssetUpload(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !selectedElement) return;
    
    const comment: DesignComment = {
      id: Math.random().toString(36).substr(2, 9),
      targetSelector: selectedElement.selector,
      text: newComment,
      author: 'user',
      timestamp: new Date().toISOString(),
      resolved: false,
    };
    setComments(prev => [...prev, comment]);
    setNewComment('');
  };

  const handleAiChat = async () => {
    if (!chatInput.trim() || isAiTyping) return;
    
    const userMsg = chatInput;
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsAiTyping(true);
    
    try {
      const res = await fetch('/api/v1/design/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMsg, 
          currentDesign: { theme: currentTheme, device: selectedDevice.name, previewUrl } 
        }),
      });
      
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'AI request failed');
      }
      
      const data = await res.json();
      setIsAiTyping(false);
      setChatHistory(prev => [...prev, { role: 'ai', text: data.reply }]);
      
      // Apply CSS changes if returned
      if (data.suggestedCss && iframeRef.current?.contentDocument) {
        const iframe = iframeRef.current;
        let style = iframe.contentDocument.getElementById('design-studio-ai-css');
        if (!style) {
          style = iframe.contentDocument.createElement('style');
          style.id = 'design-studio-ai-css';
          iframe.contentDocument.head.appendChild(style);
        }
        const newCss = (appliedCss ? appliedCss + '\n' : '') + data.suggestedCss;
        style.textContent = newCss;
        setAppliedCss(newCss);
        
        // Also flash a confirmation
        setChatHistory(prev => [...prev, { 
          role: 'ai', 
          text: `✓ CSS applied to preview (${data.source || 'ai'})` 
        }]);
      }
    } catch (err: any) {
      setIsAiTyping(false);
      setChatHistory(prev => [...prev, { role: 'ai', text: `Error: ${err.message}` }]);
    }
  };

  const applyTextEdit = () => {
    const iframe = iframeRef.current;
    if (!iframe?.contentDocument || !selectedElement) return;
    
    try {
      const el = iframe.contentDocument.querySelector(selectedElement.selector);
      if (el) {
        el.textContent = editText;
        setChatHistory(prev => [...prev, { 
          role: 'ai', 
          text: `✓ Updated "${selectedElement.selector}"` 
        }]);
      } else {
        setChatHistory(prev => [...prev, { 
          role: 'ai', 
          text: `⚠ Could not find element: ${selectedElement.selector}` 
        }]);
      }
    } catch (e: any) {
      setChatHistory(prev => [...prev, { role: 'ai', text: `Error: ${e.message}` }]);
    }
    
    setSelectedElement(null);
    setEditText('');
  };

  const handleAiImproveText = async () => {
    if (!editText.trim() || !selectedElement) return;
    
    setChatHistory(prev => [...prev, { role: 'user', text: `Improve: "${editText}"` }]);
    setIsAiTyping(true);
    
    try {
      const res = await fetch('/api/v1/design/improve-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: editText }),
      });
      if (!res.ok) throw new Error('Improve text failed');
      const data = await res.json();
      setIsAiTyping(false);
      
      // Apply to iframe immediately
      const iframe = iframeRef.current;
      if (iframe?.contentDocument && selectedElement) {
        const el = iframe.contentDocument.querySelector(selectedElement.selector);
        if (el) {
          el.textContent = data.improved;
          setEditText(data.improved);
        }
      }
      
      setChatHistory(prev => [...prev, { role: 'ai', text: `✓ Improved: "${data.improved}"` }]);
    } catch (err: any) {
      setIsAiTyping(false);
      setChatHistory(prev => [...prev, { role: 'ai', text: `Error: ${err.message}` }]);
    }
  };

  // ── Render ─────────────────────────────────────────────────────
  return (
    <div className="h-screen flex flex-col bg-[#0f0f11] text-white">
      
      {/* ═══ TOP BAR ═══ */}
      <header className="h-14 bg-[#161618] border-b border-white/10 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#a3e635] rounded-lg flex items-center justify-center">
            <Monitor size={18} className="text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-sm">Design Studio</h1>
            <p className="text-xs text-white/30">Mission Control v3</p>
          </div>
        </div>

        {/* Device Selector */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <button 
              onClick={() => setShowDeviceDropdown(!showDeviceDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg text-sm hover:bg-white/10 transition-colors"
            >
              {selectedDevice.icon}
              <span>{selectedDevice.name}</span>
              <ChevronDown size={14} />
            </button>
            {showDeviceDropdown && (
              <div className="absolute top-full mt-1 left-0 bg-[#161618] rounded-lg border border-white/10 overflow-hidden z-50">
                {DEVICES.map(device => (
                  <button
                    key={device.name}
                    onClick={() => { setSelectedDevice(device); setShowDeviceDropdown(false); }}
                    className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/5 w-full text-left"
                  >
                    {device.icon}
                    {device.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsEditMode(!isEditMode)}
            className={`p-2 rounded-lg transition-colors ${isEditMode ? 'bg-[#a3e635] text-white' : 'hover:bg-white/5 text-white/40'}`}
            title="Edit Preview"
          >
            <Edit3 size={18} />
          </button>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded-lg hover:bg-white/5 text-white/40 transition-colors"
            title="Add File / Logo"
          >
            <Upload size={18} />
          </button>
          <button 
            onClick={() => setShowAssetUpload(true)}
            className="p-2 rounded-lg hover:bg-white/5 text-white/40 transition-colors"
            title="Add Logo"
          >
            <ImagePlus size={18} />
          </button>
          <button 
            onClick={() => setShowColorPicker(!showColorPicker)}
            className={`p-2 rounded-lg transition-colors ${showColorPicker ? 'bg-[#a3e635] text-white' : 'hover:bg-white/5 text-white/40'}`}
            title="Change Colors"
          >
            <Palette size={18} />
          </button>
          <div className="w-px h-6 bg-white/10 mx-1" />
          <button className="px-4 py-1.5 bg-[#a3e635] text-white rounded-lg text-sm font-medium hover:bg-[#6d28d9] transition-colors">
            Publish
          </button>
        </div>

        <input 
          ref={fileInputRef}
          type="file" 
          multiple 
          accept="image/*" 
          className="hidden" 
          onChange={handleFileUpload}
        />
      </header>

      {/* ═══ MAIN BODY ═══ */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* ─── Left: Preview ─── */}
        <div className="flex-1 bg-[#0f0f11] flex items-center justify-center p-8 relative">
          {/* Device Frame */}
          <div 
            className="bg-white rounded-lg shadow-2xl overflow-hidden transition-all duration-300"
            style={{ 
              width: selectedDevice.width * 0.7, 
              height: selectedDevice.height * 0.7,
              maxHeight: '85vh'
            }}
          >
            <iframe
              ref={iframeRef}
              src={previewUrl}
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin"
              onLoad={() => setIframeLoaded(true)}
            />
          </div>

          {/* Edit Mode Overlay */}
          {isEditMode && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#a3e635] text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                <MousePointer size={14} className="inline mr-2" />
                Click any element to edit
              </div>
            </div>
          )}
        </div>

        {/* ─── Right: Sidebar ─── */}
        <aside className="w-96 bg-[#161618] border-l border-white/10 flex flex-col">
          
          {/* Tabs */}
          <div className="flex border-b border-white/10">
            {[
              { id: 'preview', icon: Eye, label: 'Preview' },
              { id: 'assets', icon: Layout, label: 'Assets' },
              { id: 'comments', icon: MessageSquare, label: 'Comments' },
              { id: 'code', icon: Code, label: 'Code' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm transition-colors ${
                  activeTab === tab.id ? 'text-[#a3e635] border-b-2 border-[#a3e635]' : 'text-white/30 hover:text-white/60'
                }`}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto">
            
            {/* PREVIEW TAB */}
            {activeTab === 'preview' && (
              <div className="p-4 space-y-4">
                {/* Theme Selector */}
                <div>
                  <h3 className="text-sm font-medium mb-3">Color Theme</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {PRESET_THEMES.map(theme => (
                      <button
                        key={theme.name}
                        onClick={() => setCurrentTheme(theme)}
                        className={`p-3 rounded-lg border transition-all text-left ${
                          currentTheme.name === theme.name 
                            ? 'border-[#a3e635] bg-white/5' 
                            : 'border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="flex gap-1 mb-2">
                          <div className="w-4 h-4 rounded-full" style={{ background: theme.primary }} />
                          <div className="w-4 h-4 rounded-full" style={{ background: theme.accent }} />
                          <div className="w-4 h-4 rounded-full" style={{ background: theme.background }} />
                        </div>
                        <p className="text-xs font-medium">{theme.name}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Colors */}
                {showColorPicker && (
                  <div className="p-3 bg-white/5 rounded-lg space-y-3">
                    <h3 className="text-sm font-medium">Custom Colors</h3>
                    {Object.entries(currentTheme).filter(([k]) => k !== 'name').map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-xs text-white/30 capitalize">{key}</span>
                        <div className="flex items-center gap-2">
                          <input 
                            type="color" 
                            value={customColors[key as keyof ColorTheme] || value}
                            onChange={(e) => setCustomColors(prev => ({ ...prev, [key]: e.target.value }))}
                            className="w-8 h-8 rounded cursor-pointer"
                          />
                          <span className="text-xs font-mono text-white/20 w-16">
                            {customColors[key as keyof ColorTheme] || value}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Preview Selector */}
                <div>
                  <h3 className="text-sm font-medium mb-3">Design Variants</h3>
                  <div className="space-y-2">
                    {[
                      { url: '/sketches/001-command-center/index.html', name: 'Command Center', desc: 'Dense data-focused' },
                      { url: '/sketches/002-executive-summary/index.html', name: 'Executive Summary', desc: 'Premium editorial' },
                      { url: '/sketches/003-operations-hub/index.html', name: 'Operations Hub', desc: 'Workflow + chat' },
                    ].map(variant => (
                      <button
                        key={variant.url}
                        onClick={() => { setPreviewUrl(variant.url); setIframeLoaded(false); }}
                        className={`w-full p-3 rounded-lg border text-left transition-all ${
                          previewUrl === variant.url 
                            ? 'border-[#a3e635] bg-white/5' 
                            : 'border-white/10 hover:border-white/20'
                        }`}
                      >
                        <p className="text-sm font-medium">{variant.name}</p>
                        <p className="text-xs text-white/30">{variant.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ASSETS TAB */}
            {activeTab === 'assets' && (
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium">Uploaded Assets</h3>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs text-[#a3e635] hover:text-[#a78bfa]"
                  >
                    + Upload
                  </button>
                </div>
                
                {assets.length === 0 ? (
                  <div className="text-center py-8 text-white/30">
                    <ImagePlus size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No assets yet</p>
                    <p className="text-xs mt-1">Upload logos, images, icons</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {assets.map(asset => (
                      <div key={asset.id} className="group relative aspect-square bg-white/5 rounded-lg overflow-hidden">
                        <img src={asset.url} alt={asset.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button className="p-1 bg-white/20 rounded text-white">
                            <Edit3 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* COMMENTS TAB */}
            {activeTab === 'comments' && (
              <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {comments.length === 0 ? (
                    <div className="text-center py-8 text-white/30">
                      <MessageSquare size={32} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No comments yet</p>
                      <p className="text-xs mt-1">Click edit mode, then click any element to comment</p>
                    </div>
                  ) : (
                    comments.map(comment => (
                      <div key={comment.id} className={`p-3 rounded-lg ${comment.author === 'ai' ? 'bg-[#a3e635]/10 border border-[#a3e635]/20' : 'bg-white/5'}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-medium ${comment.author === 'ai' ? 'text-[#a78bfa]' : 'text-[#a3e635]'}`}>
                            {comment.author === 'ai' ? 'AI Agent' : 'You'}
                          </span>
                          <span className="text-xs text-white/20">
                            {new Date(comment.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm text-white/70">{comment.text}</p>
                        <p className="text-xs text-white/20 mt-1">on {comment.targetSelector}</p>
                      </div>
                    ))
                  )}
                </div>
                
                {selectedElement && (
                  <div className="p-3 border-t border-white/10 bg-[#161618]">
                    <p className="text-xs text-white/30 mb-2">Commenting on: {selectedElement.selector}</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#a3e635] text-white placeholder-white/20"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                      />
                      <button 
                        onClick={handleAddComment}
                        className="p-2 bg-[#a3e635] text-white rounded-lg hover:bg-[#6d28d9]"
                      >
                        <Send size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* CODE TAB */}
            {activeTab === 'code' && (
              <div className="p-4">
                <div className="bg-[#0f0f11] rounded-lg p-4 font-mono text-xs text-white/60 overflow-x-auto">
                  <pre>{`/* Current Theme CSS */
:root {
  --hv-primary: ${currentTheme.primary};
  --hv-secondary: ${currentTheme.secondary};
  --hv-accent: ${currentTheme.accent};
  --hv-bg: ${currentTheme.background};
  --hv-surface: ${currentTheme.surface};
  --hv-text: ${currentTheme.text};
  --hv-muted: ${currentTheme.muted};
}`}</pre>
                </div>
                {appliedCss && (
                  <div className="mt-3">
                    <h4 className="text-xs font-medium text-white/40 mb-1">Applied AI CSS</h4>
                    <div className="bg-[#0f0f11] rounded-lg p-4 font-mono text-xs text-white/60 overflow-x-auto max-h-40 overflow-y-auto">
                      <pre>{appliedCss}</pre>
                    </div>
                  </div>
                )}
                <button 
                  onClick={() => navigator.clipboard.writeText(appliedCss || '/* No CSS applied yet */')}
                  className="mt-3 w-full py-2 bg-white/5 text-white/60 rounded-lg text-sm hover:bg-white/10 transition-colors"
                >
                  Copy CSS to Clipboard
                </button>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* ═══ BOTTOM: AI CHAT BAR ═══ */}
      <div className="h-auto bg-[#161618] border-t border-white/10 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Chat History */}
          {chatHistory.length > 0 && (
            <div className="mb-3 space-y-2 max-h-40 overflow-y-auto">
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                    msg.role === 'user' 
                      ? 'bg-[#a3e635] text-white' 
                      : 'bg-white/5 text-white/70'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isAiTyping && (
                <div className="flex gap-2">
                  <div className="bg-white/5 px-3 py-2 rounded-lg">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-white/30 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          )}
          
          {/* Input */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Describe changes: 'Make the header darker', 'Generate a better headline'..."
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-[#a3e635] pr-12 text-white placeholder-white/20"
                onKeyPress={(e) => e.key === 'Enter' && handleAiChat()}
              />
              <Sparkles size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a3e635]" />
            </div>
            <button 
              onClick={handleAiChat}
              disabled={!chatInput.trim() || isAiTyping}
              className="px-6 py-3 bg-[#a3e635] text-white rounded-xl text-sm font-medium hover:bg-[#6d28d9] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isAiTyping ? 'Working...' : 'Send'}
            </button>
          </div>
          
          <div className="flex items-center gap-4 mt-2 text-xs text-white/30">
            <span className="flex items-center gap-1">
              <Type size={12} />
              Click text to edit inline
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare size={12} />
              Comment on any element
            </span>
            <span className="flex items-center gap-1">
              <Sparkles size={12} />
              AI will generate and apply changes
            </span>
          </div>
        </div>
      </div>

      {/* ═══ MODALS ═══ */}
      
      {/* Text Edit Modal */}
      {selectedElement && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => { setSelectedElement(null); setEditText(''); }}>
          <div className="bg-[#161618] rounded-xl border border-white/10 p-6 w-[28rem]" onClick={e => e.stopPropagation()}>
            <h3 className="font-semibold mb-1 text-white">Edit Text</h3>
            <p className="text-xs text-white/30 mb-3 font-mono">{selectedElement.selector}</p>
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#a3e635] mb-4 text-white placeholder-white/20"
              rows={3}
            />
            <div className="flex gap-2">
              <button 
                onClick={applyTextEdit}
                className="flex-1 py-2 bg-[#a3e635] text-white rounded-lg text-sm font-medium hover:bg-[#6d28d9]"
              >
                Apply
              </button>
              <button 
                onClick={() => { setSelectedElement(null); setEditText(''); }}
                className="flex-1 py-2 bg-white/5 text-white/60 rounded-lg text-sm hover:bg-white/10"
              >
                Cancel
              </button>
            </div>
            <button 
              onClick={handleAiImproveText}
              disabled={isAiTyping}
              className="w-full mt-2 py-2 bg-[#a3e635]/10 text-[#a78bfa] rounded-lg text-sm hover:bg-[#a3e635]/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Sparkles size={14} />
              Ask AI to Improve
            </button>
          </div>
        </div>
      )}

      {/* Asset Upload Modal */}
      {showAssetUpload && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setShowAssetUpload(false)}>
          <div className="bg-[#161618] rounded-xl border border-white/10 p-6 w-96" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">Upload Assets</h3>
              <button onClick={() => setShowAssetUpload(false)}>
                <X size={18} className="text-white/30" />
              </button>
            </div>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-white/10 rounded-lg p-8 text-center cursor-pointer hover:border-[#a3e635] transition-colors"
            >
              <Upload size={32} className="mx-auto mb-2 text-white/30" />
              <p className="text-sm text-white/40">Drop files or click to browse</p>
              <p className="text-xs text-white/20 mt-1">PNG, JPG, SVG, WEBP</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
