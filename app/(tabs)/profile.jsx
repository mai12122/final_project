import React, { useState, useEffect } from "react"
import { View, Text, ScrollView, TextInput, TouchableOpacity, SafeAreaView, Alert, Platform, Image, StyleSheet } from "react-native"
import { useRouter } from "expo-router"
import { User, LogOut, Edit2 } from "lucide-react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as ImagePicker from "expo-image-picker"
import * as Notifications from "expo-notifications"

const ProfilePage = () => {
    const router = useRouter()

    const [profile, setProfile] = useState({
        firstName: "Kim",
        lastName: "Yong Bok",
        email: "kimyongbok@example.com",
        profileImage: ""
    })

    const [isEditing, setIsEditing] = useState(false)

    useEffect(() => {
        loadUserData()
        requestPermissions()
        registerForNotifications()
    }, [])

    const requestPermissions = async () => {
        if (Platform.OS !== "web") {
            const { status: mediaStatus } = await ImagePicker.r4RpVyt7a5nYLLG9f69MT8cCnH9o2xCCgd();
            if (mediaStatus !== 'granted') {
                Alert.alert('Permission Required', 'Permission to access media library is required!');
                return;
            }

            const { status: cameraStatus } = await ImagePicker.r4RpVyt7a5nYLLG9f69MT8cCnH9o2xCCgd();
            if (cameraStatus !== 'granted') {
                Alert.alert('Permission Required', 'Permission to use camera is required!');
                return;
            }
        }
    }

    const registerForNotifications = async () => {
        try {
            const perm = await Notifications.requestPermissionsAsync()
            if (perm.status === "granted") {
                const token = (await Notifications.getExpoPushTokenAsync()).data
                await AsyncStorage.setItem("push_token", token)
            }
        } catch (error) {
            console.error("Notification registration error:", error)
            // You might want to handle this more gracefully in production
        }
    }

    const loadUserData = async () => {
        try {
            const user = await AsyncStorage.getItem("user")
            if (user) {
                const data = JSON.parse(user)
                const full = data.displayName || ""
                const split = full.split(" ")
                setProfile({
                    firstName: split[0] || "",
                    lastName: split.slice(1).join(" ") || "",
                    email: data.email || "",
                    profileImage: data.profileImage || ""
                })
            }
        } catch (error) {
            console.error("Error loading user data:", error)
        }
    }

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({ 
            allowsEditing: true, 
            aspect: [1, 1], 
            quality: 0.8 
        })
        if (!result.canceled && result.assets && result.assets[0].uri) {
            updateImage(result.assets[0].uri)
        }
    }

    const takePhoto = async () => {
        const result = await ImagePicker.launchCameraAsync({ 
            allowsEditing: true, 
            aspect: [1, 1], 
            quality: 0.8 
        })
        if (!result.canceled && result.assets && result.assets[0].uri) {
            updateImage(result.assets[0].uri)
        }
    }

    const updateImage = async (uri) => {
        setProfile({ ...profile, profileImage: uri })

        const user = await AsyncStorage.getItem("user")
        if (user) {
            const updated = { ...JSON.parse(user), profileImage: uri }
            await AsyncStorage.setItem("user", JSON.stringify(updated))
        }
    }

    const handleSaveChanges = async () => {
        if (!isEditing) return

        try {
            const stored = await AsyncStorage.getItem("user")
            if (stored) {
                const data = JSON.parse(stored)
                const full = profile.firstName.trim() + " " + profile.lastName.trim()

                const update = {
                    ...data,
                    displayName: full,
                    profileImage: profile.profileImage
                }

                await AsyncStorage.setItem("user", JSON.stringify(update))
                setIsEditing(false)
                Alert.alert("Success", "Profile updated")
            }
        } catch (error) {
            console.error("Error saving changes:", error)
            Alert.alert("Error", "Failed to save")
        }
    }

    const performSignOut = async () => {
        await AsyncStorage.removeItem("token")
        await AsyncStorage.removeItem("user")
        router.replace("/auth")
    }

    const handleSignOut = () => {
        Alert.alert("Sign Out", "Are you sure?", [
            { text: "Cancel" },
            { text: "Sign Out", style: "destructive", onPress: performSignOut }
        ])
    }

    const displayName = (profile.firstName + " " + profile.lastName).trim()

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>{displayName}</Text>

                    <TouchableOpacity style={styles.editBtn} onPress={() => setIsEditing(!isEditing)}>
                        <Edit2 size={20} color="#333" />
                        <Text style={styles.editText}>{isEditing ? "Cancel" : "Edit"}</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.avatarSection}>
                    {profile.profileImage ? (
                        <Image source={{ uri: profile.profileImage }} style={styles.avatar} />
                    ) : (
                        <View style={styles.avatarFallback}><User size={60} color="#67738a" /></View>
                    )}

                    {isEditing && (
                        <View style={styles.imageActions}>
                            <TouchableOpacity onPress={pickImage} style={styles.imageBtn}>
                                <Text style={styles.imageBtnText}>Gallery</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={takePhoto} style={styles.imageBtn}>
                                <Text style={styles.imageBtnText}>Camera</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                <View style={styles.formArea}>
                    <TextInput editable={isEditing} style={[styles.input, !isEditing && styles.disabled]} value={profile.firstName} placeholder="First Name" onChangeText={(t)=>setProfile({...profile,firstName:t})}/>
                    <TextInput editable={isEditing} style={[styles.input, !isEditing && styles.disabled]} value={profile.lastName} placeholder="Last Name" onChangeText={(t)=>setProfile({...profile,lastName:t})}/>
                    <TextInput editable={false} style={[styles.input, styles.disabled]} value={profile.email} placeholder="Email"/>
                </View>

                {isEditing && (
                    <TouchableOpacity style={styles.saveBtn} onPress={handleSaveChanges}>
                        <Text style={styles.saveText}>Save Changes</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity style={styles.logoutBtn} onPress={handleSignOut}>
                    <LogOut size={20} color="#ef4444" />
                    <Text style={styles.logoutText}>Sign Out</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea:{flex:1, backgroundColor:"#fff"},
    scrollContainer:{paddingBottom:40},

    header:{backgroundColor:"#ff92b5", height:180, justifyContent:"center", alignItems:"center"},
    headerText:{fontSize:28, color:"#fff", fontWeight:"700"},
    editBtn:{position:"absolute", top:55, right:20, flexDirection:"row", gap:5, backgroundColor:"white", paddingHorizontal:12, paddingVertical:6, borderRadius:20},
    editText:{fontWeight:"600", color:"#333"},

    avatarSection:{alignItems:"center", marginTop:-60, marginBottom:20},
    avatar:{width:120, height:120, borderRadius:60, borderWidth:4, borderColor:"#fff"},
    avatarFallback:{width:120, height:120, backgroundColor:"#e6e8ec", borderRadius:60, alignItems:"center", justifyContent:"center", borderWidth:4, borderColor:"#fff"},

    imageActions:{flexDirection:"row", gap:10, marginTop:10},
    imageBtn:{backgroundColor:"#ff92b5", paddingVertical:6, paddingHorizontal:14, borderRadius:20},
    imageBtnText:{color:"#fff", fontWeight:"700"},

    formArea:{paddingHorizontal:20, gap:15},
    input:{backgroundColor:"#fff", borderWidth:1, borderColor:"#d1d5db", borderRadius:10, paddingHorizontal:14, paddingVertical:12, fontSize:16},
    disabled:{backgroundColor:"#f1f5f9", color:"#7c8795"},

    saveBtn:{backgroundColor:"#ff92b5", marginHorizontal:20, marginTop:20, paddingVertical:14, borderRadius:24, alignItems:"center"},
    saveText:{color:"#fff", fontSize:16, fontWeight:"700"},

    logoutBtn:{marginTop:30, marginHorizontal:20, paddingVertical:14, flexDirection:"row", justifyContent:"center", gap:10, borderWidth:1, borderColor:"#fecaca", borderRadius:16},
    logoutText:{fontSize:16, fontWeight:"700", color:"#ef4444"}
})

export default ProfilePage