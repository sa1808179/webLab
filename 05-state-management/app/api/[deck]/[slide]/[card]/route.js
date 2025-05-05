import { NextResponse } from "next/server"
import { deleteCard, updateCard } from "@/repos/cards.js"

// DELETE /api/:deck/:slide/:card - Delete the card having the provided identifier
export async function DELETE(request, context) {
  try {
    // Await the params object before accessing its properties
    const { card, slide, deck } = await context.params

    const cardResult = await deleteCard(card, slide, deck)
    return NextResponse.json(cardResult, { status: 200 })
  } catch (error) {
    if (error.message.includes("not found")) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PATCH /api/:deck/:slide/:card - Update the card having the provided identifier
export async function PATCH(request, context) {
  try {
    // Await the params object before accessing its properties
    const { card, slide, deck } = await context.params

    const data = await request.json()
    const cardResult = await updateCard(card, slide, deck, data)
    return NextResponse.json(cardResult, { status: 200 })
  } catch (error) {
    if (error.message.includes("not found")) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
