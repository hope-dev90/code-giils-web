import { gihangaStory } from './gihanga';
import { nyirarucyabaStory } from './nyirarucyaba';
import { ruganzuStory } from './ruganzu';
import { kigeliStory } from './kigeli';

export const STORY_LIBRARY = [gihangaStory, nyirarucyabaStory, ruganzuStory, kigeliStory];
export const STORY_BY_ID = Object.fromEntries(STORY_LIBRARY.map((story) => [story.id, story]));

// Keep rewards from older browser-saved orders readable after moving rewards to
// the shared story library.
export const LEGACY_PRODUCT_STORY_IDS = {
  bracelet: 'nyirarucyaba',
  'story-pen': 'gihanga-ngomijana',
  polo: 'kigeli-iv-rwabugiri',
};

export function getRewardStory(id) {
  return STORY_BY_ID[id] || STORY_BY_ID[LEGACY_PRODUCT_STORY_IDS[id]] || null;
}
