import React, {useEffect, useMemo} from 'react';
import {useAtom} from 'jotai';
import {RouteComponentProps, useNavigate} from '@reach/router';
import {nip19} from 'nostr-tools';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import {darken} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import {Helmet} from 'react-helmet';
import useTranslation from 'hooks/use-translation';
import AppWrapper from 'views/components/app-wrapper';
import AppContent from 'views/components/app-content';
import SettingsHeader from 'views/settings/components/settings-header';
import SettingsContent from 'views/settings/components/settings-content';
import SettingsMenu from 'views/settings/components/settings-menu';
import {keysAtom} from 'atoms';
import CopyToClipboard from 'components/copy-clipboard';
import ContentCopy from 'svg/content-copy';
import Information from 'svg/information';


const SettingsPublicLinkPage = (_: RouteComponentProps) => {
    const [keys] = useAtom(keysAtom);
    const navigate = useNavigate();
    const [t] = useTranslation();
    const theme = useTheme();
    useEffect(() => {
        if (!keys) navigate('/login').then();
    }, [keys]);

    const npub = useMemo(() => keys ? nip19.npubEncode(keys.pub) : null, [keys]);

    if (!keys) return null;

    const url = `${window.location.protocol}//${window.location.host}/dm/${npub}`;

    return <>
        <Helmet><title>{t('NoStates - Public Profile')}</title></Helmet>
        <AppWrapper>
            <SettingsMenu/>
            <AppContent>
                <SettingsHeader section={t('Public Profile')}/>
                <SettingsContent>
                    <Box sx={{
                        mb: '20px',
                        color: darken(theme.palette.text.secondary,0.5),
                        fontSize: '0.8em',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <Information height={18}/>
                        <Box sx={{ml: '6px', color: darken(theme.palette.text.secondary,0.5), fontWeight: 700}}>
                        {t('Your public profile allows people to get in contact with you easily via direct message.')}
                            </Box>
                    </Box>

                    <TextField value={url} fullWidth
                               InputProps={{
                                   readOnly: true,
                                   endAdornment: <InputAdornment position="end">
                                       <CopyToClipboard copy={url}>
                                           <IconButton>
                                               <ContentCopy height={22}/>
                                           </IconButton>
                                       </CopyToClipboard>
                                   </InputAdornment>
                               }}
                    />

                </SettingsContent>
            </AppContent>
        </AppWrapper>
    </>;
}

export default SettingsPublicLinkPage;
