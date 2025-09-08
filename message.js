import { Message } from "../models/message.js"

const getMessages = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { page = 1 } = req.query; // Default to page 1 if not provided

        // Paginate messages, 5 per page
        const options = {
            page: parseInt(page, 10),
            limit: 7,
            populate: { path: 'sender', select: 'username avatar' }, // Populates sender info
            sort: { createdAt: -1 } // Sort by most recent messages first
        };

        const messagesResult = await Message.paginate({ chat: id }, options);

        const transformed = messagesResult.docs.reverse().map(({ sender, _id, createdAt, content, attachments,readBy }) => ({
            _id,
            createdAt,
            content,
            attachments,
            readBy,
            sender: {
                _id: sender._id,
                username: sender.username,
                avatar: sender.avatar?.url // Handle potential null or undefined avatar
            }
        }));

        res.status(200).json({
            success: true,
            messages: transformed,
            totalPages: messagesResult.totalPages,
            currentPage: messagesResult.page,
            totalMessages: messagesResult.totalDocs
        });
    } catch (error) {
        next(error);
    }
};


export { getMessages }