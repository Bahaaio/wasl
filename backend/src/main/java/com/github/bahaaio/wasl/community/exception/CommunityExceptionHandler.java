package com.github.bahaaio.wasl.community.exception;

import com.github.bahaaio.wasl.exception.ApiError;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;

public class CommunityExceptionHandler {
    @ExceptionHandler(CommunityNotFoundException.class)
    public ResponseEntity<ApiError<Void>> handleCommunityNotFoundException(CommunityNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
            ApiError.of("COMMUNITY_NOT_FOUND", "Community with name: " + ex.getName() + " not found")
        );
    }

    @ExceptionHandler(CommunityCategoryNotFoundException.class)
    public ResponseEntity<ApiError<Void>> handleCommunityCategoryNotFoundException(CommunityCategoryNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
            ApiError.of("COMMUNITY_CATEGORY_NOT_FOUND", "Community Category with id: " + ex.getId() + " not found")
        );
    }

    @ExceptionHandler(CommunityMembershipNotFoundException.class)
    public ResponseEntity<ApiError<Void>> handleCommunityMembershipNotFoundException(CommunityMembershipNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
            ApiError.of("COMMUNITY_MEMBERSHIP_NOT_FOUND", "Community Membership with id: " + ex.getId() + " not found")
        );
    }
}
