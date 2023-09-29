import {RouteComponentProps, useNavigate} from '@reach/router';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import {darken} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import {Helmet} from 'react-helmet';
import Login from 'views/components/login';
import useMediaBreakPoint from 'hooks/use-media-break-point';
import useTranslation from 'hooks/use-translation';
import react, {useEffect} from 'react';
import { createSpace } from 'space/space';

const LoginPage = (_: RouteComponentProps) => {
    
    const {isSm} = useMediaBreakPoint();
    const [t,] = useTranslation();
    const navigate = useNavigate();
    const onDone = () => navigate('/').then();
    const theme = useTheme();

    useEffect(() => {
        createSpace();
    }, []);


    return <>
    
        <Box className="drops-to-bottom-mobile" sx={{position: isSm ? 'absolute' : 'fixed', justifyContent: 'center', alignItems: 'center', bottom: isSm ? 'auto' : '3%', display: 'flex', flexDirection: 'column'}}>
            <Helmet><title>{t('Nostates - Sign in')}</title></Helmet>
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
