import React, {useEffect} from 'react';
import {useAtom} from 'jotai';
import useTranslation from 'hooks/use-translation';
import {useLocation} from '@reach/router';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {useTheme} from '@mui/material/styles';
import UserMenu from 'views/components/app-menu/user-menu';
import useMediaBreakPoint from 'hooks/use-media-break-point';
import useStyles from 'hooks/use-styles';
import {appMenuAtom} from 'atoms';
import ArrowLeft from 'svg/arrow-left';
import useModal from 'hooks/use-modal';
import {keysAtom} from 'atoms';
import {removeKeys} from 'local-storage';
import ConfirmDialog from 'components/confirm-dialog';
import Invite from 'views/channel/components/dialogs/invite';
import useLiveChannel from 'hooks/use-live-channel';

const AppMenuBase = (props: { children: React.ReactNode }) => {
    const [t] = useTranslation();
    const theme = useTheme();
    const styles = useStyles();
    const {isMd} = useMediaBreakPoint();
    const [appMenu, setAppMenu] = useAtom(appMenuAtom);
    const location = useLocation();
    const [, showModal] = useModal();
    const [keys, setKeys] = useAtom(keysAtom);
    const channel = useLiveChannel();

    useEffect(() => {
        if (appMenu) {
            setAppMenu(false);
        }
    }, [location]);

    const isSmallScreen = !isMd;

    if (isSmallScreen && !appMenu) {
        return null;
    }

    const logout = () => {
        showModal({
            body: <ConfirmDialog onConfirm={() => {
                removeKeys().then();
                setKeys(null);
                window.location.href = '/';
            }}/>
        });
    }

    const invite = () => {
        if (!channel) {return};
        showModal({
            body: <Invite channel={channel}/>
        });
    }

    return <Box sx={{
        height: '100%',
        width: styles.sideBarWidth,
        p: '0 16px',
        flexShrink: 0,
        flexGrow: 0,
        borderRight: `1px solid ${theme.palette.divider}`,
        display: 'flex',
        justifyContent: 'space-between',
    }}>
        <Box sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
        }}>
            <UserMenu/>
            <Box sx={{
                height: `calc(100% - calc(${styles.headerHeight} + ${styles.sideBarFooterHeight}))`,
                flexShrink: 0,
                ...styles.scrollY
            }}>
                {props.children}
            </Box>
            <Box sx={{
                height: styles.sideBarFooterHeight,
                pt: '10px',
                flexShrink: 0,
                display: 'flex',
                fontSize: '0.8em',
                color: theme.palette.text.disabled
            }}>
                <Box sx={{gap: '20px', display: 'flex', flexDirection: 'row'}}>
                    <Button sx={{ bottom: '30px', left: '10px'}} variant="contained" color="secondary" onClick={logout}>{t('Logout')}</Button>
                    <Button sx={{ bottom: '30px', visibility: channel ? 'visible' : 'hidden'}} variant="contained" onClick={invite}>{t('Invite')}</Button>
                </Box>
            </Box>
        </Box>
    </Box>
}

export default AppMenuBase;
