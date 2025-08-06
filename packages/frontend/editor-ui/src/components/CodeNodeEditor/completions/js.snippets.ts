import { snippets } from '@codemirror/lang-javascript';
import { completeFromList, snippetCompletion } from '@codemirror/autocomplete';

/**
 * https://github.com/codemirror/lang-javascript/blob/main/src/snippets.ts
 */
export const jsSnippets = completeFromList([
	...snippets.filter((snippet) => snippet.label !== 'class'),
	// eslint-disable-next-line aura-local-rules/no-interpolation-in-regular-string
	snippetCompletion('console.log(${arg})', { label: 'console.log()' }),
	snippetCompletion('DateTime', { label: 'DateTime' }),
	snippetCompletion('Interval', { label: 'Interval' }),
	snippetCompletion('Duration', { label: 'Duration' }),
]);
