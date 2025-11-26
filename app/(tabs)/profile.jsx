import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import React, { useState, createContext, useContext, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState({
    id: 'user_123',
    name: 'Alex Johnson',
    email: 'alex.j@student.edu',
  });

  const logout = () => {
    setUser(null);
    router.replace('/auth');
  };

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

const requestPermissions = async () => {
  const { status: libraryStatus } = await ImagePicker.getMediaLibraryPermissionsAsync();
  if (libraryStatus !== 'granted') {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return status === 'granted';
  }
  return true;
};

const Profile = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [avatarUri, setAvatarUri] = useState(null);
  const [loading, setLoading] = useState(false);

  const getAvatarSource = () => {
    if (avatarUri) return { uri: avatarUri };
    if (user && user.avatar) return { uri: user.avatar };
    if (user && user.name) {
      const cleanName = encodeURIComponent(user.name.trim().replace(/\s+/g, '+'));
      return { uri: `https://ui-avatars.com/api/?name=${cleanName}&background=6366f1&color=fff&size=200` };
    }
    return { uri: 'https://picsum.photos/200/200' };
  };

  const pickImage = async () => {
    setLoading(true);
    const hasPermission = await requestPermissions();
    setLoading(false);

    if (!hasPermission) {
      Alert.alert(
        'Permission Required',
        'We need access to your photo library to change your avatar.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => ImagePicker.openSettings() },
        ]
      );
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]?.uri) {
        setAvatarUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick an image. Please try again.');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log Out', style: 'destructive', onPress: logout },
      ]
    );
  };

  const academicYear = '2nd Year';
  const averageScore = 84;
  const streakDays = 7;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.container}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.profileCard}>
          <View style={styles.avatarWrapper}>
            <Image source={getAvatarSource()} style={styles.avatarImage} />
            <TouchableOpacity style={styles.editButton} onPress={pickImage} disabled={loading}>
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="camera-outline" size={18} color="#fff" />
              )}
            </TouchableOpacity>
          </View>

          <Text style={styles.userNameText}>{user ? user.name : 'Guest User'}</Text>
          <Text style={styles.userEmailText}>{user ? user.email : '—'}</Text>

          <View style={styles.badgesRow}>
            <View style={[styles.badge, { backgroundColor: '#e0f2fe' }]}>
              <Ionicons name="school-outline" size={14} color="#0ea5e9" />
              <Text style={[styles.badgeText, { color: '#0ea5e9' }]}>{academicYear}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: '#fef3c7' }]}>
              <Ionicons name="star-outline" size={14} color="#f59e0b" />
              <Text style={[styles.badgeText, { color: '#f59e0b' }]}>
                Avg: {averageScore}%
              </Text>
            </View>
            <View style={[styles.badge, { backgroundColor: '#dcfce7' }]}>
              <Ionicons name="flame" size={14} color="#22c55e" />
              <Text style={[styles.badgeText, { color: '#22c55e' }]}>7-Day Streak</Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.logoutSection}>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={20} color="#ef4444" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#f9fafb',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
  },
  backButton: {
    padding: 8,
  },
  container: { 
    flex: 1, 
  },
  scrollViewContent: { 
    paddingBottom: 40,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  avatarWrapper: { 
    position: 'relative',
    marginBottom: 16,
  },
  avatarImage: { 
    width: 140, 
    height: 140, 
    borderRadius: 70,
    backgroundColor: '#f3f4f6',
  },
  editButton: { 
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1d4ed8',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  userNameText: { 
    fontSize: 22, 
    fontWeight: '700', 
    color: '#111827',
    marginBottom: 4,
  },
  userEmailText: {
    fontSize: 15,
    color: '#6b7280',
    marginBottom: 16,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 24,
  },
  logoutSection: {
    marginTop: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  logoutText: { 
    fontSize: 17, 
    fontWeight: '600', 
    color: '#ef4444',
    marginLeft: 12,
  },
});

export default function ProfileWithProvider() {
  return (
    <AuthProvider>
      <Profile />
    </AuthProvider>
  );
}