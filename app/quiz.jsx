
import { View, Text, SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function QuizScreen() {
  const { quizId, quizCode, quizName, classCode } = useLocalSearchParams();
  const id = Array.isArray(quizId) ? quizId[0] : quizId;
  const code = Array.isArray(quizCode) ? quizCode[0] : quizCode;
  const name = Array.isArray(quizName) ? quizName[0] : quizName;
  const classCodeVal = Array.isArray(classCode) ? classCode[0] : classCode;

  const quizData = {
    currentQuestion: 13,
    totalQuestions: 20,
    timeLeft: 18, 
    question: "How many students in your class _from korea?",
    options: [
      { text: "come", isCorrect: true },
      { text: "comes", isCorrect: false },
      { text: "are coming", isCorrect: false },
      { text: "came", isCorrect: false },
    ],
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.timerContainer}>
            <Text style={styles.timerNumber}>{quizData.timeLeft}</Text>
            <Text style={styles.timerLabel}>sec</Text>
          </View>
          <View style={styles.progressContainer}>
            <Text style={styles.questionCounter}>
              Question {quizData.currentQuestion}/{quizData.totalQuestions}
            </Text>
          </View>
        </View>

        {/* Question Card */}
        <View style={styles.questionCard}>
          <Text style={styles.questionText}>{quizData.question}</Text>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {quizData.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                option.isCorrect && styles.correctOption,
                !option.isCorrect && styles.incorrectOption,
              ]}
            >
              <Text style={styles.optionText}>{option.text}</Text>
              {option.isCorrect ? (
                <Ionicons name="checkmark-circle" size={20} color="#16a34a" />
              ) : (
                <Ionicons name="close-circle" size={20} color="#ef4444" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Tap an option to answer. Correct answers are marked immediately.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  timerContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  timerNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e40af',
  },
  timerLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  progressContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  questionCounter: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  questionCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    lineHeight: 26,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  correctOption: {
    borderColor: '#16a34a',
    backgroundColor: '#dcfce7',
  },
  incorrectOption: {
    borderColor: '#ef4444',
    backgroundColor: '#fee2e2',
  },
  optionText: {
    fontSize: 16,
    color: '#1e293b',
    flex: 1,
  },
  footer: {
    marginTop: 30,
    marginBottom: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
});