<template>
    <div>
        <div class="row content">
            <!-- <div v-if="!!alert && !!messages[alert]">
            <p :class="messages[alert]['type']">{{ messages[alert]['text'] }}</p>
        </div> -->
            <div class="title">
                <h1>Создать чат</h1>
            </div>
            <div class="col-2"></div>
            <div class="col">
                <div>
                    <div class="input-group mb-3">
                        <span class="input-group-text" id="chatName"> Название чата </span>
                        <input type="text" class="form-control" placeholder="Название чата" aria-label="Название чата" v-model="name"  aria-describedby="chatName">
                    </div>
                    <div class="row">
                        <div class="col">
                            <h5 class="title">Добавить</h5>
                            <div class="card">
                                <div class="list-group user-card border">
                                    <button type="button" class="list-group-item list-group-item-action" @dblclick="removeUser(index)"
                                        v-for="user, index in addedUsers" :key="user">
                                        {{ user.username }}
                                    </button>

                                </div>
                            </div>
                        </div>
                        <div class="col-1"></div>
                        <div class="col">
                            <h5 class="title">Все пользователи</h5>
                            <div class="card">
                                <div class="list-group user-card border">
                                    <button type="button" :disabled="user.select" :class="`list-group-item list-group-item-action`" @dblclick="addUser(index)"
                                        v-for="user, index in users" :key="user">
                                        <img class="chat-img" :src="user.avatar"/>
                                        {{ user.username }}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div class="col-2"></div>
            <div>
                <button type="button" :disabled="submit" @click="createChat" class="btn btn-outline-secondary">Создать</button>
            </div>
        </div>

    </div>
</template>

<script>
import { authAxios } from '../utils/auth'

export default {
    name: 'ChatCreate',
    data() {
        return {
            name: "",
            users: [],
            addedUsers: [],
        }
    },
    computed: {
        submit() { return !(this.name.length > 3) }
    },
    methods: {
        addUser(index) {
            if (this.$data.users[index].select) { return }
            this.$data.users[index].select = true
            let user = { username: this.$data.users[index].username, id: this.$data.users[index].id, index: index }
            this.$data.addedUsers.push(user)
        },
        removeUser(index) {
            let id = this.$data.addedUsers[index].index // индекс элемента в users
            this.$data.users[id].select = false
            this.$data.addedUsers.splice(index, 1)
        },
        async createChat(){
            let data = {
                name: this.$data.name,
                users: this.$data.addedUsers
            }
            let response = await authAxios.post('api/list/', data)
            if (response.status == 403) {
                this.$router.push("/signin")
                return
            }
            if(response.status == 201) {
                this.$router.push(`/chat/${response.data.id}`)
            }
        },
        async getUserList(){
            let response = await authAxios.get('api/user/list/?author=0')
            this.$data.users = response.data
        },
    },
    created() {
        this.getUserList()
    }

}
</script>

<style>
.title {
    text-align: center;
}

.btns {
    width: 100%;
    margin-bottom: 20px;
}

.user-card {
    height: 300px;
    margin-bottom: 10px;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
}
</style>