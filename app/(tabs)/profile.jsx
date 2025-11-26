import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    Alert,
    Platform,
    Image,
    StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { User, LogOut, Camera, Edit2 } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const ProfilePage = () => {
    const router = useRouter();
    const [profile, setProfile] = useState({
        firstName: '',
        lastName: '',
        email: '',
        profileImage: '',
    });
    const [isEditing, setIsEditing] = useState(false); 

    useEffect(() => {
        loadUserData();
        requestPermissions();
    }, []);

    const requestPermissions = async () => {
        if (Platform.OS !== 'web') {
            const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (mediaStatus !== 'granted') {
                Alert.alert('Permission Required', 'We need access to your photo library to change your avatar.');
            }
            const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
            if (cameraStatus !== 'granted') {
                Alert.alert('Permission Required', 'We need camera access to take photos.');
            }
        }
    };

    const loadUserData = async () => {
        try {
            const user = await AsyncStorage.getItem('user');
            if (user) {
                const userData = JSON.parse(user);
                const fullName = userData.displayName || userData.name || '';
                const names = fullName.split(' ');
                const firstName = names[0] || '';
                const lastName = names.slice(1).join(' ') || '';

                setProfile({
                    firstName,
                    lastName,
                    email: userData.email || '',
                    profileImage: userData.profileImage || '',
                });
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    };

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled && result.assets?.[0]?.uri) {
                const imageUri = result.assets[0].uri;
                setProfile((prev) => ({ ...prev, profileImage: imageUri }));

                const user = await AsyncStorage.getItem('user');
                if (user) {
                    const userData = JSON.parse(user);
                    const updatedUser = { ...userData, profileImage: imageUri };
                    await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
                }
            }
        } catch (error) {
            console.error('ImagePicker error:', error);
            const errorMessage = (Platform.OS === 'web' ? 'Failed to select image.' : 'Failed to select image. Please try again.');
            Alert.alert('Error', errorMessage);
        }
    };

    const takePhoto = async () => {
        try {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestCameraPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Camera Access Needed', 'Please allow camera access in settings.');
                    return;
                }
            }

            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled && result.assets?.[0]?.uri) {
                const imageUri = result.assets[0].uri;
                setProfile((prev) => ({ ...prev, profileImage: imageUri }));

                const user = await AsyncStorage.getItem('user');
                if (user) {
                    const userData = JSON.parse(user);
                    const updatedUser = { ...userData, profileImage: imageUri };
                    await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
                }
            }
        } catch (error) {
            console.error('Camera error:', error);
            const errorMessage = (Platform.OS === 'web' ? 'Camera not supported on web.' : 'Failed to capture photo. Please try again.');
            Alert.alert('Error', errorMessage);
        }
    };

    const handleSignOut = () => {
        Alert.alert(
            'Confirm Sign Out',
            'Are you sure you want to sign out?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Yes, Sign Out',
                    style: 'destructive',
                    onPress: performSignOut,
                },
            ]
        );
    };

    const performSignOut = async () => {
        try {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('user');
            router.replace('/auth');
        } catch (error) {
            console.error('Sign-out error:', error);
            Alert.alert('Error', 'Failed to sign out. Please try again.');
        }
    };

    const handleSaveChanges = async () => {
        try {
            if (!isEditing) {
                return; 
            }
            
            const user = await AsyncStorage.getItem('user');
            if (user) {
                const userData = JSON.parse(user);
                const fullName = `${profile.firstName.trim()} ${profile.lastName.trim()}`.trim();

                const updatedUser = {
                    ...userData,
                    displayName: fullName,
                    profileImage: profile.profileImage,
                };
                await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
                setIsEditing(false);
                Alert.alert('Success', 'Profile updated successfully!');
            }
        } catch (error) {
            console.error('Save error:', error);
            Alert.alert('Error', 'Failed to save changes.');
        }
    };
    
    const displayName = `${profile.firstName.trim()} ${profile.lastName.trim()}`.trim() ;

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.headerGradient}>
                    <Text style={styles.headerTitle}>{displayName}</Text>
                    <TouchableOpacity 
                        onPress={() => setIsEditing(!isEditing)} 
                        style={styles.editButton}
                    >
                        <Edit2 size={24} color="#333" />
                        <Text style={styles.editButtonText}>
                            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.avatarSection}>
                    {profile.profileImage ? (
                        <Image source={{ uri: profile.profileImage }} style={styles.avatar} />
                    ) : (
                        <View style={styles.avatarFallback}>
                            <User size={64} color="#6b7280" />
                        </View>
                    )}
                    {isEditing && (
                        <TouchableOpacity onPress={pickImage} style={styles.cameraButton}>
                            <Camera size={20} color="#fff" />
                        </TouchableOpacity>
                    )}
                </View>
                <View style={styles.formContainer}>
                    <View style={styles.nameRow}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>First Name</Text>
                            <TextInput
                                value={profile.firstName}
                                onChangeText={(text) => setProfile({ ...profile, firstName: text })}
                                style={[styles.input, !isEditing && styles.inputReadonly]}
                                placeholder="Enter first name"
                                editable={isEditing}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Last Name</Text>
                            <TextInput
                                value={profile.lastName}
                                onChangeText={(text) => setProfile({ ...profile, lastName: text })}
                                style={[styles.input, !isEditing && styles.inputReadonly]}
                                placeholder="Enter last name"
                                editable={isEditing} /* Conditional editability */
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email (Read-Only)</Text>
                        <TextInput
                            value={profile.email}
                            editable={false}
                            style={[styles.input, styles.inputReadonly]}
                        />
                    </View>
                    {isEditing && (
                        <TouchableOpacity onPress={handleSaveChanges} style={styles.saveButton}>
                            <Text style={styles.saveButtonText}>Save Changes</Text>
                        </TouchableOpacity>
                    )}
                </View>
                <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
                    <LogOut size={20} color="#ef4444" />
                    <Text style={styles.signOutText}>Sign Out of Account</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

/* --- */

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fefefe',
    },
    scrollContainer: {
        paddingBottom: 40,
    },
    headerGradient: {
        height: 180,
        backgroundColor: '#ff92b5', 
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 40,
    },
    headerTitle: {
        fontSize: 28, 
        fontWeight: '700',
        color: '#fff', 
        marginBottom: 8,
    },
    editButton: { 
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 15,
        paddingHorizontal: 12,
        paddingVertical: 5,
        position: 'absolute',
        top: 60,
        right: 20,
    },
    editButtonText: {
        color: '#333',
        fontSize: 14,
        fontWeight: '600',
    },
    avatarSection: {
        alignItems: 'center',
        marginTop: -60,
        marginBottom: 20,
    },
    avatar: {
        width: 120, 
        height: 120,
        borderRadius: 60,
        borderWidth: 4, 
        borderColor: '#fff',
    },
    avatarFallback: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#f8fafc',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: '#e2e8f0',
    },
    cameraButton: {
        position: 'absolute',
        bottom: 5, 
        right: 120, 
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#6b7280',
        justifyContent: 'center',
        alignItems: 'center',
    },
    formContainer: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    nameRow: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 20,
    },
    inputGroup: {
        flex: 1,
    },
    label: {
        fontSize: 14,
        color: '#6b7280',
        marginBottom: 6,
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#d1d5db',
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        color: '#111827',
    },
    inputReadonly: {
        backgroundColor: '#f8fafc',
        color: '#6b7280',
    },
    saveButton: {
        backgroundColor: '#ff92b5',
        borderRadius: 24,
        paddingVertical: 14,
        alignItems: 'center',
        marginHorizontal: 20,
        marginTop: 24,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    signOutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        marginHorizontal: 20,
        paddingVertical: 16,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#fecaca',
        marginTop: 20,
    },
    signOutText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ef4444',
    },
});

export default ProfilePage;