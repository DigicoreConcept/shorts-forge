export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string // HTML format for rendering
  publishedAt: string
  readTime: string
  tags: string[]
  author: {
    name: string
    role: string
    avatar: string
  }
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'how-to-scale-shorts-as-solo-creator',
    title: 'How to Scale Your Short-Form Video Output as a Solo Creator',
    excerpt: 'You don\'t need a team of editors to post daily. Learn the exact process to turn one long podcast or video into 20+ viral assets.',
    publishedAt: 'August 12, 2026',
    readTime: '5 min read',
    tags: ['Productivity', 'YouTube Shorts', 'TikTok'],
    author: {
      name: 'Fakson',
      role: 'Founder, Excido',
      avatar: 'F'
    },
    content: `
      <p>As a solo content creator, your biggest bottleneck is time. While media companies hire editing rooms to chop, crop, and caption their content, you have to do everything yourself. If you spend five hours editing a single vertical short, you're playing a losing game.</p>
      
      <h3>1. The "One-to-Many" Ingestion Framework</h3>
      <p>The secret to high-frequency posting isn't editing faster—it's creating a robust content reuse loop. Stop thinking about shorts as individual videos. Instead, treat your long-form recordings (podcasts, tutorials, streams) as "raw raw materials." One 45-minute video holds at least 10 key moments that can survive independently.</p>
      
      <h3>2. The Automated Workflow Checklist</h3>
      <p>To scale, you must eliminate manual editing tasks. Here is the framework you should automate:</p>
      <ul>
        <li><strong>Rough Cutting:</strong> Trimming dead space, filler words, and awkward pauses.</li>
        <li><strong>Mobile Cropping:</strong> Centering the speaker (9:16 layout) dynamically, especially during screen splits or multi-guest layouts.</li>
        <li><strong>Caption Rendering:</strong> Generating active highlights with style presets (such as Bold Highlight or Neon Glow) so the hook is readable without sound.</li>
      </ul>

      <h3>3. Prioritize Output Frequency Over Perfection</h3>
      <p>Social media algorithms are a numbers game. Proving a concept or finding your niche requires testing multiple hooks, angles, and durations. By automating the mechanical editing tasks with tools like Excido, you can push 3 to 4 high-quality shorts daily, maximizing your chances of hitting the algorithm stream.</p>
    `
  },
  {
    slug: 'secret-to-high-retention-captions',
    title: 'The Secret to High-Retention Captions: Styles and Placement',
    excerpt: 'Most scrollers watch videos on mute. If your subtitles are static or poorly styled, you are leaking viewers in the first 3 seconds.',
    publishedAt: 'August 14, 2026',
    readTime: '4 min read',
    tags: ['Video Editing', 'Retention', 'Growth'],
    author: {
      name: 'Fakson',
      role: 'Founder, Excido',
      avatar: 'F'
    },
    content: `
      <p>Over 80% of users on platforms like TikTok and Instagram Reels browse their feeds with sound turned off. If your video starts and there are no captions, or if the captions are tiny browser-default texts, the user will swipe away immediately. Captions are no longer an accessibility add-on—they are a core retention mechanism.</p>
      
      <h3>1. Active Word Highlighting</h3>
      <p>Standard paragraph-style blocks of text do not keep attention. Your captions must highlight the active word as it is being spoken. Dynamic changes in color (such as shifting from white to a vibrant neon red or yellow) trigger visual engagement cues, forcing the brain to stay locked onto the screen.</p>
      
      <h3>2. Text Placement Constraints</h3>
      <p>Where you place your captions determines whether they are readable. Many creators make the mistake of placing text too low. This clashes with the term's UI (the user name, caption text, and music track info). The optimal placement zone is center-middle or slightly lower-middle, keeping the text clear of both the video edges and social overlay buttons.</p>
      
      <h3>3. High Contrast Theme Styling</h3>
      <p>Use stroke outlines (shadow borders) around your fonts. If your video background changes from dark to light, plain white text becomes unreadable. A clean, bold stroke of black behind your active text maintains premium readability regardless of what is happening in the video frame.</p>
    `
  },
  {
    slug: 'why-viral-score-is-the-metric-to-watch',
    title: 'Why "Viral Score" is the Metric You Should Watch',
    excerpt: 'Stop counting raw views. Learn how transcript-based virality analysis can tell you exactly which clips are worth publishing.',
    publishedAt: 'August 16, 2026',
    readTime: '6 min read',
    tags: ['AI Analysis', 'Strategy', 'Analytics'],
    author: {
      name: 'Fakson',
      role: 'Founder, Excido',
      avatar: 'F'
    },
    content: `
      <p>Many creators waste hours exporting, uploading, and tagging clips that simply do not have a compelling narrative structure. A short video needs a hook, a build-up, and a payload. If any of these are missing in the transcription, the clip will fail to capture interest—no matter how beautiful your subtitles look.</p>
      
      <h3>1. What is a "Viral Score"?</h3>
      <p>A Viral Score is an AI-driven index that analyzes your video transcript for semantic engagement triggers. Instead of just randomly slicing a video every 30 seconds, it scores segments based on:</p>
      <ul>
        <li><strong>Hook Quality:</strong> Does the first sentence pose a strong question, a surprising statement, or high emotional charge?</li>
        <li><strong>Topic Cohesion:</strong> Does the segment complete a full thought or concept without trailing off?</li>
        <li><strong>Sentiment Density:</strong> Is there a clear emotional peak (laughter, high energy, intense statements)?</li>
      </ul>

      <h3>2. Saving Your Processing Credits</h3>
      <p>As a solo creator, your credits are valuable. You shouldn't waste rendering credits on clips that scored low in virality hooks. By reviewing the Viral Score before you hit export, you can focus exclusively on clips that have a mathematically high probability of retaining search interest and audience attention.</p>
      
      <h3>3. Predictability Over Guesswork</h3>
      <p>Transitioning from guessing to data-driven selection is how you build a sustainable channel. Focus on clips that score 80+ in transcript hooks, publish consistently, and let the algorithm do the heavy lifting.</p>
    `
  }
]
