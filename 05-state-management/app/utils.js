// Utility function to generate random data based on card type
export function generateRandomCardData(type) {
  // Generate random tags (1-3 tags)
  const allPossibleTags = [
    "programming",
    "design",
    "languages",
    "concepts",
    "colors",
    "development",
    "coding",
    "palette",
    "visual",
    "creative",
    "ui",
    "nature",
    "accent",
  ]

  const tags = []
  const tagCount = Math.floor(Math.random() * 3) + 1 // 1-3 tags

  for (let i = 0; i < tagCount; i++) {
    const randomIndex = Math.floor(Math.random() * allPossibleTags.length)
    const tag = allPossibleTags[randomIndex]
    if (!tags.includes(tag)) {
      tags.push(tag)
    }
  }

  // Generate random data based on type
  let data

  if (type === "foreign-word") {
    const words = [
      "JavaScript",
      "Python",
      "TypeScript",
      "Rust",
      "Go",
      "Swift",
      "Kotlin",
      "Ruby",
      "Java",
      "C#",
      "PHP",
      "Emerald",
      "Sapphire",
      "Ruby",
      "Amethyst",
    ]
    const pronunciations = ["jah-vuh-skript", "pie-thon", "type-script", "rust", "go", "swift", "kot-lin", "em-er-uld"]
    const translations = [
      "Dynamic programming language for web development",
      "High-level programming language for general-purpose programming",
      "Strongly typed programming language that builds on JavaScript",
      "Systems programming language focused on safety and performance",
      "Statically typed language designed for simplicity and efficiency",
      "Programming language for iOS and macOS development",
      "Modern programming language for Android development",
      "Bright green gemstone associated with nature and growth",
    ]

    data = {
      pronunciation: pronunciations[Math.floor(Math.random() * pronunciations.length)],
      translation: translations[Math.floor(Math.random() * translations.length)],
    }

    // Return the word as well for title generation
    return {
      tags,
      data,
      titleData: words[Math.floor(Math.random() * words.length)],
    }
  } else if (type === "playing-card") {
    const symbols = ["heart", "diamond", "club", "spade"]
    const values = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"]
    const suits = ["♠", "♥", "♦", "♣"]

    data = {
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      value: values[Math.floor(Math.random() * values.length)],
      suit: suits[Math.floor(Math.random() * suits.length)],
    }
  } else if (type === "string-list") {
    const listTitles = [
      "Software Design Patterns",
      "UI Elements",
      "Brand Elements",
      "Programming Paradigms",
      "Web Technologies",
      "Frontend Frameworks",
      "Backend Technologies",
      "Database Systems",
    ]

    const possibleItems = [
      "Singleton",
      "Factory",
      "Observer",
      "Strategy",
      "Decorator",
      "Header",
      "Footer",
      "Sidebar",
      "Main Content",
      "Navigation",
      "Logo",
      "Typography",
      "Color Palette",
      "Imagery",
      "Voice",
    ]

    const itemCount = Math.floor(Math.random() * 5) + 1 // 1-5 items
    data = []

    for (let i = 0; i < itemCount; i++) {
      const randomIndex = Math.floor(Math.random() * possibleItems.length)
      data.push(possibleItems[randomIndex])
    }

    // Return the list title as well for title generation
    return {
      tags,
      data,
      titleData: listTitles[Math.floor(Math.random() * listTitles.length)],
    }
  }

  return { tags, data }
}

// Determine card type based on slide title
export function determineCardType(slideTitle) {
  const title = slideTitle.toLowerCase()

  if (title.includes("language") || title.includes("programming")) {
    return "foreign-word"
  } else if (title.includes("color") || title.includes("design")) {
    return "playing-card"
  } else if (title.includes("concept") || title.includes("pattern")) {
    return "string-list"
  }

  // Default to foreign-word if can't determine
  return "foreign-word"
}

// Generate a title for a card based on its type and data
export function generateCardTitle(type, data, titleData) {
  if (type === "playing-card") {
    const value = data.value
    const suit = data.suit

    // Convert suit symbol to name
    let suitName = "Spades"
    if (suit === "♥") suitName = "Hearts"
    else if (suit === "♦") suitName = "Diamonds"
    else if (suit === "♣") suitName = "Clubs"

    // Format the title
    return `${typeof value === "number" ? value : value} of ${suitName}`
  } else if (type === "foreign-word" && titleData) {
    // For foreign words, use the provided word
    return titleData
  } else if (type === "string-list" && titleData) {
    // For string lists, use the provided list title
    return titleData
  }

  return null // Return null for other cases to use the user-provided title
}
