import { styles } from '@/lib/ui';
import ModalBox from '@/lib/ui/components/ModalBox';
import PauseThaaliForm from '@/lib/ui/components/PauseThaaliForm';
import WithBg from '@/lib/ui/components/WithBg';
import { activateThaali } from '@/services/thaali.api';
import { setRefetch } from '@/store/slices/commonSlice';
import React, { useState } from 'react';
import { ScrollView, View, TouchableOpacity } from 'react-native';
import { Button, Card, Surface, Text } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import SnackbarWidget from '@/lib/ui/components/SnackbarWidget';

const ManageThali = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [activeModal, setActiveModal] = React.useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const openModal = (modal) => setActiveModal(modal);
    const closeModal = () => setActiveModal(null);

    const startThali = async () => {
        try {
            const res = await activateThaali(user?.id);
            dispatch(setRefetch(Math.floor(Math.random() * 100)));
            closeModal();
            if (res.data) {
                setSnackbarMessage(res?.data?.message);
                setSnackbarOpen(true);
            }
        }
        catch (e) {
            console.log(e);
        }
    };

    const menuItems = [
        { id: 'pause', title: 'Stop Thali', icon: 'pause-circle' },
        { id: 'resume', title: 'Start Thali', icon: 'play-circle' },
    ];

    return (
        <ScrollView>
            <Surface style={styles.screen}>
                <SnackbarWidget open={snackbarOpen} message={snackbarMessage} onDismiss={() => setSnackbarOpen(false)} />
                <Text variant="headlineSmall" style={[styles.marginLeft, { fontWeight: 'bold', color: '#4b3621' }]}>Manage Thali</Text>

                {/* Modals */}
                <ModalBox open={activeModal === 'pause'} content={<PauseThaaliForm onCompletion={closeModal} />} onDismiss={closeModal} />
                <ModalBox open={activeModal === 'resume'} content={
                    <View style={{ alignItems: 'center', padding: 20 }}>
                        <Card style={styles.cardContainer}>
                            <Card.Content>
                                <Text variant="titleMedium">Are you sure you want to start thali?</Text>
                                <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'center' }}>
                                    <Button mode="contained" onPress={startThali} style={{ marginRight: 10 }}>Yes</Button>
                                    <Button mode="outlined" onPress={closeModal}>Cancel</Button>
                                </View>
                            </Card.Content>
                        </Card>
                    </View>
                } onDismiss={closeModal} />
                <ModalBox open={activeModal === 'request'} content={<Text>Request Kitchen</Text>} onDismiss={closeModal} />

                {/* 3-Column Grid Layout */}
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', marginTop: 20 }}>
                    {menuItems.map((item) => (
                        <TouchableOpacity key={item.id} onPress={() => openModal(item.id)} style={{ alignItems: 'center', margin: 10 }}>
                            <MaterialCommunityIcons name={item.icon} size={80} color="#b98027" />
                            <Text>{item.title}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </Surface>
        </ScrollView>
    );
};

export default WithBg(ManageThali);
