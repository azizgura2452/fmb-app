import { Colors, styles } from '@/lib/ui';
import FeedbackForm from '@/lib/ui/components/FeedbackForm';
import ModalBox from '@/lib/ui/components/ModalBox';
import SalawaatForm from '@/lib/ui/components/SalawaatForm';
import SalawaatList from '@/lib/ui/components/ContributionList';
import WithBg from '@/lib/ui/components/WithBg';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { Dimensions, PixelRatio, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Card, Surface, Text, useTheme } from 'react-native-paper';
import ContributionList from '@/lib/ui/components/ContributionList';
import ZabihatForm from '@/lib/ui/components/ZabihatForm';

const ZabihatScreen = () => (
    <Surface style={{ padding: 20 }}>
        <Text variant="bodyMedium">Demo text for Zabihat screen.</Text>
    </Surface>
);

const Contribution = () => {
    const theme = useTheme();
    const [activeTab, setActiveTab] = useState('Salawaat');
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [refetch, setRefetch] = useState(false);


    return (
        <ScrollView>
            <Surface style={{ padding: 20, paddingTop: 50 }}>
                <Text variant="headlineSmall" style={customStyles.quote}>Huzur-e-Aala TUS stated in one of his Bayaan Mubarak</Text>
                <Image
                    source={require('@/assets/images/contribution_img.png')}
                    style={{
                        width: '100%',
                        height: 85,
                        borderRadius: 2,
                        marginBottom: 20,
                        marginTop: 30,
                        objectFit: 'contain'
                    }}
                />
            </Surface>

            <Surface style={[styles.screen]}>
                <Card style={styles.cardContainer}>
                    <Card.Content>
                        <Text variant="bodySmall" style={customStyles.date}>Salawaat/Zabihat Request Form</Text>
                        <Button mode="contained-tonal"
                            style={{ width: 100, alignSelf: 'flex-end', marginRight: -24 }}
                            onPress={() => {
                                activeTab === 'Salawaat' ? setOpen(true) : setOpen2(true)
                            }}
                        >Add</Button>
                        <View style={customStyles.tabContainer}>
                            <TouchableOpacity onPress={() => setActiveTab('Salawaat')} style={[customStyles.tabButton, activeTab === 'Salawaat' && customStyles.activeTab]}>
                                <Text style={customStyles.tabText}>Salawaat</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setActiveTab('Zabihat')} style={[customStyles.tabButton, activeTab === 'Zabihat' && customStyles.activeTab]}>
                                <Text style={customStyles.tabText}>Zabihat</Text>
                            </TouchableOpacity>
                        </View>

                        {activeTab === 'Salawaat' && <ContributionList refetch={refetch} type="SALAWAAT" />}
                        {activeTab === 'Zabihat' && <ContributionList refetch={refetch} type="ZABIHAT" />}
                    </Card.Content>
                </Card>
            </Surface>

            <ModalBox open={open} content={<SalawaatForm onCompletion={() => {
                setOpen(false);
                setRefetch(!refetch);
            }
            } />} onDismiss={() => setOpen(false)} />
            <ModalBox open={open2} content={<ZabihatForm onCompletion={() => {
                setOpen2(false);
                setRefetch(!refetch);
            }
            } />} onDismiss={() => setOpen2(false)} />

        </ScrollView>
    );
};

const screenWidth = Dimensions.get('window').width;
const normalizeFont = (size: number) => {
    const scale = screenWidth / 390;
    const newSize = size * scale;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

const customStyles = StyleSheet.create({
    card: {
        backgroundColor: Colors.light.gold.background
    },
    quote: {
        fontWeight: 'bold',
        fontStyle: 'italic',
        textAlign: 'center',
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: 4,
        marginBottom: normalizeFont(10),
    },
    tabButton: {
        paddingVertical: normalizeFont(10),
        paddingHorizontal: normalizeFont(20),
        borderBottomWidth: 2,
        borderColor: Colors.light.gold.backdrop,
    },
    activeTab: {
        backgroundColor: Colors.light.gold.background,
        borderColor: Colors.light.gold.primary,
    },
    tabText: {
        fontSize: normalizeFont(16),
        fontWeight: '600',
    },
    date: {
        fontSize: normalizeFont(14),
        color: '#999',
        marginBottom: normalizeFont(2),
    },
    title: {
        fontSize: normalizeFont(14),
    },
    text: {
        fontSize: normalizeFont(16),
        fontWeight: 'bold',
    },
});

export default WithBg(Contribution);
