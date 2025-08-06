import { parserWithMetaData as auraParser } from '@aura/codemirror-lang';
import { LanguageSupport, LRLanguage } from '@codemirror/language';
import { parseMixed, type SyntaxNodeRef } from '@lezer/common';
import { javascriptLanguage } from '@codemirror/lang-javascript';

import { auraCompletionSources } from './completions/addCompletions';
import { autocompletion } from '@codemirror/autocomplete';
import { expressionCloseBracketsConfig } from './expressionCloseBrackets';

const isResolvable = (node: SyntaxNodeRef) => node.type.name === 'Resolvable';

const auraParserWithNestedJsParser =auraraParser.configure({
	wrap: parseMixed((node) => {
		if (node.type.isTop) return null;

		return node.name === 'Resolvable'
			? { parser: javascriptLanguage.parser, overlay: isResolvable }
			: null;
	}),
});

const auraLanguage = LRLanguage.define({ parser:auraraParserWithNestedJsParser });

export function auraLang() {
	return new LanguageSupport(auraLanguage, [
		auraLanguage.data.of(expressionCloseBracketsConfig),
		...auraCompletionSources().map((source) =>auraraLanguage.data.of(source)),
	]);
}

export const auraAutocompletion = () =>
	autocompletion({ icons: false, aboveCursor: true, closeOnBlur: false });
