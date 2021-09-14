<script>
    import { createEventDispatcher } from 'svelte';

    // Dispatcher for future usage in /index.svelte
    const dispatch = createEventDispatcher();

    // Variables bound to respective inputs via bind:value
    let email;
    let password;
    let error;

    const login = async () => {
        // Reset error from previous failed attempts
        error = undefined;

        // POST method to src/routes/auth/login.js endpoint
        try {
            const res = await fetch('/auth/login', {
                method: 'POST',
                body: JSON.stringify({
                    email,
                    password
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (res.ok) {
                dispatch('success');
            } else {
                error = 'An error occured';
            }
        } catch (err) {
            console.log(err);
            error = 'An error occured';
        }
    };
</script>

<h1>Login</h1>
<input type="email" name="email" placeholder="Enter your email" bind:value={email} />
<input type="password" name="password" placeholder="Enter your password" bind:value={password} />
{#if error}
    <p>{error}</p>
{/if}
<button on:click={login}>Login</button>