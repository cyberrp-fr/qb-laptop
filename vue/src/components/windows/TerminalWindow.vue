<script setup lang="ts">
import { ref, getCurrentInstance, onMounted, onBeforeUnmount, defineProps } from 'vue'
import { useStateStore } from '@/stores/state';
import Linux from '@/utils/linux/LinuxOS'

const props = defineProps(['id'])

// window position coords
const containerElem = ref()
const containerPos = ref({
    x: 0,
    y: 0,
    movementX: 0,
    movementY: 0
})

// terminal contents
const user = ref('root@kali')
const output = ref("")
const prompt = ref("")
const promptField = ref()

const stateStore: any = useStateStore()

const app = getCurrentInstance()
const emitter = app?.appContext.config.globalProperties.$emitter


// when component is mounted meaning rendered
onMounted(() => {
    if (stateStore.state.user != null) {
        user.value = stateStore.state.user.name + '@kali'
    }
})

function selfDestruct() {
    emitter.emit('desktop/closeWindow', props.id)
}

// execute linux command
async function executeCommand(e: any) {
    e.preventDefault()

    // exit terminal
    if (prompt.value.trim() === 'exit') {
        selfDestruct()
        return
    }

    let res = await Linux.execute(output.value, prompt.value)
    if (res != '') {
        output.value = res + ' <br>'
    } else {
        output.value = res
    }

    prompt.value = ''

    let outputContainer: any = document.querySelector('.content');
    outputContainer.scrollTop = outputContainer.scrollHeight - outputContainer.clientHeight;
}

// focus on input when clicked anywhere on the terminal window
function focusPrompt(): void {
    if (promptField.value != null) {
        promptField.value.focus()
    }
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

</script>

<template>
    <div ref="containerElem" class="window terminal-window resizable" @click="focusPrompt">
        <div class="window-header" @mousedown="onWindowMove">
            <div class="logo">
                <img src="@/assets/img/kali-terminal-vector.png" class="window-logo">
            </div>

            <div class="header-action-buttons">
                <div class="window-action window-action-minimize"></div>
                <div class="window-action window-action-close" @click="selfDestruct"></div>
            </div>
        </div>

        <div class="content">
            <div class="output" v-html="output"></div>

            <div class="prompt-zone">
                <div class="prompt-user">{{ user }}</div>
                <textarea ref="promptField" v-model="prompt" v-on:keydown.enter="executeCommand" class="prompt" rows="3"></textarea>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.window {
    position: absolute;
    width: 900px;
    height: 450px;
    border-radius: 5px;
    box-shadow: 0px 0px 20px 1px rgba(0,0,0,0.5);
    left: 20%;
    top: 20%;
    background-color: rgba(36, 42, 56, 0.9);
    resize: both;
    overflow: hidden;

    &.resizable {
        resize: both;
    }

    .window-header {
        position: relative;
        top: 0;
        left: 0;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px 0;

        .logo {
            padding-left: 7px;
            img {
                width: 15px;
            }
        }

        .header-action-buttons {
            padding-right: 15px;
            display: flex;
            justify-content: space-between;
            width: 30px;

            .window-action {
                border: none;
                outline: 0;
                width: 12px;
                height: 12px;
                border-radius: 50%;
                position: relative;
                // top: 0;
                // left: 0;

                &:hover {
                    opacity: .6 !important;
                }

                &.window-action-close {
                    background-color: rgb(248, 58, 58);
                }

                &.window-action-minimize {
                    background-color: rgb(230, 200, 33);
                }
            }
        }
    }

    .content {
        position: absolute;
        width: 100%;
        height: calc(100% - 25px);
        left: 0;
        bottom: 0;
        overflow-x: hidden;
        overflow-y: scroll;

        /* width */
        &::-webkit-scrollbar {
            width: 10px;
            height: 10px;
        }
        /* Track */
        &::-webkit-scrollbar-track {
            background: #1b1e22;
        }
        /* Handle */
        &::-webkit-scrollbar-thumb {
            background: #2f333a;
            border-radius: 10px;
        }
        /* Handle on hover */
        &::-webkit-scrollbar-thumb:hover {
            background: #474d58;
        }


        .output {
            color: #d7d7d7;
            border: none;
            outline: 0;
            margin: 0;
            position: relative;
            width: 98%;
            margin: auto;
            // height: 100%;
            top: 0;
            left: 0;
            background-color: transparent;
            padding: 10px;
            font-family: 'Ubuntu Mono', sans-serif;
            font-weight: 400;
            font-size: 16px;
            overflow-wrap: break-word;
        }

        .prompt-zone {
            font-family: 'Ubuntu Mono', sans-serif;
            font-weight: 500;
            font-size: 16px;
            padding-left: 10px;
            display: flex;
            justify-content: left;
            line-height: 1.3;

            .prompt-user {
                font-weight: bold;
                font-size: 16px;
                font-family: inherit;
                color: rgb(78, 122, 255);
                margin-right: 10px;
            }

            .prompt {
                width: 100%;
                border: none;
                outline: 0;
                background-color: transparent;
                caret-color: transparent;
                color: #d7d7d7;
                font-family: 'Ubuntu Mono', sans-serif;
                font-weight: 500;
                font-size: 16px;
                resize: none;
                overflow-y: hidden;
            }
        }
    }
}
</style>