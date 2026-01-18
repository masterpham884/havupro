
export type TabType = 'home' | 'script' | 'video' | 'thumbnail' | 'timelapse' | 'spy' | 'guide' | 'history' | 'settings';

export interface HistoryItem {
  id: number;
  text: string;
  time: string;
  type: string;
}

export interface ScriptResult {
  character: string;
  background: string;
  script: string;
}

export interface SEOResult {
  title: string;
  description: string;
  hashtags: string;
}

export interface SpyResult {
  title: string;
  description: string;
  prompts: string;
  script: string;
}

export interface ThumbnailVariation {
  id: string;
  prompt: string;
  imageUrl?: string;
  isGenerating?: boolean;
  editInput?: string;
}

export interface StyleOption {
  value: string;
  label: string;
  prompt: string;
}

export type ConsistencyMode = 'dynamic' | 'fixed';
export type VoiceType = 'off' | 'Child' | 'Female' | 'Male' | 'Old' | 'Mixed';
export type TimelapseMode = 'manual' | 'batch' | 'batch_img';
export type ImageQuality = '1K' | '2K' | '4K';

// Tùy chọn bổ sung mới
export type ScriptLength = 'short' | 'standard' | 'long';
export type ScriptFormat = 'vlog' | 'documentary' | 'movie' | 'review';
export type SEOStyle = 'clickbait' | 'professional' | 'storytelling' | 'minimalist';
