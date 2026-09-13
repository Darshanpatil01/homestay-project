package com.homestay.presentation.exception;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.multipart.support.MissingServletRequestPartException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartException;
import org.springframework.web.server.ResponseStatusException;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ApiErrorResponse>
            handleResponseStatusException(
                    ResponseStatusException exception,
                    HttpServletRequest request
            ) {

        int statusCode =
                exception.getStatusCode().value();

        String errorName = resolveErrorName(statusCode);

        String message =
                exception.getReason() != null
                        ? exception.getReason()
                        : "Request could not be completed.";

        ApiErrorResponse response = createResponse(
                statusCode,
                errorName,
                message,
                request.getRequestURI(),
                null
        );

        return ResponseEntity
                .status(exception.getStatusCode())
                .body(response);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse>
            handleValidationException(
                    MethodArgumentNotValidException exception,
                    HttpServletRequest request
            ) {

        Map<String, String> validationErrors =
                new LinkedHashMap<>();

        exception.getBindingResult()
                .getFieldErrors()
                .forEach(error ->
                        validationErrors.putIfAbsent(
                                error.getField(),
                                error.getDefaultMessage()
                        )
                );

        ApiErrorResponse response = createResponse(
                HttpStatus.BAD_REQUEST.value(),
                HttpStatus.BAD_REQUEST.getReasonPhrase(),
                "Validation failed. Check the submitted fields.",
                request.getRequestURI(),
                validationErrors
        );

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(response);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiErrorResponse>
            handleConstraintViolation(
                    ConstraintViolationException exception,
                    HttpServletRequest request
            ) {

        Map<String, String> validationErrors =
                new LinkedHashMap<>();

        exception.getConstraintViolations()
                .forEach(violation ->
                        validationErrors.put(
                                violation
                                        .getPropertyPath()
                                        .toString(),
                                violation.getMessage()
                        )
                );

        ApiErrorResponse response = createResponse(
                HttpStatus.BAD_REQUEST.value(),
                HttpStatus.BAD_REQUEST.getReasonPhrase(),
                "Request validation failed.",
                request.getRequestURI(),
                validationErrors
        );

        return ResponseEntity
                .badRequest()
                .body(response);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiErrorResponse>
            handleUnreadableRequest(
                    HttpMessageNotReadableException exception,
                    HttpServletRequest request
            ) {

        ApiErrorResponse response = createResponse(
                HttpStatus.BAD_REQUEST.value(),
                HttpStatus.BAD_REQUEST.getReasonPhrase(),
                "Invalid request body or unsupported value.",
                request.getRequestURI(),
                null
        );

        return ResponseEntity
                .badRequest()
                .body(response);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiErrorResponse>
            handleDataIntegrityViolation(
                    DataIntegrityViolationException exception,
                    HttpServletRequest request
            ) {

        ApiErrorResponse response = createResponse(
                HttpStatus.CONFLICT.value(),
                HttpStatus.CONFLICT.getReasonPhrase(),
                "The operation conflicts with existing data.",
                request.getRequestURI(),
                null
        );

        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(response);
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ApiErrorResponse>
            handleMaximumUploadSize(
                    MaxUploadSizeExceededException exception,
                    HttpServletRequest request
            ) {

        ApiErrorResponse response = createResponse(
                HttpStatus.PAYLOAD_TOO_LARGE.value(),
                HttpStatus.PAYLOAD_TOO_LARGE.getReasonPhrase(),
                "The uploaded file exceeds the maximum allowed size.",
                request.getRequestURI(),
                null
        );

        return ResponseEntity
                .status(HttpStatus.PAYLOAD_TOO_LARGE)
                .body(response);
    }

    @ExceptionHandler({
            MultipartException.class,
            MissingServletRequestPartException.class
    })
    public ResponseEntity<ApiErrorResponse>
            handleMultipartException(
                    Exception exception,
                    HttpServletRequest request
            ) {

        ApiErrorResponse response = createResponse(
                HttpStatus.BAD_REQUEST.value(),
                HttpStatus.BAD_REQUEST.getReasonPhrase(),
                "Please provide a valid image using the 'file' field.",
                request.getRequestURI(),
                null
        );

        return ResponseEntity
                .badRequest()
                .body(response);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiErrorResponse>
            handleAuthenticationException(
                    AuthenticationException exception,
                    HttpServletRequest request
            ) {

        ApiErrorResponse response = createResponse(
                HttpStatus.UNAUTHORIZED.value(),
                HttpStatus.UNAUTHORIZED.getReasonPhrase(),
                "Authentication is required or the credentials are invalid.",
                request.getRequestURI(),
                null
        );

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(response);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiErrorResponse>
            handleAccessDeniedException(
                    AccessDeniedException exception,
                    HttpServletRequest request
            ) {

        ApiErrorResponse response = createResponse(
                HttpStatus.FORBIDDEN.value(),
                HttpStatus.FORBIDDEN.getReasonPhrase(),
                "You do not have permission to perform this action.",
                request.getRequestURI(),
                null
        );

        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse>
            handleUnexpectedException(
                    Exception exception,
                    HttpServletRequest request
            ) {

        ApiErrorResponse response = createResponse(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase(),
                "An unexpected server error occurred.",
                request.getRequestURI(),
                null
        );

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(response);
    }

    private ApiErrorResponse createResponse(
            int status,
            String error,
            String message,
            String path,
            Map<String, String> validationErrors
    ) {
        return new ApiErrorResponse(
                LocalDateTime.now(),
                status,
                error,
                message,
                path,
                validationErrors
        );
    }

    private String resolveErrorName(int statusCode) {
        HttpStatus status =
                HttpStatus.resolve(statusCode);

        return status != null
                ? status.getReasonPhrase()
                : "Request Error";
    }
}