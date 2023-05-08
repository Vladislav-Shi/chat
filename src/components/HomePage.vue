<template>
    <div class="page-content page-container">
        <div v-if="!!alert && !!messages[alert]">
            <p :class="messages[alert]['type']">{{ messages[alert]['text'] }}</p>
        </div>

        <h3>Выбор чатов</h3>
        <button class="btn btn-outline-secondary" @click="getChatList">Обновить</button>
        <div>
            <table class="table table-hover table-borderless">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">chat name</th>
                        <th scope="col">new messages</th>
                        <th scope="col">link</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="chat in chats" :key="chat">
                        <th scope="row">{{ chat['id'] }}</th>
                        <td>{{ chat['chatName'] }}</td>
                        <td>{{ chat['newMessages'] }}</td>
                        <td>
                            <router-link :to="chat['link']" type="button" class="btn btn-outline-secondary">открыть</router-link>
                        </td>
                    </tr>

                </tbody>
            </table>
        </div>

    </div>
</template>

<script>
import { authAxios } from '../utils/auth'
import messagesArray from '../utils/messages'

export default {
    name: 'HomePage',
    data() {
        return {
            chats: [
                { 'id': 1, 'chatName': 'Mile Janny', 'newMessages': 3, 'link': '/chat/1' },
                { 'id': 2, 'chatName': 'Флуд и Анархия', 'newMessages': 0, 'link': '/chat/2' },
                { 'id': 3, 'chatName': 'Секретики', 'newMessages': 1, 'link': '/chat/3' },

            ],
            alert: this.$route.query.msg,
            messages: messagesArray
        }
    },

    methods: {

        chatListToData(data) {
            let chats = []
            data.forEach(element => {
                chats.push({ id: element.id, chatName: element.name, newMessages: 0, link: `/chat/${element.id}` })
            });
            return chats
        },

        async getChatList() {
            let response = await authAxios.get('api/list/')
            console.log('response', response)
            if (response.status == 403){
                this.$router.push("/signin")
                return
            }
            this.$data.chats = this.chatListToData(response.data)
        }
    },
    created() {
        this.getChatList()
    }
}
</script>

<style></style>