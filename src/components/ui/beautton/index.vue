<template>
  <button
    ref="beauttonRef"
    v-bind="$props"
    :class="`
        beautton 
        ${$props.class} 
        ${isMouseDown ? 'mousedown' : 'mouseup'}
    `"
    @mousedown="handleMouseDown"
  >
    <slot></slot>
    <span
        class="bubble"
        :style="{
            left: `${clickPosition.left}px`,
            top: `${clickPosition.top}px`,
        }"
    ></span>
  </button>
</template>

<script>
export default {
    name: 'beautton',
    data () {
        return {
            isMouseDown: false,
            clickPosition: { left: 0, top: 0 }
        }
    },
    props: {
        class: {
            type: String
        }
    },
    methods: {
        handleMouseDown (mouseEvent) {
            this.isMouseDown = true
            const { clientX, clientY } = mouseEvent
            const { left, top } = this.$refs.beauttonRef.getBoundingClientRect()
            const clickPosition = {
                left: clientX - left,
                top: clientY - top
            }
            this.clickPosition = clickPosition
        },
        handleMouseUp () {
            this.isMouseDown = false
        }
    },
    created () {
        document.addEventListener('mouseup', this.handleMouseUp)
    },
    unmounted () {
        document.removeEventListener('mouseup', this.handleMouseUp)
    }
}
</script>

<style scoped>
.beautton  {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    padding: .5rem 1rem;
    background: var(--titles-dark);
    color: var(--bg-light);
    border-radius: 2px;
    border: none;
    box-shadow: 0 1px 2px 1px #4466;
    user-select: none;
    cursor: pointer;
    transition: .1s all ease, .7s background ease;
}
.beautton:focus {
    outline: none;
    box-shadow: 0 1px 2px 2px #4466;
}
.beautton:active,
.beautton:disabled {
    transform: translateY(1px);
    box-shadow: none;
}
.beautton:disabled {
    cursor: default;
    pointer-events: none;
    opacity: .5 !important;
    background: var(--border-light-broken);
    color: var(--link-active);
    box-shadow: 0 0 0 1px var(--link);
}

.bubble {
    position: absolute;
    width: 5px; height: 5px;
    background: #FFF8;
    border-radius: 50%;
    visibility: hidden;
    transition: transform .3s, width .3s, height .3s, opacity .3s, left 0s, top 0s;
    box-shadow: 0 0 0 .5rem #FFF4;
}

.beautton.mousedown .bubble {
    animation: grow .3s ease-out 1 both;
    visibility: visible;
}


@keyframes grow {
    from {
        opacity: 0;
    } to {
        opacity: 1;
        transform: scale(40);
    }
}
</style>