import * as React from 'react';
import { View, Dimensions, StyleSheet, Alert, PixelRatio } from 'react-native';
import { Card, Text, Divider, IconButton, useTheme, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { IMenu } from '@/lib/interfaces';
import { formatDate, isDateInPausedRange, isFriday, isMenuDateInPausedRange, isPast, isTodayInPausedRange, titleCase } from '@/lib/utils';
import SkeletonLoader from './SkeletonLoader';
import { styles } from '../styles';
import { useDispatch, useSelector } from 'react-redux';
import { Switch } from 'react-native-switch';
import { Controller, useForm } from 'react-hook-form';
import { checkStatus, fullThaali, getReducedMenuItems, getThaaliData, login, pauseSingle, reduceSingle, startSingle } from '@/services/thaali.api';
import LoadingIndicator from './LoadingIndicator';
import { setUser } from '@/store/slices/authSlice';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import SnackbarWidget from './SnackbarWidget';

const MenuCard = React.memo((props: Partial<IMenu>) => {
    const { id, dish1, dish2, dish3, dish4, hijri_date, menu_date, other, khidmat_by, isLoading } = props;
    const theme = useTheme();
    const { control, handleSubmit, formState: { errors }, setValue, getValues, watch } = useForm();
    const { user } = useSelector((state) => state.auth)
    const [isFetching, setIsFetching] = React.useState(true);
    const [isTodayPaused, setIsTodayPaused] = React.useState<boolean>(false);
    const [isTodayDateInPaused, setIsTodayDateInPaused] = React.useState<boolean>(false);
    const [reducedItems, setReducedItems] = React.useState([]);
    const [isAfterLastTime, setIsAfterLastTime] = React.useState(false);
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');

    React.useEffect(() => {
        if (!user?.id || !menu_date) return;
        setValue('thaali_id', user.id);
        setValue('thaali_date', menu_date);
        setValue('last_time', new Date());
        checkMenuStatus();
        fetchReducedMenuItems();
    }, [user, menu_date]);

    const fetchReducedMenuItems = async () => {
        setIsFetching(true);
        try {
            const { thaali_id, thaali_date } = getValues();
            const response = await getReducedMenuItems({ thaali_id, thaali_date });
            if (response.data.status === 'success') {
                setValue('reduced_items', response.data.data || []);
                setReducedItems(response.data.data || []);
            }
        } catch (error) {
            console.error("Error fetching reduced menu items:", error);
        }
        finally {
            setIsFetching(false);
        }
    };

    const checkMenuStatus = async () => {
        setIsFetching(true)
        const { thaali_id, thaali_date } = getValues();

        try {
            const res = await checkStatus({ thaali_id, thaali_date });
            const isPaused = isDateInPausedRange(user, menu_date) || res?.data?.data?.status === 'PAUSED';
            setValue('thaali_switch', !isPaused); // Switch is ON if not paused
            setIsTodayPaused(isPaused);
            setIsTodayDateInPaused(isPaused && res?.data?.data?.status !== 'PAUSED'); // Adjust based on the context
        } catch (error) {
            console.log("Error fetching menu status:", error, menu_date);
        }
    };

    const onStop = async (data) => {
        setIsFetching(true)
        const res = await pauseSingle(data);
        try {
            if (res.data.status === "error") {
                setValue("thaali_switch", true);
                // setSnackbarMessage(res?.data?.message);
                // setSnackbarOpen(true);
                Alert.alert('Not allowed!', res.data?.message);
            }
        }
        catch (e) {
            console.log('Error', e)
        }
        finally {
            setIsFetching(false)
            setIsTodayPaused(true);
        }
    }

    const onStart = async (data) => {
        setIsFetching(true)
        const res = await startSingle(data);
        try {
            if (res.data.status === "error") {
                setValue("thaali_switch", false);
                Alert.alert('Not allowed!', res.data?.message);
            }
        }
        catch (e) {
            console.log('Error', e)
        }
        finally {
            setIsFetching(false)
            setIsTodayPaused(false);
        }
    }

    const onFull = async (data) => {
        // console.log('full', data)
        try {
            const res = await fullThaali(data);
            console.log(res?.data);
        }
        catch (e) {
            console.log(e);
        }
        finally {
            setIsFetching(false);
        }
    }

    const onLess = async (data) => {
        // console.log('less', data)
        try {
            const res = await reduceSingle(data);
            console.log(res?.data);
        }
        catch (e) {
            console.log(e);
        }
        finally {
            setIsFetching(false);
        }
    }

    if (isLoading) return <SkeletonLoader />;

    const renderSwitch = () => {
        if (isFetching) {
            return <View style={{ alignSelf: 'center' }}><LoadingIndicator /></View>;
        } else {
            if (!isFriday(menu_date) && !isPast(menu_date)) {
                const shouldDisableSwitch = (isTodayPaused && isTodayDateInPaused) || isAfterLastTime; // refined condition
                return (
                    <View>
                        <Controller
                            control={control}
                            name="thaali_switch"
                            render={({ field: { onChange, value } }) => (
                                <Switch
                                    value={value ?? true}
                                    onValueChange={(val) => {
                                        onChange(val); // Update the switch state
                                        if (val) {
                                            handleSubmit((data) => onStart(data))();
                                        } else {
                                            handleSubmit((data) => onStop(data))();
                                        }
                                        // Alert.alert('', `Are you sure you want to ${val ? 'start' : 'stop'}?`, [
                                        //     {
                                        //         text: 'Yes',
                                        //         onPress: () => {
                                        //             onChange(val); // Update the switch state
                                        //             if (val) {
                                        //                 handleSubmit((data) => onStart(data))();
                                        //             } else {
                                        //                 handleSubmit((data) => onStop(data))();
                                        //             }
                                        //         },
                                        //     },
                                        //     { text: 'No', style: 'cancel' },
                                        // ]);
                                    }}
                                    disabled={shouldDisableSwitch ?? false}
                                    activeText={'On'}
                                    inActiveText={'Off'}
                                    backgroundActive={!shouldDisableSwitch ? theme.colors.success : theme.colors.surfaceDisabled}
                                    backgroundInactive={!shouldDisableSwitch ? theme.colors.error : theme.colors.surfaceDisabled}
                                    switchLeftPx={10}
                                    switchRightPx={10}
                                    circleSize={30}
                                    switchWidthMultiplier={2}
                                    outerCircleStyle={{ alignItems: "center", justifyContent: "center", paddingLeft: 10, paddingRight: 10 }}
                                    circleBorderActiveColor={!shouldDisableSwitch ? theme.colors.success : theme.colors.surfaceDisabled}
                                    circleBorderInactiveColor={!shouldDisableSwitch ? theme.colors.error : theme.colors.surfaceDisabled}
                                />
                            )}
                        />
                    </View>
                );
            }
        }
    }


    const renderDishSwitch = (dishName, paramName) => {
        if (isFetching) {
            return <View style={{ alignSelf: 'center' }}><LoadingIndicator /></View>;
        }
        else {
            const reducedMenuItems = watch('reduced_items') || reducedItems;
            return (
                <Controller
                    control={control}
                    name={`thaali_qty_${paramName}`}
                    defaultValue={!reducedMenuItems.includes(dishName)} // If dish is reduced, show "LESS" (false), else "FULL" (true)
                    render={({ field: { onChange, value } }) => (
                        <Switch
                            value={value}
                            onValueChange={(val) => {
                                Alert.alert('', `Are you sure you want to ${val ? 'normalize quantity' : 'reduce quantity'}?`, [
                                    {
                                        text: 'Yes',
                                        onPress: () => {
                                            onChange(val); // Update the switch state
                                            setValue('reduced_qty', dishName);

                                            if (val) {
                                                handleSubmit((data) => onFull(data))();
                                            } else {
                                                handleSubmit((data) => onLess(data))();
                                            }
                                        },
                                    },
                                    { text: 'No', style: 'cancel' },
                                ]);
                            }}
                            disabled={isTodayPaused}
                            activeText={'Full'}
                            inActiveText={'Less'}
                            backgroundActive={!isTodayPaused ? theme.colors.success : theme.colors.surfaceDisabled}
                            backgroundInactive={!isTodayPaused ? theme.colors.error : theme.colors.surfaceDisabled}
                            switchLeftPx={10}
                            switchRightPx={10}
                            circleSize={30}
                            switchWidthMultiplier={2}
                            outerCircleStyle={{ alignItems: "center", justifyContent: "center", paddingLeft: 10, paddingRight: 10 }}
                            circleBorderActiveColor={!isTodayPaused ? theme.colors.success : theme.colors.surfaceDisabled}
                            circleBorderInactiveColor={!isTodayPaused ? theme.colors.error : theme.colors.surfaceDisabled}
                        />
                    )}
                />
            );
        }
    };



    const renderDish = (icon, dish, paramName) => {
        if (!isFriday(menu_date) && dish) {
            const dishName = (dish as unknown as string).toLowerCase();
            const updatedName = dishName.includes('chicken') ? dishName.replaceAll('chicken', 'Chk.') : dish;

            return (
                <View style={styles2.menuItem} key={`${Math.floor(Math.random() * (10 + 1))}${dish.toString()}`}>
                    {
                        icon === 'rice' ? <FontAwesome6 name="bowl-rice" size={22} color="#BF360C" />
                            : <MaterialCommunityIcons name={icon} size={24} style={styles2.iconColor} />

                    }
                    <Text style={styles2.menuText}>{titleCase(updatedName)}</Text>
                    {/* {!isPast(menu_date) && !isFetching && renderDishSwitch(dish, paramName)} */}
                </View>
            );
        }
        return null;
    };


    const renderItems = (otherItem) => {
        let dishItems = [];

        if (otherItem && (otherItem as unknown as string).toLowerCase().includes('n/a')) {
            dishItems.push(renderDish('star', dish1, 'dish1'));
        } else {
            dishItems.push(renderDish('bowl', dish1, 'dish1'));
            dishItems.push(renderDish('bread-slice', dish3, 'dish3'));
            dishItems.push(renderDish('bowl-mix', dish2, 'dish2'));
            dishItems.push(renderDish('rice', dish4, 'dish4'));
            dishItems.push(renderDish('star', other, 'other'));
        }

        return dishItems;
    }
    // const [disableSwitch, setDisableSwitch] = React.useState(false);
    return (
        <>
            <SnackbarWidget open={snackbarOpen} message={snackbarMessage} onDismiss={() => setSnackbarOpen(false)} />

            <Card style={[styles.cardContainer, styles2.card]}>
                <View style={styles2.headerContainer}>
                    <View style={styles2.dateHeader}>
                        <Text style={styles2.headerText}>{formatDate(menu_date)}</Text>
                        <Text style={styles2.captionText}>{hijri_date}</Text>
                        {khidmat_by && <Text style={{ ...styles2.captionText, fontStyle: 'italic', color: '#BF360C' }}>Niyaz Khidmat: {khidmat_by}</Text>}
                    </View>
                    {renderSwitch()}
                </View>

                <Card.Content style={{ paddingRight: 0 }}>
                    <Divider style={styles2.divider} />
                    {/* {!isPast(menu_date) && <Text variant="bodySmall" style={{ alignSelf: 'flex-end', marginBottom: 10, marginRight: 5, color: '#e0d4c3', }}>Quantity</Text>} */}
                    {renderItems(other)}
                </Card.Content>
            </Card>
        </>
    );
});
const screenWidth = Dimensions.get('window').width;
const normalizeFont = (size: number) => {
    const scale = screenWidth / 390;
    const newSize = size * scale;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

const styles2 = StyleSheet.create({
    card: {
        maxWidth: screenWidth * 0.89,
        minWidth: screenWidth * 0.89,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: normalizeFont(16),
    },
    dateHeader: {
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    headerText: {
        fontSize: normalizeFont(20),
        fontWeight: 'bold',
        color: '#b98027',
    },
    captionText: {
        fontSize: normalizeFont(14),
        fontWeight: 'normal',
        color: '#b98027',
    },
    divider: {
        marginVertical: normalizeFont(16),
        backgroundColor: '#e0d4c3',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: normalizeFont(12),
    },
    menuText: {
        fontSize: normalizeFont(18),
        fontWeight: '500',
        color: '#4b3621',
        marginLeft: normalizeFont(12),
        flex: 3,
        flexShrink: 1
    },
    iconColor: {
        color: '#BF360C'
    }
});

export default MenuCard;
