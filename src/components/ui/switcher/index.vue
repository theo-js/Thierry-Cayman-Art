<template>
    <span class="switcher">
        <input
            type="checkbox"
            v-bind="$props"
            :id="id" 
            :checked="checked"
            @change="handleCheck"
        />
        <label
            class="label"
            :for="id"
        ></label>
    </span>
</template>

<script>
export default {
    name: 'switcher',
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
        }
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