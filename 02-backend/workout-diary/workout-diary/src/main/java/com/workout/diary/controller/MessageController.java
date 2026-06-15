package com.workout.diary.controller;

import com.workout.diary.entity.Message;
import com.workout.diary.repository.UserProfileRepository;
import com.workout.diary.requestmodels.AdminQuestionResponse;
import com.workout.diary.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = {"https://localhost:3000", "https://jane-workout.duckdns.org"})
@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private MessageService messageService;

    @Autowired
    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    // list of all Q&A
    @GetMapping("/secure/messages")
    public Page<Message> getMessages(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam(required = false) Boolean closed,  // null 가능
            Pageable pageable) throws Exception {

        List<String> roles = jwt.getClaimAsStringList("https://exercise-library.com/roles");

        if (roles == null || !roles.contains("admin")) {
            throw new Exception("Administration page only");
        }
        return messageService.getAllMessages(closed, pageable);
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

    @PutMapping("/secure/read/messages")
    public void markMessagesAsRead(@AuthenticationPrincipal Jwt jwt) {
        String userEmail = jwt.getClaim("https://exercise-library.com/email");
        messageService.markMessagesAsRead(userEmail);
    }

    @GetMapping("/secure/unread/count")
    public int getUnreadMessageCount(@AuthenticationPrincipal Jwt jwt) {
        String userEmail = jwt.getClaim("https://exercise-library.com/email");
        return messageService.getUnreadMessageCount(userEmail);
    }

    @PutMapping("/secure/admin/message")
    public void PutMessage(@AuthenticationPrincipal Jwt jwt,
                           @RequestBody AdminQuestionResponse adminQuestionResponse) throws Exception {
        String userEmail = jwt.getClaim("https://exercise-library.com/email");
        List<String> roles = jwt.getClaimAsStringList("https://exercise-library.com/roles");
        String admin = roles != null && !roles.isEmpty() ? roles.get(0) : null;
        if (admin == null || !admin.equals("admin")) {
            throw new Exception("Administration page only");
        }
        messageService.putMessage(adminQuestionResponse, userEmail);
    }

}
