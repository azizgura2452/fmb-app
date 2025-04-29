import React from 'react'
import { StyleSheet, View } from 'react-native';
import { Avatar, Button, Card, IconButton, Text } from 'react-native-paper'
import ButtonComponent from './ButtonComponent';

const CardBox = (props) => {
    const { title, subtitle, contentTitle, contentBody, image } = props;
    return (
        <Card style={{ padding: 1 }}>
            <Card.Title title={title} subtitle={subtitle} />
            <Card.Content style={{ marginBottom: 10 }}>
                <Text variant="titleLarge">{contentTitle}</Text>
                <Text variant="bodyMedium">{contentBody}</Text>
            </Card.Content>
            {
                image && <Card.Cover source={{ uri: image }} />
            }
            <Card.Actions>
                <ButtonComponent title="Give Feedback" />
            </Card.Actions>
        </Card>
    )
}
export default CardBox