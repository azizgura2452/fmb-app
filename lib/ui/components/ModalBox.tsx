import React from 'react'
import { Modal, Portal} from 'react-native-paper'

const ModalBox = ({open, content, onDismiss}) => {
    return (
        <Portal>
            <Modal visible={open} dismissable dismissableBackButton onDismiss={onDismiss} style={{padding: 16}}>
                {content}
            </Modal>
        </Portal>
    )
}

export default ModalBox