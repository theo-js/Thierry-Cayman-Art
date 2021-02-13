<template>
  <div class="contact">
      <section class="how-to">
          <header>
              <h2>{{ $t('contact.howto.title') }}</h2>
          </header>
          <main>
              <ul class="contact-info-list">
                  <li>
                      {{ $t('contact.form.email') }}:&nbsp;
                      <strong>caymanthierry1@gmail.com</strong>
                    </li>
              </ul>
              <br />


          </main>
      </section>
      <section class="send-email">
          <form
            class="contact-form"
            @submit.prevent="handleContactFormSubmit"
          >
            <header class="contact-form-header">
                <h3 class="contact-form-title">
                    {{ $t('contact.form.title') }}
                </h3>
            </header>
            <main class="contact-form-body">
                <fieldset :class="`form-field ${formData.name ? 'filled' : 'not-filled'}`">
                    <input
                        class="user-name"
                        type="text"
                        maxlength="100"
                        v-model="formData.name"
                        autocomplete="true"
                    />
                    <label class="input-label">{{ $t('contact.form.name') }}</label>
                    <span class="underline"></span>
                </fieldset>
                <fieldset :class="`form-field required ${formData.email ? 'filled' : 'not-filled'}`">
                    <input
                        class="user-email required"
                        type="email"
                        maxlength="100"
                        v-model="formData.email"
                        autofocus="true"
                        autocomplete="true"
                    />
                    <label class="input-label">{{ $t('contact.form.email') }}</label>
                    <span class="underline"></span>
                </fieldset>
                <fieldset :class="`form-field required ${formData.subject ? 'filled' : 'not-filled'}`">
                    <input
                        class="user-subject"
                        type="text"
                        maxlength="256"
                        v-model="formData.subject"
                    />
                    <label class="input-label">{{ $t('contact.form.subject') }}</label>
                    <span class="underline"></span>
                </fieldset>
                <fieldset :class="`form-field required msg-field ${formData.msg ? 'filled' : 'not-filled'}`">
                    <section>
                        <p>
                            <span class="star">*</span>{{ $t('app.forms.requiredFields') }}
                        </p>
                    </section>
                    <section>
                        <label>{{ $t('contact.form.msg') }}</label>
                        <textarea
                            class="user-msg"
                            v-model="formData.msg"
                            maxlength="25000"
                            minlength="1"
                        >
                        </textarea>
                    </section>
                </fieldset>
                <beautton
                    :disabled="!canSendForm"
                    class="submitBTN"
                >
                    {{ submitBTNText }}
                </beautton>
            </main>
          </form>
      </section>
  </div>
</template>

<script>
import axios from 'axios'
import getCookie from '../../utils/getCookie'
import Beautton from '../../components/ui/beautton'

export default {
    name: 'contact',
    components: {
        'beautton': Beautton
    },
    data () {
        return {
            formData: {
                name: '',
                email: '',
                subject: '',
                msg: ''
            },
            isSendingForm: false,
            hasSentForm: false
        }
    },
    methods: {
        handleContactFormSubmit () {
            if (this.canSendForm) {
                // Post form data
                (async () => {
                    try {
                        this.isSendingForm = true
                        // Config
                        const csrftoken = getCookie('csrftoken')
                        const config = {
                            headers: {
                                'X-CSRFToken': csrftoken
                            }
                        }
                        const body = {
                            email: this.formData.email,
                            subject: this.formData.subject,
                            message: `
                                Message de ${this.formData.name || 'anonyme'}\n
                                Adresse e-mail: ${this.formData.email}\n
                                ===============================\n
                                ${this.formData.msg}
                            `
                        }
                        await axios.post('/api/contact/', body, config)

                        this.hasSentForm = true
                        this.isSendingForm = true

                        // Reset form data
                        this.formData = {
                            ...this.formData,
                            msg: '', subject: ''
                        }
                    } catch (err) {
                        console.log ({ err })
                        this.isSendingForm = false
                    }
                })()
            }
        }
    },
    computed: {
        canSendForm () {
            return this.formData.email && this.formData.subject && this.formData.msg && !this.hasSentForm && !this.isSendingForm
        },
        submitBTNText () {
            if (this.hasSentForm) return this.$t('app.forms.sent')
            if (this.isSendingForm) return this.$t('app.forms.sending')
            return this.$t('app.forms.send')
        }
    }
}
</script>

<style scoped>
.contact {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-areas: "how-to contact-form";
    grid-gap: 1rem;
}

/* Contact form */
.send-email {
    grid-area: contact-form;
}

.contact-form {
    animation: apply-shadow .3s ease 1 both;
    animation-delay: .5s;
}

.contact-form-header,
.contact-form-body {
    animation: stretch-left .6s cubic-bezier(.57,-0.03,.23,1.45) 1;
}
.contact-form-header > *,
.contact-form-body > * {
    animation: fade-in .3s ease-in-out 1 both;
    animation-delay: .5s;
}
.contact-form-header {
    background: var(--titles-purple);
    padding-bottom: 0;
    border-radius: .25rem .25rem 0 0;
    border: 1px solid var(--titles-purple);
    border-bottom: none;
}
.contact-form-title {
    color: var(--bg-light);
    text-align: center;
    margin-top: 0;
    margin-bottom: 0;
    padding: .75em;
    font-weight: 400;
    font-family: 'Dosis';
    font-size: 1.5em;
}
.contact-form-body {
    padding: 1.5rem 2rem;
    background: var(--bg-light-broken);
    border: 1px solid var(--border-light-broken);
    border-top: none;
    border-radius: 0 0 3px 3px;
}

/* Form fields */
.form-field {
    position: relative;
    padding: 0;
    margin-bottom: 1.5rem;
    border: none;
}
.form-field input {
    position: relative;
    display: block;
    background: transparent;
    padding: .5rem 0;
    border: none;
    border-bottom: 1px solid var(--border-light-broken);
}

.form-field input,
.form-field textarea {
    font-size: 1.125em;
    color: var(--text-dark);
    width: 100%;
}
.form-field .underline {
    content: '';
    position: absolute; left: 0; right: 0; bottom: 0;
    margin: 0 auto;
    height: 1px; width: 0;
    background: var(--link);
    transition: .3s all ease;
}
.form-field .input-label {
    position: absolute; left: 0; bottom: .5rem;
    pointer-events: none;
    transition: .3s all ease;
}
.form-field input:focus {
    outline: none;
}
.form-field input:focus + label,
.form-field.filled label {
    bottom: 2rem;
    font-size: .875em;
    opacity: .5;
}
.form-field input:focus + label + .underline,
.form-field.filled input + label + .underline {
    width: 100%;
}

.form-field.required label::after {
    content: '*';
    color: var(--text-red);
    opacity: .75;
}

.contact-form .form-field.msg-field {
    display: grid;
    grid-template-columns: 1fr 2fr;
    grid-gap: 1rem;
}
.contact-form .form-field.msg-field label {
    transition: .3s all ease;
}
.contact-form .form-field.msg-field textarea {
    margin-top: .5rem;
    padding: .75rem;
    outline: none;
    background: var(--bg-light);
    border: 1px solid var(--border-light-broken);
    border-radius: 3px;
    height: 8em;
    font-size: 1.125em;
    resize: vertical;
    transition: .3s all ease;
}
.contact-form .form-field.msg-field textarea:focus,
.contact-form .form-field.msg-field.filled textarea {
    border-color: var(--link);
}
.contact-form .form-field.msg-field p {
    opacity: .75;
}

.star {
    color: var(--text-red);
}

.submitBTN {
    font-size: 1.125em;
    margin-left: auto;
    flex-flow: row nowrap;
}

/* How to */
.how-to {
    grid-area: how-to;
    animation: fade-in .8s ease 1 both;
    animation-delay: .4s;
    background-image: url('/static/images/contact/site_contact.svg');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: 70% center;
}
.how-to h2 {
    text-align: center;
    margin-top: 0;
    padding: .5rem;
}

.how-to .contact-info-list > li {
    list-style: none;
}

.how-to main {
    text-align: center;
}

@media screen and (max-width: 1000px) {
    .contact-form .form-field.msg-field {
        display: flex;
        flex-flow: column-reverse nowrap;
    }
}

@media screen and (max-width: 700px) {
    .contact {
        grid-template-areas: "how-to how-to" "contact-form contact-form";
    }
    .how-to {
        background-position: 10% center !important;
    }
}


@keyframes stretch-left {
    from {
        padding-right: 100%;
        margin-left: -100%;
        opacity: 0;
    } to {
        padding-left: 1rem;
        margin-right: 0;
        opacity: 1;
    }
}

@keyframes fade-in {
    from {
        opacity: 0;
    } to {
        opacity: 1;
    }
}

@keyframes apply-shadow {
    from {
        box-shadow: none;
    } to {
        box-shadow: 0 1px 2px 0 #2242;
    }
}
</style>