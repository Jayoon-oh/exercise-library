package com.workout.diary.service;

import com.workout.diary.repository.MessageRepository;
import com.workout.diary.entity.Message;
import com.workout.diary.requestmodels.AdminQuestionResponse;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class MessageService {

    private MessageRepository messageRepository;

    @Autowired
    public MessageService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    public void deleteMessage(String userEmail, Long messageId) throws Exception {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new Exception("메시지를 찾을 수 없습니다."));

        if (message.isClosed()) {
            throw new Exception("답변이 완료된 후 질문은 삭제할 수 없습니다");
        }
        if (!message.getUserEmail().equals(userEmail)) {
            throw new Exception("삭제 권한이 없습니다.");
        }
        messageRepository.delete(message);
    }

    public void updateMessage(String userEmail, Long messageId, Message updatedRequest) throws Exception {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new Exception("메시지를 찾을 수 없습니다."));

        if (message.isClosed()) {
            throw new Exception("답변이 완료된 질문은 수정할 수 없습니다.");
        }
        message.setTitle(updatedRequest.getTitle());
        message.setQuestion(updatedRequest.getQuestion());
        messageRepository.save(message);

    }

    public Page<Message> getUserMessages(String userEmail, Pageable pageable) {
        Sort sort = Sort.by(Sort.Order.asc("closed"), Sort.Order.desc("createdAt"));

        Pageable sortedPageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort);

        return messageRepository.findByUserEmail(userEmail, sortedPageable);

    }

    public Page<Message> getAllMessages(Boolean closed , Pageable pageable) {
        Sort sort = Sort.by(Sort.Order.asc("closed"), Sort.Order.desc("createdAt"));
        Pageable sortedPageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort);

        if (closed == null) {
            return messageRepository.findAll(sortedPageable);
        }
        return messageRepository.findByClosed(closed, sortedPageable);
    }

    // add new Q&A message
    public void postMessage(Message messageRequest, String userEmail) {
        Message message = new Message(messageRequest.getTitle(), messageRequest.getQuestion());
        message.setUserEmail(userEmail);
        messageRepository.save(message);
    }

    // Count messages have not read
    public int getUnreadMessageCount(String userEmail) {
        return messageRepository.countByUserEmailAndClosedAndIsRead(userEmail, true, false);
    }

    public void markMessagesAsRead(String userEmail) {
        List<Message> unreadMessages = messageRepository.findByUserEmailAndClosedAndIsRead(userEmail, true, false);

        for (Message message : unreadMessages) {
            message.setRead(true);
        }

        messageRepository.saveAll(unreadMessages);
    }


    public void putMessage(AdminQuestionResponse adminQuestionResponse, String userEmail) throws Exception {
        Optional<Message> message = messageRepository.findById(adminQuestionResponse.getId());
        if (!message.isPresent()) {
            throw new Exception("Message not found");
        }

        message.get().setAdminEmail(userEmail);
        message.get().setResponse(adminQuestionResponse.getResponse());
        message.get().setClosed(true);
        message.get().setRead(false);
        messageRepository.save(message.get());
    }
}
