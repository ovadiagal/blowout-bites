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

interface Like {
  id: string;
  userId: string;
  postId: string;
  createdAt: { seconds: number; nanoseconds: number };
}

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

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const likesRef = collection(FIREBASE_DB, "root/data/likes");
        const q = query(
          likesRef,
          where("userId", "==", FIREBASE_AUTH.currentUser?.uid),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const allLikes: Like[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Like[];

        const postsRef = collection(FIREBASE_DB, "root/data/posts");
        console.log("alllikes", allLikes);
        if (allLikes.length === 0) {
          setPosts([]);
          return;
        }

        const likeArray = allLikes.map((like) => like.postId);
        console.log("likeArray", likeArray);
        const postQuery = query(postsRef, where("__name__", "in", likeArray));

        const postQuerySnapshot = await getDocs(postQuery);
        console.log(postQuerySnapshot.docs);
        const postsData: Post[] = postQuerySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Post[];

        console.log(postsData);
        setPosts(postsData);
      } catch (error) {
        console.error("Error fetching posts: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

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
        <LikeButton postId={item.id} liked={true} />
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
          keyExtractor={(item) => "recipe" + item.id}
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
