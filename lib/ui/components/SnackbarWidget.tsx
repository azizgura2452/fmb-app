import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Portal, Snackbar, useTheme } from 'react-native-paper';

const SnackbarWidget = ({open, message, onDismiss, hideTime=undefined}) => {
    const theme = useTheme();
    return (
        <Portal>
            <Snackbar
                visible={open}
                onDismiss={onDismiss}
                action={{
                    label: 'Close',
                }}
                style={{
                    backgroundColor: theme.colors.onSurface,
                }}
                duration={hideTime ?? 3000}
                >
                {message}
            </Snackbar>
        </Portal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
    },
});

export default SnackbarWidget;