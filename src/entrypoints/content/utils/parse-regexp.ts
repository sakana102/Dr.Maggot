const REGEXP_LITERAL = /^\/(.+)\/([dgimsuvy]*)$/;

export function parseRegExp(text: string): RegExp | null {
    const match = REGEXP_LITERAL.exec(text);
    if (!match) return null;

    const [, pattern = "", flags = ""] = match;
    try {
        return new RegExp(pattern, flags.replace(/[gy]/g, ""));
    } catch {
        return null;
    }
}
