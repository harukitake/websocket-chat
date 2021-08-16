<template>
  <v-container class="grey lighten-5">
    <h1>{{ title }}</h1>
    <v-row no-gutters>
      <v-col v-for="(message, i) in messages" :key="i" cols="12">
        <v-card class="pa-2" elevation="2" outlined>
          <v-card-subtitle>{{ message.id }}</v-card-subtitle>
          <v-card-text class="message-text">{{ message.text }}</v-card-text>
        </v-card>
      </v-col>

      <v-col col="12">
        <v-card class="pa-2" elevation="2" outlined>
          <v-card-item>
<!--  まだ開発中で使えないみたい          -->
<!--            <v-input v-model="messageInput" type="text"></v-input>-->
            <input v-model="messageInput" type="text" class="message-input">
          </v-card-item>
          <v-card-item>
            <v-btn flat color="secondary" @click="sendMessage">
              送信
            </v-btn>
            <v-card-text>{{ typingUserText }}</v-card-text>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import io from 'socket.io-client'

/**
 * タインピング中と判定しなくなるまでの時間(ms)
 * @type {number}
 */
const TYPING_INTERVAL = 3000;
export default {
  name: 'Chat',
  data() {
    const socket = io('localhost:3000');
    console.log(socket)
    return {
      title: 'Chat',
      socket,
      messageInput: '',
      messages: [],
      isTyping: false,
      timeout: null,
      typingUsers: [],
    }
  },
  mounted() {
    this.socket.on('connect', () => {
      console.log('connected!')

      this.socket.on('message', newMessage => {
        this.messages.push(newMessage)
      })

      this.socket.on('start typing', user => {
        console.log(user)
        this.typingUsers.push(user.id)
      })

      this.socket.on('stop typing', user => {
        const index = this.typingUsers.indexOf(user.id)
        this.typingUsers.splice(index, 1)
      })
    })
  },
  computed: {
    typingUserText() {
      if (this.typingUsers.length === 1) {
        return `${this.typingUsers[0]} is typing`
      } else if (this.typingUsers.length > 1) {
        return `${this.typingUsers.join(',')} are typing`
      }

      return ''
    },
  },
  watch: {
    messageInput() {
      if (this.isTyping) {
        clearTimeout(this.timeout)
      } else {
        this.isTyping = true
        this.socket.emit('start typing', { id: this.socket.id })
      }
      this.timeout = setTimeout(this.resetIsTyping, TYPING_INTERVAL)
    },
  },
  methods: {
    sendMessage() {
      this.socket.emit('message', {
        id: this.socket.id,
        text: this.messageInput,
      })

      this.messageInput = ''
    },
    resetIsTyping() {
      this.isTyping = false
      this.socket.emit('stop typing', { id: this.socket.id })
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.message-input {
  display: block;
  width: 100%;
  padding: .75rem .375rem;
  font-weight: 400;
  line-height: 1.5;
  color: #212529;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #dee2e6;
  appearance: none;
}

.message-text {
  color: black;
  font-size: large;
  opacity: 1.0;
}
</style>
