<template>
    <div id="__layout">
        <header id="header">
            <div class="icon-wrapper">
                <NuxtLink to="/admin">
                    <Icon name="heroicons:user-circle" color="white" size="1em" />
                </NuxtLink>
            </div>
            <NuxtLink to="/admin/work/add" class="action">Add</NuxtLink>
            <UIButton @click="logOut" class="action ghosted">Log Out</UIButton>
        </header>
        
        <div id="content">
            <section id="admin" class="container">
                <slot />
            </section>
        </div>
    </div>
</template>

<script setup lang="ts">
const client = useSupabaseClient();
const user = useSupabaseUser();
const logOut = async (): Promise<void> => {
	await client.auth.signOut();
}

watchEffect(() => {
    if (!user.value) navigateTo('/login');
});
</script>

<style scoped>
#__layout {
    will-change: opacity;
}
#content {
    padding-top: 120px;
    min-height: 100vh;
}
#header {
    position: fixed;
    top: 1rem;
    left: 50%;
    transform: translate3d(-50%, 0, 0);
    width: max-content;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 6px;
    gap: 8px;
    border-radius: 10px;
    background: rgba(0, 0, 0, .3);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, .25);
    z-index: 10;
    user-select: none;
}
.icon {
    display: block;
}
.btn {
    height: 100%;
}
.btn > button {
    height: 100%;
}
.action {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    background: rgba(255, 255, 255, 0);
    padding: 0 1rem;
    color: #fff;
    font-size: 1rem;
    letter-spacing: 0.95px;
    border-radius: 10px;
    transition: background var(--smooth);
}
.action.ghosted {
    background: rgba(255, 255, 255, 0.1);
}
.action:hover {
    background: rgba(255, 255, 255, 0.2);
}
</style>