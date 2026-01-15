import prisma from "$lib/prisma";
import type { CardResponse } from "$lib/types/api.types";
import { cardIdSchema, updateCardSchema } from "$lib/validators/cards.validators";
import { json, type RequestHandler } from "@sveltejs/kit";

export const PATCH: RequestHandler = async ({ params, request }) => {
    try {
        const id = cardIdSchema.parse(params.id);
        const body = await request.json();
        const validatedData = updateCardSchema.parse(body);

        const card = await prisma.card.update({
            where: id,
            data: validatedData
        })

        const response:CardResponse = {
            data:card,
            success: true,
            message: 'Card updated successfully'
        }

        return json(response);
    } catch (error) {
        return json({
            error: 'Failed to update card'
        }, { status: 500 });
    }
}

export const DELETE: RequestHandler = async ({ params }) => {
    try {
        const id = cardIdSchema.parse(params);

        await prisma.card.delete({
            where: id
        });

        const response:CardResponse = {
            success: true,
            message: 'Card deleted successfully'
        }

        return json(response);
    } catch (error) {
        return json(
            { error: 'Failed to delete card' },
            { status: 500 }
        );
    }
}