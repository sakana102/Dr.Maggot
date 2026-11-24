class TrieNode {
    children: Map<string, TrieNode>;
    isEnd: boolean;

    constructor() {
        this.children = new Map<string, TrieNode>();
        this.isEnd = false;
    }
}

export class Trie {
    private root: TrieNode;

    constructor(words: Iterable<string>) {
        this.root = new TrieNode();
        for (const word of words) {
            this.add(word);
        }
    }

    add(word: string) {
        if (word === "") {
            return;
        }

        let node = this.root;
        for (const char of word) {
            let next = node.children.get(char);
            if (!next) {
                next = new TrieNode();
                node.children.set(char, next);
            }
            node = next;
        }
        node.isEnd = true;
    }

    includes(text: string): boolean {
        const chars = Array.from(text);
        for (let i = 0; i < chars.length; i++) {
            let node = this.root;
            for (let j = i; j < chars.length; j++) {
                const next = node.children.get(chars[j]!);
                if (!next) break;
                if (next.isEnd) return true;
                node = next;
            }
        }
        return false;
    }
}
