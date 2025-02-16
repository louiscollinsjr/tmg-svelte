import { error, json } from '@sveltejs/kit';
import { getUserSavedItemModel } from '$lib/server/models/userSavedItem';

export async function DELETE({ params, locals }) {
    if (!locals.user) {
        throw error(401, 'Unauthorized');
    }

    const UserSavedItem = getUserSavedItemModel();

    try {
        const savedItem = await UserSavedItem.findById(params.id);
        
        if (!savedItem) {
            throw error(404, 'Saved item not found');
        }

        // Ensure the user owns this saved item
        if (savedItem.userId.toString() !== locals.user._id.toString()) {
            throw error(403, 'Forbidden');
        }

        await savedItem.deleteOne();
        return json({ success: true });
    } catch (err) {
        console.error('Error deleting saved item:', err);
        throw error(500, 'Error deleting saved item');
    }
}
