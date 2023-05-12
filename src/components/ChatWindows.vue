<template>
    <!-- Chat start -->
    <div class="page-content page-container" id="page-content">
        <div class="padding">
            <div class="row container d-flex justify-content-center">
                <div class="col-md-5">

                    <div class="box box-warning direct-chat direct-chat-warning">
                        <div class="box-header with-border">
                            <h3 class="box-title">{{ chatName }}</h3>
                            <div class="row border-top">
                                <div class="col">участников: {{ chatSize }}</div>
                                <div class="col justify-content-end">
                                    <button class="btn btn-outline-warning mt-1">Выйти</button>
                                    <button class="btn btn-outline-warning mt-1" @click="addUserModal">Пригласить</button>
                                </div>
                            </div>
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
                <div class="col-md-2">
                    <div class="card" style="width: 12rem;">
                        <div class="card-body">
                            <h5 class="card-title">Участники</h5>
                            <h6 class="card-subtitle mb-2 text-muted">список</h6>
                            <div class="list-group list-group-flush user-card ">
                                <li :class="`list-group-item`" v-for="user in users" :key="user">
                                    <img class="chat-img" :src="user.avatar" />
                                    {{ user.username }}
                                </li>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>


        <!-- TODO переделать на норм компонент Modal -->
        <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel"
            aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content modal-size">
                    <div class="modal-header">
                        <h5 class="modal-title" id="staticBackdropLabel">Добавить участников</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">

                        <!-- Тело модельного окна -->
                        <div class="row">
                            <div class="col">
                                <h5 class="title">Добавить</h5>
                                <div class="card">
                                    <div class="list-group  user-card border">
                                        <button type="button" @dblclick="removeUser(index)" class="list-group-item list-group-item-action" v-for="user, index in invites.add" :key="user">
                                            {{ user.username }}
                                        </button>

                                    </div>
                                </div>
                            </div>
                            <div class="col-1"></div>
                            <div class="col">
                                <h5 class="title">Все пользователи</h5>
                                <div class="card">
                                    <div class="list-group  user-card border">
                                        <button type="button" @dblclick="inviteUser(index)" :disabled="user.select" :class="`list-group-item list-group-item-action`" v-for="user, index in invites.all"
                                            :key="user">
                                            <img class="chat-img" :src="user.avatar" />
                                            {{ user.username }}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="inviteUsersRquest">Применить</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- END Modal -->


    </div>
    <!-- Chat end -->
</template>
    
<script>
import { authAxios } from '../utils/auth'
import ChatMessage from './ChatMessage.vue'
import { Modal } from 'bootstrap'


export default {
    name: 'ChatWindows',
    data() {
        return {
            chatSize: 1,
            connection: null,
            chatName: 'Mike',
            messages: [],
            users: [],
            message: '',
            invites: {
                all: [],
                add: [],
            }
        }
    },
    components: {
        ChatMessage
    },
    methods: {

        async chatInfo() {
            let response = await authAxios.get(`api/chat/${this.$route.params.id}/`)
            this.$data.chatName = response.data.name
            this.$data.chatSize = response.data.chat_size
            this.$data.users = response.data.users
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

        async addUserModal() {
            let response = await authAxios.get(`api/user/list/?chat=${this.$route.params.id}`)
            this.invites.all = response.data
            
            new Modal(document.querySelector('#staticBackdrop')).show()
        },

        inviteUser(index) {
            console.log('this.invites', this.invites.all)
            if (this.invites.all[index].select) { return }
            this.invites.all[index].select = true
            let user = { username: this.invites.all[index].username, id: this.invites.all[index].id, index: index }
            this.invites.add.push(user)
        },

        removeUser(index) {
            let id = this.invites.add[index].index // индекс элемента в users
            this.invites.all[id].select = false
            this.invites.add.splice(index, 1)
        },

        async inviteUsersRquest() {
            // приглашает пользователей в чат
            let data = {
                users: this.invites.add
            }
            await authAxios.put(`api/chat/${this.$route.params.id}/`, data)
            this.invites.add = []
            this.chatInfo()
        }
    },
    created() {
        this.$data.connection = new WebSocket(`ws://localhost:8000/ws/chat/${this.$route.params.id}/?token=${this.$store.state.auth.access_token}`)

        this.$data.connection.onmessage = this.get_message

        this.chatInfo()
        this.getHistory()
    },

}
</script>
    
<style>
.modal-size {
    width: 550px;
}

.user-card {
    height: 350px;
    margin-bottom: 10px;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
}

/* TODO Тоже исправить в отдельный компонент */
.user-card {
    height: 300px;
    margin-bottom: 10px;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
}
</style>
    