
import React from 'react';
import { 
  Sparkles, ScrollText, Rocket, Image, Clock, 
  UserSearch, BookOpen, History, Settings, 
  Flame, LayoutTemplate, Target, Timer, HelpCircle
} from 'lucide-react';
import { StyleOption, TabType } from './types';

export const STYLE_LIBRARY: StyleOption[] = [
  { value: "cinematic", label: "🎬 Cinematic (Điện ảnh)", prompt: "Photorealistic, 8k, cinematic lighting, shot on Arri Alexa, movie aesthetic." },
  { value: "3d_animation", label: "🧸 Hoạt hình 3D (Pixar)", prompt: "3D Animation style, Pixar/Disney inspired, vivid colors, octane render." },
  { value: "2d_animation", label: "🎨 Hoạt hình 2D", prompt: "Traditional 2D animation, Studio Ghibli aesthetic, fluid movement." },
  { value: "anime", label: "🌸 Anime (Nhật Bản)", prompt: "Japanese Anime style, cel shading, Makoto Shinkai inspired lighting." },
  { value: "cyberpunk", label: "🌃 Cyberpunk (Sci-Fi)", prompt: "Neon lights, futuristic city, high tech low life, purple and blue palette." },
  { value: "horror", label: "👻 Horror (Kinh dị)", prompt: "Dark and moody, low key lighting, ominous shadows, unsettling atmosphere." },
  { value: "watercolor", label: "🖌️ Watercolor (Màu nước)", prompt: "Watercolor painting style, artistic, soft edges, dreamy atmosphere." },
  { value: "scifi_space", label: "🚀 Space (Vũ trụ)", prompt: "High-tech Sci-Fi, interstellar aesthetic, futuristic interfaces." },
  { value: "travel_vlog", label: "📷 Travel Vlog", prompt: "GoPro Hero 11 style, wide angle, POV shot, vibrant saturation." },
  { value: "isometric", label: "🎲 Isometric (3D Game)", prompt: "Isometric view, miniature world, tilt-shift effect, diorama aesthetic." }
];

export const TIMELAPSE_STYLES = [
  { value: "urban_pulse", label: "🏙️ Urban Pulse (Nhịp sống đô thị)" },
  { value: "nature_bloom", label: "🌸 Nature Bloom (Hoa nở/Cây lớn)" },
  { value: "celestial_motion", label: "🌌 Celestial (Sao chạy/Thiên văn)" },
  { value: "construction_build", label: "🏗️ Construction (Xây dựng/Kiến trúc)" },
  { value: "weather_cycle", label: "🌦️ Weather Cycle (Bão/Mây trôi)" },
  { value: "seasonal_shift", label: "🍂 Seasonal (Bốn mùa thay đổi)" },
  { value: "macro_growth", label: "🔬 Macro Growth (Vi mô/Tế bào)" },
  { value: "light_trails", label: "⚡ Light Trails (Vệt sáng đêm)" },
  { value: "human_evolution", label: "👤 Evolution (Người già đi/Thay đổi)" },
  { value: "vintage_decay", label: "🏚️ Vintage Decay (Sự tàn phai/Rỉ sét)" }
];

export const THUMBNAIL_STYLES = [
  { value: "Hyper-realistic", label: "📸 Siêu thực (Real Photo)" },
  { value: "3D Pixar", label: "🧊 3D Render (Pixar/Disney)" },
  { value: "Cyberpunk Glow", label: "🌃 Cyberpunk Neon" },
  { value: "Epic Fantasy", label: "🐉 Fantasy (Kỳ ảo)" },
  { value: "Grand Theft Auto", label: "🎮 GTA Art Style" },
  { value: "Anime Viral", label: "🌸 Anime Viral" },
  { value: "Oil Painting", label: "🖌️ Sơn dầu nghệ thuật" },
  { value: "Minimalist Modern", label: "⚪ Tối giản hiện đại" },
  { value: "Comic Pop Art", label: "💥 Pop Art / Comic" },
  { value: "Dark Cinematic", label: "📽️ Dark Cinema" }
];

export const CAMERA_MOVEMENTS = [
  { value: "static", label: "🎥 Static (Cố định)" },
  { value: "pan", label: "↔️ Pan (Quay ngang)" },
  { value: "tilt", label: "↕️ Tilt (Quay dọc)" },
  { value: "zoom", label: "🔍 Zoom (Phóng/Thu)" },
  { value: "dolly", label: "🚋 Dolly (Di chuyển)" },
  { value: "orbit", label: "🔄 Orbit (Quay vòng)" }
];

export const LIGHTING_MODES = [
  { value: "natural", label: "☀️ Natural (Tự nhiên)" },
  { value: "cinematic", label: "🎬 Cinematic (Điện ảnh)" },
  { value: "neon", label: "🌃 Neon (Đèn Neon)" },
  { value: "golden_hour", label: "🌅 Golden Hour (Giờ vàng)" },
  { value: "studio", label: "📸 Studio (Phòng studio)" },
  { value: "dramatic", label: "🕯️ Dramatic (Kịch tính)" }
];

// Mới bổ sung cho SEO
export const SEO_STYLES = [
  { value: "clickbait", label: "🔥 Clickbait (Gây sốc)" },
  { value: "professional", label: "👔 Chuyên gia (Uy tín)" },
  { value: "storytelling", label: "📖 Kể chuyện (Cuốn hút)" },
  { value: "minimalist", label: "⚪ Tối giản (Súc tích)" }
];

// Mới bổ sung cho Script
export const SCRIPT_FORMATS = [
  { value: "vlog", label: "🤳 Vlog POV" },
  { value: "documentary", label: "🏛️ Tài liệu" },
  { value: "movie", label: "🎬 Phim ngắn" },
  { value: "review", label: "📦 Review sản phẩm" }
];

// Mới bổ sung cho Visual Prompt
export const FOCUS_MODES = [
  { value: "deep", label: "🖼️ Deep Focus (Rõ nét toàn bộ)" },
  { value: "bokeh", label: "✨ Bokeh (Xóa phông mạnh)" },
  { value: "macro", label: "🔍 Macro (Siêu cận cảnh)" },
  { value: "tilt-shift", label: "🏙️ Tilt-shift (Mô hình nhỏ)" }
];

export const COLOR_GRADES = [
  { value: "standard", label: "🌈 Chuẩn" },
  { value: "teal-orange", label: "🍊 Teal & Orange" },
  { value: "vintage", label: "🎞️ Vintage (Cổ điển)" },
  { value: "bw", label: "🌑 Trắng đen" },
  { value: "vibrant", label: "⚡ Rực rỡ" }
];

export const NAV_ITEMS = [
  { id: 'home' as TabType, label: 'Visual Prompt', icon: <Sparkles className="w-5 h-5" /> },
  { id: 'script' as TabType, label: 'Kịch Bản (Script)', icon: <ScrollText className="w-5 h-5" /> },
  { id: 'video' as TabType, label: 'Video SEO', icon: <Rocket className="w-5 h-5" /> },
  { id: 'thumbnail' as TabType, label: 'Thumbnail', icon: <Image className="w-5 h-5" /> },
  { id: 'timelapse' as TabType, label: 'Timelapse', icon: <Timer className="w-5 h-5" /> },
  { id: 'spy' as TabType, label: 'Spy Video', icon: <UserSearch className="w-5 h-5" /> },
  { id: 'guide' as TabType, label: 'Hướng Dẫn', icon: <HelpCircle className="w-5 h-5" /> },
  { id: 'history' as TabType, label: 'Lịch Sử', icon: <History className="w-5 h-5" /> },
  { id: 'settings' as TabType, label: 'Cài Đặt', icon: <Settings className="w-5 h-5" /> },
];
