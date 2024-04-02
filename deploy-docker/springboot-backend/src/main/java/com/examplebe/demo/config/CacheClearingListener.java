package com.examplebe.demo.config;

import org.springframework.cache.CacheManager;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextClosedEvent;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class CacheClearingListener implements ApplicationListener<ContextClosedEvent> {
    private final CacheManager cacheManager;

    @SuppressWarnings("null")
    @Override
    public void onApplicationEvent(ContextClosedEvent event) {
        cacheManager.getCacheNames().parallelStream().forEach(cacheName -> {
            cacheManager.getCache(cacheName).clear();
        });
    }

}
