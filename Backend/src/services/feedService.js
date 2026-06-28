import {
    getUserFeed,
    toggleFeedLike,
    createFeedComment,
    listFeedComments
} from "../models/feedModel.js";

export async function getUserFeedService(userId) {
    return await getUserFeed(userId);
}

export async function toggleFeedLikeService(userId, data) {
    const { itemType, itemId } = data;

    if (!itemType || !itemId) {
        throw new Error("Tipo e ID da atividade são obrigatórios.");
    }

    return await toggleFeedLike({
        userId,
        itemType,
        itemId
    });
}

export async function createFeedCommentService(userId, data) {
    const { itemType, itemId, comment } = data;

    if (!itemType || !itemId || !comment) {
        throw new Error("Comentário inválido.");
    }

    return await createFeedComment({
        userId,
        itemType,
        itemId,
        comment
    });
}

export async function listFeedCommentsService(itemType, itemId) {
    return await listFeedComments({
        itemType,
        itemId
    });
}