import {Capacitor} from '@capacitor/core';
import {PaletteMode} from '@mui/material';
import {Channel, Platform, RelayDict} from 'types';

export const DEFAULT_RELAYS: RelayDict = {
    'wss://relay1.nostrchat.io': {read: true, write: true},
    'wss://relay2.nostrchat.io': {read: true, write: true},
    'wss://relay.damus.io': {read: true, write: true},
    'wss://relay.snort.social': {read: true, write: false},
    'wss://nos.lol': {read: true, write: true},
};

export const MESSAGE_PER_PAGE = 30;
export const ACCEPTABLE_LESS_PAGE_MESSAGES = 5;
export const SCROLL_DETECT_THRESHOLD = 5;

export const GLOBAL_CHAT: Channel = {
    id: 'a3ac114dad9af66d5b0bccd1a3f5e4c2d4b452cc16e0fb0c009df63b636d61f8',
    name: 'Global Chat',
    about: 'Discussing freedom tech & bringing it to your hands. Just be civil...',
    picture: '',
    creator: 'npub1xfp0eu86raryz2sw53f9qnxdujm8z73c5s55d3vzkae06gz5p0dsxae7an',
    created: 1678198928
};

export const PLATFORM = Capacitor.getPlatform() as Platform;

export const DEFAULT_THEME: PaletteMode = 'dark';