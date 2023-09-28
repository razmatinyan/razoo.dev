<template>
	<section id="login">
        <h1>Sign In</h1>
        <form 
            @submit.prevent="() => login()"
            id="form"
            class="container container-sm"
        >
            <UIInput
                type="email"
                placeholder="Email"
                autocomplete="off"
                required="true"
                :model-value="email"
                @update:model-value="newValue => email = newValue"
            />
            <UIInput
                type="password"
                placeholder="Password"
                autocomplete="off"
                required="true"
                :model-value="password"
                @update:model-value="newValue => password = newValue"
            />
	        <UIButton :disabled="btnDisabled" class="full-width corner" type="submit" style="height: 43px;">Sign In</UIButton>

            <span v-if="errorMsg" class="error-msg">{{ errorMsg }}</span>
        </form>
    </section>
</template>

<script setup lang="ts">
definePageMeta({
	middleware: ['auth'],
});

const email: Ref = ref<string>('');
const password: Ref = ref<string>('');
const errorMsg: Ref = ref<string>('');
const btnDisabled: Ref = ref<boolean>(false);
const client = useSupabaseClient();

const login = async (): Promise<void> => {
    btnDisabled.value = true;
    errorMsg.value = '';
	const { data, error } = await client.auth.signInWithPassword({
		email: email.value,
		password: password.value,
	});

	if ( error?.message ) {
        errorMsg.value = error.message;
        email.value = '';
        password.value = '';
    }
    btnDisabled.value = false;
};

const user = useSupabaseUser();

onMounted(() => {
	watchEffect(() => {
		if (user.value) navigateTo('/admin');
	});
});
</script>

<style scoped>
#login {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    min-height: 100vh;
}
h1 {
    margin-bottom: 1em;
}
input {
    margin-bottom: .75rem;
}
.error-msg {
    display: block;
    margin-top: 10px;
    font-size: 1rem;
    padding-left: 4px;
    color: #ff3333;
}
</style>