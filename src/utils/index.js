
const httpChatURL = `http://${process.env.VUE_APP_CHAT_API_HOST}:${process.env.VUE_APP_CHAT_API_PORT}/`
const wsChatURL = `ws://${process.env.VUE_APP_CHAT_API_HOST}:${process.env.VUE_APP_CHAT_API_PORT}/`

const apiRoute = {
    'http': httpChatURL,
    'ws': wsChatURL
}


export default apiRoute;
