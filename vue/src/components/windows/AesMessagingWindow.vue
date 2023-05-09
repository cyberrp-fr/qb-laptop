<script setup lang="ts">
import { ref, onMounted, getCurrentInstance } from 'vue'
import { useAesMessageStore } from "@/stores/aes-message"

const props = defineProps(['id', 'focus'])
const windowFocus = ref(props.focus)
const app = getCurrentInstance()
const emitter = app?.appContext.config.globalProperties.$emitter

const aesStore = useAesMessageStore()

const searchFound = ref(false)
const searchResults = ref({})
const discussionSearchValue = ref('')

const newDiscussionForm = ref(false)
const selectedDiscussion = ref()

const recipientAddress = ref('')
const newMessageContent = ref('') // only used for new discussion creations
const messageContent = ref('')
const formError = ref(false)

const tooltipShowing = ref(false)

async function sendMessage() {
    messageContent.value = messageContent.value.trim()
    if (messageContent.value === '') {
        formError.value = true
        return
    }
    formError.value = false

    await aesStore.sendMessage(selectedDiscussion.value.discussionId, messageContent.value)

    messageContent.value = ''
}

async function startNewDiscussion() {
    recipientAddress.value = recipientAddress.value.trim()
    newMessageContent.value = newMessageContent.value.trim()
    if (newMessageContent.value === '') {
        formError.value = true
        return
    }
    formError.value = false

    await aesStore.newDiscussion(recipientAddress.value, newMessageContent.value)

    const toAddress = recipientAddress.value

    newDiscussionForm.value = false
    newMessageContent.value = ''
    recipientAddress.value = ''

    while (selectedDiscussion.value == null) {
        await new Promise(resolve => setTimeout(resolve, 100))
        selectedDiscussion.value = aesStore.getStartedDiscussion(toAddress)
    }
}

function newDiscussionFormCreate() {
    selectedDiscussion.value = null
    newDiscussionForm.value = true
}

function selectDiscussion(hash: string) {
    newDiscussionForm.value = false
    selectedDiscussion.value = aesStore.getDiscussion(hash)
}

function searchDiscussion() {
    // discussionSearchValue.value = discussionSearchValue.value.trim()
    if (discussionSearchValue.value === '') {
        searchResults.value = []
        searchFound.value = false
    } else {
        searchResults.value = aesStore.searchDiscussion(discussionSearchValue.value)
        searchFound.value = true
    }
}

function copyAddress() {
    const address = aesStore.address

    const el = document.createElement("textarea");
    el.value = address;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
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
                            <input v-model="discussionSearchValue" v-on:keyup="searchDiscussion" type="text" class="form-control" placeholder="Search...">
                        </div>
                        <div class="new-discussion-btn">
                            <button @click="newDiscussionFormCreate">+</button>
                        </div>
                    </div>
                    <div class="address-group">
                        <div class="popover-wrapper">
                            <slot></slot>
                            <div v-if="tooltipShowing" class="popover">Cliquez pour copier</div>
                        </div>
                        <div @mouseover="() => tooltipShowing = true" @mouseleave="() => tooltipShowing = false" @click="copyAddress" class="address-label">My Address:</div>
                        <div @mouseover="() => tooltipShowing = true" @mouseleave="() => tooltipShowing = false" @click="copyAddress" class="address-value">{{ aesStore.address }}</div>
                    </div>
                </div>

                <div class="main-content-container">
                    <div class="sidebar">
                        <div v-if="searchFound === false" @click="selectDiscussion(discussion)" v-for="discussion in Object.keys(aesStore.discussions)" class="conversation" :class="{'active': (selectedDiscussion != null && discussion == selectedDiscussion.discussionId)}">
                            <div class="address">{{ discussion }}</div>
                        </div>

                        <div v-if="searchFound === true" @click="selectDiscussion(discussion)" v-for="discussion in Object.keys(searchResults)" class="conversation" :class="{'active': (selectedDiscussion != null && discussion == selectedDiscussion.discussionId)}">
                            <div class="address">{{ discussion }}</div>
                        </div>
                    </div>

                    <div v-if="selectedDiscussion == null && newDiscussionForm === false" class="conversation-tab">
                        <div class="center">
                            <h5>No discussion selected</h5>
                        </div>
                    </div>

                    <div v-if="newDiscussionForm === true" class="conversation-tab">
                        <div class="recipient-address">
                            <input v-model="recipientAddress" type="text" placeholder="Recipient address">
                        </div>
                        <div class="message-history empty"></div>
                        <div class="compose">
                            <textarea v-model="newMessageContent" :class="{'error': formError}" placeholder="Message..."></textarea>
                            <button @click="startNewDiscussion">Send</button>
                        </div>
                    </div>

                    <div v-if="selectedDiscussion != null" class="conversation-tab">
                        <div class="message-history">
                            <div v-for="message in selectedDiscussion.messages" class="message" :class="{ 'received': message.from !== aesStore.address, 'sent': message.from === aesStore.address }">
                                <div class="message-box">{{ message.content }}</div>
                            </div>
                        </div>
                        <div class="compose">
                            <textarea v-model="messageContent" :class="{'error': formError}" placeholder="Message..."></textarea>
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
            width: 24%;
            display: flex;

            .search-field {
                width: 100%;

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

            .new-discussion-btn {
                position: relative;

                button {
                    margin-left: 30px;
                    border: none;
                    outline: 0;
                    padding: 4px 10px;
                    border-radius: 3px;
                    background-color: #1a212b;
                    color: #d9d9d9;
                    font-size: 14px;
                    font-weight: bolder;
                    cursor: pointer;

                    &:hover {
                        background-color: #0e1621;
                    }
                }
            }
        }

        .address-group {
            display: flex;
            padding-right: 10px !important;
            cursor: pointer;

            &:hover {
                color: #9f9f9f !important;
            }

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
            overflow-x: hidden;
            overflow-y: scroll;
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

            .recipient-address {
                width: 100%;
                padding: 10px;

                input {
                    background-color: #242f3d;
                    border: none;
                    outline: 0;
                    padding: 10px 10px;
                    width: 90%;
                    color: #d9d9d9;
                }
            }

            .message-history {
                height: 80%;
                padding: 0 20px;
                display: flex;
                flex-direction: column;

                &.empty {
                    height: 67% !important;
                }

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
                        white-space: pre;
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
                    white-space: pre;

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

// Tooltip
.popover-wrapper {
  position: relative;
  display: inline-block;
}

.popover {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1;
  padding: 5px;
  border: none;
  background-color: #111;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  min-width: 150px;
}

</style>