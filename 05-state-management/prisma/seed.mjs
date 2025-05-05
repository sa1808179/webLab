import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seeding process...');
  
  // Define all valid card types
  const cardTypes = [
    { type: 'string-list' },
    { type: 'playing-card' },
    { type: 'foreign-word' }
  ];

  console.log('Creating card types...');
  
  // Create or update each card type
  const createdCardTypes = {};
  for (const cardType of cardTypes) {
    const result = await prisma.cardType.upsert({
      where: { type: cardType.type },
      update: {}, // No updates needed if it exists
      create: cardType,
    });
    createdCardTypes[cardType.type] = result;
    console.log(`Upserted card type: ${result.type} with id: ${result.id}`);
  }

  // Create the deck
  console.log('Creating deck...');
  const deck = await prisma.deck.upsert({
    where: { id: 'deck1' },
    update: {
      title: 'Learning Materials',
      tags: ['programming', 'design', 'languages', 'concepts', 'colors', 'development']
    },
    create: {
      id: 'deck1',
      title: 'Learning Materials',
      tags: ['programming', 'design', 'languages', 'concepts', 'colors', 'development']
    }
  });
  console.log(`Created deck: ${deck.title} with id: ${deck.id}`);

  // Create slides
  console.log('Creating slides...');
  
  // Languages slide
  const languagesSlide = await prisma.slide.upsert({
    where: { id: 'slide1' },
    update: {
      title: 'Programming Languages',
      tags: ['programming', 'languages', 'development', 'coding'],
      deckId: deck.id
    },
    create: {
      id: 'slide1',
      title: 'Programming Languages',
      tags: ['programming', 'languages', 'development', 'coding'],
      deckId: deck.id
    }
  });
  
  // Colors slide
  const colorsSlide = await prisma.slide.upsert({
    where: { id: 'slide2' },
    update: {
      title: 'Design Colors',
      tags: ['design', 'colors', 'palette', 'visual', 'creative'],
      deckId: deck.id
    },
    create: {
      id: 'slide2',
      title: 'Design Colors',
      tags: ['design', 'colors', 'palette', 'visual', 'creative'],
      deckId: deck.id
    }
  });
  
  // Concepts slide
  const conceptsSlide = await prisma.slide.upsert({
    where: { id: 'slide3' },
    update: {
      title: 'Programming Concepts',
      tags: ['programming', 'concepts', 'development'],
      deckId: deck.id
    },
    create: {
      id: 'slide3',
      title: 'Programming Concepts',
      tags: ['programming', 'concepts', 'development'],
      deckId: deck.id
    }
  });

  console.log(`Created slides: ${languagesSlide.title}, ${colorsSlide.title}, ${conceptsSlide.title}`);

  // Delete existing cards to avoid duplicates
  await prisma.card.deleteMany({
    where: {
      id: {
        in: ['card1', 'card2', 'card3', 'card4', 'card5', 'card6', 'card7', 'card8', 'card9', 'card10', 'card11', 'card12', 'card13', 'card14']
      }
    }
  });

  // Create cards for Languages slide
  console.log('Creating cards for Languages slide...');
  const languageCards = [
    {
      id: 'card1',
      title: 'JavaScript',
      tags: ['programming'],
      data: {
        pronunciation: 'jah-vuh-skript',
        translation: 'Dynamic programming language for web development'
      },
      typeId: createdCardTypes['foreign-word'].id,
      slideId: languagesSlide.id
    },
    {
      id: 'card2',
      title: 'Python',
      tags: ['programming'],
      data: {
        pronunciation: 'pie-thon',
        translation: 'High-level programming language for general-purpose programming'
      },
      typeId: createdCardTypes['foreign-word'].id,
      slideId: languagesSlide.id
    },
    {
      id: 'card3',
      title: 'TypeScript',
      tags: ['programming'],
      data: {
        pronunciation: 'type-script',
        translation: 'Strongly typed programming language that builds on JavaScript'
      },
      typeId: createdCardTypes['foreign-word'].id,
      slideId: languagesSlide.id
    },
    {
      id: 'card4',
      title: 'Rust',
      tags: ['programming'],
      data: {
        pronunciation: 'rust',
        translation: 'Systems programming language focused on safety and performance'
      },
      typeId: createdCardTypes['foreign-word'].id,
      slideId: languagesSlide.id
    },
    {
      id: 'card5',
      title: 'Go',
      tags: ['programming'],
      data: {
        pronunciation: 'go',
        translation: 'Statically typed language designed for simplicity and efficiency'
      },
      typeId: createdCardTypes['foreign-word'].id,
      slideId: languagesSlide.id
    },
    {
      id: 'card6',
      title: 'Swift',
      tags: ['programming'],
      data: {
        pronunciation: 'swift',
        translation: 'Programming language for iOS and macOS development'
      },
      typeId: createdCardTypes['foreign-word'].id,
      slideId: languagesSlide.id
    },
    {
      id: 'card7',
      title: 'Kotlin',
      tags: ['programming'],
      data: {
        pronunciation: 'kot-lin',
        translation: 'Modern programming language for Android development'
      },
      typeId: createdCardTypes['foreign-word'].id,
      slideId: languagesSlide.id
    }
  ];

  for (const card of languageCards) {
    await prisma.card.create({ data: card });
  }

  // Create cards for Colors slide
  console.log('Creating cards for Colors slide...');
  const colorCards = [
    {
      id: 'card8',
      title: 'Ace of Hearts',
      tags: ['design'],
      data: {
        symbol: 'heart',
        value: 'A',
        suit: '♥'
      },
      typeId: createdCardTypes['playing-card'].id,
      slideId: colorsSlide.id
    },
    {
      id: 'card9',
      title: 'King of Diamonds',
      tags: ['design', 'accent'],
      data: {
        symbol: 'diamond',
        value: 'K',
        suit: '♦'
      },
      typeId: createdCardTypes['playing-card'].id,
      slideId: colorsSlide.id
    },
    {
      id: 'card10',
      title: 'Queen of Clubs',
      tags: ['design'],
      data: {
        symbol: 'club',
        value: 'Q',
        suit: '♣'
      },
      typeId: createdCardTypes['playing-card'].id,
      slideId: colorsSlide.id
    },
    {
      id: 'card11',
      title: 'UI Elements',
      tags: ['design', 'ui'],
      data: ['Header', 'Footer', 'Sidebar', 'Main Content', 'Navigation'],
      typeId: createdCardTypes['string-list'].id,
      slideId: colorsSlide.id
    },
    {
      id: 'card12',
      title: 'Emerald',
      tags: ['design', 'nature'],
      data: {
        pronunciation: 'em-er-uld',
        translation: 'Bright green gemstone associated with nature and growth'
      },
      typeId: createdCardTypes['foreign-word'].id,
      slideId: colorsSlide.id
    },
    {
      id: 'card13',
      title: 'Brand Elements',
      tags: ['design'],
      data: ['Logo', 'Typography', 'Color Palette', 'Imagery', 'Voice'],
      typeId: createdCardTypes['string-list'].id,
      slideId: colorsSlide.id
    }
  ];

  for (const card of colorCards) {
    await prisma.card.create({ data: card });
  }

  // Create cards for Concepts slide
  console.log('Creating cards for Concepts slide...');
  const conceptCards = [
    {
      id: 'card14',
      title: 'Software Design Patterns',
      tags: ['programming', 'concepts'],
      data: ['Singleton', 'Factory', 'Observer', 'Strategy', 'Decorator'],
      typeId: createdCardTypes['string-list'].id,
      slideId: conceptsSlide.id
    }
  ];

  for (const card of conceptCards) {
    await prisma.card.create({ data: card });
  }

  console.log('Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    // Close the Prisma client connection
    await prisma.$disconnect();
    console.log('Prisma client disconnected.');
  });
