package exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND) // 404
public class ActivatedRoutineNotFoundException extends RuntimeException{
    public ActivatedRoutineNotFoundException(String message) {
        super(message);
    }
}
