
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Modal, KeyboardAvoidingView, Platform, Linking, Share, Image, ActivityIndicator } from 'react-native';
import { useState, useRef, useEffect } from 'react';
 
const supabase = createClient(
  'https://truceubjgpbearomzlr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRydWNldWpiamdwYmVhcm9temxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0MjU3ODQsImV4cCI6MjA5MzAwMTc4NH0.xawvE96CGH6xVHn0o1yycH47sHuTS_X7l22Mn7Qv01s',
  { auth: { storage: AsyncStorage, autoRefreshToken: true, persistSession: true, detectSessionInUrl: false } }
);
 
const SHOPS = {
  "San Francisco": {
    flag: "🇺🇸", country: "USA",
    shops: [
      { name: "Linea Caffe", hood: "Mission District", rating: 4.9, tags: ["Best Latte", "Traditional", "Cappuccino"], hours: "Mon–Fri 7am–3pm, Wknd 8am–3pm", price: "$$", wifi: "Limited", seats: "Cozy", openNow: true, stamps: 847, isHiddenGem: false, photo: "https://lineacaffe.com/wp-content/uploads/2021/06/linea-outdoor-line.jpg", desc: "Widely considered SF's finest espresso bar — a tiny, precise Mission space where some of the most technically perfect shots in the country are pulled.", reviews: [{ a: "Local coffee writer", t: "The best straight espresso in San Francisco. No shortcuts, no gimmicks." }, { a: "Verified visitor", t: "Flew in from Chicago and made this my first stop. Worth every minute." }] },
      { name: "Sightglass Coffee", hood: "SoMa", rating: 4.8, tags: ["Ambiance", "Work Spot", "Best Latte"], hours: "Mon–Fri 7am–5pm, Wknd 8am–5pm", price: "$$", wifi: "Yes", seats: "Plenty", openNow: true, stamps: 912, isHiddenGem: false, photo: "https://img1.10bestmedia.com/Images/Photos/416582/Sightglass-Coffee_54_990x660.jpg", desc: "An iconic two-story SoMa roastery with soaring ceilings and massive skylights. The most beautiful café interior in San Francisco.", reviews: [{ a: "Eater SF", t: "The room is as good as the coffee. A genuine SF landmark." }, { a: "Visitor", t: "Nothing in the city comes close to the atmosphere here." }] },
      { name: "Ballast Coffee", hood: "West Portal", rating: 4.7, tags: ["Experience", "Ambiance", "Work Spot"], hours: "Mon–Fri 7:30am–8pm, Wknd 7:30am–5pm", price: "$$", wifi: "Yes", seats: "Plenty", openNow: false, stamps: 234, isHiddenGem: true, photo: "https://s3-media0.fl.yelpcdn.com/bphoto/I0-r3ff9BnkSrJEAYz857w/348s.jpg", desc: "SF's only source of Philippine Barako coffee — imported directly from Lipa, Batangas. The ube latte is stunning.", reviews: [{ a: "Nextdoor neighbor", t: "The Barako bean is a must try. You cannot find it elsewhere in SF." }, { a: "Regular", t: "The ube latte is beautiful. Big space, lovely patio, great wifi." }] },
      { name: "Paper Son Coffee", hood: "Dogpatch", rating: 4.8, tags: ["Experience", "Best Latte", "Matcha"], hours: "Tue–Sun 8am–4pm", price: "$$", wifi: "Yes", seats: "Moderate", openNow: true, stamps: 445, isHiddenGem: true, photo: "https://res.cloudinary.com/the-infatuation/image/upload/v1662504222/images/VerveCoffee_MarketStreet_PressPhoto_urocsl.jpg", desc: "A love letter to the Asian-American coffee experience. Pandan aerocanos, cardamom cappuccinos, exceptional matcha.", reviews: [{ a: "SF Magazine", t: "The most creative menu in SF specialty coffee." }, { a: "Regular", t: "The pandan aerocano changed my life." }] },
      { name: "Andytown Coffee", hood: "Outer Sunset", rating: 4.7, tags: ["Traditional", "Date Spot", "Ambiance"], hours: "Mon–Sun 7am–5pm", price: "$", wifi: "No", seats: "Cozy", openNow: true, stamps: 389, isHiddenGem: false, photo: "https://live.staticflickr.com/3871/15110445001_2986b3b0f5_b.jpg", desc: "A beloved institution at the foggy edge of the city, roasting on-site since 2014. Warm wood interior, community feel.", reviews: [{ a: "SF Gate", t: "The soul of the Outer Sunset in café form." }, { a: "Regular", t: "This is what a neighborhood coffee shop is supposed to feel like." }] },
      { name: "Saint Frank Coffee", hood: "Russian Hill", rating: 4.7, tags: ["Best Latte", "Date Spot", "Cappuccino"], hours: "Mon–Fri 7am–5pm, Wknd 8am–5pm", price: "$$", wifi: "Limited", seats: "Cozy", openNow: false, stamps: 312, isHiddenGem: false, photo: "https://openscopestudio.com/wp-content/uploads/2020/10/St-Frank-Coffee-0124-3069902204-O-e1603836207979.jpg", desc: "A refined Russian Hill gem with exceptional single-origin focus. SF's best kept secret for a coffee date.", reviews: [{ a: "Yelp Top Reviewer", t: "By far the best coffee in San Francisco." }, { a: "Regular", t: "My go-to date spot. Quiet, warm, genuinely special." }] },
      { name: "Tadaima", hood: "Mission District", rating: 4.8, tags: ["Matcha", "Experience", "Date Spot"], hours: "Mon–Thu 11am–4:30pm, Fri–Sun 10am–5:30pm", price: "$", wifi: "Limited", seats: "Cozy", openNow: true, isNew: true, stamps: 567, isHiddenGem: false, photo: "https://assets.sfstandard.com/image/994911177489/image_1pls21bugl29790qa3dnl5d44o", desc: "The Mission's most exciting matcha spot since 2024. Japanese comfort food meets exceptional ceremonial matcha — the matcha latte with salted cream cheese is the best in SF.", reviews: [{ a: "TikTok visitor", t: "The matcha latte with salted cream cheese is probably the best matcha latte I've had in the city." }, { a: "SF food writer", t: "Tadaima means 'I'm home' in Japanese. That warmth comes through in every bite and sip." }] },
      { name: "Q Specialty Coffee", hood: "Laurel Heights", rating: 4.8, tags: ["Matcha", "Experience", "Best Latte"], hours: "Daily — check Instagram for hours", price: "$$", wifi: "Yes", seats: "Moderate", openNow: true, isNew: true, stamps: 734, isHiddenGem: false, photo: "https://res.cloudinary.com/the-infatuation/image/upload/q_auto,f_auto/Untitled_design_17_d6hh9s", desc: "SF's most viral new café — and the hype is earned. Owner Cyrus Shen roasts green beans in-house in just 12 minutes. Six matcha drinks including the Triple Matcha Yuzu Cloud. Lines out the door daily.", reviews: [{ a: "Axios SF, 2026", t: "After one sip, it all made sense. The matcha is forever my favorite." }, { a: "Yelp reviewer", t: "Best matcha in San Fran. Newly opened. The presentation is amazing." }] },
    ]
  },
  "Los Angeles": {
    flag: "🇺🇸", country: "USA",
    shops: [
      { name: "Harun Coffee", hood: "Leimert Park", rating: 4.8, tags: ["Experience", "Ambiance", "Cold Brew"], hours: "Mon–Sun 7am–4pm & 6pm–11pm", price: "$$", wifi: "Yes", seats: "Plenty", openNow: true, isCultural: true, stamps: 1243, isHiddenGem: false, photo: "https://res.cloudinary.com/the-infatuation/image/upload/c_fill,w_1400,ar_4:3,g_center,f_auto/cms/guides/5-exciting-things-to-do-eat-between-august-18th-22nd/Harun_Coffee", desc: "A cultural institution in Leimert Park. By day a specialty coffee shop; by night a speakeasy through a hidden wall. Founded by A$AP Rocky's former manager.", reviews: [{ a: "The Infatuation", t: "More than coffee — a community hub with a gallery and lifestyle brand." }, { a: "LA Sentinel, 2026", t: "Pull open the canary yellow wall and enter a high-ceilinged speakeasy." }] },
      { name: "Go Get Em Tiger", hood: "Los Feliz", rating: 4.9, tags: ["Best Latte", "Work Spot", "Experience"], hours: "Mon–Fri 7am–5pm, Wknd 8am–5pm", price: "$$", wifi: "Yes", seats: "Plenty", openNow: true, stamps: 987, isHiddenGem: false, photo: "https://gget.com/cdn/shop/files/GCM_cafe.jpg?v=1732579503&width=2400", desc: "Founded by two James Beard award winners, GGET redefined LA specialty coffee with a cocktail bar service model.", reviews: [{ a: "LA Times", t: "GGET changed how LA thinks about the entire coffee experience." }, { a: "Regular", t: "The macchiato flight alone is worth the trip." }] },
      { name: "Verve Coffee Roasters", hood: "Downtown LA", rating: 4.8, tags: ["Work Spot", "Ambiance", "Best Latte"], hours: "Mon–Fri 7am–6pm, Wknd 8am–6pm", price: "$$", wifi: "Excellent", seats: "Plenty", openNow: true, stamps: 756, isHiddenGem: false, photo: "https://www.vervecoffee.com/cdn/shop/files/Cafes-SpringSt-9018_800x.jpg?v=1654116154", desc: "The Santa Cruz roaster's DTLA flagship — soaring ceilings, living plant walls, light that makes you want to stay all day.", reviews: [{ a: "Coffee Traveler", t: "High ceilings, concrete, living plants. A perfect work environment." }, { a: "Regular", t: "The oat cortado is smooth perfection." }] },
      { name: "Maru Coffee", hood: "Arts District", rating: 4.8, tags: ["Traditional", "Cappuccino", "Matcha"], hours: "Daily 7am–5pm", price: "$$", wifi: "Limited", seats: "Moderate", openNow: true, stamps: 645, isHiddenGem: false, photo: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/29/11/42/photo0jpg.jpg?w=500&h=-1&s=1", desc: "Named for the Korean word for mountaintop. Japanese-influenced precision. The cappuccino and matcha are world class.", reviews: [{ a: "Timeout LA", t: "Lines down the block on weekends. The best cappuccino in Los Angeles." }, { a: "Regular", t: "Every detail is considered — the cup, the pour, the space." }] },
      { name: "Intelligentsia Coffee", hood: "Silver Lake", rating: 4.7, tags: ["Traditional", "Work Spot", "Cold Brew"], hours: "Mon–Fri 6am–7pm, Wknd 7am–7pm", price: "$$", wifi: "Yes", seats: "Plenty", openNow: false, stamps: 534, isHiddenGem: false, photo: "https://images.squarespace-cdn.com/content/v1/5ecc30f127d0ac66b8a0075e/1609309585814-424720Z7Y3QYF0IV71GH/02_intelli.JPG", desc: "The institution that invented direct trade coffee sourcing. The standard-bearer for traditional specialty coffee in LA.", reviews: [{ a: "Bon Appétit", t: "Intelligentsia invented the vocabulary for the entire specialty coffee industry." }, { a: "Regular", t: "The best traditional espresso in Silver Lake." }] },
      { name: "Canyon Coffee", hood: "Echo Park", rating: 4.8, tags: ["Date Spot", "Ambiance", "Best Latte"], hours: "Daily 7am–5pm", price: "$$", wifi: "Limited", seats: "Cozy", openNow: true, stamps: 423, isHiddenGem: true, photo: "https://s3-media0.fl.yelpcdn.com/bphoto/cI3Lx-irhIhCOF-NBURECA/348s.jpg", desc: "After years supplying beans to LA's best cafés, Canyon Coffee opened in Echo Park as a love letter to slow mornings.", reviews: [{ a: "Eater LA", t: "Canyon Coffee is what every neighborhood deserves." }, { a: "Regular", t: "Best date spot for coffee in all of LA." }] },
      { name: "Kindness & Mischief", hood: "Highland Park", rating: 4.7, tags: ["Experience", "Work Spot", "Matcha"], hours: "Mon–Fri 7am–5pm, Wknd 8am–5pm", price: "$$", wifi: "Yes", seats: "Plenty", openNow: true, stamps: 378, isHiddenGem: true, photo: "https://sprudge.com/wp-content/uploads/2016/06/Sprudge-KindnessAndMischief-TatianaErnst-KandM-Interior.jpg", desc: "Community-centered specialty shop with a turquoise facade. The rotating guest roaster program makes every visit a discovery.", reviews: [{ a: "Discover LA", t: "The most community-driven specialty shop in LA." }, { a: "Regular", t: "The Mischief latte is the most creative drink in the city." }] },
    ]
  },
  "New York": {
    flag: "🇺🇸", country: "USA",
    shops: [
      { name: "Arcane Estate Coffee", hood: "West Village", rating: 4.9, tags: ["Experience", "Traditional", "Date Spot"], hours: "Mon–Fri 8am–5pm, Wknd 9am–5pm", price: "$$$", wifi: "Limited", seats: "Cozy", openNow: true, stamps: 1456, isHiddenGem: false, photo: "https://media.timeout.com/images/106375451/750/422/image.jpg", desc: "Ranked #12 on the World's 100 Best Coffee Shops list in 2026. A moody West Village hideaway devoted to Panamanian single-origin coffee.", reviews: [{ a: "Timeout New York, 2026", t: "Arcane's devotion to Panama's terroir stands out as something genuinely world-class." }, { a: "Regular", t: "The most intentional cup of coffee I have ever had." }] },
      { name: "Sey Coffee", hood: "Bushwick, Brooklyn", rating: 4.9, tags: ["Best Latte", "Traditional", "Work Spot"], hours: "Mon–Fri 7am–5pm, Wknd 8am–5pm", price: "$$", wifi: "Yes", seats: "Plenty", openNow: true, stamps: 1123, isHiddenGem: false, photo: "https://sprudge.com/wp-content/uploads/2017/08/Sey_Coffee_Bushwick_Liz_Clayton-3-1104x780.jpg", desc: "Consistently ranked the finest specialty roaster in NYC. Light roasts so delicate you taste florals you didn't know existed in coffee.", reviews: [{ a: "My Coffee Explorer 2026", t: "Light roast masters. The Saturday line is worth every minute." }, { a: "Regular", t: "The best coffee in New York City, full stop." }] },
      { name: "Devoción", hood: "Williamsburg, Brooklyn", rating: 4.8, tags: ["Ambiance", "Best Latte", "Work Spot"], hours: "Daily 8am–6pm", price: "$$", wifi: "Yes", seats: "Plenty", openNow: true, stamps: 867, isHiddenGem: false, photo: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/08/4e/9d/c5/the-spacious-interior.jpg?w=900&h=500&s=1", desc: "A Colombian roaster with a breathtaking Williamsburg space and a living plant wall. Beans arrive within 10 days of harvest.", reviews: [{ a: "Drips of God", t: "The latte is exceptional and the farm-to-cup story is unmatched." }, { a: "Regular", t: "You can taste how fresh the beans are." }] },
      { name: "Maru Coffee", hood: "Williamsburg, Brooklyn", rating: 4.8, tags: ["Traditional", "Cappuccino", "Matcha"], hours: "Daily 7:30am–5pm", price: "$$", wifi: "Limited", seats: "Moderate", openNow: true, isNew: true, stamps: 634, isHiddenGem: false, photo: "https://www.marucoffee.com/cdn/shop/files/Maru_Coffee_Williamsburg_Brooklyn_4_1000x.jpg?v=1759875658", desc: "The cult LA favorite brought its Japanese-influenced precision to Williamsburg in late 2025. Beans never older than 3 days.", reviews: [{ a: "NYC-MAP.COM, 2026", t: "Coffee here isn't for work — it's for slowing down and savoring the moment." }, { a: "Regular", t: "Having Maru in Williamsburg feels like a gift to New York." }] },
      { name: "% Arabica — Dumbo", hood: "Dumbo, Brooklyn", rating: 4.8, tags: ["Experience", "Ambiance", "Matcha"], hours: "Daily 7:30am–6pm", price: "$$", wifi: "Limited", seats: "Moderate", openNow: false, isNew: true, stamps: 445, isHiddenGem: false, photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMfWpxCHeqn_UH_IkjkG3MC6dFbCxAQvuqkw&s", desc: "The Kyoto roaster's Brooklyn flagship steps from the Brooklyn Bridge. The Spanish latte, matcha, and pour overs are all exceptional.", reviews: [{ a: "The Infatuation", t: "The baristas make a perfect cup every time." }, { a: "Regular", t: "Beautiful spot with the Brooklyn Bridge view." }] },
      { name: "Fast Times at Buck Mason", hood: "SoHo, Manhattan", rating: 4.7, tags: ["Experience", "Ambiance", "Date Spot"], hours: "Mon–Sat 8am–8pm, Sun 8am–7pm", price: "$$", wifi: "Yes", seats: "Plenty", openNow: true, isNew: true, stamps: 523, isHiddenGem: false, photo: "https://www.fasttimescoffee.com/cdn/shop/files/FastTimesSoHo.jpg?v=1753485485&width=900", desc: "A specialty coffee bar inside Buck Mason's SoHo flagship — 1,000 curated vintage books, candles, incense, vinyl.", reviews: [{ a: "TikTok visitor", t: "Ambiance 10/10. Candles, incense, great vinyl. Perfect solo creative session." }, { a: "Regular", t: "The coziest secret in SoHo. The brown sugar latte is exceptional." }] },
      { name: "787 Coffee", hood: "SoHo, Manhattan", rating: 4.7, tags: ["Traditional", "Experience", "Best Latte"], hours: "Daily 7am–8pm", price: "$$", wifi: "Yes", seats: "Moderate", openNow: true, stamps: 412, isHiddenGem: true, photo: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2e/80/9e/10/caption.jpg?w=900&h=500&s=1", desc: "The only NYC coffee shop that owns its own farm — Hacienda Iluminada in Puerto Rico. The Coquito Latte has a cult following.", reviews: [{ a: "787 Coffee", t: "We source from farms we trust — including our own farm in Puerto Rico." }, { a: "Regular", t: "The Coquito Latte is one of the best things I have ever had." }] },
      { name: "Café Integral", hood: "Nolita, Manhattan", rating: 4.9, tags: ["Cappuccino", "Traditional", "Best Latte"], hours: "Mon–Fri 7am–5pm, Wknd 8am–5pm", price: "$$$", wifi: "Limited", seats: "Cozy", openNow: true, stamps: 789, isHiddenGem: false, photo: "https://images.squarespace-cdn.com/content/v1/50ce0513e4b0c301a8234314/1473865808815-30VGNVGYLKI4A9DLXGJW/Screen+Shot+2016-09-14+at+10.08.22+AM.jpg?format=750w", desc: "A Nicaraguan-focused specialty roaster in a beautifully spare Nolita space where every cappuccino is a technical masterpiece.", reviews: [{ a: "New York magazine", t: "Integral proves that NYC can do specialty coffee as well as anywhere in the world." }, { a: "Regular", t: "The most precise, intentional cappuccino I have ever had." }] },
      { name: "Rhythm Zero", hood: "West Village, Manhattan", rating: 4.7, tags: ["Experience", "Ambiance", "Date Spot"], hours: "Mon–Fri 7am–4pm, Wknd 8am–4pm", price: "$$", wifi: "Check in store", seats: "Limited", openNow: true, stamps: 287, isHiddenGem: true, photo: "https://whereyoueat.com/r_gallery_images/rgallery-26776/Pic1.jpg", desc: "A creative multidisciplinary hub born in Greenpoint in 2022 — part specialty coffee bar, part gallery, part curated retail. One of NYC's most intentional third-wave coffee experiences, built in collaboration with artists, designers and brands.", reviews: [{ a: "Rhythm Zero", t: "From sourcing the finest coffee beans to curating exhibitions that spoke to the soul — every step required a leap of faith." }, { a: "Regular", t: "Came for the coffee, stayed for the whole vibe. Nothing else like it in the city." }] },
    ]
  }
};
 
const SHOP_OF_WEEK = { city: 'New York', name: 'Arcane Estate Coffee', reason: "Roam's pick this week. A moody West Village hideaway ranked #12 in the world. The most intentional cup of coffee in NYC." };
 
const CATEGORIES = [
  { label: 'Best Latte', emoji: '☕' },
  { label: 'Matcha', emoji: '🍵' },
  { label: 'Work Spot', emoji: '💻' },
  { label: 'Date Spot', emoji: '🌹' },
  { label: 'Ambiance', emoji: '✨' },
  { label: 'Cold Brew', emoji: '🧊' },
  { label: 'Cappuccino', emoji: '☕' },
  { label: 'Experience', emoji: '⭐' },
  { label: 'Traditional', emoji: '🏺' },
];
 
const TAG_COLORS = {
  'Best Latte': { bg: '#F5E6C8', text: '#6B3F1A' },
  'Work Spot': { bg: '#E1F5EE', text: '#0F6E56' },
  'Date Spot': { bg: '#FBEAF0', text: '#993556' },
  'Experience': { bg: '#EEEDFE', text: '#534AB7' },
  'Ambiance': { bg: '#FAEEDA', text: '#854F0B' },
  'Cold Brew': { bg: '#EAF3DE', text: '#3B6D11' },
  'Cappuccino': { bg: '#E6F1FB', text: '#185FA5' },
  'Traditional': { bg: '#F5E6C8', text: '#6B3F1A' },
  'Matcha': { bg: '#E8F5E9', text: '#1B5E20' },
};
 
const HERO_COLORS = {
  'Harun Coffee': '#1A0A00', 'Arcane Estate Coffee': '#040108', 'Sightglass Coffee': '#161622',
  'Sey Coffee': '#1A1A1A', 'Devoción': '#051008', 'Go Get Em Tiger': '#180700',
  'Linea Caffe': '#1A0A03', 'Maru Coffee': '#080808', 'Canyon Coffee': '#180D04',
  'Tadaima': '#0A1A0A', 'Q Specialty Coffee': '#0A0A14', 'Fast Times at Buck Mason': '#0A0806',
  'Café Integral': '#0A0A0A', '787 Coffee': '#0A0614', 'Rhythm Zero': '#0A0A0E',
  'default': '#1A0F07',
};
 
const RANKS = [
  { min: 0, title: "First Sip", sub: "Your coffee journey is just beginning.", next: "Stamp 1 shop to level up" },
  { min: 1, title: "Regular", sub: "You've found your first favorite.", next: "Stamp 3 shops to reach Enthusiast" },
  { min: 3, title: "Enthusiast", sub: "You know your way around a coffee menu.", next: "Stamp 7 shops to reach Connoisseur" },
  { min: 7, title: "Connoisseur", sub: "Your palate is refined.", next: "Stamp 12 to reach Expert" },
  { min: 12, title: "Expert", sub: "A serious coffee traveler.", next: "Stamp 20 to reach World Traveler" },
  { min: 20, title: "World Traveler", sub: "You've explored the world one cup at a time.", next: "The coffee world is yours" },
];
 
const BADGES = [
  { id: 'first_stamp', emoji: '☕', title: 'First Sip', desc: 'Stamped your first shop', condition: (s) => Object.keys(s).length >= 1 },
  { id: 'three_stamps', emoji: '🎯', title: 'On a Roll', desc: 'Stamped 3 shops', condition: (s) => Object.keys(s).length >= 3 },
  { id: 'five_stamps', emoji: '🔥', title: 'Coffee Obsessed', desc: 'Stamped 5 shops', condition: (s) => Object.keys(s).length >= 5 },
  { id: 'ten_stamps', emoji: '💯', title: 'Double Digits', desc: 'Stamped 10 shops', condition: (s) => Object.keys(s).length >= 10 },
  { id: 'two_cities', emoji: '✈️', title: 'City Hopper', desc: 'Stamped shops in 2 cities', condition: (s) => new Set(Object.values(s).map(x => x.city)).size >= 2 },
  { id: 'three_cities', emoji: '🌎', title: 'Coast to Coast', desc: 'Stamped shops in all 3 cities', condition: (s) => new Set(Object.values(s).map(x => x.city)).size >= 3 },
  { id: 'matcha_lover', emoji: '🍵', title: 'Matcha Lover', desc: 'Stamped a Matcha shop', condition: (s) => Object.values(s).some(x => x.shop?.tags?.includes('Matcha')) },
  { id: 'night_owl', emoji: '🦉', title: 'Night Owl', desc: 'Stamped Harun Coffee', condition: (s) => Object.keys(s).some(k => k.includes('Harun Coffee')) },
  { id: 'world_class', emoji: '🏆', title: 'World Class', desc: 'Stamped a top-ranked shop', condition: (s) => Object.keys(s).some(k => k.includes('Arcane Estate Coffee')) },
  { id: 'hidden_gem', emoji: '💎', title: 'Gem Hunter', desc: 'Stamped a hidden gem', condition: (s) => Object.values(s).some(x => x.shop?.isHiddenGem) },
];
 
function ShopPhoto({ uri, style, fallbackColor, children }) {
  return (
    <View style={[style, { overflow: 'hidden', backgroundColor: fallbackColor || '#1A0F07' }]}>
      {uri ? <Image source={{ uri }} style={StyleSheet.absoluteFillObject} resizeMode="cover" /> : null}
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.35)' }]} />
      {children}
    </View>
  );
}
 
function Tag({ label }) {
  const colors = TAG_COLORS[label] || { bg: '#F5E6C8', text: '#6B3F1A' };
  return (
    <View style={[styles.tag, { backgroundColor: colors.bg }]}>
      <Text style={[styles.tagText, { color: colors.text }]}>{label}</Text>
    </View>
  );
}
 
function SplashScreen({ onDone }) {
  setTimeout(onDone, 2200);
  return (
    <View style={styles.splash}>
      <Text style={styles.splashLogo}>Roam</Text>
      <Text style={styles.splashTag}>STAMP THE WORLD, ONE CUP AT A TIME</Text>
      <View style={styles.splashDot} />
    </View>
  );
}
 
function OnboardingScreen({ onLogin, onSignup }) {
  return (
    <View style={styles.onboarding}>
      <View style={styles.onboardingHero}>
        <Text style={styles.splashLogo}>Roam</Text>
      </View>
      <View style={styles.onboardingBody}>
        <Text style={styles.onboardingTitle}>The world's best{'\n'}coffee, curated.</Text>
        <Text style={styles.onboardingSub}>Discover exceptional specialty coffee in SF, LA, NYC and beyond. Stamp every shop you visit. Build your passport.</Text>
        <TouchableOpacity style={styles.onboardingBtnPrimary} onPress={onSignup}>
          <Text style={styles.onboardingBtnPrimaryText}>Create account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.onboardingBtnSecondary} onPress={onLogin}>
          <Text style={styles.onboardingBtnSecondaryText}>Sign in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
 
function AuthScreen({ mode, onSuccess, onBack }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isSignup = mode === 'signup';
 
  const handleAuth = async () => {
    setLoading(true);
    setError('');
    try {
      if (isSignup) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name } }
        });
        if (error) throw error;
        onSuccess({ name: name || email.split('@')[0], email, id: data.user?.id });
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onSuccess({ name: data.user?.user_metadata?.name || email.split('@')[0], email, id: data.user?.id });
      }
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };
 
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={styles.authHeader}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}><Text style={styles.backBtnText}>← Back</Text></TouchableOpacity>
          <Text style={styles.authTitle}>{isSignup ? 'Create account' : 'Welcome back'}</Text>
          <Text style={styles.authSub}>{isSignup ? 'Join the Roam community.' : 'Sign in to your account.'}</Text>
        </View>
        <View style={{ padding: 22 }}>
          {error ? <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text></View> : null}
          <View style={styles.dividerRow}><View style={styles.dividerLine} /><Text style={styles.dividerText}>email & password</Text><View style={styles.dividerLine} /></View>
          {isSignup && <TextInput style={styles.authInput} placeholder="Your name" placeholderTextColor="#BBB" value={name} onChangeText={setName} autoCapitalize="words" />}
          <TextInput style={styles.authInput} placeholder="Email address" placeholderTextColor="#BBB" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          <TextInput style={styles.authInput} placeholder="Password" placeholderTextColor="#BBB" value={password} onChangeText={setPassword} secureTextEntry />
          <TouchableOpacity style={[styles.authBtn, (!email || !password || loading) && { opacity: 0.4 }]} onPress={handleAuth} disabled={!email || !password || loading}>
            {loading ? <ActivityIndicator color="#F5E6C8" /> : <Text style={styles.authBtnText}>{isSignup ? 'Create account' : 'Sign in'}</Text>}
          </TouchableOpacity>
          {!isSignup && <TouchableOpacity style={{ alignItems: 'center', marginTop: 16 }}><Text style={{ fontSize: 13, color: '#C4B49A' }}>Forgot password?</Text></TouchableOpacity>}
          <Text style={styles.authTerms}>By continuing you agree to Roam's Terms of Service and Privacy Policy.</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
 
function RequestCityModal({ visible, onClose }) {
  const [city, setCity] = useState('');
  const [submitted, setSubmitted] = useState(false);
  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
          <TouchableOpacity activeOpacity={1} onPress={() => {}}>
            <View style={styles.modalCard}>
              {!submitted ? (<>
                <Text style={styles.modalTitle}>Request your city</Text>
                <Text style={styles.modalSub}>Tell us where you want Roam to go next. We read every request.</Text>
                <TextInput style={styles.modalInput} placeholder="City name..." placeholderTextColor="#BBB" value={city} onChangeText={setCity} autoFocus />
                <TouchableOpacity style={[styles.modalBtn, !city.trim() && { opacity: 0.4 }]} onPress={() => { if (city.trim()) setSubmitted(true); }} disabled={!city.trim()}><Text style={styles.modalBtnText}>Submit request</Text></TouchableOpacity>
                <TouchableOpacity onPress={onClose} style={{ marginTop: 14, alignItems: 'center' }}><Text style={{ fontSize: 13, color: '#BBB' }}>Cancel</Text></TouchableOpacity>
              </>) : (<>
                <Text style={{ fontSize: 40, textAlign: 'center', marginBottom: 16 }}>📍</Text>
                <Text style={styles.modalTitle}>We got it!</Text>
                <Text style={styles.modalSub}>{city} has been added to our list.</Text>
                <TouchableOpacity style={styles.modalBtn} onPress={() => { setSubmitted(false); setCity(''); onClose(); }}><Text style={styles.modalBtnText}>Done</Text></TouchableOpacity>
              </>)}
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
}
 
function DirectionsModal({ visible, shopName, onConfirm, onClose }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity activeOpacity={1} onPress={() => {}}>
          <View style={[styles.modalCard, { paddingBottom: 28 }]}>
            <Text style={{ fontSize: 36, textAlign: 'center', marginBottom: 12 }}>📍</Text>
            <Text style={styles.modalTitle}>Heading out?</Text>
            <Text style={styles.modalSub}>We'll remind you to stamp {shopName} and leave a review after your visit.</Text>
            <TouchableOpacity style={styles.modalBtn} onPress={onConfirm}><Text style={styles.modalBtnText}>Open in Maps</Text></TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={{ marginTop: 14, alignItems: 'center' }}><Text style={{ fontSize: 13, color: '#BBB' }}>Cancel</Text></TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
 
function HomeScreen({ onCityPress, onShopPress, onCategoryPress, user }) {
  const [search, setSearch] = useState('');
  const [showRequest, setShowRequest] = useState(false);
  const [openNowOnly, setOpenNowOnly] = useState(false);
  const cityKeys = Object.keys(SHOPS);
  const filteredCities = search.trim() ? cityKeys.filter(c => c.toLowerCase().includes(search.toLowerCase())) : cityKeys;
  const noMatch = search.trim() && filteredCities.length === 0;
  const allShops = Object.entries(SHOPS).flatMap(([city, data]) => data.shops.map(s => ({ ...s, city })));
  const nearMeShops = allShops.filter(s => openNowOnly ? s.openNow : true).slice(0, 6);
  const trendingShops = [...allShops].sort((a, b) => b.stamps - a.stamps).slice(0, 6);
  const hiddenGems = allShops.filter(s => s.isHiddenGem);
  const sotw = SHOPS[SHOP_OF_WEEK.city]?.shops.find(s => s.name === SHOP_OF_WEEK.name);
 
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
            <View>
              <Text style={styles.logo}>Roam</Text>
              <Text style={styles.logoTag}>Specialty coffee, curated</Text>
            </View>
            <View style={styles.profileDot}>
              <Text style={{ fontSize: 13, color: '#8B4A00', fontWeight: '600' }}>{user?.name?.charAt(0).toUpperCase() || '◯'}</Text>
            </View>
          </View>
          <View style={styles.searchBox}>
            <Text style={{ fontSize: 14, opacity: 0.3 }}>🔍</Text>
            <TextInput style={styles.searchInput} placeholder="Search a city..." placeholderTextColor="#CCC" value={search} onChangeText={setSearch} returnKeyType="search" />
            {search.length > 0 && <TouchableOpacity onPress={() => setSearch('')}><Text style={{ fontSize: 16, color: '#CCC', paddingLeft: 8 }}>✕</Text></TouchableOpacity>}
          </View>
        </View>
 
        {!search.trim() && (<>
          {sotw && (<>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Shop of the week</Text>
              <View style={{ backgroundColor: '#F5EFE6', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 }}>
                <Text style={{ fontSize: 10, color: '#8B4A00', fontWeight: '600' }}>⭐ Roam's pick</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.sotwCard} onPress={() => onShopPress(SHOP_OF_WEEK.city, SHOP_OF_WEEK.name)} activeOpacity={0.9}>
              <ShopPhoto uri={sotw.photo} style={styles.sotwHero} fallbackColor={HERO_COLORS[sotw.name] || HERO_COLORS.default}>
                <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16 }}>
                  <Text style={styles.sotwName}>{sotw.name}</Text>
                  <Text style={styles.sotwLoc}>{sotw.hood} · {SHOP_OF_WEEK.city}</Text>
                </View>
              </ShopPhoto>
              <View style={styles.sotwBody}>
                <Text style={styles.sotwReason}>{SHOP_OF_WEEK.reason}</Text>
                <View style={{ flexDirection: 'row', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
                  {sotw.tags.map(t => <Tag key={t} label={t} />)}
                </View>
              </View>
            </TouchableOpacity>
 
            <View style={[styles.sectionHeader, { marginTop: 8 }]}>
              <Text style={styles.sectionTitle}>Trending this week</Text>
              <Text style={{ fontSize: 10, color: '#C4B49A' }}>📈 Most stamped</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 22, gap: 12 }}>
              {trendingShops.map(shop => (
                <TouchableOpacity key={shop.city + shop.name} style={styles.nearCard} onPress={() => onShopPress(shop.city, shop.name)} activeOpacity={0.9}>
                  <ShopPhoto uri={shop.photo} style={styles.nearHero} fallbackColor={HERO_COLORS[shop.name] || HERO_COLORS.default}>
                    <View style={{ position: 'absolute', bottom: 6, left: 8 }}>
                      <Text style={{ fontSize: 9, color: 'rgba(255,255,255,0.9)', fontWeight: '600' }}>{shop.stamps} stamps</Text>
                    </View>
                  </ShopPhoto>
                  <View style={{ padding: 10 }}>
                    <Text style={styles.nearName} numberOfLines={1}>{shop.name}</Text>
                    <Text style={styles.nearLoc} numberOfLines={1}>{shop.city}</Text>
                    <Text style={styles.nearRating}>{shop.rating.toFixed(1)} ★</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
 
            <View style={[styles.sectionHeader, { marginTop: 8 }]}>
              <Text style={styles.sectionTitle}>Near you</Text>
              <TouchableOpacity onPress={() => setOpenNowOnly(!openNowOnly)} style={[styles.openNowBtn, openNowOnly && styles.openNowBtnActive]}>
                <Text style={[styles.openNowBtnText, openNowOnly && styles.openNowBtnTextActive]}>{openNowOnly ? '✓ Open now' : 'Open now'}</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 22, gap: 12 }}>
              {nearMeShops.map(shop => (
                <TouchableOpacity key={shop.city + shop.name + 'near'} style={styles.nearCard} onPress={() => onShopPress(shop.city, shop.name)} activeOpacity={0.9}>
                  <ShopPhoto uri={shop.photo} style={styles.nearHero} fallbackColor={HERO_COLORS[shop.name] || HERO_COLORS.default}>
                    {shop.openNow && (
                      <View style={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,180,0,0.85)', borderRadius: 10, paddingHorizontal: 7, paddingVertical: 2 }}>
                        <Text style={{ fontSize: 9, color: '#fff', fontWeight: '600' }}>OPEN</Text>
                      </View>
                    )}
                  </ShopPhoto>
                  <View style={{ padding: 10 }}>
                    <Text style={styles.nearName} numberOfLines={1}>{shop.name}</Text>
                    <Text style={styles.nearLoc} numberOfLines={1}>{shop.city}</Text>
                    <Text style={styles.nearRating}>{shop.rating.toFixed(1)} ★</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
 
            {hiddenGems.length > 0 && (<>
              <View style={[styles.sectionHeader, { marginTop: 8 }]}>
                <Text style={styles.sectionTitle}>Hidden gems</Text>
                <Text style={{ fontSize: 10, color: '#C4B49A' }}>💎 Locals know</Text>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 22, gap: 12 }}>
                {hiddenGems.map(shop => (
                  <TouchableOpacity key={shop.city + shop.name + 'gem'} style={styles.gemCard} onPress={() => onShopPress(shop.city, shop.name)} activeOpacity={0.9}>
                    <ShopPhoto uri={shop.photo} style={styles.gemHero} fallbackColor={HERO_COLORS[shop.name] || HERO_COLORS.default}>
                      <View style={{ position: 'absolute', top: 8, left: 8, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 }}>
                        <Text style={{ fontSize: 9, color: '#fff', fontWeight: '600' }}>💎 Hidden gem</Text>
                      </View>
                    </ShopPhoto>
                    <View style={{ padding: 10 }}>
                      <Text style={styles.nearName} numberOfLines={1}>{shop.name}</Text>
                      <Text style={styles.nearLoc} numberOfLines={1}>{shop.hood} · {shop.city}</Text>
                      <Text style={styles.nearRating}>{shop.rating.toFixed(1)} ★</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </>)}
          </>)}
 
          <View style={[styles.sectionHeader, { marginTop: 28 }]}>
            <Text style={styles.sectionTitle}>Browse by vibe</Text>
          </View>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity key={cat.label} style={styles.categoryCard} onPress={() => onCategoryPress(cat.label)} activeOpacity={0.7}>
                <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
                <Text style={styles.categoryLabel}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>)}
 
        <View style={[styles.sectionHeader, { marginTop: 8 }]}>
          <Text style={styles.sectionTitle}>{search.trim() ? 'Results' : 'Cities'}</Text>
          {search.trim() && <TouchableOpacity onPress={() => setSearch('')}><Text style={styles.sectionLink}>Clear</Text></TouchableOpacity>}
        </View>
        <View style={styles.cityGrid}>
          {filteredCities.map(city => (
            <TouchableOpacity key={city} style={styles.cityCard} onPress={() => onCityPress(city)} activeOpacity={0.7}>
              <Text style={styles.cityFlag}>{SHOPS[city].flag}</Text>
              <Text style={styles.cityName}>{city}</Text>
              <Text style={styles.cityCount}>{SHOPS[city].shops.length} curated shops</Text>
            </TouchableOpacity>
          ))}
          {noMatch && (
            <TouchableOpacity style={[styles.cityCard, styles.requestCard, { width: '100%' }]} onPress={() => setShowRequest(true)} activeOpacity={0.7}>
              <Text style={styles.cityFlag}>📍</Text>
              <Text style={[styles.cityName, { color: '#8B4A00' }]}>"{search}" isn't on Roam yet</Text>
              <Text style={[styles.cityCount, { color: '#C4B49A' }]}>Tap to request it →</Text>
            </TouchableOpacity>
          )}
          {!search.trim() && (
            <TouchableOpacity style={[styles.cityCard, styles.requestCard]} onPress={() => setShowRequest(true)} activeOpacity={0.7}>
              <Text style={styles.cityFlag}>📍</Text>
              <Text style={[styles.cityName, { color: '#8B4A00' }]}>Your city?</Text>
              <Text style={[styles.cityCount, { color: '#C4B49A' }]}>Request it →</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={{ height: 30 }} />
      </ScrollView>
      <RequestCityModal visible={showRequest} onClose={() => setShowRequest(false)} />
    </View>
  );
}
 
function CategoryResultsScreen({ category, onBack, onShopPress, stamps }) {
  const allShops = Object.entries(SHOPS).flatMap(([city, data]) => data.shops.filter(s => s.tags.includes(category)).map(s => ({ ...s, city })));
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.cityHeader}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}><Text style={styles.backBtnText}>← Back</Text></TouchableOpacity>
        <Text style={styles.cityHeaderTitle}>{category}</Text>
        <Text style={styles.cityResCnt}>{allShops.length} shops across all cities</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} {...require('react-native').PanResponder.create({ onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 20 && Math.abs(g.dx) > Math.abs(g.dy), onPanResponderRelease: (_, g) => { if (g.dx > 60) onBack(); } }).panHandlers}>
        <View style={{ paddingHorizontal: 22 }}>
          {allShops.map(shop => {
            const stamped = !!stamps[shop.city + '||' + shop.name];
            return (
              <TouchableOpacity key={shop.city + shop.name} style={styles.listItem} onPress={() => onShopPress(shop.city, shop.name)} activeOpacity={0.7}>
                <ShopPhoto uri={shop.photo} style={styles.listThumb} fallbackColor={HERO_COLORS[shop.name] || HERO_COLORS.default} />
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, flexWrap: 'wrap', marginBottom: 2 }}>
                    <Text style={styles.listName}>{shop.name}</Text>
                    {shop.isNew && <View style={styles.newBadge}><Text style={styles.newBadgeText}>New</Text></View>}
                    {shop.isCultural && <View style={styles.cultBadge}><Text style={styles.cultBadgeText}>Cultural anchor</Text></View>}
                    {shop.isHiddenGem && <View style={styles.gemBadge}><Text style={styles.gemBadgeText}>💎 Gem</Text></View>}
                  </View>
                  <Text style={styles.listSub}>{shop.hood} · {shop.city}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  {stamped && <Text>📬</Text>}
                  <Text style={styles.listBadge}>{shop.rating.toFixed(1)} ★</Text>
                </View>
              </TouchableOpacity>
            );
          })}
          <View style={{ height: 30 }} />
        </View>
      </ScrollView>
    </View>
  );
}
 
function CityScreen({ city, onBack, onShopPress, stamps }) {
  const [activeCat, setActiveCat] = useState('All');
  const [showFilter, setShowFilter] = useState(false);
  const [openNowOnly, setOpenNowOnly] = useState(false);
  const data = SHOPS[city];
  let shops = activeCat === 'All' ? data.shops : data.shops.filter(s => s.tags.includes(activeCat));
  if (openNowOnly) shops = shops.filter(s => s.openNow);
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.cityHeader}>
        <TouchableOpacity onPress={() => { if (showFilter) { setShowFilter(false); } else { onBack(); } }} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
          <Text style={styles.cityHeaderTitle}>{data.flag} {city}</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity onPress={() => setOpenNowOnly(!openNowOnly)} style={[styles.openNowBtn, openNowOnly && styles.openNowBtnActive]}>
              <Text style={[styles.openNowBtnText, openNowOnly && styles.openNowBtnTextActive]}>{openNowOnly ? '✓ Open' : 'Open now'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={(e) => { e.stopPropagation && e.stopPropagation(); setShowFilter(!showFilter); }} style={[styles.filterBtn, activeCat !== 'All' && styles.filterBtnActive]}>
              <Text style={[styles.filterBtnText, activeCat !== 'All' && styles.filterBtnTextActive]}>{activeCat === 'All' ? '⊞  Filter' : `✓  ${activeCat}`}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {showFilter && (
        <View style={styles.filterGrid}>
          {['All', ...CATEGORIES.map(c => c.label)].map(c => (
            <TouchableOpacity key={c} onPress={() => { setActiveCat(c); setShowFilter(false); }} style={[styles.filterChip, activeCat === c && styles.filterChipActive]}>
              <Text style={[styles.filterChipText, activeCat === c && styles.filterChipTextActive]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      <View style={styles.cityResHeader}>
        <Text style={styles.cityResName}>Coffee in {city}</Text>
        <Text style={styles.cityResCnt}>{shops.length} curated shops</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} {...require('react-native').PanResponder.create({ onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 20 && Math.abs(g.dx) > Math.abs(g.dy), onPanResponderRelease: (_, g) => { if (g.dx > 60) onBack(); } }).panHandlers}>
        <View style={{ paddingHorizontal: 22 }}>
          {shops.map(shop => {
            const stamped = !!stamps[city + '||' + shop.name];
            return (
              <TouchableOpacity key={shop.name} style={styles.listItem} onPress={() => onShopPress(city, shop.name)} activeOpacity={0.7}>
                <ShopPhoto uri={shop.photo} style={styles.listThumb} fallbackColor={HERO_COLORS[shop.name] || HERO_COLORS.default} />
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, flexWrap: 'wrap', marginBottom: 2 }}>
                    <Text style={styles.listName}>{shop.name}</Text>
                    {shop.isNew && <View style={styles.newBadge}><Text style={styles.newBadgeText}>New</Text></View>}
                    {shop.isCultural && <View style={styles.cultBadge}><Text style={styles.cultBadgeText}>Cultural anchor</Text></View>}
                    {shop.isHiddenGem && <View style={styles.gemBadge}><Text style={styles.gemBadgeText}>💎 Gem</Text></View>}
                    {shop.openNow && <View style={styles.openBadge}><Text style={styles.openBadgeText}>Open</Text></View>}
                  </View>
                  <Text style={styles.listSub}>{shop.hood} · {shop.tags.slice(0, 2).join(' · ')}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  {stamped && <Text>📬</Text>}
                  <Text style={styles.listBadge}>{shop.rating.toFixed(1)} ★</Text>
                </View>
              </TouchableOpacity>
            );
          })}
          <View style={{ height: 30 }} />
        </View>
      </ScrollView>
    </View>
  );
}
 
function UserReviews({ shopKey, scrollRef }) {
  const [reviews, setReviews] = useState([]);
  const [text, setText] = useState('');
  const [rating, setRating] = useState(5);
  const [showForm, setShowForm] = useState(false);
  const openForm = () => { setShowForm(true); setTimeout(() => scrollRef?.current?.scrollToEnd({ animated: true }), 150); };
  const submit = () => {
    if (!text.trim()) return;
    setReviews(prev => [{ text: text.trim(), rating, date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), author: 'You' }, ...prev]);
    setText(''); setRating(5); setShowForm(false);
  };
  return (
    <View>
      {reviews.length === 0 && !showForm && (
        <View style={{ paddingVertical: 16, alignItems: 'center' }}>
          <Text style={{ fontSize: 13, color: '#AAA', marginBottom: 12 }}>No community reviews yet. Be the first.</Text>
        </View>
      )}
      {reviews.map((r, i) => (
        <View key={i} style={styles.reviewCard}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
            <Text style={styles.reviewAuthor}>{r.author}</Text>
            <Text style={{ fontSize: 11, color: '#8B4A00' }}>{'★'.repeat(r.rating)}</Text>
          </View>
          <Text style={styles.reviewText}>{r.text}</Text>
          <Text style={{ fontSize: 10, color: '#CCC', marginTop: 6 }}>{r.date}</Text>
        </View>
      ))}
      {showForm ? (
        <View style={styles.reviewForm}>
          <View style={{ flexDirection: 'row', gap: 6, marginBottom: 12 }}>
            {[1,2,3,4,5].map(n => (
              <TouchableOpacity key={n} onPress={() => setRating(n)}>
                <Text style={{ fontSize: 24, color: n <= rating ? '#8B4A00' : '#E0E0E0' }}>★</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TextInput style={styles.reviewInput} placeholder="Share your experience..." placeholderTextColor="#BBB" value={text} onChangeText={setText} multiline numberOfLines={4} onFocus={() => { setTimeout(() => scrollRef?.current?.scrollToEnd({ animated: true }), 350); }} />
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
            <TouchableOpacity style={[styles.reviewSubmitBtn, !text.trim() && { opacity: 0.4 }]} onPress={submit} disabled={!text.trim()}>
              <Text style={styles.reviewSubmitText}>Post review</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.reviewCancelBtn} onPress={() => setShowForm(false)}>
              <Text style={styles.reviewCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity style={styles.writeReviewBtn} onPress={openForm}>
          <Text style={styles.writeReviewText}>✏️  Write a review</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
 
function DetailScreen({ city, shopName, onBack, stamps, onToggleStamp, saved, onToggleSave, visitedShops, onGotDirections }) {
  const shop = SHOPS[city]?.shops.find(s => s.name === shopName);
  if (!shop) return null;
  const stamped = !!stamps[city + '||' + shopName];
  const isSaved = !!saved[city + '||' + shopName];
  const scrollRef = useRef(null);
  const gotDirectionsHere = !!visitedShops[city + '||' + shopName];
  const showReturnBanner = gotDirectionsHere && !stamped;
  const [showDirectionsModal, setShowDirectionsModal] = useState(false);
 
  const handleDirectionsConfirm = () => {
    setShowDirectionsModal(false);
    onGotDirections(city, shopName);
    Linking.openURL(`maps://maps.apple.com/?q=${encodeURIComponent(shop.name + ' ' + shop.hood)}`);
  };
 
  const handleShare = async () => {
    const shortDesc = shop.desc.length > 80 ? shop.desc.substring(0, 80).trim() + '...' : shop.desc;
    const message = `☕ ${shop.name}\n${shop.hood}, ${city}\n${shop.tags.slice(0, 2).join(' · ')} · ${shop.rating.toFixed(1)}★\n\n${shortDesc}\n\nFound on Roam — specialty coffee, curated.\nroamcoffee.app`;
    try { await Share.share({ message }); } catch (e) {}
  };
 
  const panResponder = require('react-native').PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 20 && Math.abs(g.dx) > Math.abs(g.dy),
    onPanResponderRelease: (_, g) => { if (g.dx > 60) onBack(); },
  });
 
  return (
    <>
      <ScrollView ref={scrollRef} style={{ flex: 1, backgroundColor: '#fff' }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" {...panResponder.panHandlers}>
        <ShopPhoto uri={shop.photo} style={styles.detailHero} fallbackColor={HERO_COLORS[shopName] || HERO_COLORS.default}>
          <TouchableOpacity onPress={onBack} style={styles.detailBack}><Text style={styles.detailBackText}>← Back</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => onToggleStamp(city, shopName)} style={[styles.stampFab, stamped && styles.stampFabOn]}>
            <Text style={[styles.stampFabText, stamped && { color: '#fff' }]}>{stamped ? '📬 Stamped!' : "✓ I've been here"}</Text>
          </TouchableOpacity>
          <View style={styles.detailHeroText}>
            <Text style={styles.detailHeroName}>{shop.name}</Text>
            <Text style={styles.detailHeroLoc}>{shop.hood} · {city}</Text>
            <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: 1, marginTop: 10 }}>← SWIPE TO GO BACK</Text>
          </View>
        </ShopPhoto>
 
        {showReturnBanner && (
          <View style={styles.returnBanner}>
            <View style={{ flex: 1 }}>
              <Text style={styles.returnBannerTitle}>How was {shop.name}?</Text>
              <Text style={styles.returnBannerSub}>Stamp it or leave a quick review.</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity style={styles.returnBannerBtnPrimary} onPress={() => onToggleStamp(city, shopName)}>
                <Text style={styles.returnBannerBtnPrimaryText}>Stamp it</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.returnBannerBtnSecondary} onPress={() => scrollRef.current?.scrollToEnd({ animated: true })}>
                <Text style={styles.returnBannerBtnSecondaryText}>Review</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
 
        <View style={{ padding: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap', flex: 1 }}>
              <View style={styles.roamCert}><Text style={styles.roamCertText}>✓ Roam certified</Text></View>
              {shop.isCultural && <View style={styles.cultBadge}><Text style={styles.cultBadgeText}>Cultural anchor</Text></View>}
              {shop.isNew && <View style={styles.newBadge}><Text style={styles.newBadgeText}>New</Text></View>}
              {shop.isHiddenGem && <View style={styles.gemBadge}><Text style={styles.gemBadgeText}>💎 Hidden gem</Text></View>}
              {shop.openNow && <View style={styles.openBadge}><Text style={styles.openBadgeText}>Open now</Text></View>}
            </View>
            <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
              <TouchableOpacity onPress={handleShare} style={styles.shareBtn}>
                <Text style={{ fontSize: 14 }}>↗</Text>
                <Text style={styles.shareBtnText}>Share</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onToggleSave(city, shopName)} style={[styles.saveBtn, isSaved && styles.saveBtnActive]}>
                <Text style={{ fontSize: 14 }}>🔖</Text>
                <Text style={[styles.saveBtnText, isSaved && styles.saveBtnTextActive]}>{isSaved ? 'Saved' : 'Save'}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.tagRow}>{shop.tags.map(t => <Tag key={t} label={t} />)}</View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <Text style={styles.detailRating}>{'★'.repeat(Math.floor(shop.rating))}  {shop.rating.toFixed(1)} · Roam certified</Text>
            <Text style={{ fontSize: 11, color: '#AAA' }}>{shop.stamps?.toLocaleString()} stamps</Text>
          </View>
          <View style={styles.divider} />
          <Text style={styles.detailSecTitle}>About</Text>
          <Text style={styles.detailDesc}>{shop.desc}</Text>
          <View style={styles.divider} />
          <Text style={styles.detailSecTitle}>Details</Text>
          {[['Hours', shop.hours], ['Price', shop.price], ['WiFi', shop.wifi], ['Seating', shop.seats]].map(([k, v]) => (
            <View key={k} style={styles.detailRow}>
              <Text style={styles.detailKey}>{k}</Text>
              <Text style={styles.detailVal}>{v}</Text>
            </View>
          ))}
          <TouchableOpacity style={styles.directionsBtn} onPress={() => setShowDirectionsModal(true)}>
            <Text style={styles.directionsBtnText}>📍  Get directions</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <Text style={styles.detailSecTitle}>From the press</Text>
          {shop.reviews.map((r, i) => (
            <View key={i} style={styles.reviewCard}>
              <Text style={styles.reviewAuthor}>{r.a}</Text>
              <Text style={styles.reviewText}>{r.t}</Text>
            </View>
          ))}
          <View style={styles.divider} />
          <Text style={styles.detailSecTitle}>From the community</Text>
          <UserReviews shopKey={city + '||' + shopName} scrollRef={scrollRef} />
          <View style={{ height: 300 }} />
        </View>
      </ScrollView>
      <DirectionsModal visible={showDirectionsModal} shopName={shop.name} onConfirm={handleDirectionsConfirm} onClose={() => setShowDirectionsModal(false)} />
    </>
  );
}
 
function SavedScreen({ saved, onShopPress }) {
  const savedShops = Object.values(saved).filter(Boolean);
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.passHeader}>
        <Text style={styles.passLogo}>Saved</Text>
        <Text style={styles.passSub}>SHOPS YOU WANT TO VISIT</Text>
      </View>
      {savedShops.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyEmoji}>🔖</Text>
          <Text style={styles.emptyTitle}>Nothing saved yet</Text>
          <Text style={styles.emptySub}>Tap the Save button on any shop to add it here for later.</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ paddingHorizontal: 22, paddingTop: 8 }}>
            {savedShops.map((item, i) => (
              <TouchableOpacity key={i} style={styles.listItem} onPress={() => onShopPress(item.city, item.shop.name)} activeOpacity={0.7}>
                <ShopPhoto uri={item.shop.photo} style={styles.listThumb} fallbackColor={HERO_COLORS[item.shop.name] || HERO_COLORS.default} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.listName}>{item.shop.name}</Text>
                  <Text style={styles.listSub}>{item.shop.hood} · {item.city}</Text>
                </View>
                <Text style={styles.listBadge}>{item.shop.rating.toFixed(1)} ★</Text>
              </TouchableOpacity>
            ))}
            <View style={{ height: 30 }} />
          </View>
        </ScrollView>
      )}
    </View>
  );
}
 
function ProfileScreen({ user, stamps, onSignOut }) {
  const all = Object.values(stamps);
  const cities = new Set(all.map(s => s.city));
  let rank = RANKS[0];
  for (const r of RANKS) if (all.length >= r.min) rank = r;
  const next = RANKS[RANKS.indexOf(rank) + 1];
  const pct = next ? Math.min(100, Math.round((all.length - rank.min) / (next.min - rank.min) * 100)) : 100;
  const earnedBadges = BADGES.filter(b => b.condition(stamps));
  const unearnedBadges = BADGES.filter(b => !b.condition(stamps));
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }} showsVerticalScrollIndicator={false}>
      <View style={styles.passHeader}>
        <View style={styles.profileAvatar}>
          <Text style={{ fontSize: 28, fontWeight: '700', color: '#1A0F07' }}>{user?.name?.charAt(0).toUpperCase() || '?'}</Text>
        </View>
        <Text style={styles.profileName}>{user?.name || 'Coffee Explorer'}</Text>
        <Text style={styles.profileEmail}>{user?.email || ''}</Text>
      </View>
      <View style={styles.statGrid}>
        {[['Stamps', all.length], ['Cities', cities.size], ['Badges', earnedBadges.length]].map(([l, n]) => (
          <View key={l} style={styles.statCard}>
            <Text style={styles.statNum}>{n}</Text>
            <Text style={styles.statLabel}>{l}</Text>
          </View>
        ))}
      </View>
      <View style={[styles.sectionHeader, { paddingHorizontal: 22 }]}><Text style={styles.sectionTitle}>Explorer rank</Text></View>
      <View style={styles.rankCard}>
        <Text style={styles.rankTitle}>{rank.title}</Text>
        <Text style={styles.rankSub}>{rank.sub}</Text>
        <View style={styles.rankBarWrap}><View style={[styles.rankBar, { width: pct + '%' }]} /></View>
        <Text style={styles.rankNext}>{rank.next}</Text>
      </View>
      <View style={[styles.sectionHeader, { paddingHorizontal: 22 }]}>
        <Text style={styles.sectionTitle}>Badges</Text>
        <Text style={{ fontSize: 11, color: '#AAA' }}>{earnedBadges.length}/{BADGES.length} earned</Text>
      </View>
      <View style={styles.badgeGrid}>
        {earnedBadges.map(b => (
          <View key={b.id} style={styles.badgeItem}>
            <View style={styles.badgeEmojiWrap}><Text style={styles.badgeEmoji}>{b.emoji}</Text></View>
            <Text style={styles.badgeTitle}>{b.title}</Text>
            <Text style={styles.badgeDesc}>{b.desc}</Text>
          </View>
        ))}
        {unearnedBadges.map(b => (
          <View key={b.id} style={[styles.badgeItem, styles.badgeItemLocked]}>
            <View style={[styles.badgeEmojiWrap, styles.badgeEmojiLocked]}><Text style={[styles.badgeEmoji, { opacity: 0.3 }]}>{b.emoji}</Text></View>
            <Text style={[styles.badgeTitle, { color: '#CCC' }]}>{b.title}</Text>
            <Text style={[styles.badgeDesc, { color: '#DDD' }]}>{b.desc}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.signOutBtn} onPress={onSignOut}><Text style={styles.signOutText}>Sign out</Text></TouchableOpacity>
      <View style={{ height: 30 }} />
    </ScrollView>
  );
}
 
function PassportScreen({ stamps }) {
  const all = Object.values(stamps);
  const cities = new Set(all.map(s => s.city));
  const countries = new Set(all.map(s => s.country));
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }} showsVerticalScrollIndicator={false}>
      <View style={styles.passHeader}>
        <Text style={styles.passLogo}>Roam</Text>
        <Text style={styles.passSub}>MY PASSPORT</Text>
      </View>
      <View style={styles.statGrid}>
        {[['Stamps', all.length], ['Cities', cities.size], ['Countries', countries.size]].map(([l, n]) => (
          <View key={l} style={styles.statCard}>
            <Text style={styles.statNum}>{n}</Text>
            <Text style={styles.statLabel}>{l}</Text>
          </View>
        ))}
      </View>
      <View style={[styles.sectionHeader, { paddingHorizontal: 22 }]}><Text style={styles.sectionTitle}>Your stamps</Text></View>
      {all.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyEmoji}>✈</Text>
          <Text style={styles.emptyTitle}>No stamps yet</Text>
          <Text style={styles.emptySub}>Visit a shop, get directions, come back and stamp it to build your passport.</Text>
        </View>
      ) : (
        <View style={styles.stampGrid}>
          {all.map((s, i) => (
            <View key={i} style={styles.stampItem}>
              <ShopPhoto uri={s.shop.photo} style={styles.stampThumb} fallbackColor={HERO_COLORS[s.shop.name] || HERO_COLORS.default} />
              <Text style={styles.stampName}>{s.shop.name}</Text>
              <Text style={styles.stampCity}>{s.city}</Text>
              <Text style={styles.stampDate}>{s.date}</Text>
            </View>
          ))}
        </View>
      )}
      <View style={{ height: 30 }} />
    </ScrollView>
  );
}
 
function NavBar({ active, onPress }) {
  const tabs = [
    { id: 'home', label: 'Discover', icon: '⌂' },
    { id: 'saved', label: 'Saved', icon: '🔖' },
    { id: 'passport', label: 'Passport', icon: '📖' },
    { id: 'profile', label: 'Profile', icon: '◯' },
  ];
  return (
    <View style={styles.navBar}>
      {tabs.map(t => (
        <TouchableOpacity key={t.id} style={styles.navItem} onPress={() => onPress(t.id)} activeOpacity={0.7}>
          <View style={[styles.navIco, active === t.id && styles.navIcoActive]}>
            <Text style={[styles.navIcon, active === t.id && { color: '#F5E6C8' }]}>{t.icon}</Text>
          </View>
          <Text style={[styles.navLabel, active === t.id && styles.navLabelActive]}>{t.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
 
export default function App() {
  const [screen, setScreen] = useState('splash');
  const [authMode, setAuthMode] = useState('signup');
  const [tab, setTab] = useState('home');
  const [city, setCity] = useState(null);
  const [shopKey, setShopKey] = useState(null);
  const [category, setCategory] = useState(null);
  const [stamps, setStamps] = useState({});
  const [saved, setSaved] = useState({});
  const [user, setUser] = useState(null);
  const [visitedShops, setVisitedShops] = useState({});
 
  // ── Check for existing Supabase session on launch ──
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const u = session.user;
        setUser({ name: u.user_metadata?.name || u.email.split('@')[0], email: u.email, id: u.id });
        loadUserData(u.id);
        setScreen('main');
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) { setUser(null); setStamps({}); setSaved({}); setScreen('onboarding'); }
    });
    return () => subscription.unsubscribe();
  }, []);
 
  const loadUserData = async (userId) => {
    // Load stamps
    const { data: stampsData } = await supabase.from('stamps').select('*').eq('user_id', userId);
    if (stampsData) {
      const stampsMap = {};
      stampsData.forEach(s => {
        const shop = SHOPS[s.city]?.shops.find(sh => sh.name === s.shop_name);
        if (shop) {
          stampsMap[s.city + '||' + s.shop_name] = {
            shop, city: s.city, country: s.country, flag: s.flag,
            date: new Date(s.stamped_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          };
        }
      });
      setStamps(stampsMap);
    }
    // Load saved shops
    const { data: savedData } = await supabase.from('saved_shops').select('*').eq('user_id', userId);
    if (savedData) {
      const savedMap = {};
      savedData.forEach(s => {
        const shop = SHOPS[s.city]?.shops.find(sh => sh.name === s.shop_name);
        if (shop) savedMap[s.city + '||' + s.shop_name] = { shop, city: s.city };
      });
      setSaved(savedMap);
    }
  };
 
  if (screen === 'splash') return <SplashScreen onDone={() => setScreen('onboarding')} />;
  if (screen === 'onboarding') return <OnboardingScreen onLogin={() => { setAuthMode('login'); setScreen('auth'); }} onSignup={() => { setAuthMode('signup'); setScreen('auth'); }} />;
  if (screen === 'auth') return <AuthScreen mode={authMode} onSuccess={(u) => { setUser(u); loadUserData(u.id); setScreen('main'); }} onBack={() => setScreen('onboarding')} />;
 
  const handleShopPress = (c, name) => { setCity(c); setShopKey(name); setScreen('detail'); };
  const handleCategoryPress = (cat) => { setCategory(cat); setScreen('category'); };
 
  const handleToggleStamp = async (c, name) => {
    const key = c + '||' + name;
    const shop = SHOPS[c]?.shops.find(s => s.name === name);
    if (!shop || !user?.id) return;
    if (stamps[key]) {
      // Remove stamp
      await supabase.from('stamps').delete().eq('user_id', user.id).eq('shop_name', name).eq('city', c);
      setStamps(prev => { const next = { ...prev }; delete next[key]; return next; });
    } else {
      // Add stamp
      await supabase.from('stamps').insert({ user_id: user.id, shop_name: name, city: c, country: SHOPS[c].country, flag: SHOPS[c].flag });
      setStamps(prev => ({ ...prev, [key]: { shop, city: c, country: SHOPS[c].country, flag: SHOPS[c].flag, date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) } }));
    }
  };
 
  const handleToggleSave = async (c, name) => {
    const key = c + '||' + name;
    const shop = SHOPS[c]?.shops.find(s => s.name === name);
    if (!shop || !user?.id) return;
    if (saved[key]) {
      await supabase.from('saved_shops').delete().eq('user_id', user.id).eq('shop_name', name).eq('city', c);
      setSaved(prev => { const next = { ...prev }; delete next[key]; return next; });
    } else {
      await supabase.from('saved_shops').insert({ user_id: user.id, shop_name: name, city: c });
      setSaved(prev => ({ ...prev, [key]: { shop, city: c } }));
    }
  };
 
  const handleGotDirections = (c, name) => { setVisitedShops(prev => ({ ...prev, [c + '||' + name]: true })); };
 
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null); setStamps({}); setSaved({}); setVisitedShops({});
    setScreen('onboarding');
  };
 
  const handleBack = () => {
    if (screen === 'detail') { setScreen(category ? 'category' : city ? 'city' : 'main'); }
    else if (screen === 'city') { setCity(null); setScreen('main'); }
    else if (screen === 'category') { setCategory(null); setScreen('main'); }
  };
 
  const renderContent = () => {
    if (screen === 'city') return <CityScreen city={city} onBack={handleBack} onShopPress={handleShopPress} stamps={stamps} />;
    if (screen === 'category') return <CategoryResultsScreen category={category} onBack={handleBack} onShopPress={handleShopPress} stamps={stamps} />;
    if (screen === 'detail') return <DetailScreen city={city} shopName={shopKey} onBack={handleBack} stamps={stamps} onToggleStamp={handleToggleStamp} saved={saved} onToggleSave={handleToggleSave} visitedShops={visitedShops} onGotDirections={handleGotDirections} />;
    if (tab === 'passport') return <PassportScreen stamps={stamps} />;
    if (tab === 'saved') return <SavedScreen saved={saved} onShopPress={handleShopPress} />;
    if (tab === 'profile') return <ProfileScreen user={user} stamps={stamps} onSignOut={handleSignOut} />;
    return <HomeScreen onCityPress={(c) => { setCity(c); setScreen('city'); }} onShopPress={handleShopPress} onCategoryPress={handleCategoryPress} stamps={stamps} user={user} saved={saved} onToggleSave={handleToggleSave} />;
  };
 
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {renderContent()}
      {screen === 'main' && <NavBar active={tab} onPress={setTab} />}
    </View>
  );
}
 
const styles = StyleSheet.create({
  splash: { flex: 1, backgroundColor: '#E8D9C0', justifyContent: 'center', alignItems: 'center', gap: 10 },
  splashLogo: { fontSize: 72, fontWeight: '700', color: '#1A0F07', letterSpacing: -2 },
  splashTag: { fontSize: 11, color: '#6A5040', letterSpacing: 2 },
  splashDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#8B4A00', marginTop: 10 },
  onboarding: { flex: 1, backgroundColor: '#fff' },
  onboardingHero: { height: 320, backgroundColor: '#E8D9C0', justifyContent: 'center', alignItems: 'center' },
  onboardingBody: { padding: 28, flex: 1 },
  onboardingTitle: { fontSize: 32, fontWeight: '700', color: '#111', fontStyle: 'italic', letterSpacing: -1, lineHeight: 38, marginBottom: 12 },
  onboardingSub: { fontSize: 15, color: '#888', lineHeight: 22, marginBottom: 32 },
  onboardingBtnPrimary: { backgroundColor: '#1A0F07', borderRadius: 16, height: 54, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  onboardingBtnPrimaryText: { color: '#F5E6C8', fontSize: 16, fontWeight: '600' },
  onboardingBtnSecondary: { backgroundColor: '#F8F8F8', borderRadius: 16, height: 54, justifyContent: 'center', alignItems: 'center' },
  onboardingBtnSecondaryText: { color: '#333', fontSize: 16, fontWeight: '500' },
  authHeader: { paddingHorizontal: 22, paddingTop: 56, paddingBottom: 24, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  authTitle: { fontSize: 28, fontWeight: '700', color: '#111', fontStyle: 'italic', letterSpacing: -1, marginBottom: 6, marginTop: 12 },
  authSub: { fontSize: 14, color: '#AAA' },
  authInput: { backgroundColor: '#F8F8F8', borderRadius: 14, paddingHorizontal: 18, height: 52, fontSize: 15, color: '#111', marginBottom: 12, borderWidth: 1, borderColor: '#F0F0F0' },
  authBtn: { backgroundColor: '#1A0F07', borderRadius: 14, height: 52, justifyContent: 'center', alignItems: 'center', marginTop: 4 },
  authBtnText: { color: '#F5E6C8', fontSize: 15, fontWeight: '600' },
  authTerms: { fontSize: 11, color: '#CCC', textAlign: 'center', lineHeight: 16, marginTop: 24 },
  errorBox: { backgroundColor: '#FEF2F2', borderRadius: 12, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: '#FECACA' },
  errorText: { fontSize: 13, color: '#DC2626', lineHeight: 18 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 16 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#F0F0F0' },
  dividerText: { fontSize: 13, color: '#CCC' },
  header: { backgroundColor: '#fff', paddingHorizontal: 22, paddingTop: 56, paddingBottom: 18, borderBottomWidth: 1, borderBottomColor: '#F5F0EC' },
  logo: { fontSize: 42, fontWeight: '700', color: '#1A0F07', fontStyle: 'italic', letterSpacing: -2, lineHeight: 48 },
  logoTag: { fontSize: 10, color: '#BBB', letterSpacing: 2, marginTop: 2, textTransform: 'uppercase' },
  profileDot: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F5EFE6', borderWidth: 1.5, borderColor: '#C4B49A', justifyContent: 'center', alignItems: 'center' },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F8F8', borderRadius: 100, paddingHorizontal: 18, height: 46, gap: 10, marginTop: 18 },
  searchInput: { flex: 1, fontSize: 14, color: '#111', height: '100%' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 22, paddingTop: 24, paddingBottom: 14 },
  sectionTitle: { fontSize: 22, fontWeight: '600', color: '#111', fontStyle: 'italic', letterSpacing: -0.5 },
  sectionLink: { fontSize: 12, color: '#C4B49A' },
  sotwCard: { marginHorizontal: 22, borderRadius: 20, overflow: 'hidden', marginBottom: 8 },
  sotwHero: { height: 200 },
  sotwName: { fontSize: 20, fontWeight: '700', color: '#fff', fontStyle: 'italic', letterSpacing: -0.5 },
  sotwLoc: { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 3 },
  sotwBody: { backgroundColor: '#F8F8F8', padding: 14 },
  sotwReason: { fontSize: 13, color: '#555', lineHeight: 20 },
  nearCard: { width: 140, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#F0F0F0' },
  nearHero: { height: 96 },
  nearName: { fontSize: 11, fontWeight: '700', color: '#111', fontStyle: 'italic', paddingHorizontal: 8, paddingTop: 6 },
  nearLoc: { fontSize: 10, color: '#AAA', paddingHorizontal: 8, marginTop: 2 },
  nearRating: { fontSize: 10, fontWeight: '600', color: '#8B4A00', paddingHorizontal: 8, paddingBottom: 8, marginTop: 2 },
  gemCard: { width: 160, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#F0F0F0' },
  gemHero: { height: 110 },
  openNowBtn: { backgroundColor: '#F8F8F8', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: '#E8E8E8' },
  openNowBtnActive: { backgroundColor: '#0A8A0A', borderColor: '#0A8A0A' },
  openNowBtnText: { fontSize: 11, fontWeight: '600', color: '#666' },
  openNowBtnTextActive: { color: '#fff' },
  openBadge: { backgroundColor: '#E8F5E8', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 1 },
  openBadgeText: { fontSize: 9, color: '#0A6A0A', fontWeight: '600' },
  gemBadge: { backgroundColor: '#F0EEFF', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 1 },
  gemBadgeText: { fontSize: 9, color: '#534AB7', fontWeight: '500' },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 22, gap: 10 },
  categoryCard: { width: '30%', backgroundColor: '#F8F8F8', borderRadius: 16, padding: 14, alignItems: 'center' },
  categoryEmoji: { fontSize: 24, marginBottom: 6 },
  categoryLabel: { fontSize: 10, fontWeight: '500', color: '#333', textAlign: 'center', lineHeight: 14 },
  cityGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 22, gap: 10 },
  cityCard: { width: '47%', backgroundColor: '#F8F8F8', borderRadius: 20, padding: 16 },
  requestCard: { backgroundColor: '#F5EFE6', borderStyle: 'dashed', borderWidth: 1, borderColor: '#C4B49A' },
  cityFlag: { fontSize: 24, marginBottom: 8 },
  cityName: { fontSize: 15, fontWeight: '700', color: '#111', fontStyle: 'italic' },
  cityCount: { fontSize: 11, color: '#999', marginTop: 3 },
  cityHeader: { backgroundColor: '#fff', paddingHorizontal: 22, paddingTop: 56, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F5F0EC' },
  backBtn: { backgroundColor: '#F5F5F5', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, alignSelf: 'flex-start', marginBottom: 10 },
  backBtnText: { fontSize: 12, fontWeight: '500', color: '#333' },
  cityHeaderTitle: { fontSize: 26, fontWeight: '700', color: '#111', fontStyle: 'italic', letterSpacing: -1 },
  cityResHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', paddingHorizontal: 22, paddingTop: 12, paddingBottom: 4 },
  cityResName: { fontSize: 16, fontWeight: '700', color: '#111' },
  cityResCnt: { fontSize: 11, color: '#BBB' },
  filterBtn: { backgroundColor: '#F8F8F8', borderRadius: 20, paddingHorizontal: 18, paddingVertical: 10, borderWidth: 1, borderColor: '#E8E8E8' },
  filterBtnActive: { backgroundColor: '#1A0F07', borderColor: '#1A0F07' },
  filterBtnText: { fontSize: 13, fontWeight: '600', color: '#666' },
  filterBtnTextActive: { color: '#F5E6C8' },
  filterGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, padding: 16, paddingHorizontal: 22, borderBottomWidth: 1, borderBottomColor: '#F5F5F5', backgroundColor: '#fff' },
  filterChip: { backgroundColor: '#F8F8F8', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: '#E8E8E8' },
  filterChipActive: { backgroundColor: '#1A0F07', borderColor: '#1A0F07' },
  filterChipText: { fontSize: 12, fontWeight: '500', color: '#666' },
  filterChipTextActive: { color: '#F5E6C8' },
  listItem: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  listThumb: { width: 56, height: 56, borderRadius: 14, flexShrink: 0 },
  listName: { fontSize: 14, fontWeight: '700', color: '#111', fontStyle: 'italic' },
  listSub: { fontSize: 11, color: '#AAA', marginTop: 2 },
  listBadge: { fontSize: 12, fontWeight: '600', color: '#8B4A00' },
  newBadge: { backgroundColor: '#F5EFE6', borderWidth: 1, borderColor: '#C4B49A', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 1 },
  newBadgeText: { fontSize: 9, color: '#5A3A1A', fontWeight: '500' },
  cultBadge: { backgroundColor: '#1A0A00', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 1 },
  cultBadgeText: { fontSize: 9, color: '#F5C88A', fontWeight: '500' },
  detailHero: { height: 320 },
  detailHeroText: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20 },
  detailHeroName: { fontSize: 26, fontWeight: '700', color: '#fff', fontStyle: 'italic', letterSpacing: -1, lineHeight: 30 },
  detailHeroLoc: { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 4 },
  detailBack: { position: 'absolute', top: 54, left: 16, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7 },
  detailBackText: { fontSize: 12, fontWeight: '500', color: '#111' },
  stampFab: { position: 'absolute', top: 54, right: 16, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7 },
  stampFabOn: { backgroundColor: '#8B4A00' },
  stampFabText: { fontSize: 12, fontWeight: '500', color: '#111' },
  returnBanner: { backgroundColor: '#FDF6EC', borderBottomWidth: 1, borderBottomColor: '#E8D9C0', paddingHorizontal: 18, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  returnBannerTitle: { fontSize: 14, fontWeight: '700', color: '#1A0F07' },
  returnBannerSub: { fontSize: 12, color: '#8A7060', marginTop: 2 },
  returnBannerBtnPrimary: { backgroundColor: '#1A0F07', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  returnBannerBtnPrimaryText: { fontSize: 12, fontWeight: '600', color: '#F5E6C8' },
  returnBannerBtnSecondary: { backgroundColor: '#F0EBE3', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  returnBannerBtnSecondaryText: { fontSize: 12, fontWeight: '600', color: '#8B4A00' },
  shareBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#F8F8F8', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7, borderWidth: 1, borderColor: '#E8E8E8' },
  shareBtnText: { fontSize: 12, fontWeight: '500', color: '#333' },
  saveBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#F8F8F8', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7, borderWidth: 1, borderColor: '#E8E8E8' },
  saveBtnActive: { backgroundColor: '#F5EFE6', borderColor: '#C4B49A' },
  saveBtnText: { fontSize: 12, fontWeight: '500', color: '#666' },
  saveBtnTextActive: { color: '#8B4A00' },
  roamCert: { backgroundColor: '#1A0F07', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  roamCertText: { fontSize: 10, color: '#F5E6C8', fontWeight: '500' },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  tag: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  tagText: { fontSize: 10, fontWeight: '500' },
  detailRating: { fontSize: 13, color: '#8A7060' },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginBottom: 16 },
  detailSecTitle: { fontSize: 10, fontWeight: '600', letterSpacing: 2, textTransform: 'uppercase', color: '#BBB', marginBottom: 10 },
  detailDesc: { fontSize: 14, color: '#333', lineHeight: 22, marginBottom: 16 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  detailKey: { fontSize: 13, color: '#AAA' },
  detailVal: { fontSize: 13, color: '#111', fontWeight: '500' },
  reviewCard: { backgroundColor: '#F8F8F8', borderRadius: 16, padding: 14, marginBottom: 10 },
  reviewAuthor: { fontSize: 11, fontWeight: '600', color: '#333', marginBottom: 5 },
  reviewText: { fontSize: 13, color: '#666', lineHeight: 20 },
  reviewForm: { backgroundColor: '#F8F8F8', borderRadius: 16, padding: 16, marginBottom: 10 },
  reviewInput: { backgroundColor: '#fff', borderRadius: 12, padding: 14, fontSize: 14, color: '#111', borderWidth: 1, borderColor: '#F0F0F0', minHeight: 100, textAlignVertical: 'top' },
  reviewSubmitBtn: { flex: 1, backgroundColor: '#1A0F07', borderRadius: 12, height: 44, justifyContent: 'center', alignItems: 'center' },
  reviewSubmitText: { color: '#F5E6C8', fontSize: 14, fontWeight: '600' },
  reviewCancelBtn: { backgroundColor: '#F0F0F0', borderRadius: 12, height: 44, paddingHorizontal: 18, justifyContent: 'center', alignItems: 'center' },
  reviewCancelText: { color: '#888', fontSize: 14, fontWeight: '500' },
  writeReviewBtn: { backgroundColor: '#F8F8F8', borderRadius: 14, height: 48, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E8E8E8', marginBottom: 8 },
  writeReviewText: { fontSize: 14, fontWeight: '600', color: '#1A0F07' },
  passHeader: { backgroundColor: '#E8D9C0', paddingHorizontal: 22, paddingTop: 56, paddingBottom: 28, borderBottomWidth: 1, borderBottomColor: '#C4B49A', alignItems: 'flex-start' },
  passLogo: { fontSize: 32, fontWeight: '700', color: '#1A0F07', fontStyle: 'italic', letterSpacing: -1 },
  passSub: { fontSize: 10, color: '#6A5040', letterSpacing: 2, marginTop: 4, textTransform: 'uppercase' },
  profileAvatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#F5EFE6', borderWidth: 2, borderColor: '#C4B49A', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  profileName: { fontSize: 24, fontWeight: '700', color: '#1A0F07', fontStyle: 'italic', letterSpacing: -0.5 },
  profileEmail: { fontSize: 13, color: '#8A7060', marginTop: 3 },
  statGrid: { flexDirection: 'row', gap: 10, padding: 20 },
  statCard: { flex: 1, backgroundColor: '#F8F8F8', borderRadius: 16, padding: 16, alignItems: 'center' },
  statNum: { fontSize: 28, fontWeight: '700', color: '#111', fontStyle: 'italic' },
  statLabel: { fontSize: 10, color: '#AAA', marginTop: 3, textTransform: 'uppercase', letterSpacing: 1 },
  rankCard: { backgroundColor: '#F8F8F8', borderRadius: 20, padding: 20, marginHorizontal: 22, marginBottom: 20 },
  rankTitle: { fontSize: 22, fontWeight: '700', color: '#111', fontStyle: 'italic', marginBottom: 6 },
  rankSub: { fontSize: 13, color: '#666', lineHeight: 20, marginBottom: 16 },
  rankBarWrap: { height: 5, backgroundColor: '#E8E8E8', borderRadius: 3, overflow: 'hidden', marginBottom: 8 },
  rankBar: { height: '100%', backgroundColor: '#8B4A00', borderRadius: 3 },
  rankNext: { fontSize: 12, color: '#AAA' },
  badgeGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 22, gap: 10, marginBottom: 20 },
  badgeItem: { width: '30%', backgroundColor: '#F8F8F8', borderRadius: 16, padding: 12, alignItems: 'center', gap: 4 },
  badgeItemLocked: { backgroundColor: '#FAFAFA', opacity: 0.6 },
  badgeEmojiWrap: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F5EFE6', borderWidth: 1.5, borderColor: '#C4B49A', justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  badgeEmojiLocked: { backgroundColor: '#F0F0F0', borderColor: '#E0E0E0' },
  badgeEmoji: { fontSize: 22 },
  badgeTitle: { fontSize: 10, fontWeight: '700', color: '#111', textAlign: 'center', lineHeight: 13 },
  badgeDesc: { fontSize: 9, color: '#AAA', textAlign: 'center', lineHeight: 12 },
  signOutBtn: { marginHorizontal: 22, marginTop: 8, backgroundColor: '#F8F8F8', borderRadius: 14, height: 50, justifyContent: 'center', alignItems: 'center' },
  signOutText: { fontSize: 14, color: '#888', fontWeight: '500' },
  emptyWrap: { padding: 48, alignItems: 'center' },
  emptyEmoji: { fontSize: 44, marginBottom: 14 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#111', fontStyle: 'italic', marginBottom: 8 },
  emptySub: { fontSize: 13, color: '#AAA', lineHeight: 20, textAlign: 'center' },
  stampGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingHorizontal: 22 },
  stampItem: { width: '30%', backgroundColor: '#FDF6EC', borderWidth: 1.5, borderColor: '#8B4A00', borderRadius: 16, overflow: 'hidden', alignItems: 'center' },
  stampThumb: { width: '100%', height: 70 },
  stampName: { fontSize: 10, fontWeight: '600', color: '#111', textAlign: 'center', lineHeight: 14, fontStyle: 'italic', paddingHorizontal: 6, marginTop: 8 },
  stampCity: { fontSize: 10, color: '#AAA', textAlign: 'center' },
  stampDate: { fontSize: 9, color: '#8B4A00', marginTop: 2, marginBottom: 8 },
  navBar: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 12, paddingHorizontal: 16, borderTopWidth: 1, borderTopColor: '#F0F0F0', backgroundColor: '#fff' },
  navItem: { alignItems: 'center', gap: 4 },
  navIco: { width: 32, height: 32, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  navIcoActive: { backgroundColor: '#1A0F07' },
  navIcon: { fontSize: 15, color: '#CCC' },
  navLabel: { fontSize: 9, color: '#CCC', textTransform: 'uppercase', letterSpacing: 0.5 },
  navLabelActive: { color: '#1A0F07', fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 28, paddingBottom: 40 },
  modalTitle: { fontSize: 24, fontWeight: '700', color: '#111', fontStyle: 'italic', marginBottom: 8, letterSpacing: -0.5 },
  modalSub: { fontSize: 14, color: '#888', lineHeight: 20, marginBottom: 24 },
  modalInput: { backgroundColor: '#F8F8F8', borderRadius: 14, paddingHorizontal: 18, height: 52, fontSize: 16, color: '#111', marginBottom: 16, borderWidth: 1, borderColor: '#F0F0F0' },
  modalBtn: { backgroundColor: '#1A0F07', borderRadius: 14, height: 52, justifyContent: 'center', alignItems: 'center' },
  modalBtnText: { color: '#F5E6C8', fontSize: 15, fontWeight: '600' },
  directionsBtn: { backgroundColor: '#F8F8F8', borderRadius: 14, height: 48, justifyContent: 'center', alignItems: 'center', marginTop: 8, borderWidth: 1, borderColor: '#E8E8E8', marginBottom: 16 },
  directionsBtnText: { fontSize: 14, fontWeight: '600', color: '#1A0F07' },
});