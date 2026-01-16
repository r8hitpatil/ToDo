import prisma from "$lib/prisma";
import type { CardResponse, CardsResponse } from "$lib/types/api.types";
import { createCardSchema } from "$lib/validators/cards.validators";
import { json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request }) => {
    try {
    const body = await request.json();

    const validateData = createCardSchema.parse(body);

    const card = await prisma.card.create({
      data: validateData
    });

    const response: CardResponse = {
        data: card,
        message: 'Card create successfully'
    }

    return json(response, { status: 201 });
  } catch (err) {
    return json(
      { error: 'Failed to create card' },
      { status: 500 }
    );
  }
};

export async function GET() {
  try {
    const cards = await prisma.card.findMany({
      orderBy: { createdAt: 'desc' }
    });

    const response:CardsResponse = {
      data: cards,
      count: cards.length
    }

    return json(response);
  } catch (err) {
    return json(
      { error: 'Failed to fetch cards' },
      { status: 500 }
    );
  }
}