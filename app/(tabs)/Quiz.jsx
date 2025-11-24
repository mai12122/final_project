import React, { useState, useRef, useEffect } from 'react';
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
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function JoinQuizScreen() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputs = useRef([]);

  const handleTextChange = (text, index) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Auto-focus next input
    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }

    // If all filled, submit
    if (index === 5 && text) {
      handleSubmit();
    }
  };

  const handleBackspace = (index) => {
    if (code[index] === '' && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    const fullCode = code.join('').toUpperCase();
    if (fullCode.length !== 6) {
      Alert.alert('Invalid Code', 'Please enter a 6-character code.');
      return;
    }

    const validQuizzes = {
      QZ42XX: { name: 'Algorithm Quiz #1', class: 'FEC201' },
      QZ09YY: { name: 'Calculus Midterm', class: 'MATH202' },
    };

    if (validQuizzes[fullCode]) {
      Alert.alert(
        '🎉 Quiz Found!',
        `Ready for "${validQuizzes[fullCode].name}"?`,
        [
          { 
            text: 'Start Quiz', 
            onPress: () => router.push({
              pathname: '/quiz',
              params: { quizId: fullCode, quizName: validQuizzes[fullCode].name }
            }) 
          },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    } else {
      Alert.alert(
        'Quiz Not Found',
        `No active quiz with code "${fullCode}". Try QZ42XX or QZ09YY.`,
        [{ text: 'OK' }]
      );
    }
  };

  const handleClear = () => {
    setCode(['', '', '', '', '', '']);
    inputs.current[0]?.focus();
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
          <Text style={styles.headerTitle}>Join Quiz</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.content}>
          <View style={styles.iconCircle}>
            <Text style={styles.icon}>🎯</Text>
          </View>

          <Text style={styles.title}>Join a Quiz</Text>
          <Text style={styles.subtitle}>
            Enter the 6-digit quiz code provided by your instructor.
          </Text>

          {/* Code Input Boxes */}
          <View style={styles.codeContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputs.current[index] = ref)}
                style={[styles.codeInput, digit ? styles.filled : null]}
                value={digit}
                onChangeText={(text) => handleTextChange(text, index)}
                onKeyPress={({ nativeEvent }) => {
                  if (nativeEvent.key === 'Backspace') {
                    handleBackspace(index);
                  }
                }}
                keyboardType="number-pad"
                maxLength={1}
                textAlign="center"
                autoFocus={index === 0}
              />
            ))}
          </View>

          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <Text style={styles.clearText}>❌ Clear</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.joinButton} onPress={handleSubmit}>
            <Text style={styles.joinButtonText}>Join Quiz</Text>
          </TouchableOpacity>

          <Text style={styles.tip}>
            ⏱️ Quiz codes are time-sensitive — make sure your lecturer has started the quiz!
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
    backgroundColor: '#f3e8ff',
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
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 24,
  },
  codeInput: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: '#3b82f6',
    borderRadius: 8,
    fontSize: 24,
    textAlign: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  filled: {
    backgroundColor: '#dbeafe',
  },
  clearButton: {
    marginBottom: 16,
  },
  clearText: {
    color: '#ef4444',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  joinButton: {
    backgroundColor: '#a855f7',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 24,
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