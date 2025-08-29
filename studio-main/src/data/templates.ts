import { DoodleTemplate } from '@/types/templates';

export const DOODLE_TEMPLATES: DoodleTemplate[] = [
  {
    id: 'travel-memory',
    name: 'Travel Memory Sketch',
    description: 'Transform your photo into a personal travel diary page with landmarks and journey notes',
    category: 'Travel',
    icon: '✈️',
    prompt: `Transform this photograph into the page of a travel diary that feels both personal and artistic. Imagine crisp, white hand-drawn doodles scattered across the scene, tracing the contours of iconic landmarks and marking out small travel details that a wanderer might note in their journal. Add playful arrows leading to quirky labels, sketch tiny travel-inspired icons like airplanes, compasses, and dotted route markers, and include handwritten-style annotations that capture {location}, the {date}, or little personal observations. Ensure the doodles enhance the atmosphere of a {color_palette} travel memory, while carefully avoiding any overlap on people's faces.`,
    parameters: [
      { key: 'location', label: 'Location', type: 'text', placeholder: 'Paris, France', required: true },
      { key: 'date', label: 'Date', type: 'text', placeholder: 'Summer 2024', required: false }
    ],
    colorPalettes: ['warm sepia', 'cool blue', 'vintage cream', 'sunset orange']
  },
  {
    id: 'daily-mood',
    name: 'Daily Mood Chronicle',
    description: 'Capture emotions and feelings with expressive doodles and mood annotations',
    category: 'Personal',
    icon: '😊',
    prompt: `Reimagine this image as a whimsical daily mood journal entry. Let airy, white sketch strokes float gently around the composition—delicate arrows, expressive swirls, symbolic icons, and tiny hand-lettered notes that capture the feeling of {mood} in the {time_of_day}. Incorporate subtle visual metaphors for emotions, like clouds, suns, or abstract doodle-shapes, while keeping the overall {color_palette} soft and dreamlike. The doodles should amplify the photo's atmosphere without interfering with human features, so faces remain clear and expressive.`,
    parameters: [
      { key: 'mood', label: 'Mood', type: 'select', options: ['happy', 'peaceful', 'excited', 'contemplative', 'energetic', 'calm'], required: true },
      { key: 'time_of_day', label: 'Time of Day', type: 'select', options: ['morning', 'afternoon', 'evening', 'night'], required: true }
    ],
    colorPalettes: ['soft pastels', 'warm neutrals', 'cool grays', 'dreamy lavender']
  },
  {
    id: 'professional-insight',
    name: 'Professional Insight Visualization',
    description: 'Create sleek corporate-style annotations for business and professional contexts',
    category: 'Business',
    icon: '💼',
    prompt: `Convert this photo into a sleek professional sketchboard, as though it were part of a presentation slide or corporate journal. Use clean, deliberate white doodle elements—rectangles, arrows, graphs, and callout boxes—to highlight insights relevant to the {industry}. Overlay subtle icons (like gears, laptops, charts) to visualize context. Add concise, handwritten-style annotations that frame the image as part of a {context}. Keep the design polished, minimal, and {color_palette}-driven, while ensuring people's faces remain unobstructed for professionalism and clarity.`,
    parameters: [
      { key: 'industry', label: 'Industry', type: 'select', options: ['technology', 'finance', 'healthcare', 'education', 'marketing', 'consulting'], required: true },
      { key: 'context', label: 'Context', type: 'select', options: ['strategy meeting', 'project review', 'team brainstorm', 'client presentation'], required: true }
    ],
    colorPalettes: ['corporate blue', 'professional gray', 'clean white', 'modern teal']
  },
  {
    id: 'childhood-memory',
    name: 'Childhood Memory Scrapbook',
    description: 'Add nostalgic, playful doodles reminiscent of childhood scrapbooks',
    category: 'Memory',
    icon: '🎈',
    prompt: `Reframe this image as if it were pasted into a playful scrapbook from the {era}. Surround the photograph with quirky, childlike doodles drawn in white ink—stars, balloons, toy shapes, and cheerful borders—layered with nostalgic annotations recalling {personal_theme}. Sprinkle in vintage-style sketches like cassette tapes, doodle suns, or cartoonish pets, and weave handwritten fragments of memory across the scene. The vibe should feel joyful, retro, and whimsical, in line with the {color_palette}, while always leaving faces unobstructed to preserve the warmth of personal memory.`,
    parameters: [
      { key: 'era', label: 'Era', type: 'select', options: ['1980s', '1990s', '2000s', '2010s'], required: true },
      { key: 'personal_theme', label: 'Memory Theme', type: 'text', placeholder: 'summer vacation, birthday party, school days', required: false }
    ],
    colorPalettes: ['retro rainbow', 'vintage sepia', 'pastel pink', 'sunny yellow']
  },
  {
    id: 'adventure-log',
    name: 'Adventure Log Illustration',
    description: 'Document outdoor adventures with rugged, exploratory annotations',
    category: 'Adventure',
    icon: '🏔️',
    prompt: `Transform this into the page of an adventurer's field log. Overlay dynamic white doodle elements that echo the energy of {activity}, such as rugged outlines around natural forms, directional arrows marking trails, and compass-like annotations pointing toward {location}. Add quirky adventure icons like backpacks, boots, or mountain sketches, along with short handwritten notes about {difficulty} conditions. Keep the aesthetic earthy and exploratory in {color_palette}, ensuring doodles energize the scene without obscuring faces or key details.`,
    parameters: [
      { key: 'activity', label: 'Activity', type: 'select', options: ['hiking', 'camping', 'rock climbing', 'kayaking', 'skiing', 'backpacking'], required: true },
      { key: 'location', label: 'Location', type: 'text', placeholder: 'Rocky Mountains', required: true },
      { key: 'difficulty', label: 'Difficulty', type: 'select', options: ['easy', 'moderate', 'challenging', 'extreme'], required: false }
    ],
    colorPalettes: ['earthy brown', 'forest green', 'mountain gray', 'adventure orange']
  },
  {
    id: 'culinary-journey',
    name: 'Culinary Journey Sketch',
    description: 'Enhance food photos with delicious culinary annotations and recipe notes',
    category: 'Food',
    icon: '🍽️',
    prompt: `Reimagine this as a page from a food lover's illustrated journal. Surround the dish with delicate white doodles of utensils, steaming pans, herbs, and ingredient icons, turning the image into a {cuisine}-inspired culinary exploration. Annotate the plate with handwritten-style notes: playful recipe snippets, comments on taste, or observations about the {dish_type}. Keep the {color_palette} aligned with Mediterranean warmth while preserving the central focus of the food and keeping human faces clear of overlays.`,
    parameters: [
      { key: 'cuisine', label: 'Cuisine Type', type: 'select', options: ['Italian', 'French', 'Asian', 'Mediterranean', 'Mexican', 'American'], required: true },
      { key: 'dish_type', label: 'Dish Type', type: 'select', options: ['appetizer', 'main course', 'dessert', 'beverage', 'snack'], required: true }
    ],
    colorPalettes: ['Mediterranean warm', 'rustic cream', 'herb green', 'spice orange']
  },
  {
    id: 'scientific-observation',
    name: 'Scientific Observation Annotation',
    description: 'Add precise scientific annotations like a researcher\'s field journal',
    category: 'Science',
    icon: '🔬',
    prompt: `Convert this photo into the meticulous page of a scientist's field journal. Use sharp, white sketch annotations to highlight points of interest—like drawing arrows toward {discipline}-related features, overlaying simple icons (microscopes, beakers, or specimen outlines), and marking measurements in clean handwritten script. Make it feel like a {research_type} log with structured yet artistic notes, detailed but still journal-like. Use the {color_palette} to evoke a research atmosphere, while ensuring all human faces remain untouched for integrity.`,
    parameters: [
      { key: 'discipline', label: 'Scientific Discipline', type: 'select', options: ['biology', 'chemistry', 'physics', 'geology', 'astronomy', 'botany'], required: true },
      { key: 'research_type', label: 'Research Type', type: 'select', options: ['field study', 'laboratory observation', 'specimen analysis', 'data collection'], required: true }
    ],
    colorPalettes: ['laboratory white', 'scientific blue', 'research gray', 'academic green']
  },
  {
    id: 'emotional-landscape',
    name: 'Emotional Landscape',
    description: 'Express inner feelings through abstract, flowing doodle metaphors',
    category: 'Personal',
    icon: '💭',
    prompt: `Reimagine this image as a deeply introspective journal page, capturing the emotional state of {emotional_state}. Overlay white sketch elements that flow across the scene like streams of thought: abstract swirls, symbolic icons, doodled metaphors of inner life (hearts, waves, stars). Add handwritten reflections, short yet evocative, as if written directly onto the page at {time}. Let the {color_palette} feel soft and painterly, keeping doodles tender and expressive while ensuring that faces remain clear and unmarked.`,
    parameters: [
      { key: 'emotional_state', label: 'Emotional State', type: 'select', options: ['reflective', 'hopeful', 'nostalgic', 'peaceful', 'inspired', 'grateful'], required: true },
      { key: 'time', label: 'Time Context', type: 'text', placeholder: 'sunset, midnight, dawn', required: false }
    ],
    colorPalettes: ['soft watercolor', 'gentle pastels', 'emotional blues', 'warm sunset']
  },
  {
    id: 'urban-exploration',
    name: 'Urban Exploration Chronicle',
    description: 'Capture city vibes with street art-inspired annotations and cultural notes',
    category: 'Urban',
    icon: '🏙️',
    prompt: `Transform this into a lively urban exploration journal entry set in {city}, {neighborhood}. Overlay energetic white sketch doodles: playful arrows pointing at storefronts or details, little architectural motifs, cultural symbols, and short handwritten notes about city impressions. Let the doodles capture the vibrancy of street life, echoing the {color_palette} atmosphere. Ensure the overlays remain spontaneous and sketchy, full of curiosity, but keep faces unobstructed to preserve authenticity.`,
    parameters: [
      { key: 'city', label: 'City', type: 'text', placeholder: 'New York', required: true },
      { key: 'neighborhood', label: 'Neighborhood', type: 'text', placeholder: 'SoHo, Downtown', required: false }
    ],
    colorPalettes: ['urban concrete', 'street art bright', 'city noir', 'neon glow']
  },
  {
    id: 'personal-growth',
    name: 'Personal Growth Visualization',
    description: 'Inspire motivation with growth metaphors and achievement annotations',
    category: 'Self-Development',
    icon: '🌱',
    prompt: `Reimagine this as a reflective page in a personal development journal. Overlay clean white sketches of growth metaphors—leaves sprouting, ladders climbing upward, arrows pointing forward—annotated with handwritten notes about {personal_goal} and {progress}. Keep the overlays minimal, zen-inspired, and in harmony with {color_palette} neutrals. The doodles should inspire focus and positivity without covering faces or disrupting human expressions.`,
    parameters: [
      { key: 'personal_goal', label: 'Personal Goal', type: 'text', placeholder: 'fitness, career, mindfulness', required: true },
      { key: 'progress', label: 'Progress Stage', type: 'select', options: ['just starting', 'making progress', 'breakthrough moment', 'milestone achieved'], required: true }
    ],
    colorPalettes: ['zen neutral', 'growth green', 'mindful gray', 'positive yellow']
  },
  {
    id: 'sports-performance',
    name: 'Sports Performance Analysis',
    description: 'Analyze athletic performance with dynamic motion arrows and technique notes',
    category: 'Sports',
    icon: '⚽',
    prompt: `Turn this photo into a sports performance journal entry. Overlay dynamic white doodle arrows showing motion paths, annotated with small callouts on {sport} technique, timing, or skill markers. Add gear icons, performance symbols, and handwritten-style labels describing {skill_level} achievements. Keep the style energetic and fluid, aligned with the {color_palette}, while carefully leaving the athlete's face unobstructed.`,
    parameters: [
      { key: 'sport', label: 'Sport', type: 'select', options: ['soccer', 'basketball', 'tennis', 'running', 'swimming', 'cycling', 'yoga'], required: true },
      { key: 'skill_level', label: 'Skill Level', type: 'select', options: ['beginner', 'intermediate', 'advanced', 'professional'], required: true }
    ],
    colorPalettes: ['athletic blue', 'energy red', 'champion gold', 'team spirit']
  },
  {
    id: 'eco-adventure',
    name: 'Eco-Adventure Log',
    description: 'Document nature experiences with environmental conservation themes',
    category: 'Nature',
    icon: '🌿',
    prompt: `Transform this into the illustrated log of an eco-adventurer on a {environmental_focus} journey. Overlay white doodles of leaves, trees, animal tracks, or wildlife icons, interspersed with handwritten conservation notes about {conservation_activity}. Make the page feel immersive and ecological, guided by {color_palette} greens, yet always ensure faces remain untouched so human presence blends harmoniously into the natural scene.`,
    parameters: [
      { key: 'environmental_focus', label: 'Environmental Focus', type: 'select', options: ['wildlife conservation', 'forest preservation', 'ocean cleanup', 'sustainable living'], required: true },
      { key: 'conservation_activity', label: 'Conservation Activity', type: 'text', placeholder: 'tree planting, bird watching', required: false }
    ],
    colorPalettes: ['nature green', 'earth brown', 'ocean blue', 'conservation neutral']
  },
  {
    id: 'musical-journey',
    name: 'Musical Journey Illustration',
    description: 'Add rhythmic, melodic doodles inspired by music and sound',
    category: 'Music',
    icon: '🎵',
    prompt: `Convert this photo into a page from a musician's whimsical journal. Overlay rhythmic white sketch doodles: flowing wave lines to represent sound, musical notes scattered across the frame, instrument sketches (like {instrument}), and improvisational annotations capturing the energy of {genre}. Keep the {color_palette} moody and melodic, letting doodles dance around the scene without obscuring any faces.`,
    parameters: [
      { key: 'instrument', label: 'Instrument', type: 'select', options: ['guitar', 'piano', 'violin', 'drums', 'saxophone', 'vocals'], required: true },
      { key: 'genre', label: 'Music Genre', type: 'select', options: ['jazz', 'rock', 'classical', 'folk', 'electronic', 'blues'], required: true }
    ],
    colorPalettes: ['musical purple', 'jazz blue', 'rock red', 'classical gold']
  },
  {
    id: 'cultural-heritage',
    name: 'Cultural Heritage Sketch',
    description: 'Celebrate cultural traditions with respectful, symbolic annotations',
    category: 'Culture',
    icon: '🏛️',
    prompt: `Reimagine this as a cultural preservation journal entry. Surround the image with respectful white sketch motifs inspired by {tradition} and {cultural_context}. Add symbolic icons, heritage-inspired borders, and annotations that describe cultural meaning in handwritten-style notes. Keep the {color_palette} earthy and traditional. The doodles should celebrate and elevate the culture, while preserving clear visibility of human faces.`,
    parameters: [
      { key: 'tradition', label: 'Cultural Tradition', type: 'text', placeholder: 'festival, ceremony, art form', required: true },
      { key: 'cultural_context', label: 'Cultural Context', type: 'text', placeholder: 'region, community, time period', required: true }
    ],
    colorPalettes: ['heritage gold', 'traditional red', 'cultural earth', 'ceremonial white']
  },
  {
    id: 'astronomical-observation',
    name: 'Astronomical Observation Log',
    description: 'Add cosmic annotations for stargazing and celestial observations',
    category: 'Science',
    icon: '🌟',
    prompt: `Transform this into a star-gazer's observation journal page. Overlay precise white sketch annotations, constellations, telescope icons, orbital paths, and measurement marks referencing the {celestial_body}. Include short handwritten scientific notes that feel like a {observation_type}. Keep the {color_palette} cosmic and grayscale, while ensuring any human faces remain untouched, letting them appear as observers within the illustrated cosmos.`,
    parameters: [
      { key: 'celestial_body', label: 'Celestial Body', type: 'select', options: ['moon', 'stars', 'planets', 'galaxies', 'meteors', 'nebula'], required: true },
      { key: 'observation_type', label: 'Observation Type', type: 'select', options: ['naked eye observation', 'telescope viewing', 'astrophotography', 'star mapping'], required: true }
    ],
    colorPalettes: ['cosmic black', 'starlight silver', 'nebula purple', 'galaxy blue']
  }
];

export const TEMPLATE_CATEGORIES = [
  'All',
  'Travel',
  'Personal', 
  'Business',
  'Memory',
  'Adventure',
  'Food',
  'Science',
  'Urban',
  'Self-Development',
  'Sports',
  'Nature',
  'Music',
  'Culture'
];
