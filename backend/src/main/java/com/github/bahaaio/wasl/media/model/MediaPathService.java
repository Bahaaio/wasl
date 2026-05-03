package com.github.bahaaio.wasl.media.model;

import org.springframework.stereotype.Service;

@Service
public class MediaPathService {
    public String getFullPath(Media media) {
        return switch (media.getType()) {
            case IMAGE -> media.getId() + "/full.webp";
            case VIDEO -> media.getId() + "/full.mp4";
            case GIF -> media.getId() + "/full.gif";
        };
    }

    public String getThumbnailPath(Media media) {
        return media.getId() + "/thumb.webp";
    }
}
