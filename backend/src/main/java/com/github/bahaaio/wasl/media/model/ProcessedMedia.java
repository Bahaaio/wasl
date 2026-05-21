package com.github.bahaaio.wasl.media.model;

import com.github.bahaaio.wasl.storage.model.StorageFile;

public record ProcessedMedia(
    StorageFile full,
    StorageFile thumbnail
) {
}
