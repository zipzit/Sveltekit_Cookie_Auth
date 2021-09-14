<script context="module">
    export async function load({ session }) {
        console.log("/profile - session: ", session);
        if (!session.user.authenticated) {
            return {
                status: 302,
                redirect: '/auth/unauthorized'
            };
        }

        return {
            props: {
                email: session.user.email,
            }
        };
    }
    // reminder, this data comes from the cookies collection within the database, and 
    // that only stores cookieId and email address. Names are not stored there.  
</script>

<script>
    import { onMount } from 'svelte';

    export let email;
    export let name;

    onMount(async () => {
        const res = await fetch('/user');
        const user = await res.json();
        name = user.name;
        email = user.email;
    });
</script>

<div class="profile">

    <h1>Profile</h1>
    {#if email }
    <p>Hello <b> {name}</b> you are logged in with the email <b>{email}</b></p>
    {:else}
    <p>Oops You are not logged in.  <a href="/"> Please click here to login again.</a></p>
    {/if}
</div>

<style>
    .profile{
        margin: 2rem;
        padding: 1rem;
        text-align: center;
    }
</style>