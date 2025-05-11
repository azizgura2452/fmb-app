import React from 'react'
import { Modal, Portal} from 'react-native-paper'

const ModalBox = ({open, content, onDismiss, dismissableProp = true, containerStyle = {}}) => {
    return (
        <Portal>
            <Modal visible={open} dismissable={dismissableProp || true} dismissableBackButton onDismiss={onDismiss} style={{padding: 16, ...containerStyle}}>
                {content}
            </Modal>
        </Portal>
    )
}

export default ModalBox