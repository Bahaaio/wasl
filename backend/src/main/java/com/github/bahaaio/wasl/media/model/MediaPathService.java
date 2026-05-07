package com.github.bahaaio.wasl.media.model;

import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class MediaPathService {
    public String getStorageKey(UUID id) {
        return id.toString();
    }

    public String getFullPath(Media media) {
        return switch (media.getType()) {
            case IMAGE -> media.getId() + "/full.jpg";
            case VIDEO -> media.getId() + "/full.mp4";
            case GIF -> media.getId() + "/full.gif";
        };
    }

    public String getThumbnailPath(Media media) {
        return media.getId() + "/thumb.jpg";
    }
}
