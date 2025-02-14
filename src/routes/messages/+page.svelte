<!-- Two-column layout for messages -->
<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { fade } from 'svelte/transition';
    import { format } from 'date-fns';

    export let data;
    let { conversations, userData } = data;
    let selectedConversation: any = null;
    let messageInput = '';
    let messageContainer: HTMLElement;
    let loading = false;
    let error: string | null = null;
    
    // WebSocket connection for real-time updates
    let ws: WebSocket;
    
    onMount(() => {
        // Initialize WebSocket connection if user is authenticated
        if (userData) {
            initializeWebSocket();
        }
    });

    onDestroy(() => {
        ws?.close();
    });

    function initializeWebSocket() {
        ws = new WebSocket(`${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws`);
        
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'NEW_MESSAGE') {
                updateConversations();
            }
        };

        ws.onerror = (event) => {
            console.error('WebSocket error:', event);
            error = 'Failed to establish real-time connection';
        };
    }

    async function updateConversations() {
        try {
            loading = true;
            const response = await fetch('/api/conversations');
            if (!response.ok) {
                throw new Error('Failed to fetch conversations');
            }
            conversations = await response.json();
            
            if (selectedConversation) {
                const updatedConversation = await fetch(`/api/conversations/${selectedConversation._id}`);
                if (!updatedConversation.ok) {
                    throw new Error('Failed to fetch conversation');
                }
                selectedConversation = await updatedConversation.json();
                scrollToBottom();
            }
        } catch (e) {
            console.error('Error updating conversations:', e);
            error = 'Failed to update messages';
        } finally {
            loading = false;
        }
    }

    function scrollToBottom() {
        if (messageContainer) {
            messageContainer.scrollTop = messageContainer.scrollHeight;
        }
    }

    async function selectConversation(conversation: any) {
        try {
            console.log('Selecting conversation:', {
                id: conversation._id,
                with: conversation.toId?.name || conversation.fromId?.name
            });
            
            const response = await fetch(`/api/conversations/${conversation._id}`);
            const data = await response.json();
            
            if (!response.ok) {
                console.error('Server error:', data);
                throw new Error(data.error || 'Failed to fetch conversation');
            }
            
            selectedConversation = data;
            error = null; // Clear any previous errors
            scrollToBottom();
        } catch (e) {
            console.error('Error selecting conversation:', e);
            error = e instanceof Error ? e.message : 'Failed to select conversation';
            selectedConversation = null;
        }
    }

    async function sendMessage() {
        if (!messageInput.trim() || !selectedConversation) return;

        try {
            const response = await fetch(`/api/conversations/${selectedConversation._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: messageInput,
                    type: 'message'
                })
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            messageInput = '';
            const updatedConversation = await response.json();
            selectedConversation = updatedConversation;
            await updateConversations();
            scrollToBottom();
        } catch (e) {
            console.error('Error sending message:', e);
            error = 'Failed to send message';
        }
    }

    function getOtherUser(conversation: any) {
        return conversation.toId._id === userData._id ? conversation.fromId : conversation.toId;
    }

    function formatMessageTime(timestamp: string) {
        return format(new Date(timestamp), 'MMM d, yyyy h:mm a');
    }
</script>

<div class="flex h-screen bg-gray-100 pt-64">
    <!-- Left sidebar - Conversation list -->
    <div class="w-1/3 border-r bg-white">
        <div class="p-4 border-b">
            <h1 class="text-xl font-semibold">Messages</h1>
        </div>
        <div class="overflow-y-auto h-[calc(100vh-73px)]">
            {#if loading}
                <div class="flex-1 flex items-center justify-center text-gray-500">
                    Loading conversations...
                </div>
            {:else if error}
                <div class="flex-1 flex items-center justify-center text-gray-500">
                    {error}
                </div>
            {:else}
                {#each conversations as conversation}
                    {@const otherUser = getOtherUser(conversation)}
                    <button
                        class="w-full p-4 border-b hover:bg-gray-50 flex items-start gap-4 text-left"
                        class:bg-gray-100={selectedConversation?._id === conversation._id}
                        on:click={() => selectConversation(conversation)}
                    >
                        <img
                            src={otherUser.avatar || '/default-avatar.png'}
                            alt={otherUser.name}
                            class="w-12 h-12 rounded-full object-cover"
                        />
                        <div class="flex-1 min-w-0">
                            <div class="flex justify-between items-baseline">
                                <h2 class="font-medium truncate">{otherUser.name}</h2>
                                {#if conversation.messages.length > 0}
                                    <span class="text-sm text-gray-500">
                                        {formatMessageTime(conversation.messages[conversation.messages.length - 1].timestamp)}
                                    </span>
                                {/if}
                            </div>
                            {#if conversation.messages.length > 0}
                                <p class="text-sm text-gray-500 truncate">
                                    {conversation.messages[conversation.messages.length - 1].content}
                                </p>
                            {/if}
                        </div>
                    </button>
                {/each}
            {/if}
        </div>
    </div>

    <!-- Right side - Messages -->
    <div class="flex-1 flex flex-col">
        {#if selectedConversation}
            {@const otherUser = getOtherUser(selectedConversation)}
            <!-- Chat header -->
            <div class="p-4 border-b bg-white">
                <div class="flex items-center gap-4">
                    <img
                        src={otherUser.avatar || '/default-avatar.png'}
                        alt={otherUser.name}
                        class="w-10 h-10 rounded-full object-cover"
                    />
                    <h2 class="font-semibold">{otherUser.name}</h2>
                </div>
            </div>

            <!-- Messages -->
            <div
                bind:this={messageContainer}
                class="flex-1 overflow-y-auto p-4 space-y-4"
            >
                {#if loading}
                    <div class="flex-1 flex items-center justify-center text-gray-500">
                        Loading messages...
                    </div>
                {:else if error}
                    <div class="flex-1 flex items-center justify-center text-gray-500">
                        {error}
                    </div>
                {:else}
                    {#each selectedConversation.messages as message}
                        {@const isCurrentUser = message.sender === userData._id}
                        <div
                            class="flex"
                            class:justify-end={isCurrentUser}
                        >
                            <div
                                class="max-w-[70%] rounded-lg p-3"
                                class:bg-blue-500={isCurrentUser}
                                class:text-white={isCurrentUser}
                                class:bg-gray-200={!isCurrentUser}
                            >
                                {#if message.type === 'image'}
                                    {#each message.imageIds as image}
                                        <img
                                            src={image.url}
                                            alt="Shared image"
                                            class="rounded-lg max-w-full h-auto mb-2"
                                        />
                                    {/each}
                                {/if}
                                {#if message.content}
                                    <p>{message.content}</p>
                                {/if}
                                <div
                                    class="text-xs mt-1"
                                    class:text-gray-500={!isCurrentUser}
                                    class:text-blue-200={isCurrentUser}
                                >
                                    {formatMessageTime(message.timestamp)}
                                </div>
                            </div>
                        </div>
                    {/each}
                {/if}
            </div>

            <!-- Message input -->
            <div class="p-4 border-t bg-white">
                <form
                    on:submit|preventDefault={sendMessage}
                    class="flex gap-4"
                >
                    <input
                        type="text"
                        bind:value={messageInput}
                        placeholder="Type a message..."
                        class="flex-1 rounded-full border px-4 py-2 focus:outline-none focus:border-blue-500"
                    />
                    <button
                        type="submit"
                        class="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 focus:outline-none"
                        disabled={!messageInput.trim()}
                    >
                        Send
                    </button>
                </form>
            </div>
        {:else}
            <div class="flex-1 flex items-center justify-center text-gray-500">
                Select a conversation to start messaging
            </div>
        {/if}
    </div>
</div>
