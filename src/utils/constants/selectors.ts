const UNSUPPORTED = ":not(*)";

type PlatformSelector = Readonly<Record<Platform, string>>;

export const Selectors = {
    video: {
        player: {
            youtube: "#movie_player",
            twitch: '[data-a-target="video-player"] > .video-player__container',
            kick: "#injected-embedded-channel-player-video > div",
            mellowfan: UNSUPPORTED, // TODO: セレクタを調べる
            twicas: ".tw-player",
        },
    },

    chat: {
        container: {
            youtube: "#items",
            twitch: '[data-test-selector="chat-scrollable-area__message-container"]',
            kick: "#chatroom-messages > div.no-scrollbar",
            mellowfan: UNSUPPORTED, // TODO: セレクタを調べる
            twicas: ".tw-comment-list-view__scroller > div",
        },

        cell: {
            youtube: "yt-live-chat-text-message-renderer, yt-live-chat-paid-message-renderer",
            twitch: '[data-a-target="chat-line-message"], .video-chat__message-list-wrapper li',
            kick: "#chatroom-messages > div.no-scrollbar > div[data-index]",
            mellowfan: UNSUPPORTED, // TODO: セレクタを調べる
            twicas: ".tw-comment-item",
        },

        quickBlockAnchor: {
            youtube: "#menu",
            twitch: ".chat-line__icons, div.vod-message",
            kick: ".group",
            mellowfan: UNSUPPORTED, // TODO: セレクタを調べる
            twicas: ".tw-comment-item-dropdown",
        },

        contents: {
            youtube: "#message",
            twitch: '[data-a-target="chat-line-message-body"], .video-chat__message > span[class=""]',
            kick: ".font-normal",
            mellowfan: UNSUPPORTED, // TODO: セレクタを調べる
            twicas: ".tw-comment-item-comment",
        },

        username: {
            youtube: "#author-name",
            twitch: "[data-a-user]",
            kick: 'button[class="inline font-bold"]',
            mellowfan: UNSUPPORTED, // TODO: セレクタを調べる
            twicas: ".tw-comment-item-name",
        },

        messages: {
            youtube: "#message",
            twitch: ".text-fragment",
            kick: ".font-normal",
            mellowfan: UNSUPPORTED, // TODO: セレクタを調べる
            twicas: ".tw-comment-item-comment > span",
        },

        emotes: {
            youtube: ".emoji",
            twitch: 'img[class*="chat-line__message--emote"]',
            kick: "[data-emote-id][data-emote-name] img",
            mellowfan: UNSUPPORTED, // TODO: セレクタを調べる
            twicas: UNSUPPORTED,
        },
    },
} as const satisfies Record<string, Record<string, PlatformSelector>>;

export type WebSelectors = typeof Selectors;
