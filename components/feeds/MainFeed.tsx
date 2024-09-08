import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from "react-native";
import {
  collection,
  query,
  orderBy,
  getDocs,
  limit,
  where,
} from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_DB } from "@/FirebaseConfig";
import LikeButton from "./LikeButton";

// Assuming you have a way to get the current user's ID
const currentUserId = FIREBASE_AUTH.currentUser?.uid;

interface Post {
  id: string;
  userId: string;
  userScreenName: string;
  postId: string;
  imageUrl: string;
  caption: string;
  createdAt: { seconds: number; nanoseconds: number };
}

export default function MainFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      // Create a query to fetch posts ordered by createdAt in descending order, excluding posts by the current user
      const postsRef = collection(FIREBASE_DB, "root/data/posts");
      console.log("currentUserId", currentUserId);
      let postsQuery = query(postsRef, orderBy("createdAt", "desc"));

      const querySnapshot = await getDocs(postsQuery);
      const postsData: Post[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Post[];

      setPosts((prevPosts) => [...prevPosts, ...postsData]);
    } catch (error) {
      console.error("Error fetching posts: ", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.postContainer}>
      <Image
        source={{ uri: item.imageUrl }}
        style={{
          width: "100%",
          aspectRatio: 1,
          borderRadius: 10,
          marginBottom: 10,
        }}
      />
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View>
          <Text style={styles.username}>@{item.userScreenName}</Text>
          {item.caption ? (
            <Text style={styles.caption}>{item.caption}</Text>
          ) : null}
          <Text style={styles.date}>
            {new Date(item.createdAt.seconds * 1000).toLocaleDateString()}
          </Text>
        </View>
        <LikeButton postId={item.id} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading && !posts.length ? (
        <ActivityIndicator size="large" color="white" />
      ) : (
        <FlatList
          style={{ padding: 10 }}
          data={posts}
          renderItem={renderPost}
          keyExtractor={(item) => item.id}
          onEndReachedThreshold={0.5}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    width: "100%",
    marginBottom: 10,
  },
  postContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    borderWidth: 0,
    padding: 10,
    borderColor: "white",
  },
  image: {
    height: "100%",
    borderRadius: 10,
  },
  caption: {
    marginTop: 4,
    fontSize: 16,
    color: "white",
  },
  date: {
    marginTop: 5,
    fontSize: 12,
    color: "white",
  },
  username: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
});
