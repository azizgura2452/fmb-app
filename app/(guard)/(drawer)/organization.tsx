import { getMembers } from '@/services/communication.api';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, FlatList } from 'react-native';
import { IconButton, Surface, Text } from 'react-native-paper';
import { Colors, styles as defaultStyle } from '@/lib/ui/styles';
import WithBg from '@/lib/ui/components/WithBg';
import { BASE_DOMAIN } from '@/services/base.api';

const MemberNode = ({ member, expandedNodes, toggleExpand }) => {
    const isExpanded = expandedNodes[member.id] || false;

    return (
        <View style={styles.nodeContainer}>
            <TouchableOpacity style={styles.node} onPress={() => toggleExpand(member.id)}>
                {member?.photo ? (
                    <Image source={{ uri: BASE_DOMAIN + member.photo }} style={styles.memberPhoto} />
                ) : (
                    <IconButton style={styles.icon} icon="account" size={40} iconColor={Colors.light.gold.primary} />
                )}
                <View style={styles.textContainer}>
                    <Text style={[styles.nodeText, { fontWeight: 'bold' }]}>{member?.name}</Text>
                    <Text style={styles.nodeText}>{member?.designation}</Text>
                </View>
                {member.children?.length > 0 && (
                    <IconButton
                        icon={isExpanded ? "chevron-down" : "chevron-right"}
                        size={24}
                        onPress={() => toggleExpand(member.id)}
                    />
                )}
            </TouchableOpacity>
            {isExpanded && member.children?.length > 0 && (
                <View style={styles.childrenContainer}>
                    {member.children.map((child) => (
                        <MemberNode
                            key={child.id}
                            member={child}
                            expandedNodes={expandedNodes} // Pass entire expanded state
                            toggleExpand={toggleExpand}
                        />
                    ))}
                </View>
            )}
        </View>
    );
};

const Organization = () => {
    const [organizationData, setOrganizationData] = useState(null);
    const [expandedNodes, setExpandedNodes] = useState({}); // Track each node’s state

    useEffect(() => {
        const fetchData = async () => {
            const res = (await getMembers()).data;
            if (res?.data) {
                setOrganizationData(res?.data);

                // Prepopulate expandedNodes for the first two levels
                const initialExpandedNodes = {};
                const expandFirstTwoLevels = (members, level = 0) => {
                    if (level < 2) { // Expand first 2 levels
                        members.forEach(member => {
                            initialExpandedNodes[member.id] = true;
                            if (member.children && member.children.length > 0) {
                                expandFirstTwoLevels(member.children, level + 1);
                            }
                        });
                    }
                };

                // Trigger the recursive function to expand first two levels
                expandFirstTwoLevels(res.data);
                setExpandedNodes(initialExpandedNodes);
            }
        };
        fetchData();
    }, []);

    const toggleExpand = (id) => {
        setExpandedNodes((prev) => ({ ...prev, [id]: !prev[id] })); // Toggle specific node
    };

    return (
        <FlatList
            data={organizationData || []}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <MemberNode
                    member={item}
                    expandedNodes={expandedNodes}
                    toggleExpand={toggleExpand}
                />
            )}
            contentContainerStyle={styles.container}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    icon: {
        margin: 0,
    },
    node: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 8,
        elevation: 3,
        marginBottom: 8,
    },
    nodeContainer: {
        marginLeft: 20,
    },
    textContainer: {
        flex: 1,
        marginLeft: 10,
    },
    nodeText: {
        fontSize: 16,
    },
    childrenContainer: {
        marginLeft: 20,
        borderLeftWidth: 2,
        borderColor: '#ddd',
        paddingLeft: 10,
    },
    memberPhoto: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
});

export default WithBg(Organization);
