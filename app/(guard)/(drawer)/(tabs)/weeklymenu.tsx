import { styles } from '@/lib/ui';
import FeedbackForm from '@/lib/ui/components/FeedbackForm';
import PreviousWeekSlider from '@/lib/ui/components/PreviousWeekSlider';
import WeeklyMenuSlider from '@/lib/ui/components/PreviousWeekSlider';
import WithBg from '@/lib/ui/components/WithBg';
import React from 'react'
import { ScrollView } from 'react-native-gesture-handler';
import { Surface, Text, TextInput } from 'react-native-paper';

const Weeklymenu = () => {
    return (
        <ScrollView>
            <Surface style={styles.screen}>
                <Text variant="headlineSmall" style={[styles.marginLeft, {fontWeight: 'bold', color: '#4b3621', marginBottom: -16}]}>Previous Thali Feedback</Text>
                <PreviousWeekSlider />
            </Surface>
        </ScrollView >
    )
}

export default WithBg(Weeklymenu);