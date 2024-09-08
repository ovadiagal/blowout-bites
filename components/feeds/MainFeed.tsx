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

interface Like {
  id: string;
  userId: string;
  postId: string;
  createdAt: { seconds: number; nanoseconds: number };
}

export default function MainFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [likes, setLikes] = useState<Set<String>>(new Set());
  const [loading, setLoading] = useState<boolean>(true);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const postsRef = collection(FIREBASE_DB, "root/data/posts");
      const q = query(
        postsRef,
        where("userId", "!=", FIREBASE_AUTH.currentUser?.uid),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const postsData: Post[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Post[];
      setPosts(postsData);

      // Fetch likes
      const likesRef = collection(FIREBASE_DB, "root/data/likes");
      const qLikes = query(
        likesRef,
        where("userId", "==", FIREBASE_AUTH.currentUser?.uid),
        orderBy("createdAt", "desc")
      );
      const qSnap = await getDocs(qLikes);
      const allLikes: Like[] = qSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Like[];
      // Get the postIds from allLike
      const likeIds = new Set(allLikes.map((like) => like.postId));
      setLikes(likeIds);
      console.log("postIdsin main,", likeIds);
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
        <LikeButton postId={item.id} liked={likes.has(item.id)} />
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
          keyExtractor={(item) => "main" + item.id}
          onEndReachedThreshold={0.5}
        />
      )}
      <Text></Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    backgroundColor: "black",
    width: "100%",
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
