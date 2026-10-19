package com.aiinterview.prep.ai;

import com.aiinterview.prep.dto.EvaluationResult;
import org.springframework.stereotype.Service;

import java.util.*;

@Service("mockAiEvaluationService")
public class MockAiEvaluationService implements AiEvaluationService {

    private static final Set<String> STOP_WORDS = Set.of(
            "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't",
            "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "can",
            "can't", "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't",
            "down", "during", "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't", "have",
            "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him",
            "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't",
            "it", "it's", "its", "itself", "let's", "me", "more", "most", "mustn't", "my", "myself", "no", "nor",
            "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out",
            "over", "own", "same", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "so", "some",
            "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there",
            "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", "those", "through", "to",
            "too", "under", "until", "up", "very", "was", "wasn't", "we", "we'd", "we'll", "we're", "we've", "were",
            "weren't", "what", "what's", "when", "when's", "where", "where's", "which", "while", "who", "who's",
            "whom", "why", "why's", "with", "won't", "would", "wouldn't", "you", "you'd", "you'll", "you're",
            "you've", "your", "yours", "yourself", "yourselves"
    );

    @Override
    public EvaluationResult evaluateAnswer(String questionText, String category, String expectedTopics, String modelAnswer, String candidateAnswer) {
        if (candidateAnswer == null || candidateAnswer.trim().isEmpty()) {
            return new EvaluationResult(
                    1, 1, 1, 1, 1,
                    List.of("No answer provided"),
                    List.of("Candidate skipped this question", "Review technical fundamentals"),
                    "You submitted a blank answer. In a real interview, an unanswered question receives 0 marks. Please prepare this topic thoroughly."
            );
        }

        String rawAnswer = candidateAnswer.trim();
        String answerLower = rawAnswer.toLowerCase();
        String[] words = answerLower.split("\\W+");
        int totalWords = 0;
        for (String w : words) {
            if (!w.isBlank()) totalWords++;
        }

        // 1. Ultra short check (< 5 words)
        if (totalWords < 5) {
            return new EvaluationResult(
                    1, 1, 1, 1, 1,
                    List.of("Brief attempt made"),
                    List.of("Answer is too brief and incomplete", "Provide an explanation with technical details"),
                    "Your answer is way too short. Technical interviews require conceptual clarity, reasoning, and practical context rather than a single word or phrase."
            );
        }

        // 2. Repetitive spam / gibberish check (unique word ratio)
        Set<String> uniqueWords = new HashSet<>(Arrays.asList(words));
        double uniqueRatio = (double) uniqueWords.size() / totalWords;
        if (totalWords >= 10 && uniqueRatio < 0.35) {
            return new EvaluationResult(
                    1, 1, 1, 1, 1,
                    List.of("Text submitted"),
                    List.of("High repetition detected / gibberish", "Provide coherent technical explanation"),
                    "Your response contains excessive repetition or filler words. Please provide a clear, coherent technical answer."
            );
        }

        // 3. Expected topic matching
        String[] topics = expectedTopics != null ? expectedTopics.split(",") : new String[0];
        int matchedTopics = 0;
        List<String> matchedTopicNames = new ArrayList<>();
        List<String> missingTopicNames = new ArrayList<>();

        for (String topic : topics) {
            String cleanTopic = topic.trim().toLowerCase();
            if (!cleanTopic.isEmpty()) {
                if (answerLower.contains(cleanTopic)) {
                    matchedTopics++;
                    matchedTopicNames.add(topic.trim());
                } else {
                    missingTopicNames.add(topic.trim());
                }
            }
        }

        // 4. Keyword overlap with Model Answer
        Set<String> modelKeywords = extractKeywords(modelAnswer);
        int matchedModelKeywords = 0;
        for (String kw : modelKeywords) {
            if (answerLower.contains(kw)) {
                matchedModelKeywords++;
            }
        }
        double modelOverlap = modelKeywords.isEmpty() ? 0.0 : (double) matchedModelKeywords / modelKeywords.size();
        double topicCoverage = topics.length == 0 ? modelOverlap : (double) matchedTopics / topics.length;

        // 5. STRICT CHECK: If BOTH topic coverage and model keyword overlap are near zero -> IRRELEVANT / GIBBERISH
        if (matchedTopics == 0 && modelOverlap < 0.10) {
            return new EvaluationResult(
                    1, 1, 1, 1, 1,
                    List.of("Attempted the question"),
                    List.of(
                            "Answer is completely off-topic or irrelevant to the technical question",
                            !missingTopicNames.isEmpty() ? "Missed core topics: " + String.join(", ", missingTopicNames.subList(0, Math.min(3, missingTopicNames.size()))) : "Key technical explanation missing"
                    ),
                    "Unsatisfactory response. Your answer does not contain the key technical concepts required for this question (" +
                            (!missingTopicNames.isEmpty() ? String.join(", ", missingTopicNames.subList(0, Math.min(3, missingTopicNames.size()))) : "core concepts") +
                            "). In an actual interview, this answer would receive a failing score (1/10). Please review the fundamental concepts."
            );
        }

        // 6. LOW RELEVANCE: (0 topics and only superficial word overlap)
        if (matchedTopics == 0 && modelOverlap < 0.25) {
            return new EvaluationResult(
                    3, 2, 3, 2, 3,
                    List.of("General awareness of the field"),
                    List.of(
                            "Superficial response with little technical depth",
                            !missingTopicNames.isEmpty() ? "Must cover: " + String.join(", ", missingTopicNames.subList(0, Math.min(3, missingTopicNames.size()))) : "Elaborate with actual mechanics and code"
                    ),
                    "Below average. Your response touches loosely on the subject but lacks specific technical accuracy and coverage of the core mechanism. Review the model answer and practice explaining the 'how' and 'why'."
            );
        }

        // 7. Calculate scores based on real coverage
        double combinedScoreWeight = (topicCoverage * 0.6) + (modelOverlap * 0.4);

        int correctness;
        int relevance;
        int completeness;
        int clarity;

        if (combinedScoreWeight >= 0.75) {
            correctness = totalWords > 40 ? 9 : 8;
            relevance = 9;
            completeness = totalWords > 50 ? 9 : 8;
            clarity = 9;
        } else if (combinedScoreWeight >= 0.50) {
            correctness = 7;
            relevance = 8;
            completeness = totalWords > 40 ? 7 : 6;
            clarity = 7;
        } else if (combinedScoreWeight >= 0.25) {
            correctness = 5;
            relevance = 6;
            completeness = 5;
            clarity = 6;
        } else {
            correctness = 3;
            relevance = 4;
            completeness = 3;
            clarity = 4;
        }

        // Word count penalties
        if (totalWords < 20) {
            completeness = Math.max(2, completeness - 3);
            correctness = Math.max(2, correctness - 2);
        }

        int overallScore = (int) Math.round((correctness * 0.40) + (relevance * 0.25) + (completeness * 0.20) + (clarity * 0.15));
        overallScore = Math.min(10, Math.max(1, overallScore));

        // Strengths & Weaknesses
        List<String> strengths = new ArrayList<>();
        List<String> weaknesses = new ArrayList<>();

        if (!matchedTopicNames.isEmpty()) {
            strengths.add("Covered key concepts: " + String.join(", ", matchedTopicNames.subList(0, Math.min(2, matchedTopicNames.size()))));
        }
        if (totalWords >= 35 && overallScore >= 6) {
            strengths.add("Well-structured technical reasoning");
        }
        if (overallScore >= 8) {
            strengths.add("Strong alignment with industry-expected answers");
        }
        if (strengths.isEmpty()) {
            strengths.add("Basic terminology identified");
        }

        if (!missingTopicNames.isEmpty()) {
            weaknesses.add("Discuss additional key aspects: " + String.join(", ", missingTopicNames.subList(0, Math.min(2, missingTopicNames.size()))));
        }
        if (totalWords < 30) {
            weaknesses.add("Elaborate further with real-world examples and code snippets");
        }
        if (overallScore < 7) {
            weaknesses.add("Strengthen depth regarding architectural tradeoffs and internal workings");
        }

        StringBuilder feedbackBuilder = new StringBuilder();
        if (overallScore >= 8) {
            feedbackBuilder.append("Excellent response! You demonstrated solid technical depth and addressed the core concepts accurately.");
        } else if (overallScore >= 6) {
            feedbackBuilder.append("Good answer. You understand the foundational idea, but adding practical code examples or internal workings would make it interview-ready.");
        } else if (overallScore >= 4) {
            feedbackBuilder.append("Average attempt. You mentioned relevant terms, but your explanation is incomplete and lacks technical precision.");
        } else {
            feedbackBuilder.append("Weak response. Major conceptual gaps detected. Focus on understanding the core mechanisms and practice articulating them systematically.");
        }

        if (!missingTopicNames.isEmpty() && overallScore < 9) {
            feedbackBuilder.append(" Make sure to also mention: ")
                    .append(String.join(", ", missingTopicNames.subList(0, Math.min(3, missingTopicNames.size()))))
                    .append(".");
        }

        return new EvaluationResult(
                overallScore,
                correctness,
                relevance,
                completeness,
                clarity,
                strengths,
                weaknesses,
                feedbackBuilder.toString()
        );
    }

    private Set<String> extractKeywords(String text) {
        Set<String> keywords = new HashSet<>();
        if (text == null || text.isBlank()) return keywords;
        String[] tokens = text.toLowerCase().split("\\W+");
        for (String t : tokens) {
            if (t.length() > 3 && !STOP_WORDS.contains(t)) {
                keywords.add(t);
            }
        }
        return keywords;
    }
}
