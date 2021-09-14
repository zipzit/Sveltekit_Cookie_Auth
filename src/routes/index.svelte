<!-- https://stackoverflow.com/questions/69066169/how-to-implement-cookie-authentication-sveltekit-mongodb/ -->

<script>
    import Login from '$lib/Login.svelte';
    import Register from '$lib/Register.svelte';
    import { goto } from '$app/navigation';

    // Redirection to /profile
    function redirectToProfile() {
        goto('/profile');
    }
</script>

<main>
    <h1>Auth with cookies</h1>

    <!-- on:success listens for dispatched 'success' events -->
    <Login on:success={redirectToProfile} />
    <Register on:success={redirectToProfile} />
</main>