package com.workout.diary.controller;

import com.workout.diary.entity.Message;
import com.workout.diary.requestmodels.AdminQuestionResponse;
import com.workout.diary.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private MessageService messageService;

    @Autowired
    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @PostMapping("/secure/add/message")
    public void postMessage(@AuthenticationPrincipal Jwt jwt,
                            @RequestBody Message messageRequest) {
        String userEmail = jwt.getClaim("http://exercise-library.com/email");
        messageService.postMessage(messageRequest, userEmail);
    }

    @PutMapping("/secure/admin/message")
    public void PutMessage(@AuthenticationPrincipal Jwt jwt,
                           @RequestBody AdminQuestionResponse adminQuestionResponse) throws Exception {
        String userEmail = jwt.getClaim("http://exercise-library.com/email");
        List<String> roles = jwt.getClaimAsStringList("http://exercise-library.com/roles");
        String admin = roles != null && !roles.isEmpty() ? roles.get(0) : null;
        if (admin == null || !admin.equals("admin")) {
            throw new Exception("관리자만 가능합니다.");
        }
        messageService.pubMessage(adminQuestionResponse, userEmail);
    }

}
