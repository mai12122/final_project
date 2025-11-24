import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function JoinClassroomScreen() {
  const [classCode, setClassCode] = useState('');

  const handleJoin = () => {
    const code = classCode.trim().toUpperCase();
    if (!code) {
      Alert.alert('Invalid Code', 'Please enter a class code.');
      return;
    }

    const validClasses = {
      FEC201: { id: 4, name: 'FEC201: Algorithm I', lecturer: 'Dr. Smith' },
      MATH202: { id: 5, name: 'MATH202: Calculus II', lecturer: 'Prof. Lee' },
    };

    if (validClasses[code]) {
      Alert.alert(
        'Success!',
        `You joined ${validClasses[code].name}`,
        [
          { text: 'Go to Class', onPress: () => router.push('/class-detail') },
          { text: 'Back to Home', onPress: () => router.replace('/(tabs)/index') },
        ]
      );
    } else {
      Alert.alert(
        'Class Not Found',
        `No class found with code "${code}". Try FEC201 or MATH202.`,
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Join Classroom</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.content}>
          <View style={styles.iconCircle}>
            <Text style={styles.icon}>🎓</Text>
          </View>

          <Text style={styles.title}>Join a Classroom</Text>
          <Text style={styles.subtitle}>
            Enter the class code provided by your instructor
          </Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="e.g. FEC201"
              value={classCode}
              onChangeText={setClassCode}
              autoCapitalize="characters"
              keyboardType="default"
              returnKeyType="done"
              onSubmitEditing={handleJoin}
              maxLength={10}
            />
            <TouchableOpacity style={styles.joinButton} onPress={handleJoin}>
              <Text style={styles.joinButtonText}>Join</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.tip}>
            💡 Tip: Ask your lecturer for the class code — it’s usually 5–7 letters/numbers.
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 40,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  icon: {
    fontSize: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 17,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  joinButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  tip: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 300,
  },
});