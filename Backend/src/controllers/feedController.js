import {
    getUserFeedService,
    toggleFeedLikeService,
    createFeedCommentService,
    listFeedCommentsService
} from "../services/feedService.js";

export async function getFeed(req, res) {
    try {
        const feed = await getUserFeedService(req.userId);

        return res.json({ feed });
    } catch (error) {
        return res.status(400).json({
            error: error.message
        });
    }
}

export async function toggleLike(req, res) {
    try {
        const result = await toggleFeedLikeService(req.userId, req.body);

        return res.json({
            message: result.liked ? "Curtida adicionada." : "Curtida removida.",
            liked: result.liked
        });
    } catch (error) {
        return res.status(400).json({
            error: error.message
        });
    }
}

export async function addComment(req, res) {
    try {
        const comment = await createFeedCommentService(req.userId, req.body);

        return res.status(201).json({
            message: "Comentário adicionado.",
            comment
        });
    } catch (error) {
        return res.status(400).json({
            error: error.message
        });
    }
}

export async function getComments(req, res) {
    try {
        const comments = await listFeedCommentsService(
            req.params.itemType,
            req.params.itemId
        );

        return res.json({ comments });
    } catch (error) {
        return res.status(400).json({
            error: error.message
        });
    }
}