import React, { useEffect, useState } from 'react';
import { View, StyleSheet, UIManager, Platform, LayoutAnimation, TouchableOpacity, Dimensions, PixelRatio } from 'react-native';
import { Card, Text, Divider, Avatar, IconButton, Button, Chip, useTheme, Switch } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles as defaultStyle } from '../styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { useSelector } from 'react-redux';
import { isDateInPausedRange } from '@/lib/utils';
import { useRouter } from 'expo-router';


// Enable LayoutAnimation on Android
if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental &&
        UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ProfileCard = ({ data }) => {
    const theme = useTheme()
    const { id, cboFTitle, cboLivingStatus, cboMaskanName, cboTitle, cboWatanCode, txtEjamaat_ID, txtFatherName, txtSabeelNo, txtSurname, txtThaaliNo, txtMuminName, txtAmountTakhmeen, txtAmountDue, thaali_status, txtAmountPaid } = data;
    const {
        people_count = 0, // Default value if people_count is undefined
        status = 'fetching..' // Default value for status
    } = thaali_status || {};
    const { user } = useSelector((state) => state.auth);
    const [expanded, setExpanded] = useState(false);
    const [isTodayPaused, setIsTodayPaused] = React.useState<boolean>(false);
    const router = useRouter();

    const handleChipPress = () => {
        // Navigate to the "managethali" page
        router.push('/(guard)/(drawer)/(tabs)/managethali');
    };

    useEffect(() => {
        if (user?.id) {
            setIsTodayPaused(isDateInPausedRange(user) || false);
        }
    }, [user])

    // Trigger Layout Animation
    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);
    };

    return (
        <Card style={[defaultStyle.cardContainer]}>
            <View style={styles.headerContainer}>
                <Avatar.Icon size={60} icon="account" color={theme.colors.background} />
                <View style={styles.headerText}>
                    <Text style={styles.name}>
                        {`${cboTitle ?? ''} ${txtMuminName ?? ''} ${cboFTitle ?? ''} ${txtFatherName ?? ''} ${txtSurname ?? ''}`.trim()}
                    </Text>
                    <Text style={styles.city}>Watan: {cboWatanCode ?? 'Kuwait'}</Text>
                </View>
            </View>

            <Card.Content>
                <Divider style={styles.divider} />
                <View style={styles.infoRow}>
                    <MaterialCommunityIcons name="information" size={20} color={theme.colors.primary} />
                    <Text style={styles.label}>Thali Status: {isTodayPaused}</Text>
                    {!isTodayPaused ? (
                        <Chip onPress={handleChipPress} icon={() => (
                            <Icon name="check" size={16} color="#fff" />
                        )} style={[styles.value, { backgroundColor: theme.colors.success }]}>
                            <Text variant="bodySmall" style={{ color: '#fff' }}>ACTIVE</Text>
                        </Chip>
                    )
                        : (
                            <Chip icon={() => (
                                <Icon name="stop" size={16} color="#fff" />
                            )} style={[styles.value, { backgroundColor: theme.colors.error }]}>
                                <Text variant="bodySmall" style={{ color: '#fff' }}>
                                    STOPPED
                                </Text>
                            </Chip>
                        )
                    }
                </View>
                <View style={styles.infoRow}>
                    <MaterialCommunityIcons name="inbox-multiple" size={20} color="#b98027" />
                    <Text style={styles.label}>Thali No:</Text>
                    <Text style={styles.value}>{txtThaaliNo}</Text>
                </View>
                <View style={styles.infoRow}>
                    <MaterialCommunityIcons name="account-multiple" size={20} color="#b98027" />
                    <Text style={styles.label}>Family Members:</Text>
                    <Text style={styles.value}>{people_count}</Text>
                </View>
                {/* <View style={styles.infoRow}>
                    <MaterialCommunityIcons name="account-multiple" size={20} color="#b98027" />
                    <Text style={styles.label}>No. of family members:</Text>
                    <Text style={styles.value}>{4}</Text>
                </View> */}
                {/* Collapsible Extra Details */}
                {expanded && (
                    <>
                        <View style={styles.infoRow}>
                            <MaterialCommunityIcons name="cash-lock" size={20} color="#b98027" />
                            <Text style={styles.label}>Takhmeen:</Text>
                            <Text style={styles.value}>KD{txtAmountTakhmeen}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <MaterialCommunityIcons name="cash-minus" size={20} color="#b98027" />
                            <Text style={styles.label}>Paid:</Text>
                            <Text style={styles.value}>KD{txtAmountPaid}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <MaterialCommunityIcons name="cash-plus" size={20} color="#b98027" />
                            <Text style={styles.label}>Due:</Text>
                            <Text style={styles.value}>KD{txtAmountDue}</Text>
                        </View>
                        {/* <View style={styles.infoRow}>
                            <MaterialCommunityIcons name="smart-card-outline" size={20} color="#b98027" />
                            <Text style={styles.label}>ITS:</Text>
                            <Text style={styles.value}>{txtEjamaat_ID}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <MaterialCommunityIcons name="home-outline" size={20} color="#b98027" />
                            <Text style={styles.label}>Sabeel No:</Text>
                            <Text style={styles.value}>{txtSabeelNo}</Text>
                        </View> */}
                    </>
                )}

                <TouchableOpacity onPress={toggleExpand}>
                    <Text style={styles.expandButton}>
                        {expanded ? 'Show Less' : 'Show More'}
                    </Text>
                </TouchableOpacity>
            </Card.Content>
        </Card>
    );
};

const screenWidth = Dimensions.get('window').width;
const normalizeFont = (size: number) => {
    const scale = screenWidth / 390;
    const newSize = size * scale;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: normalizeFont(16),
    },
    avatar: {
        backgroundColor: '#c1a17a',
    },
    headerText: {
        flex: 1,
        marginLeft: normalizeFont(16),
    },
    name: {
        fontSize: normalizeFont(20),
        fontWeight: 'bold',
        color: '#4b3621',
    },
    city: {
        fontSize: normalizeFont(16),
        color: '#b98027',
    },
    divider: {
        marginVertical: normalizeFont(16),
        backgroundColor: '#e0d4c3',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: normalizeFont(12),
    },
    label: {
        fontSize: normalizeFont(16),
        fontWeight: '500',
        color: '#4b3621',
        marginLeft: normalizeFont(8),
    },
    value: {
        fontSize: normalizeFont(16),
        fontWeight: '600',
        color: '#4b3621',
        marginLeft: 'auto',
    },
    expandButton: {
        color: '#b98027',
        textAlign: 'center',
        marginTop: normalizeFont(10),
        fontSize: normalizeFont(16),
        fontWeight: 'bold',
    },
});

export default ProfileCard;
