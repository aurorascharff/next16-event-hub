/* eslint-disable no-console */
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { PrismaClient } from '../generated/prisma/client';

const adapter = new PrismaLibSql({ url: 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

const spots = [
  {
    category: 'restaurant',
    content:
      'Versailles has been the heart of Little Havana since 1971. Known for its mirrored walls, bustling atmosphere, and some of the best Cuban coffee in the city. Order the cafecito at the ventanita (walk-up window), try the ropa vieja or the croquetas de jamón. Go during off-peak hours to avoid the lunch rush — the ventanita is faster if you just want coffee and pastries.',
    description: 'The most famous Cuban restaurant in Miami — a cultural institution since 1971.',
    featured: true,
    name: 'Versailles',
    neighborhood: 'Little Havana',
    slug: 'versailles',
  },
  {
    category: 'restaurant',
    content:
      "A Miami Beach institution since 1913. Famous for stone crab claws served chilled with mustard sauce — medium is the sweet spot for meat-to-shell ratio. The hash browns are legendary, and the key lime pie is the perfect finish. Only open October through May. No reservations for dinner, so arrive early or try Joe's Take Away next door for the same food without the wait.",
    description: 'Iconic seafood institution — stone crab claws and key lime pie since 1913.',
    featured: true,
    name: "Joe's Stone Crab",
    neighborhood: 'South Beach',
    slug: 'joes-stone-crab',
  },
  {
    category: 'cafe',
    content:
      "Zak Stern's bakery serves some of the best bread and pastries in Miami. Everything is baked in-house daily. The sourdough is naturally leavened perfection, the babka (chocolate or cinnamon) is phenomenal, and the shakshuka is a great brunch pick. Industrial-chic space in a converted warehouse with big communal tables. Get there early on weekends — bread sells out. The Friday challah is special.",
    description: 'Award-winning bakery and café — sourdough, babka, and sandwiches on house-baked bread.',
    featured: false,
    name: 'Zak the Baker',
    neighborhood: 'Wynwood',
    slug: 'zak-the-baker',
  },
  {
    category: 'bar',
    content:
      'Named one of the best bars in the world. Creative cocktails in a lively, welcoming space. The signature Sweet Liberty is a riff on a rum swizzle — the seasonal menu rotates and is always worth exploring. The food is surprisingly good for a cocktail bar; the fried chicken sandwich is a local favorite. Loud, fun, social — great drinks without the velvet rope attitude.',
    description: 'Award-winning cocktail bar — world-class drinks, no pretension.',
    featured: true,
    name: 'Sweet Liberty',
    neighborhood: 'South Beach',
    slug: 'sweet-liberty',
  },
  {
    category: 'bar',
    content:
      'Originally opened in 1935 as a jazz hotspot. The revived version keeps that spirit alive with live Latin music, cocktails, and dancing nightly. The front bar has an intimate, historic feel. The back opens into a massive tropical courtyard with a pineapple-shaped venue and stage. Arguably the best mojitos in Miami. Right on Calle Ocho, so combine with a neighborhood walk. Arrive before 9pm on weekends for a seat.',
    description: 'Historic bar and live music venue — salsa, mojitos, and dancing since 1935.',
    featured: false,
    name: 'Ball & Chain',
    neighborhood: 'Little Havana',
    slug: 'ball-and-chain',
  },
  {
    category: 'beach',
    content:
      'The most iconic beach in Miami. Wide white sand runs from South Pointe Park up to about 23rd Street, with the Art Deco Historic District as backdrop. The colorful lifeguard towers are a Miami symbol. Go early morning for a peaceful experience. The area around 3rd–5th streets is usually less crowded. South Pointe Park at the southern tip has great views of Fisher Island. Parking is easiest at the garages on Collins Court.',
    description: "Miami's most iconic beach — white sand, Art Deco backdrop, colorful lifeguard towers.",
    featured: true,
    name: 'South Beach',
    neighborhood: 'South Beach',
    slug: 'south-beach',
  },
  {
    category: 'beach',
    content:
      'A beautiful, family-friendly beach on Key Biscayne. Consistently ranks among the best beaches in the US. A sandbar creates a natural wading pool with calm water. The beach is huge and never feels packed. Take the Rickenbacker Causeway from Brickell — the drive has incredible views of the bay and downtown skyline. Arrive before 11am on weekends for parking. The north end is quieter.',
    description: 'Expansive Key Biscayne beach with calm, shallow waters — a local favorite.',
    featured: false,
    name: 'Crandon Park Beach',
    neighborhood: 'Coconut Grove',
    slug: 'crandon-park-beach',
  },
  {
    category: 'art',
    content:
      'Founded by Tony Goldman in 2009, the Walls transformed a warehouse district into one of the world\'s premier street art destinations. Over 50 murals by artists from around the world, rotating with new commissions. The surrounding blocks are just as interesting — every building, alley, and shutter is painted. Art Basel week in December is when major new murals debut. Free to walk the surrounding streets; the Walls garden has a small admission fee.',
    description: 'The outdoor street art museum that transformed Wynwood — world-class murals.',
    featured: true,
    name: 'Wynwood Walls',
    neighborhood: 'Wynwood',
    slug: 'wynwood-walls',
  },
  {
    category: 'art',
    content:
      "Miami's flagship contemporary art museum. The stilt-supported structure hovers over the bay with hanging tropical plants and water features. Focus on 20th and 21st-century international art with strengths in Caribbean, Latin American, and African diasporic art. Free on first Thursdays of the month (6–9pm). The museum terrace has one of the best views in Miami. Combine with a visit to nearby Frost Science museum.",
    description: 'Contemporary art museum in a stunning waterfront building by Herzog & de Meuron.',
    featured: false,
    name: 'Pérez Art Museum Miami',
    neighborhood: 'Downtown',
    slug: 'perez-art-museum',
  },
  {
    category: 'nightlife',
    content:
      'The premier nightclub at the Fontainebleau Miami Beach. Top-tier EDM, hip-hop, and house DJs. Strict dress code — dress sharp, no sneakers, no shorts. Bottle service is the primary way to guarantee entry. LED screens, CO2 cannons, confetti — a full sensory experience. Doors open around 11pm, peaks 1–3am. Wednesdays and Sundays often have special events.',
    description: "Miami's most iconic nightclub at the Fontainebleau — A-list DJs and full production.",
    featured: false,
    name: 'LIV',
    neighborhood: 'South Beach',
    slug: 'liv',
  },
  {
    category: 'nightlife',
    content:
      'An intimate, underground-feeling dance club focused on quality house and techno. No VIP tables, no bottle service, no attitude. The sound system is exceptional, the DJs are carefully curated, and the vibe is inclusive. Small, dark, immersive — think Berlin, not Vegas. Gets going after midnight, often runs until 5am+. Check their calendar for international DJs. Can sell out, so buy tickets in advance.',
    description: 'Intimate underground club for house and techno — exceptional sound, no pretension.',
    featured: false,
    name: 'Do Not Sit on the Furniture',
    neighborhood: 'South Beach',
    slug: 'do-not-sit-on-the-furniture',
  },
  {
    category: 'cafe',
    content:
      "Founded by James Beard Award–winning bartender Julio Cabrera. The front room is a casual Cuban café with coladas, croquetas, and dominos. Walk through to the back for a dimly lit cocktail lounge with live bolero, son cubano, and Latin jazz nightly. The attention to detail — tiles, music, bartenders' uniforms — is extraordinary. Feels like stepping into old Havana. One of the most atmospheric spots in Miami.",
    description: 'Cuban cocktail bar and café — live music, coladas, and 1950s Havana vibes.',
    featured: true,
    name: 'Café La Trova',
    neighborhood: 'Little Havana',
    slug: 'cafe-la-trova',
  },
  {
    category: 'restaurant',
    content:
      'A Mediterranean oasis in the Design District. Set in a restored 1940s bungalow with a lush garden courtyard. The hummus is some of the best anywhere, the grilled octopus is tender and charred perfectly, and the lamb chops are simply seasoned and perfectly cooked. The courtyard dining under bougainvillea with soft lighting is one of the most romantic settings in Miami. Reserve for dinner, especially weekends.',
    description: 'Mediterranean gem — Turkish and Greek cuisine in a garden courtyard.',
    featured: false,
    name: 'Mandolin Aegean Bistro',
    neighborhood: 'Design District',
    slug: 'mandolin-aegean-bistro',
  },
  {
    category: 'cafe',
    content:
      "Wynwood's original specialty coffee roaster, operating since before Wynwood was a destination. Rotating single-origin pour-overs, dialed-in espresso, and smooth cold brew perfect for Miami heat. Open-air, industrial, casual. The Wynwood location has a big patio great for people-watching. They roast on-site — you can often see and smell it happening. Bags of beans make great souvenirs.",
    description: "Wynwood's original specialty coffee roaster — single-origin beans, open-air vibes.",
    featured: false,
    name: 'Panther Coffee',
    neighborhood: 'Wynwood',
    slug: 'panther-coffee',
  },
  {
    category: 'art',
    content:
      'A free contemporary art museum in the Design District with an ambitious exhibition program. The permanent collection includes major works by Sterling Ruby, Hélio Oiticica, and Tomás Saraceno. The building is a sleek angular structure by Aranguren + Gallegos Arquitectos. The rooftop sculpture garden is a highlight. Always free, no tickets needed. Open Tuesday through Sunday. The Design District has great dining nearby.',
    description: 'Free contemporary art museum — ambitious exhibitions and a rooftop sculpture garden.',
    featured: false,
    name: 'ICA Miami',
    neighborhood: 'Design District',
    slug: 'ica-miami',
  },
  {
    category: 'restaurant',
    content:
      'Peruvian fine dining by chef Gastón Acurio at the Mandarin Oriental on Brickell Key. Multiple ceviche varieties, all exceptional. The anticuchos (grilled skewers) are smoky and tender, and the pisco sours are among the best in the US. Floor-to-ceiling windows overlooking Biscayne Bay — the terrace at sunset is stunning. Reservations recommended. The bar menu is a good option if you want to try several ceviches.',
    description: 'Peruvian waterfront dining — world-class ceviches and bay views.',
    featured: false,
    name: 'La Mar by Gastón Acurio',
    neighborhood: 'Brickell',
    slug: 'la-mar',
  },
  {
    category: 'beach',
    content:
      'A beautiful state park at the southern tip of Key Biscayne. Cape Florida Light, built in 1825, is the oldest structure in Miami-Dade County. The beach is consistently rated among the best in the US with crystal clear water and natural dunes. Cycling and walking paths wind through coastal hammock forest. State park entrance is $8 per vehicle. The bay side has calmer water and great sunset views. Bring snorkeling gear — the water is clear enough to see fish.',
    description: 'State park at the tip of Key Biscayne — historic lighthouse and pristine beach.',
    featured: false,
    name: 'Bill Baggs Cape Florida',
    neighborhood: 'Coconut Grove',
    slug: 'bill-baggs-cape-florida',
  },
  {
    category: 'bar',
    content:
      "A neighborhood bar that feels like Miami's living room. Pool tables, pinball machines, a jukebox, and strong no-frills drinks. Divey in the best way — Christmas lights, stickers on every surface, a patio out back. The kind of place where you plan to stay for one drink and leave three hours later. Great happy hour deals, solid bar food, and a late-night kitchen. The antidote to Miami's velvet-rope culture.",
    description: 'The ultimate neighborhood bar — pool tables, pinball, strong drinks, zero pretension.',
    featured: false,
    name: 'The Anderson',
    neighborhood: 'Brickell',
    slug: 'the-anderson',
  },
];

const tips = [
  { author: 'Maria', content: 'The ventanita line moves fast — get a cafecito and a guava pastry for under $5.', spotSlug: 'versailles' },
  { author: 'Carlos', content: 'Try the vaca frita. Trust me.', spotSlug: 'versailles' },
  { author: 'Jake', content: 'Their brunch is an underrated move — less crowded than dinner and the food is great.', spotSlug: 'sweet-liberty' },
  { author: 'Sophie', content: 'Go on a weekday morning to get photos without crowds. The light is better too.', spotSlug: 'wynwood-walls' },
  { author: 'Alex', content: 'Don\'t just stay inside the walls — the surrounding blocks have equally amazing murals.', spotSlug: 'wynwood-walls' },
  { author: 'Lisa', content: 'South Pointe Park at sunset is magical. Bring a blanket and watch the cruise ships leave.', spotSlug: 'south-beach' },
  { author: 'Tom', content: 'The 3rd street area is way less touristy. Much more relaxed vibe.', spotSlug: 'south-beach' },
  { author: 'Diana', content: 'Sit at the bar in the back room — watching the bartenders work is part of the experience.', spotSlug: 'cafe-la-trova' },
  { author: 'Marco', content: 'Take a salsa lesson before you go. You\'ll thank me when the band starts playing.', spotSlug: 'ball-and-chain' },
  { author: 'Nina', content: 'The weekend Turkish breakfast is a feast. Reserve ahead.', spotSlug: 'mandolin-aegean-bistro' },
  { author: 'Ryan', content: 'Their cold brew concentrate is perfect for hot Miami days. Get the large.', spotSlug: 'panther-coffee' },
  { author: 'Ellen', content: 'Lunch has a much shorter wait than dinner and the same menu.', spotSlug: 'joes-stone-crab' },
];

async function main() {
  console.log('Seeding database...');

  await prisma.favorite.deleteMany();
  await prisma.tip.deleteMany();
  await prisma.spot.deleteMany();

  for (const spot of spots) {
    await prisma.spot.create({ data: spot });
  }

  for (const tip of tips) {
    await prisma.tip.create({ data: tip });
  }

  console.log(`Seeded ${spots.length} spots and ${tips.length} tips`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
