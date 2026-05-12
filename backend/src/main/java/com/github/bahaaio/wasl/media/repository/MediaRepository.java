package com.github.bahaaio.wasl.media.repository;

import com.github.bahaaio.wasl.media.model.Media;
import com.github.bahaaio.wasl.media.model.MediaOwnerType;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface MediaRepository extends JpaRepository<Media, UUID> {
    List<Media> findAllByOwnerIdAndOwnerType(Long ownerId, MediaOwnerType ownerType);

    List<Media> findAllByOwnerIdAndOwnerTypeOrderByPosition(Long ownerId, MediaOwnerType ownerType);
}
