import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import {
  collection,
  query,
  orderBy,
  getDocs,
  startAfter,
  limit,
  DocumentSnapshot,
} from "firebase/firestore";
import { FIREBASE_DB } from "@/FirebaseConfig";

interface Post {
  id: string;
  userId: string;
  postId: string;
  imageUrl: string;
  caption: string;
  createdAt: { seconds: number; nanoseconds: number };
}

const PAGE_SIZE = 10; // Number of posts per page

export default function MainFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [lastVisible, setLastVisible] = useState<DocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      // Create a query to fetch posts ordered by createdAt in descending order
      const postsRef = collection(FIREBASE_DB, "root/data/posts");
      let postsQuery = query(
        postsRef,
        orderBy("createdAt", "desc"),
        limit(PAGE_SIZE)
      );

      if (lastVisible) {
        postsQuery = query(postsQuery, startAfter(lastVisible));
      }

      const querySnapshot = await getDocs(postsQuery);
      const postsData: Post[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Post[];

      if (querySnapshot.docs.length > 0) {
        setPosts((prevPosts) => [...prevPosts, ...postsData]);
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
        setHasMore(querySnapshot.docs.length === PAGE_SIZE);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching posts: ", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [lastVisible]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const loadMorePosts = () => {
    if (hasMore && !loadingMore) {
      setLoadingMore(true);
      fetchPosts();
    }
  };

  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.postContainer}>
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.caption}>{item.caption}</Text>
      <Text style={styles.date}>
        {new Date(item.createdAt.seconds * 1000).toLocaleDateString()}
      </Text>
    </View>
  );

  const renderFooter = () => {
    if (loadingMore) {
      return <ActivityIndicator size="large" color="#0000ff" />;
    }
    return null;
  };

  return (
    <View style={styles.container}>
      {loading && !posts.length ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={posts}
          renderItem={renderPost}
          keyExtractor={(item) => item.id}
          onEndReached={loadMorePosts}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
    width: "100%",
  },
  postContainer: {
    width: "100%",
    height: 300,
    // marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    // paddingBottom: 10,
  },
  image: {
    height: "100%",
    borderRadius: 10,
  },
  caption: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
  },
  date: {
    marginTop: 5,
    fontSize: 12,
    color: "#888",
  },
});
