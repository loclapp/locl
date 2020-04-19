import { ɵMessageId, ɵTargetMessage } from '@angular/localize';

export interface ParsedTranslationBundle {
  locale: string;
  translations: Record<ɵMessageId, ɵTargetMessage>;
}
