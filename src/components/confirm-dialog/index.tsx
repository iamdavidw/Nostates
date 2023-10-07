import React from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';
import {darken} from '@mui/material';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import {DialogContentText} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import useTranslation from '../../hooks/use-translation';
import useModal from '../../hooks/use-modal';
import CloseModal from '../close-modal';

const ConfirmDialog = (props: {onConfirm: () => void}) => {
    const [t] = useTranslation();
    const [, showModal] = useModal();
    const theme = useTheme();

    const handleClose = () => {
        showModal(null);
    };

    const handleConfirm = () => {
        props.onConfirm();
        showModal(null);
    }

    return (
        <>
        <Box sx={{backgroundColor: darken(theme.palette.secondary.dark,0.4)}}>
            <DialogTitle >{t('Confirmation')}
                <CloseModal onClick={handleClose}/>
            </DialogTitle>
            <DialogContent>
                <DialogContentText>{t('Are you sure you want to do this?')}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>{t('Cancel')}</Button>
                <Button onClick={handleConfirm}>{t('Confirm')}</Button>
            </DialogActions>
        </Box>
        </>
    );
}

export default ConfirmDialog;
