import React from 'react';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import {useTheme} from '@mui/material/styles';
import {darken} from '@mui/material';
import CloseModal from 'components/close-modal';
import CopyToClipboard from 'components/copy-clipboard';
import useModal from 'hooks/use-modal';
import useTranslation from 'hooks/use-translation';
import IconButton from '@mui/material/IconButton';
import ContentCopy from 'svg/content-copy';
import {Channel} from 'types';


const Invite = (props: { channel: Channel }) => {
    const theme = useTheme();
    const {channel} = props;
    const [, showModal] = useModal();
    const [t] = useTranslation();

    const handleClose = () => {
        showModal(null);
    };

    const url = `${window.location.protocol}//${window.location.host}/channel/${channel.id}`;

    return (
        <>
        <Box sx={{backgroundColor: darken(theme.palette.primary.dark,0.3)}}>
            <DialogTitle>{t('Invite Friends & Family  👨‍👩‍👧‍👦')}<CloseModal onClick={handleClose}/></DialogTitle>
            <DialogContent>
                <Box sx={{pt: '10px'}}>
                    <TextField
                        label="Invitation Link"
                        value={url}
                        fullWidth
                        InputProps={{
                            endAdornment: <InputAdornment position="end">
                                <CopyToClipboard copy={url}>
                                    <IconButton><ContentCopy height={18}/></IconButton>
                                </CopyToClipboard>
                            </InputAdornment>,
                        }}
                    />
                </Box>
            </DialogContent>
        </Box>    
        </>
    );
}

export default Invite;
