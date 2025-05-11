import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, HelperText, TextInput, useTheme } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { Dropdown } from 'react-native-paper-dropdown';
import SnackbarWidget from './SnackbarWidget';
import { submitFeedback } from '@/services/menu.api';
import { useDispatch, useSelector } from 'react-redux';

const feedbackOptions = [
    { label: 'Oily', value: 'oily' },
    { label: 'Less Oily', value: 'less_oily' },
    { label: 'Spicy', value: 'spicy' },
    { label: 'Less Spicy', value: 'less_spicy' },
    { label: 'Perfect', value: 'perfect' },
    { label: 'Too Salty', value: 'too_salty' },
    { label: 'Not Salty Enough', value: 'not_salty_enough' },
    { label: 'Stale', value: 'stale' },
    { label: 'Other', value: 'other' },
];

const FeedbackForm = ({ menuId, ratings, onResetRatings }) => {
    const theme = useTheme();
    const { user } = useSelector((state) => state.auth);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const { control, handleSubmit, setValue, formState: { errors }, reset, watch } = useForm();
    const feedbackOption = watch('food_feedback');

    const onSubmit = async (data) => {
        // Check if at least one rating is provided
        const hasRating = Object.values(ratings).some((rating: number) => rating > 0);

        if (!hasRating) {
            setSnackbarMessage('Please provide at least one rating before submitting.');
            setSnackbarOpen(true);
            return;
        }

        const updatedData = {
            ...data,
            user_id: user.id,
            menu_id: menuId,
            ...ratings, // Include ratings in the submitted data
        };

        try {
            const res = await submitFeedback(updatedData);
            if (res?.data) {
                // console.log(res?.data)
                setSnackbarMessage(res?.data?.message);
                setSnackbarOpen(true);
                reset({ comments: '', food_feedback: '' });
                onResetRatings(); // Reset star ratings on successful submission
            }
        } catch (e) {
            console.log(e);
            console.log('catch', updatedData);
        }
    };


    const optionHeight = 50; // Approximate height of each option
    const dropdownHeight = feedbackOptions.length * optionHeight;
    return (
        <View style={{ width: '100%', paddingRight: 16 }}>
            <SnackbarWidget open={snackbarOpen} message={snackbarMessage} onDismiss={() => setSnackbarOpen(false)} />
            {(
                <Controller
                    control={control}
                    name="comments"
                    render={({ field: { onChange, value } }) => (
                        <>
                            <TextInput
                                mode="outlined"
                                label="Additional Feedback (optional)"
                                value={value}
                                onChangeText={onChange}
                                multiline
                                numberOfLines={2}
                                error={!!errors.comments}
                                placeholder="Write your feedback here"
                            />
                            <HelperText type="error" visible={!!errors.comments}>
                                {errors.comments?.message as unknown as string}
                            </HelperText>
                        </>
                    )}
                />
            )}

            <Button mode="contained" onPress={handleSubmit(onSubmit)} style={{ marginTop: 20 }}>
                Submit Feedback
            </Button>
        </View>
    );
};

export default FeedbackForm;
