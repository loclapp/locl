/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ɵParsedMessage, ɵparseMessage } from '@angular/localize';
import { NodePath, PluginObj } from '@babel/core';
import { TaggedTemplateExpression } from '@babel/types';

import {
  isGlobalIdentifier,
  isNamedIdentifier,
  unwrapMessagePartsFromTemplateLiteral
} from '../source_file_utils';
import { Diagnostics } from '../../common/diagnostics';

export function makeEs2015ExtractPlugin(
  messages: ɵParsedMessage[],
  diagnostics: Diagnostics,
  localizeName = '$localize'
): PluginObj {
  return {
    visitor: {
      TaggedTemplateExpression(path: NodePath<TaggedTemplateExpression>) {
        const tag = path.get('tag');
        if (isNamedIdentifier(tag, localizeName) && isGlobalIdentifier(tag)) {
          const messageParts = unwrapMessagePartsFromTemplateLiteral(
            path.node.quasi.quasis
          );
          const message = ɵparseMessage(
            messageParts,
            path.node.quasi.expressions
          );
          if (!messages.find(msg => msg.messageId === message.messageId)) {
            messages.push(message);
          }
        }
      }
    }
  };
}
