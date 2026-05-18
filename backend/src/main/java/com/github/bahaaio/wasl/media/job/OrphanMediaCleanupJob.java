package com.github.bahaaio.wasl.media.job;

import com.github.bahaaio.wasl.media.service.MediaService;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Component
public class OrphanMediaCleanupJob {
    private final MediaService mediaService;

    @Scheduled(cron = "${media.cleanup.cron}")
    public void cleanup() {
        log.info("Media cleanup job started");
        long start = System.currentTimeMillis();

        long deleted = mediaService.deleteOrphanedMedia();
        log.info("Deleted {} media items", deleted);

        long end = System.currentTimeMillis() - start;
        log.info("Media cleanup finished in {} ms", end);
    }
}
