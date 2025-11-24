import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    StyleSheet, 
    Image, 
    ScrollView,
    SafeAreaView,
    Alert,
} from 'react-native';
import { router } from 'expo-router';
import { joinClass, joinQuiz, getJoinedClasses, getJoinedQuizzes } from '../../utils/storage';

export default function StudentHomeScreen() {
    const [classes, setClasses] = useState([]);
    const [quizzes, setQuizzes] = useState([]);

    useEffect(() => {
        const load = async () => {
            const loadedClasses = await getJoinedClasses();
            const loadedQuizzes = await getJoinedQuizzes();
            setClasses(loadedClasses);
            setQuizzes(loadedQuizzes);
        };
        load();
    }, []);

    const handleJoinClass = async (classData) => {
        const success = await joinClass(classData);
        if (success) {
            setClasses(prev => [classData, ...prev]);
            Alert.alert('Success', `Joined ${classData.name}`);
        } else {
            Alert.alert('Already Joined', 'You are already in this class.');
        }
    };

    const handleJoinQuiz = async (quizData) => {
        const success = await joinQuiz(quizData);
        if (success) {
            setQuizzes(prev => [quizData, ...prev]);
            Alert.alert('Success', `Joined ${quizData.name}`);
        } else {
            Alert.alert('Already Joined', 'You have already joined this quiz.');
        }
    };

    const allItems = [
        ...classes.map(c => ({ ...c, type: 'class' })),
        ...quizzes.map(q => ({ ...q, type: 'quiz', status: 'Live' })),
    ].sort((a, b) => new Date(b.joinedAt) - new Date(a.joinedAt));

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
                    <Image 
                        source={{ uri: 'https://d.ibtimes.com/en/full/4464408/stray-kids-felix.jpg?w=1600&h=1200&q=88&f=c43706df5e2f56272f7f56dba1c82bea' }} 
                        style={styles.avatar}
                    />
                </TouchableOpacity>
                <View style={styles.searchContainer}>
                    <TextInput 
                        placeholder="Search" 
                        style={styles.searchInput}
                        placeholderTextColor="#9ca3af"
                    />
                    <Text style={styles.searchIcon}>🔍</Text>
                </View>
                <TouchableOpacity style={styles.bellButton}>
                    <Text style={styles.bellIcon}>🔔</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollContent}>
                <View style={styles.actionButtons}>
                    <TouchableOpacity 
                        style={[styles.actionButton, styles.joinClassroomButton]}
                        onPress={() => router.push('/join-classroom')}
                    >
                        <Text style={styles.actionButtonText}>➕ Join Classroom</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.actionButton, styles.joinQuizButton]}
                        onPress={() => router.push('/join-quiz')}
                    >
                        <Text style={styles.actionButtonText}>🔓 Join Quiz</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.sectionTitle}>My Classes & Quizzes</Text>
                <View style={styles.classesList}>
                    {allItems.length === 0 ? (
                        <Text style={styles.emptyText}>No classes or quizzes yet. Join one to get started!</Text>
                    ) : (
                        allItems.map(item => (
                            <TouchableOpacity 
                                key={item.id || item.code}
                                style={styles.classCard}
                                onPress={() => {
                                    if (item.type === 'class') {
                                        router.push({
                                            pathname: '/class-detail',
                                            params: { classId: item.code, className: item.name }
                                        });
                                    } else {
                                        router.push({
                                            pathname: '/quiz',
                                            params: { quizId: item.code, quizName: item.name }
                                        });
                                    }
                                }}
                            >
                                <Text style={styles.classIcon}>
                                    {item.type === 'class' ? '📚' : '🎯'}
                                </Text>
                                <View style={styles.classText}>
                                    <Text style={styles.className} numberOfLines={1}>
                                        {item.name}
                                    </Text>
                                    <Text style={styles.lecturerName}>
                                        {item.type === 'class' 
                                            ? `by ${item.lecturer}` 
                                            : `Class: ${item.classCode || '—'}`}
                                    </Text>
                                </View>
                                {item.status === 'Live' && (
                                    <View style={styles.liveBadge}>
                                        <Text style={styles.liveText}>Live</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))
                    )}
                </View>
                <View style={{ height: 80 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 3,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f3f4f6',
        borderRadius: 20,
        paddingHorizontal: 15,
        marginHorizontal: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: '#1e293b',
        paddingVertical: 8,
    },
    searchIcon: {
        fontSize: 16,
        color: '#6b7280',
    },
    bellButton: {
        padding: 8,
    },
    bellIcon: {
        fontSize: 20,
        color: '#1e293b',
    },
    scrollContent: {
        flex: 1,
        paddingHorizontal: 20,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        marginBottom: 24,
    },
    actionButton: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: 'center',
        marginHorizontal: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    joinClassroomButton: {
        backgroundColor: '#3b82f6',
    },
    joinQuizButton: {
        backgroundColor: '#a855f7',
    },
    actionButtonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 15,
    },
    sectionTitle: {
        fontSize: 19,
        fontWeight: '800',
        color: '#1e293b',
        marginVertical: 16,
    },
    classesList: {
        marginBottom: 24,
    },
    classCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 14,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    classIcon: {
        fontSize: 26,
        marginRight: 14,
    },
    classText: {
        flex: 1,
    },
    className: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e293b',
    },
    lecturerName: {
        fontSize: 13,
        color: '#6b7280',
        marginTop: 2,
    },
    liveBadge: {
        backgroundColor: '#ef4444',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    liveText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '600',
    },
    emptyText: {
        textAlign: 'center',
        color: '#9ca3af',
        fontSize: 15,
        marginTop: 40,
    },
});