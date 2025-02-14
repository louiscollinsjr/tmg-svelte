import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import mongoose from 'mongoose';
import { getReviewModel } from '$lib/server/models/review';
import { getUserModel } from '$lib/server/models/user';

export const POST: RequestHandler = async ({ params, request, locals }) => {
    try {
        const reviewId = params.id;
        const { session } = locals;

        if (!session?.user?.email) {
            return json({ error: 'User not authenticated' }, { status: 401 });
        }

        // Get user from session email
        const User = getUserModel();
        const user = await User.findOne({ email: session.user.email });

        if (!user?._id) {
            return json({ error: 'User not found' }, { status: 404 });
        }

        const Review = getReviewModel();
        
        // First, get the current review to check if user has already marked it helpful
        const review = await Review.findById(reviewId);
        if (!review) {
            return json({ error: 'Review not found' }, { status: 404 });
        }

        const userIdStr = user._id.toString();
        const hasVoted = review.helpful?.users?.some(id => id.toString() === userIdStr) || false;

        // Use findOneAndUpdate with MongoDB operators
        const updatedReview = await Review.findOneAndUpdate(
            { _id: reviewId },
            hasVoted
                ? {
                    $pull: { 'helpful.users': user._id },
                    $inc: { 'helpful.count': -1 }
                }
                : {
                    $addToSet: { 'helpful.users': user._id },
                    $inc: { 'helpful.count': 1 }
                },
            { 
                new: true,
                runValidators: false
            }
        );

        if (!updatedReview) {
            return json({ error: 'Failed to update review' }, { status: 500 });
        }

        return json({
            message: 'Helpful status updated',
            helpful: {
                count: updatedReview.helpful?.count || 0,
                isHelpful: !hasVoted
            }
        });
    } catch (error) {
        console.error('Error updating helpful status:', error);
        return json({ error: 'Internal server error' }, { status: 500 });
    }
};
