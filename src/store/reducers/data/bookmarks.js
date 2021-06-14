import * as types from "store/actions/types";
import { uniqueArrayMerge } from "utils";

const initState = [];

const bookmark = (state = initState, action) => {
    switch (action.type) {
        case types.BOOKMARK_CREATED: {
            const { bookmark } = action.payload;
            return [...state, { ...bookmark, isDisplayed: true, isSelected: false }];
        } case types.BOOKMARKS_DELETED: {
            const { bookmarkIds } = action.payload;
            return state.filter(b => !bookmarkIds.includes(b.bookmarkId));
        } case types.BOOKMARK_EDITED: {
            const { bookmark } = action.payload;
            return state.map(b => b.bookmarkId === bookmark.bookmarkId ? { ...b, ...bookmark } : bookmark);
        } case types.BOOKMARKS_FILTERED: {
            const { bookmarks } = action.payload;
            return state.map(b => ({ ...b, isDisplayed: bookmarks === null ? true : bookmarks.some(filtered => filtered.bookmarkId === b.bookmarkId) }));
        } case types.BOOKMARKS_RETRIEVED: {
            const { bookmarks } = action.payload;
            return bookmarks.length > 0 ? state.concat(bookmarks) : state;
        } case types.BOOKMARK_SELECTED: {
            const { bookmarkId } = action.payload;
            return state.map(b => b.bookmarkId === bookmarkId ? { ...b, isSelected: !b.isSelected } : b);
        } case types.BOOKMARKS_UNSELECTED: {
            return state.map(b => ({ ...b, isSelected: false }));
        } case types.BOOKMARK_VIEWED: {
            const { bookmarkId } = action.payload;
            return state.map(b => b.bookmarkId === bookmarkId ? { ...b, views: +b.views + 1 } : b);
        } case types.TAGS_UPDATED: {
            const { bookmarkIds, addedTags, removedTags, dateModified } = action.payload;
            return state.map(b => bookmarkIds.includes(b.bookmarkId) ? {
                    ...b,
                    tags: uniqueArrayMerge(b.tags, addedTags).filter(tag => !removedTags.includes(tag)),
                    dateModified
                } : b);
        } case types.RESET: {
            return initState;
        } default: {
            return state;
        }
    }
};

export default bookmark;