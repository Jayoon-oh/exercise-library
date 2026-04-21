package com.workout.diary.repository;

import com.workout.diary.entity.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message,Long> {

    Page<Message> findByUserEmail(@RequestParam("user_email") String userEmail, Pageable pageable);

    Page<Message> findByClosed(@RequestParam("closed") boolean closed, Pageable pageable);

    // Count messages have not read
    int countByUserEmailAndClosedAndIsRead (String userEmail, boolean closed, boolean isRead);

    List<Message> findByUserEmailAndClosedAndIsRead(String userEmail, boolean closed, boolean isRead);
}
