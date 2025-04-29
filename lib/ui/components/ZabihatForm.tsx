import React, { useEffect, useState } from 'react';
import { Surface, Button, HelperText, TextInput, Text } from 'react-native-paper';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet } from 'react-native';
import { DatePickerModal } from 'react-native-paper-dates';
import { enGB, registerTranslation } from 'react-native-paper-dates';
import { formatDate } from '@/lib/utils';
import { styles } from '../styles';
import { useDispatch, useSelector } from 'react-redux';
import SnackbarWidget from './SnackbarWidget';
import { submitContribution } from '@/services/thaali.api';

registerTranslation('en-GB', enGB);

const ZabihatForm = ({onCompletion}) => {
    const { control, handleSubmit, formState: { errors }, setValue } = useForm();
    const [date, setDate] = useState(undefined);
    const [open, setOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        setValue('user_id', user?.id);
        setValue('type', 'ZABIHAT');
    }, [user]);

    const onDismiss = () => {
        setOpen(false);
    }

    const onConfirm = (params) => {
        if (params?.date) {
            // Set the selected date without timezone adjustments
            const selectedDate = new Date(params.date.getFullYear(), params.date.getMonth(), params.date.getDate());
            setDate(selectedDate);
            setValue('date', selectedDate);
        }
        setOpen(false);
    };
    
    

    const onSubmit = async (data) => {
        console.log(data);

        try{
            const res = await submitContribution(data);

            if (res.data) {
                setSnackbarMessage(res?.data?.message);
                setSnackbarOpen(true);
    
                setTimeout(() => {
                    onCompletion();
                }, 5000)
            }
        }
        catch(e) {
            console.log(e)
        }
    };

    return (
        <Surface style={styles.cardContainer}>
            <SnackbarWidget open={snackbarOpen} message={snackbarMessage} onDismiss={() => setSnackbarOpen(false)} hideTime={5000} />
            <Text variant="headlineSmall" style={{ marginBottom: 20 }}>Zabihat</Text>

            {/* Date Field */}
            <Controller
                control={control}
                name="date"
                rules={{ required: 'Date is required' }}
                render={({ field: { onChange, value } }) => (
                    <>
                        <Button onPress={() => setOpen(true)} uppercase={false} mode="outlined">
                            {date ? formatDate(date) : 'Select Date'}
                        </Button>
                        <DatePickerModal
                            locale="en-GB"
                            mode="single"
                            visible={open}
                            onDismiss={onDismiss}
                            date={date}
                            onConfirm={onConfirm}
                            presentationStyle="pageSheet"
                        />
                        <HelperText type="error" visible={!!errors.date}>
                            {errors.date?.message as unknown as string}
                        </HelperText>
                    </>
                )}
            />

            <Button mode="contained" onPress={handleSubmit(onSubmit)} style={{ marginTop: 20 }}>
                Submit
            </Button>
        </Surface>
    );
};

export default ZabihatForm;
