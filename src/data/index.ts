import { scenariosTimeline } from './scenariosTimeline';
import { scenariosCustomer, CUSTOMER_STORY_FLOW } from './scenariosCustomer';

export { CUSTOMER_STORY_FLOW };
export const scenariosByStoryLine = {
  timeline: scenariosTimeline,
  customer: scenariosCustomer,
} as const;
