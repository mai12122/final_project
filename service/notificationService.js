import AsyncStorage from "@react-native-async-storage/async-storage"
import * as Notifications from "expo-notifications"
import { getLogByUserId } from "./logService"

export const sendNotificationToUser = async (userId, title, message) => {
    try {
        const token = await AsyncStorage.getItem("push_token")
        if (!token) {
            console.log("No push token found for user", userId)
            return
        }

        await Notifications.scheduleNotificationAsync({
            content: { title, body: message },
            trigger: { seconds: 1 }
        })
    } catch (err) {
        console.error("Failed to send notification:", err)
    }
}

export const notifyLogAdded = async (log) => {
    const { userId, title } = log
    await sendNotificationToUser(userId, "New Log Added", title)
}

export const notifyLogUpdated = async (log) => {
    const { userId, title } = log
    await sendNotificationToUser(userId, "Log Updated", title)
}
