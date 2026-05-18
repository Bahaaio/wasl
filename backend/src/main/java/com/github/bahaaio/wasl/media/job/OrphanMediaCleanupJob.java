package com.github.bahaaio.wasl.media.job;

import com.github.bahaaio.wasl.media.service.MediaService;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Component
public class OrphanMediaCleanupJob {
    private final MediaService mediaService;

    @Scheduled(cron = "${media.cleanup.cron}")
    public void cleanup() {
        mediaService.deleteOrphanedMedia();
    }
}
