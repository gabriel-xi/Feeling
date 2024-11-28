const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sentimento: { type: String, required: true },
    note: { type: String },
    reactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            comment: { type: String },
            createdAt: { type: Date, default: Date.now },
        },
    ],
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);