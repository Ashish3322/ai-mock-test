package com.aiinterview.prep.service;

import com.aiinterview.prep.dto.AdminStatsDto;
import com.aiinterview.prep.dto.DashboardStatsDto;
import com.aiinterview.prep.dto.InterviewSessionDto;
import com.aiinterview.prep.entity.InterviewResponse;
import com.aiinterview.prep.entity.InterviewSession;
import com.aiinterview.prep.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final InterviewSessionRepository sessionRepository;
    private final InterviewResponseRepository responseRepository;
    private final UserRepository userRepository;
    private final QuestionRepository questionRepository;

    @Autowired
    public DashboardService(InterviewSessionRepository sessionRepository,
                            InterviewResponseRepository responseRepository,
                            UserRepository userRepository,
                            QuestionRepository questionRepository) {
        this.sessionRepository = sessionRepository;
        this.responseRepository = responseRepository;
        this.userRepository = userRepository;
        this.questionRepository = questionRepository;
    }

    @Transactional(readOnly = true)
    public DashboardStatsDto getStudentStats(Long userId) {
        DashboardStatsDto stats = new DashboardStatsDto();

        long totalInterviews = sessionRepository.countByUserId(userId);
        long completedSessions = sessionRepository.countByUserIdAndStatus(userId, "COMPLETED");
        Double avgScore = sessionRepository.findAverageScoreByUserId(userId);
        Double bestScore = sessionRepository.findMaxScoreByUserId(userId);

        stats.setTotalInterviews(totalInterviews);
        stats.setCompletedSessions(completedSessions);
        stats.setAverageScore(avgScore != null ? Math.round(avgScore * 10.0) / 10.0 : 0.0);
        stats.setBestScore(bestScore != null ? Math.round(bestScore * 10.0) / 10.0 : 0.0);

        List<InterviewSession> allSessions = sessionRepository.findByUserIdOrderByStartedAtDesc(userId);
        List<InterviewSessionDto> recent = allSessions.stream().limit(5).map(s -> {
            List<InterviewResponse> resps = responseRepository.findBySessionIdOrderByIdAsc(s.getId());
            return new InterviewSessionDto(s, resps);
        }).collect(Collectors.toList());
        stats.setRecentInterviews(recent);

        // Calculate average skills from completed sessions
        List<InterviewSession> completed = allSessions.stream()
                .filter(s -> "COMPLETED".equals(s.getStatus()))
                .collect(Collectors.toList());

        Map<String, Double> skills = new HashMap<>();
        if (!completed.isEmpty()) {
            double correctness = completed.stream().mapToDouble(InterviewSession::getCorrectnessAvg).average().orElse(0.0) * 10.0;
            double relevance = completed.stream().mapToDouble(InterviewSession::getRelevanceAvg).average().orElse(0.0) * 10.0;
            double completeness = completed.stream().mapToDouble(InterviewSession::getCompletenessAvg).average().orElse(0.0) * 10.0;
            double clarity = completed.stream().mapToDouble(InterviewSession::getClarityAvg).average().orElse(0.0) * 10.0;

            skills.put("Technical Skills", Math.round(correctness * 10.0) / 10.0);
            skills.put("Correctness", Math.round(correctness * 10.0) / 10.0);
            skills.put("Relevance", Math.round(relevance * 10.0) / 10.0);
            skills.put("Completeness", Math.round(completeness * 10.0) / 10.0);
            skills.put("Communication", Math.round(clarity * 10.0) / 10.0);
        } else {
            skills.put("Technical Skills", 0.0);
            skills.put("Correctness", 0.0);
            skills.put("Relevance", 0.0);
            skills.put("Completeness", 0.0);
            skills.put("Communication", 0.0);
        }
        stats.setSkillsBreakdown(skills);

        // Strengths & areas to improve (dynamically collected from past candidate feedback)
        Set<String> strengths = new LinkedHashSet<>();
        Set<String> areas = new LinkedHashSet<>();

        for (InterviewSessionDto sessionDto : recent) {
            for (InterviewSessionDto.ResponseDetailDto r : sessionDto.getResponses()) {
                if (r.getStrengths() != null) strengths.addAll(r.getStrengths());
                if (r.getWeaknesses() != null) areas.addAll(r.getWeaknesses());
            }
        }

        if (strengths.isEmpty()) {
            strengths.add("Complete your first interview session to unlock your verified strengths.");
        }
        if (areas.isEmpty()) {
            areas.add("Complete a practice session to receive targeted focal improvement areas.");
        }

        stats.setStrengths(new ArrayList<>(strengths).stream().limit(5).collect(Collectors.toList()));
        stats.setAreasToImprove(new ArrayList<>(areas).stream().limit(5).collect(Collectors.toList()));

        return stats;
    }

    @Transactional(readOnly = true)
    public AdminStatsDto getAdminStats() {
        long totalUsers = userRepository.count();
        long totalInterviews = sessionRepository.count();
        long totalQuestions = questionRepository.count();
        Double avg = sessionRepository.findPlatformAverageScore();
        double avgScore = avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0;

        return new AdminStatsDto(totalUsers, totalInterviews, totalQuestions, avgScore);
    }
}
