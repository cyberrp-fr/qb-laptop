<script setup lang="ts">
import { ref, onMounted, getCurrentInstance } from 'vue'
import { useAesMessageStore } from "@/stores/aes-message"

const props = defineProps(['id', 'focus'])
const windowFocus = ref(props.focus)
const app = getCurrentInstance()
const emitter = app?.appContext.config.globalProperties.$emitter

const aesStore = useAesMessageStore()
const selectedDiscussion = ref()

const messageContent = ref('')
const formError = ref(false)

async function sendMessage() {
    messageContent.value = messageContent.value.trim()
    if (messageContent.value === '') {
        formError.value = true
        return
    }
    formError.value = false

    // await aesStore.sendMessage(messageContent)
}

function selectDiscussion(hash: string) {
    selectedDiscussion.value = aesStore.getDiscussion(hash)
}

function windowClicked() {
    emitter.emit('window/focus', props.id)
}

// window position coords
const containerElem = ref()
const containerPos = ref({
    x: 0,
    y: 0,
    movementX: 0,
    movementY: 0
})

// -----------------
// -- move window --
// -----------------
function elemDrag(e: any) {
    e.preventDefault()

    containerPos.value.movementX = (containerPos.value.x - e.clientX)
    containerPos.value.movementY = (containerPos.value.y - e.clientY)
    containerPos.value.x = e.clientX
    containerPos.value.y = e.clientY

    // set elem new position
    containerElem.value.style.top = (containerElem.value.offsetTop - containerPos.value.movementY) + 'px'
    containerElem.value.style.left = (containerElem.value.offsetLeft - containerPos.value.movementX) + 'px'
}
function closeElemDrag() {
    document.onmouseup = null
    document.onmousemove = null
}
function onWindowMove(e: any) {
    containerPos.value.x = e.clientX
    containerPos.value.y = e.clientY

    document.onmousemove = elemDrag
    document.onmouseup = closeElemDrag
}

// EVENT BUS
function focusWindow(id: string) {
    if (id === props.id) {
        windowFocus.value = true
    } else {
        windowFocus.value = false
    }
}

function initBus() {
    emitter.on('window/focus', focusWindow)
}

onMounted(() => {
    initBus()
})

// close window
function selfDestruct() {
    emitter.emit('desktop/closeWindow', props.id)
}
</script>

<template>
    <div ref="containerElem" @click="windowClicked" class="window aes-messaging-window resizable" :class="{'window-focused': windowFocus}">
        <div class="window-header" @mousedown="onWindowMove">
            <div class="logo">
                <img src="https://i.imgur.com/govaedU.png" class="window-logo">
                <div class="title">AES Messaging</div>
            </div>

            <div class="header-action-buttons">
                <div class="window-action window-action-minimize"></div>
                <div class="window-action window-action-close" @click="selfDestruct"></div>
            </div>
        </div>

        <div class="content">
            <div class="content-container">
                <div class="header">
                    <div class="search-group">
                        <div class="search-field">
                            <input type="text" class="form-control" placeholder="Search...">
                        </div>
                    </div>
                    <div class="address-group">
                        <div class="address-label">Address:</div>
                        <div class="address-value">{{ aesStore.address }}</div>
                    </div>
                </div>

                <div class="main-content-container">
                    <div class="sidebar">
                        <div @click="selectDiscussion(discussion)" v-for="discussion in Object.keys(aesStore.discussions)" class="conversation" :class="{'active': (selectedDiscussion != null && discussion == selectedDiscussion.hash)}">
                            <div class="address">{{ discussion }}</div>
                        </div>
                    </div>

                    <div v-if="selectedDiscussion == null" class="conversation-tab">
                        <div class="center">
                            <h5>No discussion selected</h5>
                        </div>
                    </div>

                    <div v-if="selectedDiscussion != null" class="conversation-tab">
                        <div class="message-history">
                            <div v-for="message in selectedDiscussion.messages" class="message" :class="{ 'received': message.from !== aesStore.address, 'sent': message.from === aesStore.address }">
                                <div class="message-box">{{ message.content }}</div>
                            </div>
                        </div>
                        <div class="compose">
                            <textarea v-model="messageContent" v-on:keydown.enter="sendMessage" :class="{'error': formError}" placeholder="Message..."></textarea>
                            <button @click="sendMessage">Send</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">

.window {
    min-width: 900px !important;
    min-height: 500px !important;
}
.window-header {
    background-color: #242f3d !important;
}

.content-container {
    position: absolute;
    width: 100%;
    height: 100%;
    color: #d9d9d9;
    font-family: Arial, Helvetica, sans-serif;
    background-color: #0e1621;
    display: block !important;

    .header {
        position: relative;
        display: flex;
        padding: 10px 0;
        justify-content: space-between;
        width: 100%;
        background-color: #242f3d;

        .search-group {
            padding-left: 10px !important;
            width: 20%;

            input {
                width: 100%;

                background-color: #1a212b !important;
                border: none;
                outline: 0;
                padding: 5px 10px;
                border-radius: 3px;
                color: #d9d9d9;
            }
        }

        .address-group {
            display: flex;
            padding-right: 10px !important;

            .address-label {
                margin-right: 8px;
            }
        }
    }

    .main-content-container {
        display: flex !important;
        width: 100%;
        height: calc(100% - 45px);
        justify-content: space-between !important;

        .sidebar {
            background-color: #242f3d;
            width: 25%;
            height: 100%;
            // padding-left: 10px;
            // padding-top: 10px;

            .conversation {
                padding: 10px 10px;
                color: #d9d9d9;
                cursor: pointer;

                &:hover {
                    background-color: #1a222c;
                }
                &.active {
                    background-color: #2b6492;
                }
            }
        }

        .conversation-tab {
            width: 75%;
            height: 100%;

            .center {
                display: flex;
                width: 100%;
                height: 90%;
                justify-content: center;
                align-items: center;

                h5 {
                    font-size: 24px;
                    font-weight: 100;
                    color: rgba(255, 255, 255, 0.3);
                }
            }

            .message-history {
                height: 80%;
                padding: 0 20px;
                display: flex;
                flex-direction: column;

                .message {
                    display: block;
                    width: 100%;
                    background-color: transparent !important;
                    margin-top: 10px;

                    &.sent {
                        text-align: right;
                    }

                    .message-box {
                        display: inline-block;
                        box-sizing: border-box;
                        text-align: left;
                        background-color: #242f3d;
                        padding: 8px 10px;
                        border-radius: 7px;
                    }
                }
            }

            .compose {
                position: relative;
                bottom: 0;
                display: flex;
                height: 18%;
                padding: 0 10px;

                textarea {
                    width: 100%;
                    border: none;
                    outline: 0;
                    background-color: #18202a;
                    padding: 10px 10px;
                    color: #d9d9d9;
                    margin-right: 10px;
                    border-radius: 5px;
                    resize: none;

                    &.error {
                        border: 1px solid rgb(214, 31, 31) !important;
                    }
                }

                button {
                    background-color: #18202a;
                    color: #d9d9d9;
                    border: none;
                    outline: 0;
                    border-radius: 4px;
                    padding: 0 15px;
                    font-weight: bold;
                    cursor: pointer;

                    &:hover {
                        background-color: #24303f;
                    }
                }
            }
        }
    }
}

</style>