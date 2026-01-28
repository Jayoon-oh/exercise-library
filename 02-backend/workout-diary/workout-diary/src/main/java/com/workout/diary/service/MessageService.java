package com.workout.diary.service;

import com.workout.diary.dao.MessageRepository;
import com.workout.diary.entity.Message;
import com.workout.diary.requestmodels.AdminQuestionResponse;
import jakarta.transaction.TransactionScoped;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Transactional
public class MessageService {

    private MessageRepository messageRepository;

    @Autowired
    public MessageService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    public void postMessage(Message messageRequest, String userEmail) {
        Message message = new Message(messageRequest.getTitle(), messageRequest.getQuestion());
        message.setUserEmail(userEmail);
        messageRepository.save(message);
    }

    public void pubMessage(AdminQuestionResponse adminQuestionResponse, String userEmail) throws Exception {
        Optional<Message> message = messageRepository.findById(adminQuestionResponse.getId());
        if (!message.isPresent()) {
            throw new Exception("Message not found");
        }

        message.get().setAdminEmail(userEmail);
        message.get().setResponse(adminQuestionResponse.getResponse());
        message.get().setClosed(true);
        messageRepository.save(message.get());
    }
}
