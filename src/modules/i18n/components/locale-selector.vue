<script setup lang="ts">
const { locale } = useI18n();
const availableLocales = ['zh', 'en']

const localesLong: Record<string, string> = {
  zh: '中文',
  en: 'English'
};

const localeOptions = computed(() =>
  availableLocales.map(locale => ({
    label: localesLong[locale] ?? locale,
    value: locale,
  })),
);
</script>

<template>
  <c-select
    v-model:value="locale"
    :options="localeOptions"
    placeholder="Select a language"
    w-100px
  />
</template>
