import React, {useEffect, useRef, useState} from 'react';
import {Box, darken} from '@mui/material';
import Divider from '@mui/material/Divider';
import {useTheme} from '@mui/material/styles';
import Button from '@mui/material/Button';
import {useAtom} from 'jotai';
import useMediaBreakPoint from 'hooks/use-media-break-point';
import MessageView from 'views/components/message-view';
import useStyles from 'hooks/use-styles';
import useTranslation from 'hooks/use-translation';
import {formatMessageDate, formatMessageTime} from 'helper';
import {Message} from 'types';
import {SCROLL_DETECT_THRESHOLD} from 'const';
import {keysAtom, ravenAtom, readMarkMapAtom, tempPrivAtom} from 'atoms';
import {notEmpty} from 'util/misc';

const ChatView = (props: { messages: Message[], separator: string, loading?: boolean, isDM?: boolean }) => {
    const {isSm} = useMediaBreakPoint();
    const {isMd} = useMediaBreakPoint();
    const {separator, messages, loading, isDM} = props;
    const theme = useTheme();
    const styles = useStyles();
    const [t] = useTranslation();
    const ref = useRef<HTMLDivElement | null>(null);
    const [isAtBottom, setIsAtBottom] = useState(true);
    const [firstMessageEl, setFirstMessageEl] = useState<HTMLDivElement | null>(null);
    const [scrollTop, setScrollTop] = useState<number>(0);
    const [raven] = useAtom(ravenAtom);
    const [keys] = useAtom(keysAtom);
    const [tempPriv] = useAtom(tempPrivAtom);
    const [readMarkMap] = useAtom(readMarkMapAtom)

    const scrollToBottom = () => {
        ref.current!.scroll({top: ref.current!.scrollHeight, behavior: 'auto'});
    }

    useEffect(() => {
        if (ref.current && isAtBottom) {
            scrollToBottom();
        }
    }, [messages]);

    useEffect(() => {
        scrollToBottom();
    }, [separator]);

    useEffect(() => {
        if (isAtBottom && keys?.priv !== 'none') {
            if (messages.length === 0) return;

            if (readMarkMap[separator] === undefined) {
                raven?.updateReadMarkMap({...readMarkMap, ...{[separator]: Math.floor(Date.now() / 1000)}});
                return;
            }

            const lMessage = messages[messages.length - 1];
            if (lMessage.created > readMarkMap[separator]) {
                raven?.updateReadMarkMap({...readMarkMap, ...{[separator]: Math.floor(Date.now() / 1000)}});
            }
        }
    }, [separator, isAtBottom, messages, readMarkMap, keys]);

    useEffect(() => {
        let scrollTimer: any;
        const div = ref.current;

        const handleScroll = () => {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(() => {
                setScrollTop(div!.scrollTop);
                const isAtBottom = Math.abs((div!.scrollHeight - div!.scrollTop) - div!.clientHeight) <= SCROLL_DETECT_THRESHOLD
                setIsAtBottom(isAtBottom);
                const isAtTop = (div!.scrollHeight > div!.clientHeight) && div!.scrollTop < SCROLL_DETECT_THRESHOLD;
                if (isAtTop) {
                    window.dispatchEvent(new Event('chat-view-top', {bubbles: true}))
                }
            }, 50);
        }

        div?.addEventListener('scroll', handleScroll);
        return () => {
            div?.removeEventListener('scroll', handleScroll);
        }
    }, []);

    useEffect(() => {
        const imageLoaded = () => {
            if (ref.current && isAtBottom) {
                scrollToBottom();
            }
        }

        window.addEventListener('chat-media-loaded', imageLoaded);
        return () => {
            window.removeEventListener('chat-media-loaded', imageLoaded)
        }
    }, [isAtBottom]);

    useEffect(() => {
        // After loading new messages, scrolls to the first one of them.
        if (loading) {
            setFirstMessageEl(ref.current!.querySelector('.message') as HTMLDivElement);
        } else {
            if (firstMessageEl) {
                if (firstMessageEl.previousSibling) {
                    (firstMessageEl.previousSibling as HTMLDivElement).scrollIntoView(true);
                }
                setFirstMessageEl(null);
            }
        }
    }, [loading]);

    useEffect(() => {
        // Listen messages visible in the screen for threads and reactions.
        const messageIds = Array.from(document.querySelectorAll('.message[data-visible=true]')).map(el => el.getAttribute('data-id')).filter(notEmpty);
        if (messageIds.length === 0) return;

        // Watching reactions' event ids to get updated if others users delete their reactions.
        // It's enough to watch reactions in last 10 minutes.
        // Otherwise, it can be impossible to get response from relays if there is a lot of reactions related to the message.
        const now = Math.floor(Date.now() / 1000)
        const relIds = messageIds.map(m => messages.find(x => x.id === m)?.reactions?.filter(x => x.creator !== keys?.pub).filter(l => now - l.created <= 600).map(l => l.id) || []).flat();

        let interval: any;
        const timer = setTimeout(() => {
            raven?.listenMessages(messageIds, relIds);
            interval = setInterval(() => {
                raven?.listenMessages(messageIds, relIds);
            }, 10000);
        }, 500);

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        }
    }, [raven, messages, scrollTop]);

    useEffect(() => {
        // Observe chat view size change and keep scrolled to bottom
        if (!ref.current) return;

        const observer = new ResizeObserver(() => {
            if (ref.current && isAtBottom) {
                scrollToBottom();
            }
        });

        observer.observe(ref.current);

        return () => {
            observer.disconnect();
        }
    }, [isAtBottom]);

    return <Box ref={ref} sx={{
        mb: 'auto',
        fontFamily: 'Poppins',
        paddingBottom: '20px',
        ...styles.scrollY,
    }}>
        {messages.map((msg, i) => {
            const prevMsg = messages[i - 1];
            const msgDate = formatMessageDate(msg.created);
            const prevMsgDate = prevMsg ? formatMessageDate(prevMsg.created) : null;
            const isCompact = prevMsg ? msg.creator === prevMsg?.creator && formatMessageTime(msg.created) === formatMessageTime(prevMsg.created) : false;

            if (msgDate !== prevMsgDate) {
                return <React.Fragment key={msg.id}>
                    <Divider
                        sx={{
                            m: isSm ? '20px 24px' : '10px 24px',
                            fontSize: '0.7em',
                            color: darken(theme.palette.text.secondary, 0.4),
                            mt: i === 0 ? '20px' : null,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            
                            '::before': i === 0 ? {display: 'none'} : {},
                            '::after': i === 0 ? {display: 'none'} : {}
                        }}>{msgDate}</Divider>
                    <MessageView message={msg} dateFormat='time' compactView={isCompact}/>
                </React.Fragment>
            }

            return <MessageView key={msg.id} message={msg} dateFormat='time' compactView={isCompact}/>;
        })}
        {(isDM && keys?.priv === 'none' && !tempPriv) && (
            <Box sx={{
                textAlign: 'center',
                m: '20px 0'
            }}>
                <Button variant="contained" onClick={() => {
                    window.requestPrivateKey().then();
                }}>{t('Decrypt chat')}</Button>
            </Box>
        )}
    </Box>;
}

export default ChatView;
