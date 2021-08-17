<template>
  <v-container class="grey lighten-5">
    <h1>{{ title }}</h1>
    <p>{{ count }}人が接続中</p>
    <v-row>
      <v-col cols="12">
        <v-card class="pa-2" elevation="2" outlined>
          <v-card-title>ニックネーム</v-card-title>
          <v-card-item>
            <!--  まだ開発中で使えないみたい          -->
            <!--            <v-input v-model="messageInput" type="text"></v-input>-->
            <input v-model="nicknameInput" type="text" class="text-input">
          </v-card-item>
          <v-card-item>
            <v-btn v-if="nickname === ''" flat color="secondary" @click="updateNickname">
              登録
            </v-btn>
            <v-btn v-else flat color="secondary" @click="updateNickname">
              更新
            </v-btn>
          </v-card-item>
        </v-card>
      </v-col>

      <v-col v-for="(message, i) in messages" :key="i" cols="12">
        <v-card class="pa-2" elevation="2" outlined>
          <v-card-subtitle>{{ message.nickname === '' ? message.id : message.nickname }}</v-card-subtitle>
          <v-card-text class="message-text">{{ message.text }}</v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card class="pa-2" elevation="2" outlined>
          <v-card-item>
<!--  まだ開発中で使えないみたい          -->
<!--            <v-input v-model="messageInput" type="text"></v-input>-->
            <input v-model="messageInput" type="text" class="text-input">
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
    // TODO : ユーザー一覧
    return {
      title: 'Chat',
      socket,
      nicknameInput: '',
      nickname: '',
      messageInput: '',
      messages: [],
      isTyping: false,
      timeout: null,
      typingUsers: [],
      count: 0,
    }
  },
  mounted() {
    this.socket.on('connect', () => {
      console.log('connected!')

      this.socket.on('message', newMessage => {
        this.messages.push(newMessage)
      })

      this.socket.on('start typing', user => {
        this.typingUsers.push(user.id)
      })

      this.socket.on('stop typing', user => {
        const index = this.typingUsers.indexOf(user.id)
        this.typingUsers.splice(index, 1)
      })

      this.socket.on('count', count => {
        this.count = count
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
      if (this.isEmptyText(this.messageInput)) return
      this.socket.emit('message', {
        id: this.socket.id,
        nickname: this.nickname,
        text: this.messageInput,
      })

      this.messageInput = ''
    },
    resetIsTyping() {
      this.isTyping = false
      this.socket.emit('stop typing', { id: this.socket.id })
    },
    updateNickname() {
      this.nickname = this.nicknameInput
    },
    isEmptyText(text) {
      if (text === '' || !text.match(/\S/g)) {
        return true
      }
      return false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.text-input {
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