package com.aiinterview.prep.repository;

import com.aiinterview.prep.entity.McqQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface McqQuestionRepository extends JpaRepository<McqQuestion, Long> {
    List<McqQuestion> findByActiveTrue();
    List<McqQuestion> findByTrackIgnoreCaseAndActiveTrue(String track);
    List<McqQuestion> findByDifficultyIgnoreCaseAndActiveTrue(String difficulty);
    List<McqQuestion> findByTrackIgnoreCaseAndDifficultyIgnoreCaseAndActiveTrue(String track, String difficulty);
    long countByTrackIgnoreCaseAndActiveTrue(String track);
}
