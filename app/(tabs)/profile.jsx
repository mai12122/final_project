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
import React, { useState, createContext, useContext } from 'react';
import { Ionicons } from '@expo/vector-icons';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
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

const SettingsModal = ({ visible, onClose, onLogout }) => {
  if (!visible) return null;

  const handleOptionPress = (title) => {
    Alert.alert('Coming Soon', `"${title}" will be available in a future update.`);
    onClose();
  };

  const handleLogoutPress = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel', onPress: onClose },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => {
            onClose();
            onLogout();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Settings</Text>
          <TouchableOpacity
            onPress={onClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.settingItem} onPress={() => handleOptionPress('Notifications')}>
          <Ionicons name="notifications-outline" size={20} color="#4b5563" />
          <Text style={styles.settingText}>Notifications</Text>
          <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} onPress={() => handleOptionPress('Edit')}>
          <Ionicons name="edit" size={20} color="#4b5563" />
          <Text style={styles.settingText}>Edit Profile</Text>
          <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} onPress={() => handleOptionPress('Privacy')}>
          <Ionicons name="shield-checkmark-outline" size={20} color="#4b5563" />
          <Text style={styles.settingText}>Privacy & Security</Text>
          <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} onPress={() => handleOptionPress('Help')}>
          <Ionicons name="help-circle-outline" size={20} color="#4b5563" />
          <Text style={styles.settingText}>Help & Support</Text>
          <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} onPress={() => handleOptionPress('About')}>
          <Ionicons name="information-circle-outline" size={20} color="#4b5563" />
          <Text style={styles.settingText}>About</Text>
          <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.settingItem, { borderTopWidth: 1, borderTopColor: '#f3f4f6', marginTop: 24 }]}
          onPress={handleLogoutPress}
        >
          <Ionicons name="log-out-outline" size={20} color="#ef4444" />
          <Text style={[styles.settingText, { color: '#ef4444' }]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Profile = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [avatarUri, setAvatarUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const getAvatarSource = () => {
    if (avatarUri) return { uri: avatarUri };
    if (user?.avatar) return { uri: user.avatar };
    if (user?.name) {
      const cleanName = encodeURIComponent(user.name.trim().replace(/\s+/g, '+'));
      return {
        uri: `https://ui-avatars.com/api/?name=${cleanName}&background=6366f1&color=fff&size=200`,
      };
    }
    return { uri: 'https://picsum.photos/200/200' };
  };
  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      const { status: newStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      return newStatus === 'granted';
    }
    return true;
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
          {
            text: 'Open Settings',
            onPress: () => {
              if (ImagePicker.openSettings) ImagePicker.openSettings();
            },
          },
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

      if (!result.canceled && result.assets?.[0]?.uri) {
        setAvatarUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('ImagePicker error:', error);
      Alert.alert('Error', 'Failed to pick an image. Please try again.');
    }
  };

  const academicYear = '2nd Year';
  const averageScore = 84;
  const streakDays = 7;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.container}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.profileCard}>
          <View style={styles.avatarWrapper}>
            <Image source={getAvatarSource()} style={styles.avatarImage} />
            <TouchableOpacity
              style={styles.editButton}
              onPress={pickImage}
              disabled={loading}
              accessibilityLabel="Change profile picture"
            >
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
              <Text style={[styles.badgeText, { color: '#f59e0b' }]}>Avg: {averageScore}%</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: '#dcfce7' }]}>
              <Ionicons name="flame" size={14} color="#22c55e" />
              <Text style={[styles.badgeText, { color: '#22c55e' }]}>
                {streakDays}-Day Streak
              </Text>
            </View>
          </View>
        </View>
        <View style={[styles.sectionCard, { marginTop: 24 }]}>
          <TouchableOpacity style={styles.sectionRow} onPress={() => setSettingsVisible(true)}>
            <View style={styles.iconContainer}>
              <Ionicons name="settings-outline" size={20} color="#4f46e5" />
            </View>
            <Text style={styles.sectionText}>Settings</Text>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>
      </ScrollView>
      <SettingsModal
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
        onLogout={logout}
      />
    </SafeAreaView>
  );
};

const ProfileWithProvider = () => (
  <AuthProvider>
    <Profile />
  </AuthProvider>
);

export default ProfileWithProvider;

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
    paddingTop: 16,
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
    backgroundColor: '#4f46e5',
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
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#ede9fe',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },

 
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '75%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  settingText: {
    fontSize: 16,
    color: '#1f2937',
    flex: 1,
    marginLeft: 12,
  },
});