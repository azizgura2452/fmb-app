import * as React from 'react';
import { List, useTheme } from 'react-native-paper';

const AccordionBox = (props) => {
    const theme = useTheme()
    const { component, title, icon, bgColor } = props;
    const [expanded, setExpanded] = React.useState(false);

    const handlePress = () => setExpanded(!expanded);

    return (
        <List.Accordion
            title={title}
            left={props => <List.Icon {...props} icon={icon} />}
            expanded={expanded}
            onPress={handlePress}
            style={bgColor ? {backgroundColor: expanded ? theme.colors.inverseOnSurface : bgColor} : null}>
            {component}
        </List.Accordion>
    );
};

export default AccordionBox;