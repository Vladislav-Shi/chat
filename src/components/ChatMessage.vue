<template>
    <div v-if="notify">
        <div class="alert alert-secondary">
            {{ msg }}
        </div>
    </div>
    <div class="direct-chat-msg right" v-else-if="is_your">
        <div class="direct-chat-info clearfix">
            <span class="direct-chat-name pull-left">{{ user }}</span>
            <span class="direct-chat-timestamp pull-right">{{ date }}</span>
        </div>

        <img class="direct-chat-img" src="https://img.icons8.com/color/36/000000/administrator-male.png" alt="message user image">

        <div class="direct-chat-text">
            {{ msg }}
        </div>
    </div>

    <div class="direct-chat-msg" v-else>
        <div class="direct-chat-info clearfix">
            <span class="direct-chat-name pull-right">{{ user }}</span>
            <span class="direct-chat-timestamp pull-left">{{ date }}</span>
        </div>

        <img class="direct-chat-img" src="https://img.icons8.com/office/36/000000/person-female.png" alt="message user image">

        <div class="direct-chat-text">
            {{ msg }}
        </div>
    </div>
</template>
  
<script>
export default {
    data() {
        return {
            username: this.user
        }
    },
    name: 'ChatMessage',
    props: {
        msg: String,
        user: String,
        notify: Boolean,
        date: String
    },
    computed: {
        is_your() { return this.user == this.$store.state.auth.username },
    }
}
</script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
  