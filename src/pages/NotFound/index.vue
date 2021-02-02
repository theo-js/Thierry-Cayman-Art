<template>
    <div class="not-found">
        <h3>{{ $t('app.oops') }}</h3>
        <p>{{ $t('app.404msg') }}</p>
    </div>
</template>

<script>
export default {
    name: 'not-found',
    created () {
      // Set document title
      document.title = this.$t('app.404')
    }
}
</script>

<style scoped>
.not-found {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-flow: column wrap;
    background: var(--bg-red);
    border-left: 3px solid var(--text-red);
    border-radius: 0 3px 3px 0;
}
h3 {
    color: var(--text-red);
}
</style>