import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Heart, Play, X, Sparkles, Sun, Moon, Menu, Loader2, Share2, Globe, RefreshCw } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
  publishedAt: string;
  platform: 'youtube' | 'tiktok';
  embedUrl?: string;
  duration?: string;
  viewCount?: string;
}

interface Quote {
  category: string;
  text: string;
  textEn: string;
}

// Fleurs 3D multicolores
const Flower3D = ({ color, className, style }: { color: string; className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id={`petalGrad${color}`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor={color} stopOpacity="0.9" />
        <stop offset="100%" stopColor={color} stopOpacity="0.3" />
      </radialGradient>
      <filter id={`glow${color}`}>
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    {[...Array(8)].map((_, i) => {
      const angle = (i * 45 * Math.PI) / 180;
      const x = 100 + 70 * Math.cos(angle);
      const y = 100 + 70 * Math.sin(angle);
      return (
        <ellipse key={i} cx={x} cy={y} rx="25" ry="45" fill={`url(#petalGrad${color})`} filter={`url(#glow${color})`} transform={`rotate(${i * 45} ${x} ${y})`} opacity="0.8" />
      );
    })}
    <circle cx="100" cy="100" r="30" fill="#E6E6FA" opacity="0.9" filter={`url(#glow${color})`} />
    <circle cx="100" cy="100" r="15" fill="#FFF" opacity="0.8" />
  </svg>
);

// Papillon SVG
const Butterfly = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="wingGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFB6C1" />
        <stop offset="100%" stopColor="#FF69B4" />
      </linearGradient>
      <linearGradient id="wingGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFC0CB" />
        <stop offset="100%" stopColor="#FF1493" />
      </linearGradient>
    </defs>
    <path d="M50 50 Q30 20 10 30 Q5 50 20 60 Q35 65 50 50" fill="url(#wingGrad1)" opacity="0.9" />
    <path d="M50 50 Q70 20 90 30 Q95 50 80 60 Q65 65 50 50" fill="url(#wingGrad1)" opacity="0.9" />
    <path d="M50 50 Q35 65 25 80 Q30 90 45 85 Q50 75 50 50" fill="url(#wingGrad2)" opacity="0.85" />
    <path d="M50 50 Q65 65 75 80 Q70 90 55 85 Q50 75 50 50" fill="url(#wingGrad2)" opacity="0.85" />
    <ellipse cx="50" cy="55" rx="3" ry="20" fill="#1a0033" />
    <path d="M50 35 Q45 25 40 20" stroke="#1a0033" strokeWidth="1.5" fill="none" />
    <path d="M50 35 Q55 25 60 20" stroke="#1a0033" strokeWidth="1.5" fill="none" />
    <circle cx="40" cy="20" r="2" fill="#FF69B4" />
    <circle cx="60" cy="20" r="2" fill="#FF69B4" />
  </svg>
);

const AndalusianStar = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E6E6FA" />
        <stop offset="50%" stopColor="#C0C0C0" />
        <stop offset="100%" stopColor="#E6E6FA" />
      </linearGradient>
    </defs>
    <path d="M100 20 L115 85 L180 100 L115 115 L100 180 L85 115 L20 100 L85 85 Z" fill="url(#starGrad)" opacity="0.5" />
    <circle cx="100" cy="100" r="15" fill="#E6E6FA" opacity="0.9" />
  </svg>
);

const AndalusianBorder = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 400 40" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
    <defs>
      <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#E6E6FA" stopOpacity="0" />
        <stop offset="50%" stopColor="#FFB6C1" stopOpacity="1" />
        <stop offset="100%" stopColor="#E6E6FA" stopOpacity="0" />
      </linearGradient>
    </defs>
    <path d="M0 20 Q25 5, 50 20 T100 20 T150 20 T200 20 T250 20 T300 20 T350 20 T400 20" stroke="url(#borderGrad)" strokeWidth="2" fill="none" />
    {[...Array(9)].map((_, i) => (
      <circle key={i} cx={50 * i + 25} cy="20" r="3" fill="#FFB6C1" opacity="0.8" />
    ))}
  </svg>
);

const translations = {
  ar: {
    home: "الرئيسية",
    videos: "لحظات",
    quotes: "كلمات",
    tiktok: "تيك توك",
    follow: "تابعوني",
    title: "كُلُّ مُرٍّ سَيَمُرُّ — غَدًا أَجْمَل",
    subtitle: "شوقٌ يليق بالورد",
    description: "في كل حنينٍ نبتةُ وردٍ تنتظر الصفاء لتتفتّح… هنا أنوثةٌ هادئة، وشوقٌ يروي حكايته بصمت، وروحٌ تصفو كلّما مرّت لحظةٌ صادقة تُشبهها.",
    watchButton: "مرّرْ لتشاهد اللحظات",
    moments: "لحظات",
    momentsDesc: "مقتطفات من الرحلة",
    momentsText: "كل لقطة هنا ثانية من الحياة، احتُفظ بها لأنها تستحق أن تُروى. اضغطي على أي لقطة لتشغيلها.",
    futureText: "وغدًا... سيكون أجمل، لا محالة.",
    followText: "تابعوا التفاصيل اليومية، والحكايات القادمة، على حساب التيك توك.",
    peace: "لحظة سلام",
    peaceQuote: "خذ نفساً عميقاً... واترك العالم للحظة.",
    giveWord: "✨ أعطني كلمة اليوم",
    share: "مشاركة",
    footer: "صُنع بحبّ لكل من يمرّ من هنا  — @hanoflora",
    play: "اضغطي للتشغيل",
    youtube: "يوتيوب",
    syncing: "مزامنة...",
    lastSync: "آخر مزامنة",
    allVideos: "جميع الفيديوهات",
  },
  en: {
    home: "Home",
    videos: "Moments",
    quotes: "Words",
    tiktok: "TikTok",
    follow: "Follow Me",
    title: "EVERY PAIN WILL PASS — TOMORROW WILL BE BETTER",
    subtitle: "A longing worthy of roses",
    description: "In every longing, a rosebud awaits serenity to bloom... Here is a quiet femininity, a longing that tells its story in silence, and a soul that purifies whenever a sincere moment passes that resembles it.",
    watchButton: "Scroll to watch the moments",
    moments: "Moments",
    momentsDesc: "Excerpts from the journey",
    momentsText: "Each shot here is a second of life, kept because it deserves to be told. Click on any shot to play it.",
    futureText: "And tomorrow... it will be more beautiful, inevitably.",
    followText: "Follow the daily details and upcoming stories on the TikTok account.",
    peace: "Moment of Peace",
    peaceQuote: "Take a deep breath... and leave the world for a moment.",
    giveWord: "✨ Give me a word of the day",
    share: "Share",
    footer: "Made with love for everyone who passes by here 🌸 — @hanoflora",
    play: "Click to play",
    youtube: "YouTube",
    syncing: "Syncing...",
    lastSync: "Last sync",
    allVideos: "All videos",
  }
};

const quotes: Quote[] = [
  { category: "الثقة بالنفس", text: "ثقي بنفسك، فأنتِ أقوى مما تظنين.", textEn: "Believe in yourself, you are stronger than you think." },
  { category: "السلام", text: "سلام القلب أجمل من كل شيء.", textEn: "Peace of heart is more beautiful than everything." },
  { category: "الأمل", text: "ما دام في القلب أمل، فهناك دائماً بداية جديدة.", textEn: "As long as there is hope in the heart, there is always a new beginning." },
  { category: "الجمال الداخلي", text: "الجمال الحقيقي يسكن القلب.", textEn: "True beauty resides in the heart." },
  { category: "السعادة", text: "السعادة تبدأ عندما نتصالح مع أنفسنا.", textEn: "Happiness begins when we make peace with ourselves." },
];

const YOUTUBE_CHANNEL_ID = 'UCz3XdLtQZyYQCGmGwF7fuxg';
const YOUTUBE_API_KEY = '';
const HANENNE_BG_IMAGE = '/hanoflora.jpg';

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [lang, setLang] = useState<'ar' | 'en'>('ar'); // ARABE PAR DEFAUT
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 1000], [0, 200]);
  const bgScale = useTransform(scrollY, [0, 1000], [1, 1.1]);
  const bgOpacity = useTransform(scrollY, [0, 500], [0.3, 0.15]);

  const t = translations[lang];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US');
  };

  const fetchAllYouTubeVideos = useCallback(async (useAPI: boolean = false): Promise<Video[]> => {
    const allVideos: Video[] = [];
    
    if (useAPI && YOUTUBE_API_KEY) {
      try {
        const channelsResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${YOUTUBE_CHANNEL_ID}&key=${YOUTUBE_API_KEY}`
        );
        const channelsData = await channelsResponse.json();
        if (!channelsData.items || channelsData.items.length === 0) throw new Error('Channel not found');
        const uploadsPlaylistId = channelsData.items[0].contentDetails.relatedPlaylists.uploads;
        
        let nextPageToken: string | undefined = undefined;
        let pageCount = 0;
        do {
          const playlistItemsResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${uploadsPlaylistId}&maxResults=50&pageToken=${nextPageToken || ''}&key=${YOUTUBE_API_KEY}`
          );
          const playlistItemsData = await playlistItemsResponse.json();
          const videosPromises = playlistItemsData.items.map(async (item: any) => {
            const videoId = item.contentDetails.videoId;
            const videoResponse = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${videoId}&key=${YOUTUBE_API_KEY}`);
            const videoData = await videoResponse.json();
            const stats = videoData.items?.[0]?.statistics || {};
            const contentDetails = videoData.items?.[0]?.contentDetails || {};
            return {
              id: `youtube-${videoId}`,
              title: item.snippet.title,
              thumbnail: item.snippet.thumbnails?.maxres?.url || item.snippet.thumbnails?.high?.url || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
              url: `https://www.youtube.com/watch?v=${videoId}`,
              publishedAt: item.snippet.publishedAt,
              platform: 'youtube' as const,
              embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`,
              duration: contentDetails.duration,
              viewCount: stats.viewCount ? parseInt(stats.viewCount).toLocaleString() : undefined
            };
          });
          const videos = await Promise.all(videosPromises);
          allVideos.push(...videos);
          nextPageToken = playlistItemsData.nextPageToken;
          pageCount++;
        } while (nextPageToken && pageCount < 10);
      } catch (error) {
        console.error('API Error:', error);
        return await fetchAllYouTubeVideos(false);
      }
    } else {
      try {
        const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`;
        const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`);
        if (!response.ok) throw new Error('Failed to fetch RSS');
        const data = await response.json();
        if (data.items && data.items.length > 0) {
          return data.items.map((item: any) => {
            const videoMatch = item.link.match(/[?&]v=([^&]+)/);
            const videoId = videoMatch ? videoMatch[1] : '';
            return {
              id: `youtube-${videoId}`,
              title: item.title,
              thumbnail: item.thumbnail || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
              url: item.link,
              publishedAt: item.pubDate,
              platform: 'youtube' as const,
              embedUrl: videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : undefined
            };
          });
        }
      } catch (error) {
        console.error('RSS Error:', error);
        setError('Unable to load videos');
      }
    }
    return allVideos;
  }, []);

  const syncVideos = useCallback(async () => {
    setSyncing(true);
    setError(null);
    try {
      const fetchedVideos = await fetchAllYouTubeVideos(YOUTUBE_API_KEY.length > 0);
      if (fetchedVideos.length > 0) {
        setVideos(fetchedVideos);
        setLastSync(new Date());
      }
    } catch (err) {
      console.error('Sync error:', err);
      setError('Sync failed');
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  }, [fetchAllYouTubeVideos]);

  useEffect(() => {
    syncVideos();
    const syncInterval = setInterval(syncVideos, 5 * 60 * 1000);
    return () => clearInterval(syncInterval);
  }, [syncVideos]);

  const generateQuote = () => {
    setCurrentQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  };

  useEffect(() => { generateQuote(); }, []);

  const handlePlayVideo = (videoId: string) => {
    setPlayingVideoId(playingVideoId === videoId ? null : videoId);
  };

  const handleStopVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPlayingVideoId(null);
  };

  const flowers = [
    { color: "#800020", x: 5, y: 10 },
    { color: "#E6E6FA", x: 20, y: 60 },
    { color: "#8B00FF", x: 70, y: 15 },
    { color: "#4169E1", x: 85, y: 70 },
    { color: "#008B00", x: 10, y: 80 },
    { color: "#DC143C", x: 90, y: 40 },
  ];

  const butterflies = [
    { x: 8, y: 12, delay: 0, duration: 18 },
    { x: 85, y: 8, delay: 3, duration: 22 },
    { x: 75, y: 75, delay: 6, duration: 20 },
    { x: 15, y: 80, delay: 9, duration: 25 },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-700 overflow-x-hidden ${darkMode ? 'dark' : ''}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* BACKGROUND DYNAMIQUE */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div 
          className={`absolute inset-0 transition-colors duration-1000 ${
            darkMode ? 'bg-gradient-to-br from-[#1a1f4d] via-[#1e2460] to-[#2a2f6e]' : 'bg-gradient-to-br from-[#FFF5F7] via-[#F5F0FF] to-[#F0FFF5]'
          }`}
          animate={{
            background: darkMode 
              ? ['linear-gradient(135deg, #1a1f4d 0%, #1e2460 50%, #2a2f6e 100%)', 'linear-gradient(135deg, #2a2f6e 0%, #1a1f4d 50%, #1e2460 100%)', 'linear-gradient(135deg, #1e2460 0%, #2a2f6e 50%, #1a1f4d 100%)']
              : ['linear-gradient(135deg, #FFF5F7 0%, #F5F0FF 50%, #F0FFF5 100%)', 'linear-gradient(135deg, #F0FFF5 0%, #FFF5F7 50%, #F5F0FF 100%)', 'linear-gradient(135deg, #F5F0FF 0%, #F0FFF5 50%, #FFF5F7 100%)']
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />

        <motion.div className="absolute inset-0" style={{ y: bgY, scale: bgScale, opacity: bgOpacity }}>
          <div className="w-full h-[120%] -mt-[10%]" style={{
            backgroundImage: `url('${HANENNE_BG_IMAGE}')`,
            backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
            filter: darkMode ? 'brightness(0.5) contrast(1.1) saturate(1.2)' : 'brightness(1.1) contrast(0.9) saturate(0.8)',
          }} />
        </motion.div>

        <motion.div className="absolute inset-0" style={{
            background: darkMode
              ? 'radial-gradient(circle at 20% 50%, rgba(139, 0, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(230, 230, 250, 0.1) 0%, transparent 50%), radial-gradient(circle at 50% 80%, rgba(255, 182, 193, 0.15) 0%, transparent 50%)'
              : 'radial-gradient(circle at 20% 50%, rgba(139, 0, 255, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(230, 230, 250, 0.06) 0%, transparent 50%), radial-gradient(circle at 50% 80%, rgba(128, 0, 32, 0.1) 0%, transparent 50%)'
          }}
          animate={{
            background: darkMode
              ? ['radial-gradient(circle at 20% 50%, rgba(139, 0, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(230, 230, 250, 0.1) 0%, transparent 50%)', 'radial-gradient(circle at 80% 50%, rgba(139, 0, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(230, 230, 250, 0.1) 0%, transparent 50%)', 'radial-gradient(circle at 50% 20%, rgba(139, 0, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at 50% 80%, rgba(230, 230, 250, 0.1) 0%, transparent 50%)']
              : ['radial-gradient(circle at 20% 50%, rgba(139, 0, 255, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(230, 230, 250, 0.06) 0%, transparent 50%)', 'radial-gradient(circle at 80% 50%, rgba(139, 0, 255, 0.08) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(230, 230, 250, 0.06) 0%, transparent 50%)']
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />

        {flowers.map((flower, i) => (
          <motion.div key={i} className="absolute" style={{ left: `${flower.x}%`, top: `${flower.y}%` }}
            animate={{ y: [0, -40, 0], rotate: [0, 180, 360], scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 15 + i * 3, repeat: Infinity, delay: i * 2, ease: "easeInOut" }}>
            <Flower3D color={flower.color} className="w-24 h-24 md:w-32 md:h-32" />
          </motion.div>
        ))}

        {butterflies.map((b, i) => (
          <motion.div key={`butterfly-${i}`} className="absolute" style={{ left: `${b.x}%`, top: `${b.y}%` }}
            animate={{ x: [0, 80, -40, 60, 0], y: [0, -60, 30, -80, 0], rotate: [0, 15, -15, 10, 0] }}
            transition={{ duration: b.duration, repeat: Infinity, delay: b.delay, ease: "easeInOut" }}>
            <motion.div animate={{ rotateY: [0, 180, 0] }} transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}>
              <Butterfly className="w-10 h-10 md:w-14 md:h-14 drop-shadow-lg" />
            </motion.div>
          </motion.div>
        ))}

        {[...Array(50)].map((_, i) => (
          <motion.div key={`particle-${i}`} className={`absolute w-2 h-2 rounded-full ${
              i % 5 === 0 ? 'bg-[#FFB6C1]' : i % 5 === 1 ? 'bg-[#E6E6FA]' : i % 5 === 2 ? 'bg-[#8B00FF]' : i % 5 === 3 ? 'bg-[#4169E1]' : 'bg-[#FFD700]'
            }`}
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, boxShadow: '0 0 10px currentColor' }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0], y: [0, -100, 0] }}
            transition={{ duration: 4 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 5 }} />
        ))}

        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)' }} />
      </div>

      {/* Header */}
      <header className={`fixed top-0 w-full z-50 backdrop-blur-xl border-b transition-colors duration-700 ${
        darkMode ? 'bg-[#1a1f4d]/80 border-[#FFB6C1]/30' : 'bg-[#FFF5F7]/70 border-[#800020]/30'
      }`}>
        <AndalusianBorder className="w-full h-2 absolute top-0 left-0" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center gap-3">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
                <AndalusianStar className="w-10 h-10" />
              </motion.div>
              <h1 className={`font-serif text-2xl font-bold bg-gradient-to-r from-[#FFB6C1] via-[#E6E6FA] to-[#8B00FF] bg-clip-text text-transparent`}>
                HANofLORA
              </h1>
            </div>

            <nav className="hidden md:flex space-x-8 space-x-reverse">
              <a href="#" className={`font-kufi font-medium transition-colors ${darkMode ? 'text-[#F5E6D3] hover:text-[#FFB6C1]' : 'text-[#1a0015] hover:text-[#800020]'}`}>{t.home}</a>
              <a href="#videos" className={`font-kufi font-medium transition-colors ${darkMode ? 'text-[#F5E6D3] hover:text-[#FFB6C1]' : 'text-[#1a0015] hover:text-[#800020]'}`}>{t.videos}</a>
              <a href="#quotes" className={`font-kufi font-medium transition-colors ${darkMode ? 'text-[#F5E6D3] hover:text-[#FFB6C1]' : 'text-[#1a0015] hover:text-[#800020]'}`}>{t.quotes}</a>
              <a href="https://www.tiktok.com/@hanoflora" target="_blank" rel="noopener noreferrer" className={`font-kufi font-medium transition-colors ${darkMode ? 'text-[#F5E6D3] hover:text-[#FFB6C1]' : 'text-[#1a0015] hover:text-[#800020]'}`}>{t.tiktok}</a>
            </nav>

            <div className="hidden md:flex items-center space-x-4 space-x-reverse">
              <button onClick={syncVideos} disabled={syncing} className={`p-2 rounded-lg transition-colors flex items-center gap-2 ${darkMode ? 'hover:bg-[#FFB6C1]/20' : 'hover:bg-[#800020]/20'} ${syncing ? 'animate-spin' : ''}`} title={t.syncing}>
                <RefreshCw className="w-5 h-5" />
              </button>
              <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className={`p-2 rounded-lg transition-colors flex items-center gap-2 ${darkMode ? 'hover:bg-[#FFB6C1]/20' : 'hover:bg-[#800020]/20'}`}>
                <span className="text-xl">{lang === 'ar' ? '🇬🇧' : '🇹🇳'}</span>
                <span className="text-sm font-semibold">{lang === 'ar' ? 'ENG' : 'TN'}</span>
              </button>
              <button onClick={() => setDarkMode(!darkMode)} className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-[#FFB6C1]/20' : 'hover:bg-[#800020]/20'}`}>
                {darkMode ? <Sun className="w-5 h-5 text-[#FFB6C1]" /> : <Moon className="w-5 h-5 text-[#800020]" />}
              </button>
              <a href="https://www.tiktok.com/@hanoflora" target="_blank" rel="noopener noreferrer" 
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all hover:shadow-lg ${
                  darkMode ? 'bg-gradient-to-r from-[#FFB6C1] via-[#FF69B4] to-[#FF1493] text-[#1a1f4d] shadow-lg' : 'bg-gradient-to-r from-[#800020] to-[#4169E1] text-white shadow-lg'
                }`}>
                <Heart className="w-4 h-4 fill-current" /> {t.follow}
              </a>
            </div>

            <div className="md:hidden flex items-center">
              <button onClick={() => setMobileMenuOpen(true)} className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-[#FFB6C1]/20' : 'hover:bg-[#800020]/20'}`}>
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MENU LATÉRAL MOBILE */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Overlay sombre */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 z-50 md:hidden backdrop-blur-sm"
            />
            
            {/* Sidebar glissante */}
            <motion.div 
              initial={{ x: lang === 'ar' ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: lang === 'ar' ? '100%' : '-100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`fixed top-0 ${lang === 'ar' ? 'right-0' : 'left-0'} w-80 h-full z-50 md:hidden shadow-2xl ${
                darkMode ? 'bg-[#1a1f4d]' : 'bg-[#FFF5F7]'
              }`}
            >
              <div className="flex flex-col h-full">
                {/* Header du menu */}
                <div className={`flex justify-between items-center p-6 border-b ${darkMode ? 'border-[#FFB6C1]/30' : 'border-[#800020]/30'}`}>
                  <h2 className={`text-2xl font-kufi font-bold ${darkMode ? 'text-[#FFB6C1]' : 'text-[#800020]'}`}>
                    {lang === 'ar' ? 'القائمة' : 'Menu'}
                  </h2>
                  <button onClick={() => setMobileMenuOpen(false)} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-[#FFB6C1]/20' : 'hover:bg-[#800020]/20'}`}>
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-6 space-y-4">
                  <a href="#" onClick={() => setMobileMenuOpen(false)} className={`block py-3 px-4 rounded-xl font-kufi text-lg transition-all ${darkMode ? 'text-[#F5E6D3] hover:bg-[#FFB6C1]/20 hover:text-[#FFB6C1]' : 'text-[#1a0015] hover:bg-[#800020]/20 hover:text-[#800020]'}`}>
                    {t.home}
                  </a>
                  <a href="#videos" onClick={() => setMobileMenuOpen(false)} className={`block py-3 px-4 rounded-xl font-kufi text-lg transition-all ${darkMode ? 'text-[#F5E6D3] hover:bg-[#FFB6C1]/20 hover:text-[#FFB6C1]' : 'text-[#1a0015] hover:bg-[#800020]/20 hover:text-[#800020]'}`}>
                    {t.videos}
                  </a>
                  <a href="#quotes" onClick={() => setMobileMenuOpen(false)} className={`block py-3 px-4 rounded-xl font-kufi text-lg transition-all ${darkMode ? 'text-[#F5E6D3] hover:bg-[#FFB6C1]/20 hover:text-[#FFB6C1]' : 'text-[#1a0015] hover:bg-[#800020]/20 hover:text-[#800020]'}`}>
                    {t.quotes}
                  </a>
                  <a href="https://www.tiktok.com/@hanoflora" target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)} className={`block py-3 px-4 rounded-xl font-kufi text-lg transition-all ${darkMode ? 'text-[#F5E6D3] hover:bg-[#FFB6C1]/20 hover:text-[#FFB6C1]' : 'text-[#1a0015] hover:bg-[#800020]/20 hover:text-[#800020]'}`}>
                    {t.tiktok}
                  </a>
                </nav>

                {/* Options en bas */}
                <div className={`p-6 border-t space-y-4 ${darkMode ? 'border-[#FFB6C1]/30' : 'border-[#800020]/30'}`}>
                  {/* Sélecteur de langue avec drapeaux */}
                  <div className="flex gap-3">
                    <button onClick={() => { setLang('ar'); setMobileMenuOpen(false); }} className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${lang === 'ar' ? 'bg-gradient-to-r from-[#FFB6C1] to-[#FF69B4] text-[#1a1f4d]' : darkMode ? 'bg-[#FFB6C1]/10 text-[#FFB6C1]' : 'bg-[#800020]/10 text-[#800020]'}`}>
                      <span className="text-2xl">🇹🇳</span>
                      <span>عربي</span>
                    </button>
                    <button onClick={() => { setLang('en'); setMobileMenuOpen(false); }} className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${lang === 'en' ? 'bg-gradient-to-r from-[#FFB6C1] to-[#FF69B4] text-[#1a1f4d]' : darkMode ? 'bg-[#FFB6C1]/10 text-[#FFB6C1]' : 'bg-[#800020]/10 text-[#800020]'}`}>
                      <span className="text-2xl">🇬🇧</span>
                      <span>ENG</span>
                    </button>
                  </div>

                  {/* Mode sombre/clair */}
                  <button onClick={() => setDarkMode(!darkMode)} className={`w-full py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${darkMode ? 'bg-[#FFB6C1]/20 text-[#FFB6C1]' : 'bg-[#800020]/20 text-[#800020]'}`}>
                    {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    {darkMode ? 'وضع النهار' : 'Night Mode'}
                  </button>

                  {/* Bouton Follow */}
                  <a href="https://www.tiktok.com/@hanoflora" target="_blank" rel="noopener noreferrer" className="block w-full py-3 px-4 rounded-xl font-semibold text-center bg-gradient-to-r from-[#FFB6C1] via-[#FF69B4] to-[#FF1493] text-[#1a1f4d] hover:shadow-lg transition-all">
                    <Heart className="w-5 h-5 inline mr-2 fill-current" /> {t.follow}
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <div className="flex justify-center items-center gap-4 mb-6">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}>
                <AndalusianStar className="w-16 h-16 md:w-20 md:h-20" />
              </motion.div>
              <h1 className={`font-kufi text-5xl md:text-7xl font-bold bg-gradient-to-r from-[#FFB6C1] via-[#E6E6FA] to-[#8B00FF] bg-clip-text text-transparent drop-shadow-2xl`}>
                HANofLORA
              </h1>
              <motion.div animate={{ rotate: -360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}>
                <AndalusianStar className="w-16 h-16 md:w-20 md:h-20" />
              </motion.div>
            </div>
            
            <h2 className={`font-kufi text-3xl md:text-5xl mb-4 leading-relaxed font-bold ${darkMode ? 'text-[#F5E6D3] drop-shadow-lg' : 'text-[#1a0015] drop-shadow-lg'}`}>
              {t.title}
            </h2>
            <p className={`font-kufi text-xl md:text-2xl mb-8 font-medium bg-gradient-to-r from-[#FFB6C1] to-[#8B00FF] bg-clip-text text-transparent`}>
              {t.subtitle}
            </p>
          </motion.div>

          <motion.p className={`text-lg md:text-xl mb-10 max-w-3xl mx-auto leading-loose ${darkMode ? 'text-[#F5E6D3]/90' : 'text-[#1a0015]/90'} drop-shadow-md`}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            style={{ textShadow: darkMode ? '0 2px 10px rgba(0,0,0,0.5)' : '0 2px 10px rgba(255,255,255,0.8)' }}>
            {t.description}
          </motion.p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.a href="https://www.tiktok.com/@hanoflora" target="_blank" rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-8 py-4 rounded-full font-semibold shadow-2xl text-lg transition-all backdrop-blur-sm ${
                darkMode ? 'bg-gradient-to-r from-[#FFB6C1] via-[#FF69B4] to-[#FF1493] text-[#1a1f4d] shadow-[#FFB6C1]/40' : 'bg-gradient-to-r from-[#800020] to-[#4169E1] text-white shadow-lg'
              }`}>
              <Heart className="w-5 h-5 fill-current" /> {t.tiktok} — @hanoflora
            </motion.a>
            <motion.a href="#videos" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-8 py-4 border-2 rounded-full font-semibold text-lg transition-all backdrop-blur-sm ${
                darkMode ? 'border-[#FFB6C1] text-[#FFB6C1] hover:bg-[#FFB6C1]/10' : 'border-[#800020] text-[#800020] hover:bg-[#800020]/10'
              }`}>
              <Play className="w-5 h-5 fill-current" /> {t.watchButton}
            </motion.a>
          </div>
        </div>
      </section>

      {/* Videos Section */}
      <section id="videos" className="relative py-24 px-4">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6"><AndalusianStar className="w-20 h-20" /></div>
            <h2 className={`font-kufi text-4xl md:text-5xl mb-4 font-bold bg-gradient-to-r from-[#FFB6C1] via-[#E6E6FA] to-[#8B00FF] bg-clip-text text-transparent drop-shadow-lg`}>
              {t.moments}
            </h2>
            <p className={`text-xl mb-3 ${darkMode ? 'text-[#F5E6D3] drop-shadow-md' : 'text-[#1a0015] drop-shadow-md'}`}>{t.momentsDesc}</p>
            <p className={`text-base max-w-2xl mx-auto leading-relaxed ${darkMode ? 'text-[#F5E6D3]/80' : 'text-[#1a0015]/80'}`} style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
              {t.momentsText}
            </p>
            
            <div className="flex items-center justify-center gap-3 mt-6">
              {syncing && (
                <div className="flex items-center gap-2 text-[#FFB6C1]">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm">{t.syncing}</span>
                </div>
              )}
              {lastSync && !syncing && (
                <div className={`text-sm ${darkMode ? 'text-[#F5E6D3]/60' : 'text-[#1a0015]/60'}`}>
                  {t.lastSync}: {lastSync.toLocaleTimeString(lang === 'ar' ? 'ar-SA' : 'en-US')}
                </div>
              )}
              <button onClick={syncVideos} disabled={syncing} className={`p-2 rounded-full transition-all ${syncing ? 'animate-spin' : ''} ${darkMode ? 'text-[#FFB6C1] hover:bg-[#FFB6C1]/20' : 'text-[#800020] hover:bg-[#800020]/20'}`}>
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20"><Loader2 className="w-12 h-12 animate-spin text-[#FFB6C1]" /></div>
          ) : videos.length === 0 ? (
            <div className={`text-center py-20 rounded-3xl border backdrop-blur-xl ${darkMode ? 'bg-[#1a1f4d]/60 border-[#FFB6C1]/30' : 'bg-[#FFF5F7]/60 border-[#800020]/30'}`}>
              <p className={`text-xl mb-6 ${darkMode ? 'text-[#F5E6D3]' : 'text-[#1a0015]'}`}>{t.followText}</p>
              <a href="https://www.tiktok.com/@hanoflora" target="_blank" rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${darkMode ? 'bg-gradient-to-r from-[#FFB6C1] to-[#FF1493] text-[#1a1f4d]' : 'bg-gradient-to-r from-[#800020] to-[#4169E1] text-white'}`}>
                <Heart className="w-4 h-4 fill-current" /> @hanoflora
              </a>
            </div>
          ) : (
            <div>
              <div className="mb-6 text-center">
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm ${
                  darkMode ? 'bg-[#FFB6C1]/20 text-[#FFB6C1] border border-[#FFB6C1]/30' : 'bg-[#800020]/20 text-[#800020] border border-[#800020]/30'
                }`}>
                  <Sparkles className="w-4 h-4" /> {videos.length} {t.allVideos}
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {videos.map((video) => {
                  const isPlaying = playingVideoId === video.id;
                  return (
                    <motion.div key={video.id} layout initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                      className={`relative rounded-2xl overflow-hidden shadow-2xl border transition-all backdrop-blur-sm ${
                        isPlaying ? 'border-[#FFB6C1] shadow-[#FF69B4]/50' : (darkMode ? 'border-[#FFB6C1]/30 hover:border-[#FFB6C1]/60 bg-[#1a1f4d]/40' : 'border-[#800020]/30 hover:border-[#800020]/60 bg-[#FFF5F7]/40')
                      }`}>
                      <div className="aspect-[9/16] bg-black relative">
                        {isPlaying && video.embedUrl ? (
                          <iframe src={video.embedUrl} title={video.title} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                        ) : (
                          <>
                            <img src={video.thumbnail} alt={video.title} className="w-full h-full object-contain bg-black" loading="lazy" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1f4d]/95 via-[#1a1f4d]/30 to-transparent flex flex-col justify-end p-5">
                              <span className="text-xs font-bold uppercase mb-2 text-[#FFB6C1]">
                                {video.platform === 'tiktok' ? 'TikTok' : t.youtube}
                              </span>
                              <h3 className="text-[#F5E6D3] text-sm mb-3 line-clamp-2 leading-relaxed">{video.title}</h3>
                              <div className="flex items-center justify-between text-xs text-[#F5E6D3]/70 mb-3">
                                <span>{formatDate(video.publishedAt)}</span>
                                {video.viewCount && <span>👁 {video.viewCount}</span>}
                              </div>
                              <button onClick={() => handlePlayVideo(video.id)}
                                className="w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg bg-gradient-to-r from-[#FFB6C1] via-[#FF69B4] to-[#1a0a05] text-[#FFD700] hover:shadow-[#FFB6C1]/50 border border-[#FFD700]/30">
                                <Play className="w-4 h-4 fill-current text-[#FFD700]" /> {t.play}
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                      {isPlaying && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                          className={`p-3 flex justify-between items-center border-t backdrop-blur-sm ${darkMode ? 'bg-[#1a1f4d]/80 border-[#FFB6C1]/30' : 'bg-[#FFF5F7]/80 border-[#800020]/30'}`}>
                          <h3 className={`text-sm line-clamp-1 font-medium flex-1 ${darkMode ? 'text-[#F5E6D3]' : 'text-[#1a0015]'}`}>{video.title}</h3>
                          <button onClick={handleStopVideo} className={`p-2 rounded-full transition-colors flex-shrink-0 ${darkMode ? 'hover:bg-[#FFB6C1]/20 text-[#FFB6C1]' : 'hover:bg-[#800020]/20 text-[#800020]'}`}>
                            <X className="w-5 h-5" />
                          </button>
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="text-center mt-16">
            <AndalusianBorder className="w-64 h-4 mx-auto mb-6" />
            <p className={`text-xl italic mb-3 ${darkMode ? 'text-[#F5E6D3]' : 'text-[#1a0015]'}`} style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
              {t.futureText}
            </p>
            <p className={`text-sm mb-6 ${darkMode ? 'text-[#F5E6D3]/70' : 'text-[#1a0015]/70'}`}>{t.followText}</p>
            <a href="https://www.tiktok.com/@hanoflora" target="_blank" rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-8 py-3 rounded-full font-semibold transition-all backdrop-blur-sm ${
                darkMode ? 'bg-gradient-to-r from-[#FFB6C1] via-[#FF69B4] to-[#FF1493] text-[#1a1f4d]' : 'bg-gradient-to-r from-[#800020] to-[#4169E1] text-white'
              }`}>
              <Heart className="w-4 h-4 fill-current" /> @hanoflora
            </a>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section id="quotes" className="relative py-24 px-4">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} className="mb-6">
            <AndalusianStar className="w-24 h-24 mx-auto" />
          </motion.div>
          <h2 className={`font-kufi text-4xl md:text-5xl mb-4 font-bold bg-gradient-to-r from-[#FFB6C1] via-[#E6E6FA] to-[#8B00FF] bg-clip-text text-transparent drop-shadow-lg`}>
            {t.peace}
          </h2>
          <p className={`text-2xl italic mb-12 ${darkMode ? 'text-[#F5E6D3]' : 'text-[#1a0015]'}`} style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
            {t.peaceQuote}
          </p>

          <AnimatePresence mode="wait">
            {currentQuote && (
              <motion.div key={currentQuote.category} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className={`relative p-8 md:p-12 rounded-3xl border backdrop-blur-xl shadow-2xl ${
                  darkMode ? 'border-[#FFB6C1]/40 bg-[#1a1f4d]/70 shadow-[#FF69B4]/20' : 'border-[#800020]/40 bg-[#FFF5F7]/80 shadow-[#800020]/20'
                }`}>
                <AndalusianStar className="absolute top-4 right-4 w-8 h-8 opacity-50" />
                <AndalusianStar className="absolute top-4 left-4 w-8 h-8 opacity-50" />
                <h3 className={`font-kufi text-3xl mb-4 font-bold bg-gradient-to-r from-[#FFB6C1] via-[#E6E6FA] to-[#8B00FF] bg-clip-text text-transparent`}>
                  {currentQuote.category}
                </h3>
                <p className={`text-2xl md:text-3xl leading-relaxed mb-4 ${darkMode ? 'text-[#F5E6D3]' : 'text-[#1a0015]'}`}>
                  "{currentQuote.text}"
                </p>
                <p className={`text-lg mb-8 ${darkMode ? 'text-[#F5E6D3]/70' : 'text-[#1a0015]/70'}`}>
                  "{currentQuote.textEn}"
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button onClick={generateQuote}
                    className="px-8 py-3 rounded-full font-semibold text-lg transition-all bg-gradient-to-r from-[#FFB6C1] via-[#FF69B4] to-[#1a0a05] text-[#FFD700] hover:shadow-[#FFB6C1]/50 border border-[#FFD700]/30">
                    {t.giveWord}
                  </button>
                  <button onClick={() => navigator.clipboard.writeText(`${currentQuote.category}: ${currentQuote.text}`)}
                    className={`px-8 py-3 border-2 rounded-full font-semibold text-lg transition-all ${
                      darkMode ? 'border-[#FFB6C1] text-[#FFB6C1] hover:bg-[#FFB6C1]/10' : 'border-[#800020] text-[#800020] hover:bg-[#800020]/10'
                    }`}>
                    <Share2 className="w-5 h-5 inline ml-2" /> {t.share}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Footer */}
      <footer className={`relative border-t py-16 px-4 transition-colors duration-700 backdrop-blur-xl ${
        darkMode ? 'bg-[#0f1230]/90 border-[#FFB6C1]/30' : 'bg-[#FFF5F7]/80 border-[#800020]/30'
      }`}>
        <AndalusianBorder className="w-full h-4 absolute top-0 left-0" />
        <div className="max-w-4xl mx-auto text-center relative z-10 pt-4">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="mb-6">
            <AndalusianStar className="w-16 h-16 mx-auto" />
          </motion.div>
          
          <h3 className={`font-kufi text-4xl mb-6 font-bold bg-gradient-to-r from-[#FFB6C1] via-[#E6E6FA] to-[#8B00FF] bg-clip-text text-transparent`}>HANofLORA</h3>
          <p className={`text-xl mb-8 leading-relaxed ${darkMode ? 'text-[#F5E6D3]' : 'text-[#1a0015]'}`}>
            {t.footer}
          </p>
          
          <div className="flex justify-center gap-8 mb-10">
            <a href="https://www.tiktok.com/@hanoflora" target="_blank" rel="noopener noreferrer" 
              className={`flex items-center gap-2 font-medium text-lg transition-colors ${darkMode ? 'text-[#F5E6D3] hover:text-[#FFB6C1]' : 'text-[#1a0015] hover:text-[#800020]'}`}>
              <Heart className="w-5 h-5 fill-current" /> TikTok
            </a>
            <a href="https://www.youtube.com/channel/UCz3XdLtQZyYQCGmGwF7fuxg" target="_blank" rel="noopener noreferrer" 
              className={`flex items-center gap-2 font-medium text-lg transition-colors ${darkMode ? 'text-[#F5E6D3] hover:text-[#FFB6C1]' : 'text-[#1a0015] hover:text-[#800020]'}`}>
              <Play className="w-5 h-5 fill-current" /> YouTube
            </a>
          </div>

          <AndalusianBorder className="w-48 h-3 mx-auto mb-6" />

          <div className={`text-sm space-y-2 ${darkMode ? 'text-[#F5E6D3]/60' : 'text-[#1a0015]/60'}`}>
            <p>© 2026 HANofLORA — Tous droits réservés.</p>
            <p className="flex items-center justify-center gap-1.5 pt-2 border-t max-w-xs mx-auto" style={{ borderColor: darkMode ? 'rgba(255, 182, 193, 0.3)' : 'rgba(128, 0, 32, 0.3)' }}>
              created by OMARSOFT-BEST FUTURE WITH BESTOMAR <Heart className="w-3.5 h-3.5 fill-current text-[#FFB6C1]" />
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;