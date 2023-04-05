import { MessageId, TargetMessage } from '@angular/localize';

export interface ParsedTranslationBundle {
  locale: string;
  translations: Record<MessageId, TargetMessage>;
}
