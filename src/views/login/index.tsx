import {RouteComponentProps, useNavigate} from '@reach/router';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import {darken} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import {Helmet} from 'react-helmet';
import Login from 'views/components/login';
import useMediaBreakPoint from 'hooks/use-media-break-point';
import useTranslation from 'hooks/use-translation';
import {useEffect} from 'react';
import { createSpace } from 'space/space';

const LoginPage = (_: RouteComponentProps) => {
    const {isMd} = useMediaBreakPoint();
    const {isSm} = useMediaBreakPoint();
    const [t,] = useTranslation();
    const navigate = useNavigate();
    const onDone = () => navigate('/').then();
    const theme = useTheme();

    useEffect(() => {
        createSpace();
    }, []);


    return <>

        <Box className="drops-to-bottom-mobile" sx={{position: isSm ? 'absolute' : 'fixed', alignItems: 'center', bottom: isSm ? 'auto' : '3%', display: 'flex', flexDirection: 'column'}}>
            <Helmet><title>{t('NoStates - Sign in')}</title></Helmet>
            <Box className="star-wars-effect" sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: '20px',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '20px 0 50px 0',
            }}>
                <Box component="img" sx={{
                    width: '100px',
                    height: '100px',
                }} src='/logo512.png' alt='NoStates Logo'/>
                <Box sx={{
                    color: 'text.primary',
                    fontSize: isSm ? '4rem' : isMd ? '3rem' : '3rem',
                    fontFamily: 'Rubik',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                }}>{('NoStates')}
                </Box>
            </Box>
            
            <Box sx={{ 
                width: isSm ? '590px' : '90%',
            }}>
                <Card sx={{
                    backgroundColor: darken(theme.palette.secondary.dark,0.7),
                    p: '26px 32px 46px 32px',
                }}>
                    <Login onDone={onDone}/>
                </Card>
            </Box>
        </Box>
    </>;
}

export default LoginPage;
