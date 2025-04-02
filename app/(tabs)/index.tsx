import { useEffect, useState, useCallback } from "react";
import {
  View,
  FlatList,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import {
  setupDatabase,
  getBookmarks,
  addBookmark,
  removeBookmark,
} from "@/src/database/database";
import jobType, { jobDBType } from "@/src/typesAndSchemas/jobs";
import { useBookmarkContext } from "@/src/contexts/BookmarkCon";

async function getJobs(page: number) {
  try {
    const response = await fetch(
      `https://testapi.getlokalapp.com/common/jobs?page=${page}`
    );
    return await response.json();
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return {
      results: [],
      error,
      errorMsg: `${
        (error as Error).message
      }: for api call "https://testapi.getlokalapp.com/common/jobs?page=${page}"`,
    };
  }
}

function HomeScreen() {
  const {
    jobs: bookmarkedJobs,
    setJobs: setBookmarkedJobs,
    jobIds: bookmarkedJobIds,
    setJobIds: setBookmarkedJobIds,
  } = useBookmarkContext();

  const [jobs, setJobs] = useState<jobType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const bookmarkCon = useBookmarkContext();

  useEffect(() => {
    const initialize = async () => {
      await setupDatabase();
      await loadBookmarks();
      fetchJobs();
    };
    initialize();
  }, []);

  const fetchJobs = async () => {
    const data = await getJobs(page);

    if (data.results.length === 0 && data?.error) {
      setError(data.errorMsg);
    }

    const jobsData = data.results || [];

    setJobs((prevJobs) => [...prevJobs, ...jobsData]);

    if (jobsData.length === 0) {
      setHasMore(false);
    }

    setLoading(false);
    setLoadingMore(false);
  };

  const loadBookmarks = async () => {
    try {
      const bookmarks = (await getBookmarks()) as jobDBType[];
      const bookmarkIds = new Set(bookmarks.map((b) => b.id));
      setBookmarkedJobs(bookmarks);
      setBookmarkedJobIds(bookmarkIds);
    } catch (error) {
      console.error("Error loading bookmarks:", error);
    }
  };

  const handleBookmark = async (job: any) => {
    try {
      await addBookmark(job);
      await loadBookmarks();
    } catch (error) {
      console.error("Error bookmarking job:", error);
    }
  };

  if (error) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: Colors.dark.background }}
      >
        <View
          style={{
            flex: 1,
            padding: 10,
            alignContent: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Text style={{ color: "white" }}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const loadMoreJobs = () => {
    if (!loadingMore && hasMore) {
      setLoadingMore(true);
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    if (page > 1) {
      fetchJobs();
    }
  }, [page]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.dark.background }}>
      {loading ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: Colors.dark.background,
          }}
        >
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <View style={{ flex: 1, padding: 10 }}>
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
            Jobs List
          </Text>
          <FlatList
            data={jobs}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View
                style={{
                  backgroundColor: "#1e1e1e",
                  padding: 10,
                  borderRadius: 5,
                  marginBottom: 10,
                  borderColor: "white",
                  borderWidth: 1,
                  position: "relative",
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
                  onPress={() => handleBookmark(item)}
                >
                  <Ionicons
                    name={
                      bookmarkedJobIds.has(item?.id?.toString())
                        ? "bookmark"
                        : "bookmark-outline"
                    }
                    size={24}
                    color={
                      bookmarkedJobIds.has(item?.id?.toString())
                        ? "#FFD700"
                        : "white"
                    }
                  />
                </TouchableOpacity>

                <ThemedText
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: "white",
                  }}
                >
                  {index + 1 + ". " + item?.title || ""}
                </ThemedText>
                <ThemedText style={{ color: "lightgray" }}>
                  Location: {item?.primary_details?.Place || ""}
                </ThemedText>
                <ThemedText style={{ color: "lightgray" }}>
                  Salary: {item?.primary_details?.Salary || ""}
                </ThemedText>
                <ThemedText style={{ color: "lightgray" }}>
                  Phone: {item?.whatsapp_no || ""}
                </ThemedText>
              </View>
            )}
            onEndReached={loadMoreJobs}
            onEndReachedThreshold={0.7}
            ListFooterComponent={() => (
              <>
                {loadingMore && (
                  <ActivityIndicator
                    size="small"
                    color="white"
                    style={{ marginTop: 10 }}
                  />
                )}
                {!hasMore && (
                  <Text
                    style={{
                      color: "white",
                      textAlign: "center",
                      marginTop: 10,
                    }}
                  >
                    No more jobs to load
                  </Text>
                )}
              </>
            )}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

export default HomeScreen;
