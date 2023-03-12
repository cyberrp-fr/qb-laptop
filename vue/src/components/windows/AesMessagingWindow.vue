<script setup lang="ts">
import { ref, onMounted, getCurrentInstance } from 'vue'

const props = defineProps(['id', 'focus'])
const windowFocus = ref(props.focus)
const app = getCurrentInstance()
const emitter = app?.appContext.config.globalProperties.$emitter

// window position coords
const containerElem = ref()
const containerPos = ref({
    x: 0,
    y: 0,
    movementX: 0,
    movementY: 0
})

function windowClicked() {
    emitter.emit('window/focus', props.id)
}

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
                        <div class="address-value">3242378562378575</div>
                    </div>
                </div>

                <div class="main-content-container">
                    <div class="sidebar">
                        <div class="conversation">
                            <div class="address">hash@77837897983489347</div>
                        </div>
                        <div class="conversation">
                            <div class="address">hash@77837897983489347</div>
                        </div>
                        <div class="conversation">
                            <div class="address">hash@77837897983489347</div>
                        </div>
                        <div class="conversation">
                            <div class="address">hash@77837897983489347</div>
                        </div>
                        
                    </div>

                    <div class="conversation-tab">
                        <div class="message-history">
                            <div class="message received">
                                <div class="message-box">Hi 0xIbra !</div>
                            </div>
                            <div class="message sent">
                                <div class="message-box">Hey !</div>
                            </div>
                        </div>
                        <div class="compose">
                            <textarea placeholder="Message..."></textarea>
                            <button>Send</button>
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
            padding-left: 20px !important;
            width: 25%;

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
            padding-right: 20px !important;

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
            }
        }

        .conversation-tab {
            width: 75%;
            height: 100%;

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
                    padding: 10px 20px;
                    color: #d9d9d9;
                    margin-right: 10px;
                    border-radius: 5px;
                    resize: none;
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