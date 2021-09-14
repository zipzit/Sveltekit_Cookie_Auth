# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte);

## Creating a project

Start at https://kit.svelte.dev/

## Cookie, Authentication, MongoDB and Sveltekit

This example came [from this stackoverflow posting,](https://stackoverflow.com/questions/69066169/how-to-implement-cookie-authentication-sveltekit-mongodb/) user Nikolas Blahušiak

It was inspired by this youtube video
    https://www.youtube.com/watch?v=P6gEnVlJPOc
    Fullstack SvelteKit ToDo App with TailWind CSS and MongoDB
    Mar 20, 2021        Brayden Girard  (46:13)

## Mods

A few modifications have been made to the code.  A few console.log() entries. 
Some mods made to /profile/index.svelte to make things look better.  

You can get a glimpse on how to integrate to a MongoDB, and how to use hooks.  
I was surprised how many times those console.logs hit the server.  

I'm also very surprised as to how many db connections there are in place 
from a single application running on my local host. 

## Run this sample

Note: you will need to create an account at mongodb.com, sign up for a free 
test tier server, and enter your credentials in the file: /config/default.json
