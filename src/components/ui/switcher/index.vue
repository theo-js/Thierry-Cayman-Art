<template>
    <span class="switcher">
        <input
            type="checkbox"
            v-bind="$props"
            :id="id" 
            :checked="checked"
            @change="handleCheck"
            ref="checkbox"
        />
        <label
            class="label"
            :for="id"
            @touchmove="handleTouchmove"
            @touchstart="$options.lastTouch = null"
            @mousedown="isMouseDown = true"
            @mousemove="handleMousemove"
            @click="handleClick"
        ></label>
    </span>
</template>

<script>
import { handleUnidirectionalSwipe } from '../../../utils/handleSwipe'

export default {
    name: 'switcher',
    data: function () {
        return {
            isMouseDown: false,
            canClick: true
        }
    },
    props: {
        id: {
            type: String
        },
        checked: {
            type: Boolean
        }
    },
    methods: {
        handleCheck: function (e) {
            const emit = !e.target.checked ? 'uncheck' : 'check'
            this.$emit(emit)
        },
        handleTouchmove: function (e) {
            const { touches } = e
            if (touches.length === 1) {
                const currentTouch = touches[0].clientX
                handleUnidirectionalSwipe({
                    currentTouch,
                    lastTouch: this.$options.lastTouch,
                    swipeLeft: this.swipeLeft,
                    swipeRight: this.swipeRight,
                    after: () => this.$options.lastTouch = currentTouch
                })
            }
        },
        handleMousemove: function (e) {
            if (this.isMouseDown) {
                const currentTouch = e.clientX
                handleUnidirectionalSwipe({
                    currentTouch,
                    lastTouch: this.$options.lastTouch,
                    swipeLeft: this.swipeLeft,
                    swipeRight: this.swipeRight,
                    after: () => this.$options.lastTouch = currentTouch
                })
            }
        },
        swipeLeft () {
            if (this.$refs.checkbox.checked) {
                this.$refs.checkbox.checked = false
                this.$emit('uncheck')
                // Prevent click since uncheck was already effective
                this.canClick = false
            }
        },
        swipeRight () {
            if (!this.$refs.checkbox.checked) {
                this.$refs.checkbox.checked = true
                this.$emit('check')
                // Prevent click since check was already effective
                this.canClick = false
            }
        },
        handleMouseup: function () {
            this.isMouseDown = false
        },
        handleClick: function (e) {
            if (!this.canClick) {
                e.preventDefault()
            }
            this.canClick = true
        }
    },
    created () {
        // Detect when mouse is up
        document.body.addEventListener('mouseup', this.handleMouseup, true)
    },
    unmount () {
        // Detach event listener
        document.body.removeEventListener('mouseup', this.handleMouseup, true)
    }
}
</script>

<style scoped>
.switcher {
    display: flex;
}
.switcher input[type="checkbox"] {
    display: none;
}

.label {
    background: var(--border-light-broken);
    height: .25em;
    width: 2em;
    display: inline-block;
    border-radius: 999px;
    position: relative;
    cursor: pointer;
}
input[type="checkbox"]:focus + .label::after,
.label:hover::after {
    box-shadow: 0 0 .375em var(--text-dark);
    filter: brightness(1.25);
}
.label::after {
    content: '';
    position: absolute;
    top: -.333em; left: -.333em;
    display: block;
    border-radius: 50%;
    height: 1em; width: 1em;
    background: radial-gradient(circle at top left, var(--text-dark), var(--text-dark) 33%, var(--titles-dark) 66%);
    box-shadow: 0 0 .25em var(--text-dark);
    transition: .15s all ease-in;
}

.switcher input[type="checkbox"]:checked + .label::after {
    transform: translateX(1.666em);
    background: radial-gradient(circle at top left, var(--link), var(--link) 33%, var(--link-active) 66%);
}
</style>