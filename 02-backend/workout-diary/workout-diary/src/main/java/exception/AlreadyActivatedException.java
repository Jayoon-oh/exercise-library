package exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT) // 409
public class AlreadyActivatedException extends RuntimeException{
    public AlreadyActivatedException(String message) {
        super(message);
    }
}
