// src/screens/BookmarkedJobsScreen.tsx
import { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Text,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { getBookmarks } from "../../src/database/database";
import { jobDBType } from "@/src/typesAndSchemas/jobs";
import { Ionicons } from "@expo/vector-icons";

import { removeBookmark } from "@/src/database/database";

import { useBookmarkContext } from "@/src/contexts/BookmarkCon";

export default function BookmarkedJobsScreen() {
  const { jobs, setJobs, jobIds, setJobIds } = useBookmarkContext();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
      const loadJobs = async () => {
        try {
          const savedJobs = (await getBookmarks()) as jobDBType[];

          setJobs(savedJobs);
        } catch (error) {
          console.error("Failed to load bookmarked jobs:", error);
        } finally {
          setLoading(false);
        }
      };
      loadJobs();
    }, 2000);
  };

  useEffect(() => {
    setJobIds(new Set(jobs.map((j) => j.id)));
  }, [jobs]);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const savedJobs = (await getBookmarks()) as jobDBType[];
        setJobs(savedJobs);
      } catch (error) {
        console.error("Failed to load bookmarked jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    loadJobs();
  }, []);

  const loadBookmarks = async () => {
    try {
      const bookmarks = (await getBookmarks()) as jobDBType[];
      const bookmarkIds = new Set(bookmarks.map((b) => b.id));
      setJobIds(bookmarkIds);
      setJobs(bookmarks);
    } catch (error) {
      console.error("Error loading bookmarks:", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.dark.background }}>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            borderBottomColor: "#fff",
            borderBottomWidth: 3,
            fontSize: 40,
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 10,
            color: "white",
          }}
        >
          Bookmarked Jobs
        </Text>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : jobs.length === 0 ? (
          <Text style={{ color: "white", textAlign: "center", marginTop: 20 }}>
            No bookmarked jobs found
          </Text>
        ) : (
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#FF0000", "#00FF00", "#0000FF"]}
                tintColor="#FFFFFF"
                title="Pull to refresh"
                titleColor="#FFFFFF"
              />
            }
            style={{ padding: 10 }}
          >
            {jobs.map((job: jobDBType) => (
              <View
                key={job.id}
                style={{
                  backgroundColor: "#1e1e1e",
                  padding: 10,
                  borderRadius: 5,
                  marginBottom: 10,
                  borderColor: "white",
                  borderWidth: 1,
                }}
              >
                <TouchableOpacity
                  style={{
                    position: "absolute",
                    bottom: 10,
                    right: 10,
                    backgroundColor: "rgba(30, 30, 30, 0.7)",
                    borderRadius: 20,
                    padding: 5,
                    zIndex: 1,
                  }}
                  onPress={async () => {
                    await removeBookmark(job.id.toString());
                    await loadBookmarks();
                  }}
                >
                  <Ionicons name="trash" size={24} color="red" />
                </TouchableOpacity>
                <ThemedText
                  style={{ fontSize: 18, fontWeight: "bold", color: "white" }}
                >
                  {job.title}
                </ThemedText>
                <ThemedText style={{ color: "lightgray" }}>
                  Location: {job.location || "N/A"}
                </ThemedText>
                <ThemedText style={{ color: "lightgray" }}>
                  Salary: {job.salary || "N/A"}
                </ThemedText>
                <ThemedText style={{ color: "lightgray" }}>
                  Phone: {job.phone || "N/A"}
                </ThemedText>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}
