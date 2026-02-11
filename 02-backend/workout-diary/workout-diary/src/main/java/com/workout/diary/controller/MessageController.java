package com.workout.diary.controller;

import com.workout.diary.entity.Message;
import com.workout.diary.requestmodels.AdminQuestionResponse;
import com.workout.diary.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("https://localhost:3000")
@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private MessageService messageService;

    @Autowired
    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @GetMapping("/secure/search/message")
    public Page<Message> getUserMessages(@AuthenticationPrincipal Jwt jwt,
                                         Pageable pageable) {
        String userEmail = jwt.getClaim("https://exercise-library.com/email");
       return messageService.getUserMessages(userEmail, pageable);

    }

    @PutMapping("/secure/update/message")
    public void updateMessage(@AuthenticationPrincipal Jwt jwt,
                              @RequestParam Long messageId,
                              @RequestBody Message messageRequest) throws Exception {
        String userEmail = jwt.getClaim("https://exercise-library.com/email");
        messageService.updateMessage(userEmail, messageId, messageRequest);
    }

    @DeleteMapping("/secure/delete/message")
    public void deleteMessage(@AuthenticationPrincipal Jwt jwt,
                              @RequestParam Long messageId) throws Exception {
        String userEmail = jwt.getClaim("https://exercise-library.com/email");
        messageService.deleteMessage(userEmail, messageId);
    }


    @PostMapping("/secure/add/message")
    public void postMessage(@AuthenticationPrincipal Jwt jwt,
                            @RequestBody Message messageRequest) {
        String userEmail = jwt.getClaim("https://exercise-library.com/email");
        messageService.postMessage(messageRequest, userEmail);
    }

    @PutMapping("/secure/admin/message")
    public void PutMessage(@AuthenticationPrincipal Jwt jwt,
                           @RequestBody AdminQuestionResponse adminQuestionResponse) throws Exception {
        String userEmail = jwt.getClaim("https://exercise-library.com/email");
        List<String> roles = jwt.getClaimAsStringList("https://exercise-library.com/roles");
        String admin = roles != null && !roles.isEmpty() ? roles.get(0) : null;
        if (admin == null || !admin.equals("admin")) {
            throw new Exception("관리자만 가능합니다.");
        }
        messageService.pubMessage(adminQuestionResponse, userEmail);
    }

}
