import { parseRegExp } from "../../utils/parse-regexp";
import { Trie } from "./trie";

type Matchers = {
    wordTrie: Trie;
    wordRegExps: RegExp[];
    userSet: Set<string>;
    userRegExps: RegExp[];
    emoteSet: Set<string>;
    emoteRegExps: RegExp[];
};

export class ChatFilter {
    private platform: Platform;
    private settings: FilterSettings;
    private segmenter: Intl.Segmenter;
    private unwatchers: (() => void)[];
    private matchers: Matchers;

    constructor(platform: Platform) {
        this.platform = platform;
        this.settings = FilterSettingsSchema.parse({});
        this.segmenter = new Intl.Segmenter();
        this.unwatchers = [];
        this.matchers = {
            wordTrie: new Trie([]),
            wordRegExps: [],
            userSet: new Set(),
            userRegExps: [],
            emoteSet: new Set(),
            emoteRegExps: [],
        };
    }

    run(node: Element) {
        if (!this.settings.enable[this.platform]) {
            return;
        }

        if (
            this.checkCharLimit(node) ||
            this.checkEmoteLimit(node) ||
            this.containsBlockWord(node) ||
            this.containsBlockUser(node) ||
            this.containsBlockEmote(node)
        ) {
            this.deleteContents(node);
        }
    }

    public async start() {
        await Promise.all([
            this.watch("local:FilterSettings", (value) => {
                this.settings = FilterSettingsSchema.parse(value);
            }),
            this.watch("local:BlockedWordLists", (value) => {
                const { texts, regexps } = this.compileBlocklists(value);
                this.matchers.wordTrie = new Trie(texts);
                this.matchers.wordRegExps = regexps;
            }),
            this.watch("local:BlockedUserLists", (value) => {
                const { texts, regexps } = this.compileBlocklists(value);
                this.matchers.userSet = new Set(texts);
                this.matchers.userRegExps = regexps;
            }),
            this.watch("local:BlockedEmoteLists", (value) => {
                const { texts, regexps } = this.compileBlocklists(value);
                this.matchers.emoteSet = new Set(texts);
                this.matchers.emoteRegExps = regexps;
            }),
        ]);
    }

    public stop() {
        for (const unwatch of this.unwatchers) {
            unwatch();
        }
        this.unwatchers = [];
    }

    public checkCharLimit(node: Element): boolean {
        const limit = this.settings.characterLimit[this.platform];
        const messages = node.querySelectorAll(Selectors.chat.messages[this.platform]);
        const compiled = this.compileMessages(messages);

        // 👨‍👩‍👧 のような結合絵文字は見た目は一文字でも、複数のコードポイントでできているので複数文字とカウントされる。
        // そのため Intl.Segmenter を使用して正確に文字数をカウントする。
        const length = Array.from(this.segmenter.segment(compiled)).length;

        if (0 < limit.less && length <= limit.less) return true;
        if (0 < limit.more && limit.more <= length) return true;
        return false;
    }

    public checkEmoteLimit(node: Element): boolean {
        const limit = this.settings.emoteLimit[this.platform];
        const emotes = node.querySelectorAll(Selectors.chat.emotes[this.platform]);
        if (0 < limit.less && emotes.length <= limit.less) return true;
        if (0 < limit.more && limit.more <= emotes.length) return true;
        return false;
    }

    public containsBlockWord(node: Element): boolean {
        const messages = node.querySelectorAll(Selectors.chat.messages[this.platform]);
        const compiled = this.compileMessages(messages);

        if (this.matchers.wordTrie.includes(compiled)) {
            return true;
        }

        for (const regexp of this.matchers.wordRegExps) {
            if (regexp.test(compiled)) {
                return true;
            }
        }

        return false;
    }

    public containsBlockUser(node: Element): boolean {
        const username = node.querySelector(Selectors.chat.username[this.platform])?.textContent;
        if (!username) return false;

        if (this.matchers.userSet.has(username)) {
            return true;
        }

        for (const regexp of this.matchers.userRegExps) {
            if (regexp.test(username)) {
                return true;
            }
        }

        return false;
    }

    public containsBlockEmote(node: Element): boolean {
        const emotes = node.querySelectorAll(Selectors.chat.emotes[this.platform]);
        const compiled = this.compileEmotes(emotes);

        for (const emote of compiled) {
            if (this.matchers.emoteSet.has(emote)) {
                return true;
            }

            for (const regexp of this.matchers.emoteRegExps) {
                if (regexp.test(emote)) {
                    return true;
                }
            }
        }

        return false;
    }

    private compileBlocklists(value: unknown) {
        const lists = BlocklistsSchema.parse(value);
        const blocklists = [...lists["global"], ...lists[this.platform]];
        const texts: string[] = [];
        const regexps: RegExp[] = [];

        for (const entry of blocklists) {
            if (entry.enabled) {
                const regexp = parseRegExp(entry.value);
                if (regexp) {
                    regexps.push(regexp);
                } else {
                    texts.push(entry.value);
                }
            }
        }

        return { texts, regexps };
    }

    private async watch(key: StorageItemKey, apply: (value: unknown) => void) {
        let changed = false;
        this.unwatchers.push(
            storage.watch(key, (value) => {
                changed = true;
                apply(value);
            }),
        );

        const item = await storage.getItem(key);
        if (!changed) {
            apply(item);
        }
    }

    private compileMessages(nodes: NodeListOf<Element>): string {
        const array = Array.from(nodes, (node) => node.textContent ?? "");
        return array.join("");
    }

    private compileEmotes(nodes: NodeListOf<Element>): string[] {
        const array = Array.from(nodes, (node) => node.getAttribute("alt"));
        return array.filter((alt): alt is string => !!alt);
    }

    public deleteContents(node: Element) {
        if (this.settings.deletionScope[this.platform]) {
            const element = node as HTMLElement;
            element.hidden = true;
            element.style.display = "none";
        } else {
            const contents = node.querySelector<HTMLElement>(Selectors.chat.contents[this.platform]);
            if (contents) {
                contents.hidden = true;
                contents.style.display = "none";
            }
        }
    }
}
