<template>
    <!-- Chat start -->
    <div class="page-content page-container" id="page-content">
        <div class="padding">
            <div class="row container d-flex justify-content-center">
                <div class="col-md-4">

                    <div class="box box-warning direct-chat direct-chat-warning">
                        <div class="box-header with-border">
                            <h3 class="box-title">{{ chatName }}</h3>

                        </div>

                        <div class="box-body">

                            <div class="direct-chat-messages">
                                <chat-message v-for="message in messages" :key="message" :user="message['user']" :msg="message['msg']" :date="message['date']"
                                    :notify="message['notify']"></chat-message>
                            </div>

                        </div>

                        <div class="box-footer">
                            <form action="#" method="post">
                                <div class="input-group">
                                    <input type="text" name="message" placeholder="Type Message ..." class="form-control" v-model="message">
                                    <span class="input-group-btn">
                                        <button type="button" class="btn btn-warning btn-flat" @click="send_message">Send</button>
                                    </span>
                                </div>
                            </form>
                        </div>

                    </div>

                </div>
            </div>

        </div>

    </div>
    <!-- Chat end -->
</template>
    
<script>
import { authAxios } from '../utils/auth'
import ChatMessage from './ChatMessage.vue'

export default {
    name: 'ChatWindows',
    data() {
        return {
            connection: null,
            chatName: 'Mike',
            messages: [

            ],
            message: '',
        }
    },
    // props: {
    //     chatName: String,
    // },
    components: {
        ChatMessage
    },
    methods: {

        async chatInfo(){
            let response = await authAxios.get(`api/chat/${this.$route.params.id}/`)
            this.$data.chatName = response.data.name
        },

        chatHistoryToData(data) {
            let messages = []
            data.forEach(element => {
                messages.push({ msg: element.text, user: element.autor.username, notify: element.is_event, date: element.create_at })
            });
            return messages
        },
        async getHistory() {
            let response = await authAxios.get(`api/chat/${this.$route.params.id}/messages/`)
            this.$data.messages = this.chatHistoryToData(response.data)
        },

        send_message() {
            if (this.$data.username == '') {
                return
            }
            let message = {
                'message': this.$data.message,
                'type': 'chat_message',
                'chat_id': this.$route.params.id,
                'event': 'NewMessage'
            }
            this.connection.send(JSON.stringify(message));
            this.$data.message = "";
        },
        get_message(event) {
            /**
             * Получает новое сообщение
             */
            let message = JSON.parse(event.data)
            if (message['type'] == 'chat_message') {
                this.messages.push({
                    msg: message['message'],
                    user: message['autor'],
                    date: message['create_at']
                });
            }
        },
    },
    created() {
        this.$data.connection = new WebSocket(`ws://localhost:8000/ws/chat/${this.$route.params.id}/?token=${this.$store.state.auth.access_token}`)

        this.$data.connection.onmessage = this.get_message

        this.chatInfo()
        this.getHistory()
    },

}
</script>
    
<style></style>
    