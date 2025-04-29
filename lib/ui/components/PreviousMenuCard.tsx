import React, { useState, useCallback } from 'react';
import { View, Dimensions, StyleSheet, PixelRatio } from 'react-native';
import { Card, Text, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { formatDate, isFriday, titleCase } from '@/lib/utils';
import SkeletonLoader from './SkeletonLoader';
import FeedbackForm from './FeedbackForm';
import { styles } from '../styles';
import StarRating from './StarRating';
import { IMenu } from '@/lib/interfaces';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

// Separate scaling utilities
const scaleWidth = screenWidth / 390;
const scaleHeight = screenHeight / 844;

const normalize = (size: number) => Math.round(PixelRatio.roundToNearestPixel(size * scaleWidth));
const verticalScale = (size: number) => Math.round(PixelRatio.roundToNearestPixel(size * scaleHeight));

const PreviousMenuCard = React.memo((props: IMenu) => {
    const { id, dish1, dish2, dish3, dish4, hijri_date, menu_date, other, khidmat_by, isToday, isLoading } = props;
    const [ratingState, setRatingState] = useState({});

    const handleRatingChange = (dish, rating) => {
        setRatingState((prevState) => ({ ...prevState, [dish]: rating }));
    };

    const resetRatings = useCallback(() => {
        setRatingState({});
    }, []);

    if (isLoading) return <SkeletonLoader />;

    const renderDish = (icon, dish, paramName, star = true) => {
        if (!isFriday(menu_date) && dish) {
            const dishName = (dish as unknown as string).toLowerCase();
            const updatedName = dishName.includes('chicken') ? dishName.replaceAll('chicken', 'Chk.') : dish;
            return (
                <View style={styles2.menuItem} key={`${Math.floor(Math.random() * 11)}${dish.toString()}`}>
                    <View style={styles2.iconWrapper}>
                        {icon === 'rice' ? (
                            <FontAwesome6 name="bowl-rice" size={22} color="#BF360C" />
                        ) : (
                            <MaterialCommunityIcons name={icon} size={24} style={styles2.iconColor} />
                        )}
                    </View>

                    <View style={styles2.nameWrapper}>
                        <Text style={styles2.menuText} numberOfLines={5} ellipsizeMode="tail">
                            {titleCase(updatedName)}
                        </Text>
                    </View>

                    {star && (
                        <View style={styles2.starBox}>
                            <StarRating
                                rating={ratingState[paramName]}
                                onRatingChange={(rating) => handleRatingChange(paramName, rating)}
                                size={22}
                            />
                        </View>
                    )}
                </View>
            );
        }
        return null;
    };

    const renderItems = (otherItem) => {
        let dishItems = [];

        if (otherItem && (otherItem as unknown as string).toLowerCase().includes('n/a')) {
            dishItems.push(renderDish('star', dish1, 'dish1', false));
        } else {
            dishItems.push(renderDish('bowl', dish1, 'dish1'));
            dishItems.push(renderDish('bread-slice', dish3, 'dish3'));
            dishItems.push(renderDish('bowl', dish2, 'dish2'));
            dishItems.push(renderDish('rice', dish4, 'dish4'));
            dishItems.push(renderDish('star', other, 'other'));
        }

        return dishItems;
    };

    return (
        <Card style={[styles.cardContainer, styles2.card]}>
            <View style={styles2.headerContainer}>
                <View style={styles2.dateHeader}>
                    <Text style={styles2.headerText}>{formatDate(menu_date)}</Text>
                    <Text style={styles2.captionText}>{hijri_date}</Text>
                </View>
            </View>

            <Card.Content>
                <Divider style={styles2.divider} />
                <View style={{ marginLeft: -16 }}>
                    {renderItems(other)}
                </View>
            </Card.Content>

            <FeedbackForm
                menuId={id}
                ratings={ratingState}
                onResetRatings={resetRatings}
            />
        </Card>
    );
});

const styles2 = StyleSheet.create({
    card: {
        maxWidth: screenWidth * 0.89,
        minWidth: screenWidth * 0.89,
        paddingRight: 0,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: verticalScale(8),
    },
    dateHeader: {
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    headerText: {
        fontSize: normalize(20),
        fontWeight: 'bold',
        color: '#b98027',
    },
    captionText: {
        fontSize: normalize(14),
        fontWeight: 'normal',
        color: '#b98027',
    },
    divider: {
        marginVertical: verticalScale(4),
        backgroundColor: '#e0d4c3',
    },
    iconColor: {
        color: '#BF360C',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(12),
        paddingRight: normalize(8),
    },
    iconWrapper: {
        width: normalize(30),
        alignItems: 'center',
    },
    nameWrapper: {
        flex: 1,
        marginHorizontal: normalize(10),
    },
    menuText: {
        fontSize: normalize(18),
        fontWeight: '500',
        color: '#4b3621',
    },
    starBox: {
        minWidth: normalize(90),
        alignItems: 'flex-end',
    },
});

export default PreviousMenuCard;
