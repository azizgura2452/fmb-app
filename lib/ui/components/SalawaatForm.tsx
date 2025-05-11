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

const SalawaatForm = ({onCompletion}) => {
    const { control, handleSubmit, formState: { errors }, setValue } = useForm();
    const [date, setDate] = useState(undefined);
    const [open, setOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        setValue('user_id', user?.id);
        setValue('type', 'SALAWAAT');
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
        // console.log(data);
        const res = await submitContribution(data);

        if (res.data) {
            setSnackbarMessage(res?.data?.message);
            setSnackbarOpen(true);

            setTimeout(() => {
                onCompletion();
            }, 5000)
        }
    };

    return (
        <Surface style={styles.cardContainer}>
            <SnackbarWidget open={snackbarOpen} message={snackbarMessage} onDismiss={() => setSnackbarOpen(false)} hideTime={5000} />
            <Text variant="headlineSmall" style={{ marginBottom: 20 }}>Salawaat/Fateha</Text>

            {/* In the Memory of Field */}
            <Controller
                control={control}
                name="name_of"
                rules={{ required: 'This field is required' }}
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        label="In the Memory of"
                        placeholder="Enter name"
                        value={value}
                        onChangeText={onChange}
                        mode="outlined"
                        error={!!errors.memory_of}
                    />
                )}
            />
            <HelperText type="error" visible={!!errors.memory_of}>
                {errors.name_of?.message as unknown as string}
            </HelperText>

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

export default SalawaatForm;
