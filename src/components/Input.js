import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: '25ch',
    },
}));


const InputField = () => {
    const classes = useStyles();

    return (
       <>
            <TextField
                id="standard-full-width"
                size="small"
                label="Nro de Cuil"
                fullWidth
                margin="normal"
                InputLabelProps={{
                shrink: true,
                }}
            />
       </>
    )

}

export default InputField;