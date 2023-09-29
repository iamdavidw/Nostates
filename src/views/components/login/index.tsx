import {useEffect, useState} from 'react';
import {useAtom} from 'jotai';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import {nip06, getPublicKey} from 'nostr-tools';
import {InstallNip07Dialog} from 'views/components/dialogs/no-wallet/nip07';
import ImportAccount from 'views/components/dialogs/import-account';
import MetadataForm from 'views/components/metadata-form';
import useMediaBreakPoint from 'hooks/use-media-break-point';
import useTranslation from 'hooks/use-translation';
import useModal from 'hooks/use-modal';
import {keysAtom, profileAtom, backupWarnAtom, ravenAtom, ravenStatusAtom} from 'atoms';
import Creation from 'svg/creation';
import Import from 'svg/import';
import Wallet from 'svg/wallet';
import {PLATFORM} from 'const';
import {storeKeys} from 'local-storage';
import {Keys} from 'types';
import {lighten, darken} from '@mui/material';
import {useTheme} from '@mui/material/styles';

const Login = (props: { onDone: () => void }) => {
    const {onDone} = props;
    const {isSm} = useMediaBreakPoint();
    const {isMd} = useMediaBreakPoint();
    const [t,] = useTranslation();
    const [, showModal] = useModal();
    const [, setKeys] = useAtom(keysAtom);
    const [profile, setProfile] = useAtom(profileAtom);
    const [, setBackupWarn] = useAtom(backupWarnAtom);
    const [raven] = useAtom(ravenAtom);
    const [ravenStatus] = useAtom(ravenStatusAtom);
    const [step, setStep] = useState<0 | 1 | 2>(0);
    const theme = useTheme();


    useEffect(() => {
        if (step === 1 && ravenStatus.ready) setStep(2);
    }, [step, ravenStatus.ready]);

    useEffect(() => {
        if (profile) onDone();
    }, [profile]);

    const createAccount = () => {
        const priv = nip06.privateKeyFromSeedWords(nip06.generateSeedWords());
        loginPriv(priv);
        setBackupWarn(true);
    }

    const importAccount = () => {
        showModal({
            body: <ImportAccount onSuccess={(key, type) => {
                showModal(null);
                if (type === 'priv') {
                    loginPriv(key);
                } else if (type === 'pub') {
                    proceed({priv: 'none', pub: key});
                }
            }}/>
        });
    }

    const loginNip07 = async () => {
        if (!window.nostr) {
            showModal({
                body: <InstallNip07Dialog/>
            });
            return;
        }

        const pub = await window.nostr.getPublicKey();
        if (pub) proceed({priv: 'nip07', pub});
    }

    const loginPriv = (priv: string) => {
        const pub = getPublicKey(priv);
        proceed({priv, pub});
    }

    const proceed = (keys: Keys) => {
        storeKeys(keys).then(() => {
            setKeys(keys);
            setProfile(null);
            if (keys?.priv === 'none') {
                onDone();
                return;
            }
            setStep(1);
        });
    }

    return <>
    <Box sx={{color: 'text.primary', m: '20px 0 10px 0', width: isSm ? '550px' : '100%', minWidth: '350px', fontSize: isSm ? '4rem' : isMd ? '3rem' : '3rem', fontFamily: 'Poppins', fontWeight: 700, display: 'flex', justifyContent: 'center',
        }}>{('🏳️ NoStates')}
        </Box>
        <Divider sx={{m: '28px 0', borderWidth: '2px', borderRadius: '4px'}}/>
        {(() => {
            if (step === 1) {
                return <Box sx={{display: 'flex', justifyContent: 'center'}}><CircularProgress/></Box>
            }

            if (step === 2) {
                return <>
                    <Box sx={{color: 'text.secondary', mb: '28px'}}>{t('Setup your profile')}</Box>
                    <MetadataForm
                        skipButton={<Button onClick={onDone}>{t('Skip')}</Button>}
                        submitBtnLabel={t('Finish')}
                        onSubmit={(data) => {
                            raven?.updateProfile(data).then(() => onDone());
                        }}/>
                </>
            }

            return <>
                <Box sx={{color: darken(theme.palette.text.secondary,0.5), fontFamily: 'Poppins', fontWeight: 700, mb: '28px', display: 'flex', justifyContent: 'center'}}>{t('Sign in to speak your mind')}</Box>
                <Box sx={{
                    display: 'flex',
                    flexDirection: isSm ? 'row' : 'column'
                }}>
                    <Button variant="login" size="large" disableElevation fullWidth onClick={createAccount}
                            sx={{
                                mb: '22px',
                                p: '20px 26px',
                                fontFamily: 'Poppins',
                                fontSize: '1.1rem',
                                mr: isSm ? '22px' : null,
                                border: '2px solid',
                                borderColor: 'transparent',
                                ':hover': {
                                    color: lighten(theme.palette.warning.main,0.2),
                                    border: '2px solid',
                                    borderColor: lighten(theme.palette.warning.main,0.2),
                                }
                            }}
                            startIcon={<Creation width={30}/>}>
                        {t('Create Account')}
                    </Button>
                    <Button variant="login" size="large" disableElevation fullWidth onClick={importAccount}
                            sx={{
                                mb: '22px',
                                p: '20px 26px',
                                fontFamily: 'Poppins',
                                fontSize: '1.1rem',
                                border: '2px solid',
                                borderColor: 'transparent',
                                ':hover': {
                                    color: lighten(theme.palette.primary.main,0.3),
                                    border: '2px solid',
                                    borderColor: lighten(theme.palette.primary.main,0.3),
                                }
                                }} startIcon={<Import width={30}/>}>
                        {t('Import Key')}
                    </Button>
                </Box>
                {PLATFORM === 'web' && (
                    <Button variant="login" size="large" disableElevation fullWidth onClick={loginNip07}
                            sx={{
                                p: '20px 26px',
                                fontFamily: 'Poppins',
                                fontSize: '1.1rem',
                                border: '2px solid',
                                borderColor: 'transparent',
                                ':hover': {
                                    color: lighten(theme.palette.primary.main,0.3),
                                    border: '2px solid',
                                    borderColor: lighten(theme.palette.primary.main,0.3),
                                }
                                }} startIcon={<Wallet height={30}/>}>
                        {t('Use Nostr Extension')}
                    </Button>
                )}
            </>
        })()}
    </>
}

export default Login;
