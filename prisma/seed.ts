import { PrismaLibSql } from '@prisma/adapter-libsql';
import { PrismaClient } from '../generated/prisma/client';

const adapter = new PrismaLibSql({ url: 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

const spots = [
  {
    category: 'restaurant',
    content: `# Versailles

The most famous Cuban restaurant in the world, Versailles has been the heart of Little Havana since 1971. Known for its mirrored walls, bustling atmosphere, and some of the best Cuban coffee in the city.

## What to Order

- **Cafecito** — the iconic Cuban espresso, sweet and strong
- **Ropa Vieja** — slow-cooked shredded beef in tomato sauce
- **Croquetas de Jamón** — crispy ham croquettes
- **Vaca Frita** — crispy fried shredded beef with onions

## The Vibe

Versailles is more than a restaurant — it's a cultural institution. Politicians campaign here, families celebrate here, and late-night crowds fuel up here after a night out. The ventanita (walk-up window) is open late and always has a line.

## Tips

- Go during off-peak hours (2–5pm) to avoid the lunch rush
- The ventanita is faster if you just want coffee and pastries
- Cash speeds things up at the window`,
    description:
      'The most famous Cuban restaurant in Miami — a cultural institution in Little Havana since 1971.',
    featured: true,
    name: 'Versailles',
    neighborhood: 'Little Havana',
    published: true,
    slug: 'versailles',
  },
  {
    category: 'restaurant',
    content: `# Joe's Stone Crab

A Miami Beach institution since 1913. Joe's is famous for its stone crab claws, served chilled with mustard sauce. The restaurant doesn't take reservations for dinner — expect a wait, but it's worth it.

## What to Order

- **Stone Crab Claws** — medium is the sweet spot for meat-to-shell ratio
- **Hash Browns** — legendary, crispy, buttery
- **Key Lime Pie** — the perfect finish
- **Fried Green Tomatoes** — a great starter

## Good to Know

- Only open October through May (stone crab season)
- No reservations for dinner — arrive early or try lunch
- Joe's Take Away next door has the same food, no wait
- Dress code is smart casual`,
    description:
      'Iconic seafood institution on South Beach — stone crab claws and key lime pie since 1913.',
    featured: true,
    name: "Joe's Stone Crab",
    neighborhood: 'South Beach',
    published: true,
    slug: 'joes-stone-crab',
  },
  {
    category: 'restaurant',
    content: `# Zak the Baker

Zak Stern's bakery and café in the Wynwood Arts District serves some of the best bread and pastries in Miami. Everything is baked in-house daily with a focus on quality ingredients and traditional techniques.

## Highlights

- **Sourdough bread** — naturally leavened, crusty perfection
- **Babka** — chocolate or cinnamon, both are phenomenal
- **Shakshuka** — eggs poached in spiced tomato sauce
- **Sandwiches** — built on house-baked bread, obviously

## The Space

Industrial-chic in a converted warehouse. Big communal tables, natural light, and the smell of fresh bread. It doubles as a great workspace during quieter hours.

## Tips

- Get there early on weekends — bread sells out
- The challah on Fridays is special
- Parking can be tricky; street parking or lot on NW 26th`,
    description:
      'Award-winning bakery and café in Wynwood — sourdough, babka, and sandwiches on house-baked bread.',
    featured: false,
    name: 'Zak the Baker',
    neighborhood: 'Wynwood',
    published: true,
    slug: 'zak-the-baker',
  },
  {
    category: 'bar',
    content: `# Sweet Liberty

Named one of the best bars in the world, Sweet Liberty in South Beach serves creative cocktails in a lively, welcoming space. No pretension, just excellent drinks and good energy.

## Must-Try Drinks

- **Sweet Liberty** — the signature, a riff on a rum swizzle
- **Seasonal cocktails** — the menu rotates, always worth exploring
- **Beer and wine** — solid selections beyond cocktails

## Food

The food is surprisingly good for a cocktail bar. The fried chicken sandwich is a local favorite, and the brunch menu draws crowds on weekends.

## The Vibe

Loud, fun, social. This is where you go when you want a great drink without the velvet rope attitude. The bartenders are world-class but approachable.`,
    description:
      'Award-winning cocktail bar on South Beach — world-class drinks, no pretension.',
    featured: true,
    name: 'Sweet Liberty',
    neighborhood: 'South Beach',
    published: true,
    slug: 'sweet-liberty',
  },
  {
    category: 'bar',
    content: `# Ball & Chain

A legendary Little Havana bar and live music venue that originally opened in 1935. It was a jazz hotspot in its heyday, and the revived version keeps that spirit alive with live Latin music, cocktails, and dancing.

## What to Expect

- **Live music** nightly — salsa, Latin jazz, Afro-Cuban beats
- **Dancing** — the pineapple-shaped back room is the dance floor
- **Cocktails** — classic Cuban cocktails done right
- **Mojitos** — arguably the best in Miami

## The Space

The front bar has an intimate, historic feel. The back opens into a massive tropical courtyard and pineapple-shaped venue with a stage. It's one of the most unique spaces in Miami.

## Tips

- Weekends get packed — arrive before 9pm for a seat
- Check the live music schedule in advance
- Right on Calle Ocho, so combine with a neighborhood walk`,
    description:
      'Historic Little Havana bar and live music venue — salsa, mojitos, and dancing since 1935.',
    featured: false,
    name: 'Ball & Chain',
    neighborhood: 'Little Havana',
    published: true,
    slug: 'ball-and-chain',
  },
  {
    category: 'bar',
    content: `# Broken Shaker

A craft cocktail bar tucked inside the Freehand Miami hostel. The Broken Shaker feels like a backyard party with some of the best bartenders in the country. The outdoor space, covered in tropical plants, is pure Miami.

## Drinks

- House cocktails are inventive and seasonal
- They use house-made syrups, infusions, and fresh ingredients
- The menu changes regularly — trust the bartenders' recommendations

## The Setting

The bar is set around a pool in the hostel's courtyard. String lights, lush greenery, and a mix of locals, travelers, and industry people. It feels like you discovered something secret.

## Good to Know

- Can get crowded on weekend nights
- There's also an indoor bar space
- Street parking on Indian Creek Drive is easiest`,
    description:
      'Hidden cocktail bar in a hostel courtyard — inventive drinks, tropical vibes, pool-side setting.',
    featured: false,
    name: 'Broken Shaker',
    neighborhood: 'South Beach',
    published: true,
    slug: 'broken-shaker',
  },
  {
    category: 'beach',
    content: `# South Beach

The most iconic beach in Miami and one of the most famous in the world. The wide stretch of white sand runs from South Pointe Park up to about 23rd Street, with the Art Deco Historic District as its backdrop.

## What Makes It Special

- **The sand** — wide, white, and well-maintained
- **Ocean Drive** — the Art Deco buildings along the beach are iconic
- **Lifeguard stands** — the colorful, architecturally distinct towers are a Miami symbol
- **South Pointe Park** — the southern tip has great views of Fisher Island and the port

## Tips

- Go early morning for a peaceful experience
- The area around 3rd–5th streets is usually less crowded
- Bring water — vendors are pricey
- Lummus Park (between the beach and Ocean Drive) has shade and walkways
- Parking is easiest at the garages on Collins Court or 13th Street`,
    description:
      "Miami's most iconic beach — white sand, Art Deco backdrop, and colorful lifeguard towers.",
    featured: true,
    name: 'South Beach',
    neighborhood: 'South Beach',
    published: true,
    slug: 'south-beach',
  },
  {
    category: 'beach',
    content: `# Crandon Park Beach

A beautiful, family-friendly beach on Key Biscayne that consistently ranks among the best beaches in the US. Less crowded and more natural than South Beach, with calm shallow waters.

## Why Locals Love It

- **Calm water** — a sandbar creates a natural wading pool
- **Space** — the beach is huge and never feels packed
- **Nature** — you'll see iguanas, pelicans, and sometimes manatees
- **Amenities** — picnic areas, grills, restrooms, beach chair rentals

## Getting There

Take the Rickenbacker Causeway from Brickell. There's a toll ($2.50) but it's worth it. The drive over the causeway has incredible views of the bay and downtown skyline.

## Tips

- Arrive before 11am on weekends for parking
- The north end is quieter
- Great for kids — the shallow, calm water is perfect for wading`,
    description:
      'Expansive Key Biscayne beach with calm, shallow waters and natural beauty — a local favorite.',
    featured: false,
    name: 'Crandon Park Beach',
    neighborhood: 'Coconut Grove',
    published: true,
    slug: 'crandon-park-beach',
  },
  {
    category: 'art',
    content: `# Wynwood Walls

The outdoor street art museum that put Wynwood on the map. Founded by the late Tony Goldman in 2009, the Walls transformed a warehouse district into one of the world's premier street art destinations.

## The Art

Over 50 murals by artists from around the world, rotating with new commissions. The scale and quality is staggering — entire building facades become canvases. Notable artists include Shepard Fairey, Retna, and Os Gemeos.

## Visiting

- **Free to walk the surrounding streets** — murals are everywhere in Wynwood, not just inside the Walls
- **Wynwood Walls garden** has a small admission fee
- **Art Basel week** (December) is when major new murals debut
- The area is best explored on foot — park once and walk

## Beyond the Walls

The surrounding blocks are just as interesting. Every building, alley, and shutter is painted. New work appears constantly. Combine with gallery visits and food stops along NW 2nd Avenue.`,
    description:
      'The outdoor street art museum that transformed Wynwood — world-class murals on warehouse walls.',
    featured: true,
    name: 'Wynwood Walls',
    neighborhood: 'Wynwood',
    published: true,
    slug: 'wynwood-walls',
  },
  {
    category: 'art',
    content: `# Pérez Art Museum Miami (PAMM)

Miami's flagship contemporary art museum, designed by Pritzker Prize–winning architects Herzog & de Meuron. The building itself is a work of art, with hanging gardens and stunning views of Biscayne Bay.

## The Collection

PAMM focuses on 20th and 21st-century international art, with strengths in Caribbean, Latin American, and African diasporic art. The permanent collection is complemented by ambitious temporary exhibitions.

## The Building

The stilt-supported structure hovers over the bay with covered terraces, hanging tropical plants, and water features. The architecture creates a seamless connection between indoors and outdoors.

## Tips

- **Free on first Thursdays** of the month (6–9pm)
- The museum terrace has one of the best views in Miami
- The gift shop has genuinely good design objects
- Combine with a visit to nearby Frost Science museum`,
    description:
      "Miami's contemporary art museum — world-class collection in a stunning waterfront building by Herzog & de Meuron.",
    featured: false,
    name: 'Pérez Art Museum Miami',
    neighborhood: 'Downtown',
    published: true,
    slug: 'perez-art-museum',
  },
  {
    category: 'nightlife',
    content: `# LIV

The premier nightclub at the Fontainebleau Miami Beach. LIV is where Miami's legendary nightlife reputation comes from — A-list DJs, celebrities, and a production level that rivals a concert.

## What to Know

- **Music** — top-tier EDM, hip-hop, and house DJs
- **Dress code** — strict. Dress sharp. No sneakers, no shorts
- **Bottle service** — the primary way to guarantee entry and a table
- **Cover** — expect $50–100+ on big nights
- **Hours** — doors open around 11pm, peaks 1–3am

## The Experience

The bass hits you before you even get through the door. LED screens, CO2 cannons, confetti — it's a full sensory experience. The energy is intense, and on the right night, there's nothing else like it in Miami.

## Tips

- Guest list helps but doesn't guarantee entry
- Arrive before midnight for shortest wait
- Wednesdays and Sundays often have special events`,
    description:
      "Miami's most iconic nightclub at the Fontainebleau — A-list DJs, celebrities, and full-scale production.",
    featured: false,
    name: 'LIV',
    neighborhood: 'South Beach',
    published: true,
    slug: 'liv',
  },
  {
    category: 'nightlife',
    content: `# Do Not Sit on the Furniture

An intimate, underground-feeling dance club in South Beach focused on quality house and techno music. No VIP tables, no bottle service, no attitude — just good music and dancing.

## The Philosophy

DNSTOF was founded on the idea that nightlife should be about the music and the community, not status. The sound system is exceptional, the DJs are carefully curated, and the vibe is inclusive.

## What to Expect

- **Music** — deep house, tech house, minimal techno
- **The space** — small, dark, immersive. Think Berlin, not Vegas
- **The crowd** — music lovers, not see-and-be-seen types
- **Hours** — gets going after midnight, often runs until 5am+

## Tips

- Check their calendar — they bring in excellent international DJs
- The small size means it can sell out; buy tickets in advance
- It's cash-preferred at the door`,
    description:
      'Intimate underground club for house and techno purists — exceptional sound, no pretension.',
    featured: false,
    name: 'Do Not Sit on the Furniture',
    neighborhood: 'South Beach',
    published: true,
    slug: 'do-not-sit-on-the-furniture',
  },
  {
    category: 'cafe',
    content: `# Café La Trova

A cocktail bar and café inspired by the classic Cuban social clubs of the 1950s. Founded by James Beard Award–winning bartender Julio Cabrera, it's part bar, part cultural experience.

## The Concept

The front room is a casual Cuban café — coladas, croquetas, and dominos. Walk through to the back and you're in a dimly lit cocktail lounge with live music, white-jacketed bartenders, and hand-crafted Cuban-inspired cocktails.

## Highlights

- **Colada service** — traditional Cuban coffee served communally
- **Cocktails** — classic Cuban drinks with a modern twist
- **Live music** — bolero, son cubano, Latin jazz nightly
- **Food** — elevated Cuban bar snacks

## The Vibe

It feels like stepping into old Havana. The attention to detail — from the tiles to the music to the bartenders' uniforms — is extraordinary. It's one of the most atmospheric spots in Miami.`,
    description:
      'Cuban-inspired cocktail bar and café — live music, coladas, and handcrafted cocktails in a 1950s Havana setting.',
    featured: true,
    name: 'Café La Trova',
    neighborhood: 'Little Havana',
    published: true,
    slug: 'cafe-la-trova',
  },
  {
    category: 'restaurant',
    content: `# Mandolin Aegean Bistro

A Mediterranean oasis in the Design District. Set in a restored 1940s bungalow with a lush garden courtyard, Mandolin serves Turkish and Greek cuisine that's bright, fresh, and perfectly executed.

## Must-Try Dishes

- **Hummus** — some of the best you'll have anywhere
- **Grilled octopus** — tender, charred, with lemon and olive oil
- **Lamb chops** — simply seasoned, perfectly cooked
- **Turkish breakfast** on weekends — a feast of small plates

## The Setting

The courtyard is what makes Mandolin special. Dining under the trees, surrounded by bougainvillea, with soft lighting — it's one of the most romantic settings in Miami. The indoor space is charming too, in a blue-and-white cottage feel.

## Tips

- Reserve for dinner, especially weekends
- Lunch is more relaxed and just as good
- The weekend Turkish breakfast requires a reservation`,
    description:
      'Mediterranean gem in the Design District — Turkish and Greek cuisine in a garden courtyard setting.',
    featured: false,
    name: 'Mandolin Aegean Bistro',
    neighborhood: 'Design District',
    published: true,
    slug: 'mandolin-aegean-bistro',
  },
  {
    category: 'cafe',
    content: `# Panther Coffee

Wynwood's original specialty coffee roaster. Panther has been roasting and serving single-origin coffees since before Wynwood was a destination. The flagship location on NW 2nd Avenue is a neighborhood anchor.

## The Coffee

- **Single-origin pour-overs** — rotating selections from their roastery
- **Espresso** — dialed in and consistent
- **Cold brew** — smooth, strong, perfect for Miami heat
- **Seasonal drinks** — they keep it simple but do specials well

## The Space

Open-air, industrial, casual. The original Wynwood location has a big patio that's great for people-watching. There's no AC in the outdoor area — embrace the Miami warmth.

## Good to Know

- Multiple locations now, but Wynwood is the original
- They roast on-site — you can often see (and smell) it happening
- Bags of beans make great souvenirs`,
    description:
      "Wynwood's original specialty coffee roaster — single-origin beans, open-air vibes, and community.",
    featured: false,
    name: 'Panther Coffee',
    neighborhood: 'Wynwood',
    published: true,
    slug: 'panther-coffee',
  },
  {
    category: 'art',
    content: `# Institute of Contemporary Art (ICA) Miami

A free contemporary art museum in the Design District with an ambitious exhibition program and a beautiful sculpture garden. ICA Miami punches well above its weight for a museum of its size.

## The Collection

The permanent collection includes major works by artists like Sterling Ruby, Hélio Oiticica, and Tomás Saraceno. Temporary exhibitions are well-curated and often feature emerging artists before they break through.

## The Building

Designed by Aranguren + Gallegos Arquitectos, the building is a sleek, angular structure that contrasts nicely with the Design District's luxury retail surroundings. The sculpture garden on the second floor is a highlight.

## Tips

- **Always free** — no tickets, no reservations needed
- Open Tuesday through Sunday
- The Design District has great dining options nearby
- Combine with shopping and gallery visits in the neighborhood`,
    description:
      'Free contemporary art museum in the Design District — ambitious exhibitions and a rooftop sculpture garden.',
    featured: false,
    name: 'Institute of Contemporary Art Miami',
    neighborhood: 'Design District',
    published: true,
    slug: 'ica-miami',
  },
  {
    category: 'restaurant',
    content: `# Brickell's La Mar

Peruvian fine dining by chef Gastón Acurio, located in the Mandarin Oriental on Brickell Key. The waterfront setting and creative ceviche menu make it one of the most memorable dining experiences in Miami.

## Highlights

- **Ceviche** — the specialty. Multiple varieties, all exceptional
- **Anticuchos** — grilled skewers, smoky and tender
- **Causa** — layered potato terrine with seafood
- **Pisco sours** — among the best in the US

## The Setting

Floor-to-ceiling windows overlooking Biscayne Bay. The terrace at sunset is stunning. The interior is elegant but not stuffy — clean lines, natural materials, and an open kitchen.

## Tips

- Reservations recommended, especially for the terrace
- Lunch is a great value compared to dinner
- The bar menu is a good option if you want to try several ceviches`,
    description:
      'Peruvian waterfront dining on Brickell Key — world-class ceviches and bay views from chef Gastón Acurio.',
    featured: false,
    name: 'La Mar by Gastón Acurio',
    neighborhood: 'Brickell',
    published: true,
    slug: 'la-mar',
  },
  {
    category: 'beach',
    content: `# Bill Baggs Cape Florida State Park

A beautiful state park at the southern tip of Key Biscayne, featuring a historic lighthouse, pristine beaches, and nature trails. It feels worlds away from Miami while being just 30 minutes from downtown.

## Highlights

- **The lighthouse** — Cape Florida Light, built in 1825, is the oldest structure in Miami-Dade County. Tours available.
- **The beach** — consistently rated among the best in the US. Crystal clear water, soft sand, and natural dunes.
- **Cycling and walking paths** — wind through coastal hammock forest
- **Boater's Grill** — surprisingly good food right on the beach

## Tips

- State park entrance fee is $8 per vehicle
- Lighthouse tours are free but limited — ask at the entrance
- The beach on the bay side (west) has calmer water and great sunset views
- Bring snorkeling gear — the water is clear enough to see fish`,
    description:
      'State park at the tip of Key Biscayne — historic lighthouse, pristine beach, and coastal trails.',
    featured: false,
    name: 'Bill Baggs Cape Florida',
    neighborhood: 'Coconut Grove',
    published: true,
    slug: 'bill-baggs-cape-florida',
  },
  {
    category: 'restaurant',
    content: `# Cvi.che 105

One of the best Peruvian restaurants in Miami, right in the heart of Downtown. The ceviches are vibrant and fresh, the portions are generous, and the prices are reasonable for the quality.

## What to Order

- **Ceviche Carretillero** — the house signature with leche de tigre
- **Lomo Saltado** — stir-fried beef with fries and rice
- **Arroz con Mariscos** — seafood rice, rich and flavorful
- **Chicharrón de Pescado** — crispy fried fish

## The Vibe

Casual and lively. The original downtown location is small and always packed — a sign of how good the food is. There's often a wait but it moves quickly.

## Tips

- The downtown location is the original and best
- Go for lunch to avoid the dinner wait
- They have a full bar — try the maracuyá sour`,
    description:
      'Vibrant downtown Peruvian spot — generous ceviches, lomo saltado, and a perpetual line out the door.',
    featured: false,
    name: 'Cvi.che 105',
    neighborhood: 'Downtown',
    published: true,
    slug: 'cviche-105',
  },
  {
    category: 'bar',
    content: `# The Anderson

A neighborhood bar in Brickell/Upper East Side that feels like Miami's living room. Pool tables, pinball machines, a jukebox, and strong, no-frills drinks. It's the antidote to Miami's velvet-rope culture.

## What to Expect

- **Drinks** — classic cocktails, craft beer, shots. Nothing overpriced.
- **Games** — pool tables, pinball, darts
- **Food** — solid bar food (burgers, wings, tots)
- **Vibe** — unpretentious, friendly, local

## The Space

Divey in the best way. Christmas lights, stickers on every surface, a patio out back. It's the kind of place where you plan to stay for one drink and leave three hours later.

## Good to Know

- Great happy hour deals
- Can get loud on weekends
- Has a late-night kitchen`,
    description:
      'The ultimate neighborhood bar — pool tables, pinball, strong drinks, and zero pretension.',
    featured: false,
    name: 'The Anderson',
    neighborhood: 'Brickell',
    published: true,
    slug: 'the-anderson',
  },
];

async function main() {
  console.log('Seeding database...');

  await prisma.spot.deleteMany();

  await prisma.spot.createMany({
    data: spots.map(spot => {return {
      ...spot,
      seed: true,
    }}),
  });

  console.log(`Seeded ${spots.length} spots`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
