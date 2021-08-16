<template>
  <v-container class="grey lighten-5">
    <h1>{{ title }}</h1>
    <v-row no-gutters>
      <v-col v-for="(message, i) in messages" :key="i" cols="12">
        <v-card class="pa-2" elevation="2" outlined>
          <v-card-text>{{ message }}</v-card-text>
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
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import io from 'socket.io-client'

export default {
  name: 'Chat',
  data() {
    const socket = io('localhost:3000');
    console.log(socket)
    return {
      title: 'Chat',
      socket,
      messageInput: '',
      messages: [
          'hi',
          'hiiii'
      ]
    }
  },
  mounted() {
    this.socket.on('connect', () => {
      console.log('connected!')
      this.socket.on('message', newMessage => {
        console.log(newMessage)
        this.messages.push(newMessage)
      })
    })
  },
  methods: {
    sendMessage() {
      console.log('hi')
      const messageInput = this.messageInput
      this.socket.emit('message', messageInput)

      this.messageInput = ''
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
</style>
