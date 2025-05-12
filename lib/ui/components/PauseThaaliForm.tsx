import React, { useEffect, useState } from 'react';
import { Surface, Button, HelperText, TextInput, Text, Snackbar, Portal } from 'react-native-paper';
import { Controller, useForm } from 'react-hook-form';
import { Alert, StyleSheet } from 'react-native';
import { DatePickerModal } from 'react-native-paper-dates';
import { enGB, registerTranslation } from 'react-native-paper-dates'
import { formatDate } from '@/lib/utils';
import { styles } from '../styles';
import { getThaaliData, pauseThaali } from '@/services/thaali.api';
import { useDispatch, useSelector } from 'react-redux';
import SnackbarWidget from './SnackbarWidget';
import { setRefetch } from '@/store/slices/commonSlice';
import { Dropdown } from 'react-native-paper-dropdown';
import { setUser } from '@/store/slices/authSlice';
registerTranslation('en-GB', enGB)


const reasonOptions = [
    { label: 'Not in Kuwait', value: 'not_in_kuwait' },
    { label: 'Other/Personal', value: 'other' },
];

const PauseThaaliForm = ({ onCompletion }) => {
    const { control, handleSubmit, formState: { errors }, setValue } = useForm();
    const [range, setRange] = React.useState({ startDate: undefined, endDate: undefined });
    const [open, setOpen] = React.useState(false);
    const { user } = useSelector((state) => state.auth)
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const dispatch = useDispatch();

    useEffect(() => {
        setValue('thaali_id', user?.id)
    }, [user]);

    const onDismiss = React.useCallback(() => {
        setOpen(false);
    }, [setOpen, range]);

    const onConfirm = React.useCallback(
        ({ startDate, endDate }) => {
            if (!startDate || !endDate) {
                Alert.alert('Date required', 'Please select both start and end dates.');
                return;
            }
            setOpen(false);

            const adjustedStartDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 12);
            const adjustedEndDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 12);

            setRange({ startDate: adjustedStartDate, endDate: adjustedEndDate });
            setValue('start_date', adjustedStartDate);
            setValue('end_date', adjustedEndDate);
        },
        [setOpen, setRange]
    );

    const onSubmit = async (data) => {
        try {
            const res = await pauseThaali(data);

            if (res.data) {
                setSnackbarMessage(res?.data?.message);
                setSnackbarOpen(true);
            }
        }
        catch (e) {
            console.log(e);
        }
        finally {
            dispatch(setRefetch(Math.floor(Math.random() * 100)));
            setTimeout(() => {
                onCompletion();
            }, 500)
        }
    }
    return (
        <Surface style={styles.cardContainer}>
            <SnackbarWidget open={snackbarOpen} message={snackbarMessage} onDismiss={() => setSnackbarOpen(false)} />
            <Text variant="headlineSmall" style={{ marginBottom: 20 }}>Stop Thali Temporarily</Text>
            <Controller
                control={control}
                name="date_range"
                render={({ field: { onChange, value } }) => (
                    <>
                        <Button onPress={() => setOpen(true)} uppercase={false} mode="outlined">
                            {
                                !range.startDate && !range.endDate ? 'Enter Start - End Dates'
                                    : `${formatDate(range?.startDate)} - ${formatDate(range.endDate)}`
                            }
                        </Button>
                        <DatePickerModal
                            locale="en-GB"
                            mode="range"
                            visible={open}
                            onDismiss={onDismiss}
                            startDate={range.startDate}
                            endDate={range.endDate}
                            onConfirm={onConfirm}
                            presentationStyle="pageSheet"
                        />
                        <HelperText type="error" visible={!!errors.date_range}>
                            {errors.date_range?.message as unknown as string}
                        </HelperText>
                    </>
                )}
            />

            <Controller
                control={control}
                name="reason"
                rules={{ required: 'Reason is required' }}
                render={({ field: { onChange, value } }) => (
                    <>
                        <Dropdown
                            label="Reason"
                            placeholder="Reason"
                            options={reasonOptions}
                            value={value}
                            onSelect={onChange}
                            mode="outlined"
                        />
                        <HelperText type="error" visible={!!errors.reason}>
                            {errors.reason?.message as unknown as string}
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

export default PauseThaaliForm;
