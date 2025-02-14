import type { LayoutServerLoad } from './$types';
import { getUserModel } from '$lib/server/models/user';
import { getUserSavedItemModel } from '$lib/server/models/userSavedItem';
import type { UserSavedItem } from '$lib/server/models/userSavedItem';
import mongoose from 'mongoose';
import type { ObjectId } from 'mongodb';

function serializeDocument(doc: any): any {
	if (!doc) return doc;

	if (Array.isArray(doc)) {
		return doc.map((item) => serializeDocument(item));
	}

	if (typeof doc === 'object') {
		const serialized: any = {};
		for (const [key, value] of Object.entries(doc)) {
			if (value instanceof mongoose.Types.ObjectId) {
				serialized[key] = value.toString();
			} else if (value instanceof Date) {
				serialized[key] = value.toISOString();
			} else if (typeof value === 'object' && value !== null) {
				serialized[key] = serializeDocument(value);
			} else {
				serialized[key] = value;
			}
		}
		return serialized;
	}

	return doc;
}

export const load: LayoutServerLoad = async ({ locals }) => {
	try {
		const session = await locals.auth();
		const User = getUserModel();

		console.log('LayoutServer Load: Session object:', session);
		let userData = null;

		if (session?.user) {
			try {
				userData = await getUserModel().findById(session.user.id).lean();
				console.log('LayoutServer Load: User data by id:', userData);
			} catch (e) {
				console.error('Error finding user by _id:', e);
			}
		}

		// If not found by _id, try email
		if (!userData && session?.user?.email) {
			userData = await User.findOne({ email: session.user.email }).lean();
			console.log('LayoutServer Load: Found user by email:', userData);
		}

		let savedItems: UserSavedItem[] = [];

		if (userData?._id) {
			// Fetch user's saved items using mongoose model
			const UserSavedItem = getUserSavedItemModel();
			savedItems = await UserSavedItem.find({ 
				userId: userData._id
			}).lean();
		}

		return {
			session,
			userData: serializeDocument(userData),
			savedItems: savedItems.map(item => ({
				...item,
				_id: item._id.toString(),
				userId: item.userId.toString(),
				itemId: item.itemId.toString()
			}))
		};
	} catch (e) {
		console.error('Error loading layout:', e);
		throw e;
	}
};