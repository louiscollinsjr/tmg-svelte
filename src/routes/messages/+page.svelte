<!-- Two-column layout for messages -->
<script lang="ts">
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { onMount, onDestroy } from 'svelte';
    import { fade } from 'svelte/transition';
    import { format } from 'date-fns';
    import type { PageData } from './$types';
    import { ArrowLeft,MagnifyingGlass,Sliders, Images } from 'phosphor-svelte';

    export let data: PageData;
    
    let { conversations, userData } = data;
    let selectedConversation = data.selectedConversation;
    let error: string | null = null;
    let messageInput = '';
    let messageContainer: HTMLElement;
    let loading = false;
    let ws: WebSocket;
    let reconnectAttempts = 0;
    const MAX_RECONNECT_ATTEMPTS = 5;
    const RECONNECT_DELAY = 2000; // 2 seconds

    $: conversations = data.conversations;
    $: userData = data.userData;

    // WebSocket connection for real-time updates
    function initializeWebSocket() {
        if (ws?.readyState === WebSocket.OPEN) {
            return; // Already connected
        }

        try {
            ws = new WebSocket(`${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws`);
            
            ws.onopen = () => {
                console.log('WebSocket connected');
                reconnectAttempts = 0; // Reset attempts on successful connection
                error = null; // Clear any previous connection errors
            };

            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.type === 'NEW_MESSAGE') {
                    updateConversations();
                }
            };

            ws.onerror = (event) => {
                console.error('WebSocket error:', event);
                error = 'Connection error occurred';
            };

            ws.onclose = () => {
                console.log('WebSocket closed');
                if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
                    reconnectAttempts++;
                    console.log(`Attempting to reconnect (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})...`);
                    setTimeout(initializeWebSocket, RECONNECT_DELAY);
                } else {
                    error = 'Failed to establish connection after multiple attempts';
                }
            };
        } catch (e) {
            console.error('Error initializing WebSocket:', e);
            error = 'Failed to initialize connection';
        }
    }

    onMount(() => {
        // Initialize WebSocket connection if user is authenticated
        if (userData) {
            initializeWebSocket();
        }
        
        if (selectedConversation) {
            scrollToBottom();
        }
    });

    onDestroy(() => {
        ws?.close();
    });

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

            // Update URL without reloading the page
            const url = new URL(window.location.href);
            url.searchParams.set('id', conversation._id);
            goto(url.toString(), { replaceState: true });
        } catch (e) {
            console.error('Error selecting conversation:', e);
            error = e instanceof Error ? e.message : 'Failed to select conversation';
            selectedConversation = null;
        }
    }

    async function sendMessage() {
        if (!selectedConversation || !messageInput.trim()) return;

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
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to send message');
            }

            const updatedConversation = await response.json();
            selectedConversation = updatedConversation;
            messageInput = '';
            scrollToBottom();
        } catch (e) {
            console.error('Error sending message:', e);
            error = e instanceof Error ? e.message : 'Failed to send message';
        }
    }

    function getOtherUser(conversation: any) {
        return conversation.toId._id === userData._id ? conversation.fromId : conversation.toId;
    }

    function formatMessageDate(timestamp: string) {
        return format(new Date(timestamp), 'MM/dd/yy');
    }
    function formatMessageTime(timestamp: string) {
        return format(new Date(timestamp), 'MMM d, yyyy h:mm a');
    }
</script>

<div class="flex h-screen bg-gray-100">
    <!-- Left sidebar - Conversation list -->
    <div class="w-1/6 border-r bg-white">
        <div class="flex items-center justify-between p-6">
            <button class="p-3 rounded-full bg-gray-100 hover:bg-gray-200" on:click={() => history.back()}>
                <ArrowLeft class="h-4 w-4 text-gray-600" />
            </button>
            <div class="flex gap-2">
                <button class="p-3 bg-gray-100 hover:bg-gray-100 rounded-full">
                    <MagnifyingGlass class="h-4 w-4 text-gray-600" />
                </button>
                <button class="p-3 bg-gray-100 hover:bg-gray-100 rounded-full">
                    <Sliders class="h-4 w-4 text-gray-600" />
                </button>
            </div>
        </div>
        <div class="p-6 border-0">
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
                        class="w-full p-4 border-0 hover:bg-gray-50 flex items-start gap-4 text-left"
                        class:bg-white={selectedConversation?._id === conversation._id}
                        on:click={() => selectConversation(conversation)}
                    >
                        <img
                            src={otherUser.avatar || '/default-avatar.png'}
                            alt={otherUser.name}
                            class="w-12 h-12 rounded-full object-cover"
                        />
                        <div class="flex-1 min-w-0">
                            <div class="flex justify-between items-baseline">
                                <h2 class="font-normal font-roboto truncate text-xs">{otherUser.name}</h2>
                                {#if conversation.messages.length > 0}
                                    <span class="text-xs text-gray-400">
                                        {formatMessageDate(conversation.messages[conversation.messages.length - 1].timestamp)}
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
            <div class="p-4 border-b bg-white flex flex-col items-center">
                <div class="flex items-center gap-1 flex-col">
                    <img
                        src={otherUser.avatar || '/default-avatar.png'}
                        alt={otherUser.name}
                        class="w-8 h-8 rounded-full object-cover"
                    />
                    <h2 class="font-semibold text-xs">{otherUser.name}</h2>
                </div>
            </div>

            <!-- Messages -->
            <div
                bind:this={messageContainer}
                class="flex-1 overflow-y-auto space-y-1 bg-white p-6"
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
                                class="max-w-[70%] rounded-lg p-3  text-sm"
                                class:bg-blue-500={isCurrentUser}
                                class:text-white={isCurrentUser}
                                class:bg-gray-100={!isCurrentUser}
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
                                    <p class="text-sm">{message.content}</p>
                                {/if}
                                <div
                                    class="text-xs mt-1"
                                    class:text-gray-400={!isCurrentUser}
                                    class:text-blue-200={isCurrentUser}
                                >
                                {isCurrentUser ? userData.name : otherUser.name} - {formatMessageTime(message.timestamp)}
                                </div>
                            </div>
                        </div>
                    {/each}
                {/if}
            </div>

            <!-- Message input -->
            <div class="p-4 border-0 bg-white">
                <!-- image upload icon button-->
                <form
                    on:submit|preventDefault={sendMessage}
                    class="flex gap-4 items-center"
                >
                    <button
                        type="button"
                        class="p-2 rounded-full hover:bg-gray-100"
                    >
                        <Images class="h-7 w-7 text-gray-600" />
                    </button>
                    <input
                        type="text"
                        bind:value={messageInput}
                        placeholder="Writea message..."
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
