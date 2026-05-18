package com.github.bahaaio.wasl.search.model;

/**
 * Represents different time ranges for a search query.
 * This can be used to filter search results based on the desired time period.
 */
public enum SearchTime {
    all,
    year,
    month,
    week,
    day,
    hour
}
