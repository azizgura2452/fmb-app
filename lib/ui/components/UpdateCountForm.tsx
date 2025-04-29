import React, { useEffect, useState } from 'react';
import { Surface, Button, HelperText, TextInput, Text } from 'react-native-paper';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet } from 'react-native';
import { DatePickerModal } from 'react-native-paper-dates';
import { enGB, registerTranslation } from 'react-native-paper-dates';
import { formatDate } from '@/lib/utils';
import { useSelector } from 'react-redux';
import { Colors, styles } from '../styles';
import SnackbarWidget from './SnackbarWidget';
import { updateThaaliSize } from '@/services/thaali.api';
registerTranslation('en-GB', enGB);

const UpdateCountForm = () => {
    const { control, handleSubmit, formState: { errors }, setValue } = useForm();
    const { user } = useSelector((state) => state.auth);
    const [range, setRange] = React.useState({ startDate: undefined, endDate: undefined });
    const [open, setOpen] = React.useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        setValue('thaali_id', user?.id)
    }, [user]);

    const onDismiss = React.useCallback(() => {
        setOpen(false);
    }, [setOpen]);

    const onConfirm = React.useCallback(
        ({ startDate, endDate }) => {
            setOpen(false);
            setRange({ startDate, endDate });
            setValue('start_date', startDate);
            setValue('end_date', endDate);
        },
        [setOpen, setRange]
    );

    const onSubmit = async (data) => {
        let res = null;
        try {
            res = await updateThaaliSize(data);
        }
        catch(e) {
            console.log(e);
        }

        if (res?.data) {
            setSnackbarMessage(res?.data?.message);
            setSnackbarOpen(true);
        }
    }

    return (
        <Surface style={styles.cardContainer}>
            <SnackbarWidget open={snackbarOpen} message={snackbarMessage} onDismiss={() => setSnackbarOpen(false)}/>
            <Text variant="headlineSmall" style={{ marginBottom: 20 }}>Reduce Thaali Size</Text>

            <Controller
                control={control}
                name="date_range"
                render={({ field: { onChange, value } }) => (
                    <>
                        <Button onPress={() => setOpen(true)} uppercase={false} mode="outlined">
                            {
                                !range.startDate && !range.endDate
                                    ? 'Enter Start - End Dates'
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
                        />
                        <HelperText type="error" visible={!!errors.date_range}>
                            {errors.date_range?.message as unknown as string}
                        </HelperText>
                    </>
                )}
            />

            {/* Number of People */}
            <Controller
                control={control}
                name="people_count"
                rules={{
                    required: 'Please enter the number of people',
                    validate: value => {
                        if (value > parseInt(user?.thaali_status?.people_count)) {
                            return `To increase more than registered people (${user?.thaali_status?.people_count}). Please contact the FMB office.`;
                        }
                        return true;
                    }
                }}
                render={({ field: { onChange, value } }) => (
                    <>
                        <TextInput
                            mode="outlined"
                            label="No. of People"
                            keyboardType="numeric"
                            value={value}
                            onChangeText={onChange}
                            error={!!errors.num_people}
                            placeholder="Enter number of people"
                        />
                        <HelperText type="error" visible={!!errors.people_count}>
                            {errors.people_count?.message as unknown as string}
                        </HelperText>
                    </>
                )}
            />

            <Button mode="contained" onPress={handleSubmit(onSubmit)} style={{marginTop: 20}}>
                Submit
            </Button>
        </Surface>
    );
};

export default UpdateCountForm;
