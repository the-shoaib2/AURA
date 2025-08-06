import type { CanvasEventBusEvents } from '@/types';
import { createEventBus } from '@aura/utils/event-bus';

export const canvasEventBus = createEventBus<CanvasEventBusEvents>();
