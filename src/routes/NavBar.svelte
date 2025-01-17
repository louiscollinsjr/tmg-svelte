<!-- src/routes/NavBar.svelte -->
<script lang="ts">
    import { invalidateAll } from '$app/navigation';
 
    async function handleSignOut() {
         await invalidateAll()
        window.location.href = '/logout'
     }
 </script>
 
 <nav>
     <a href="/">Home</a>
     <a href="/profile">Profile</a>
     <button onclick={handleSignOut}>Logout</button>
 </nav>