export type auraLocaleTranslateFnOptions = string[] | Record<string, unknown>;

export type auraLocaleTranslateFn = (path: string, options?: auraLocaleTranslateFnOptions) => string;

export type auraLocale = Record<string, string | ((...args: unknown[]) => string)>;
