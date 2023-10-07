import React, {useState} from 'react';
import {useAtom} from 'jotai';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import useTranslation from 'hooks/use-translation';
import {ravenAtom} from 'atoms';
import Send from 'svg/send';

const DmInput = (props: { pubkey: string, onDM: () => void }) => {
    const {pubkey, onDM} = props;
    const [message, setMessage] = useState('');
    const [raven] = useAtom(ravenAtom);
    const [t] = useTranslation();

    const send = () => {
        if (message.trim() !== '') {
            raven?.sendDirectMessage(pubkey, message).then(() => {
                setMessage('');
                onDM();
            });
        }
    }

    return <TextField
        sx={{mt:'16px'}}
        autoComplete="off"
        InputProps={{
            sx: {
                fontSize: '16px',
                px: '10px'
            },
            endAdornment: <>
                <Button variant="contained" size="small" color="primary" sx={{
                    minWidth: 'auto',
                    width: '40px',
                    height: '40px',
                    padding: '10px',
                    marginTop: '10px',
                    marginBottom: '10px',
                    marginRight: '10px',
                    borderRadius: '10px'
                }} onClick={send}><Send height={28}/></Button>
            </>
        }}
        size="small"
        fullWidth
        placeholder={t('Send direct message')}
        value={message}
        onChange={(e) => {
            setMessage(e.target.value);
        }}
        onKeyUp={(e) => {
            if (e.key === 'Enter') {
                send();
            }
        }}
    />
}

export default DmInput;
